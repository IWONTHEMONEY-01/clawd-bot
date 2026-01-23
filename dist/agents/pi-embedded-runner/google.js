import { registerUnhandledRejectionHandler } from "../../infra/unhandled-rejections.js";
import { downgradeGeminiThinkingBlocks, downgradeGeminiHistory, isCompactionFailureError, isGoogleModelApi, sanitizeGoogleTurnOrdering, sanitizeSessionMessagesImages, } from "../pi-embedded-helpers.js";
import { sanitizeToolUseResultPairing } from "../session-transcript-repair.js";
import { log } from "./logger.js";
import { describeUnknownError } from "./utils.js";
import { isAntigravityClaude } from "../pi-embedded-helpers/google.js";
import { cleanToolSchemaForGemini } from "../pi-tools.schema.js";
const GOOGLE_TURN_ORDERING_CUSTOM_TYPE = "google-turn-ordering-bootstrap";
const GOOGLE_SCHEMA_UNSUPPORTED_KEYWORDS = new Set([
    "patternProperties",
    "additionalProperties",
    "$schema",
    "$id",
    "$ref",
    "$defs",
    "definitions",
    "examples",
    "minLength",
    "maxLength",
    "minimum",
    "maximum",
    "multipleOf",
    "pattern",
    "format",
    "minItems",
    "maxItems",
    "uniqueItems",
    "minProperties",
    "maxProperties",
]);
const OPENAI_TOOL_CALL_ID_APIS = new Set([
    "openai",
    "openai-completions",
    "openai-responses",
    "openai-codex-responses",
]);
function shouldSanitizeToolCallIds(modelApi) {
    if (!modelApi)
        return false;
    return isGoogleModelApi(modelApi) || OPENAI_TOOL_CALL_ID_APIS.has(modelApi);
}
function filterOpenAIReasoningOnlyMessages(messages, modelApi) {
    if (modelApi !== "openai-responses")
        return messages;
    return messages.filter((msg) => {
        if (!msg || typeof msg !== "object")
            return true;
        if (msg.role !== "assistant")
            return true;
        const assistant = msg;
        const content = assistant.content;
        if (!Array.isArray(content) || content.length === 0)
            return true;
        let hasThinking = false;
        let hasPairedContent = false;
        for (const block of content) {
            if (!block || typeof block !== "object")
                continue;
            const type = block.type;
            if (type === "thinking") {
                hasThinking = true;
                continue;
            }
            if (type === "toolCall" || type === "toolUse" || type === "functionCall") {
                hasPairedContent = true;
                break;
            }
            if (type === "text") {
                const text = block.text;
                if (typeof text === "string" && text.trim().length > 0) {
                    hasPairedContent = true;
                    break;
                }
            }
        }
        return !(hasThinking && !hasPairedContent);
    });
}
function findUnsupportedSchemaKeywords(schema, path) {
    if (!schema || typeof schema !== "object")
        return [];
    if (Array.isArray(schema)) {
        return schema.flatMap((item, index) => findUnsupportedSchemaKeywords(item, `${path}[${index}]`));
    }
    const record = schema;
    const violations = [];
    const properties = record.properties && typeof record.properties === "object" && !Array.isArray(record.properties)
        ? record.properties
        : undefined;
    if (properties) {
        for (const [key, value] of Object.entries(properties)) {
            violations.push(...findUnsupportedSchemaKeywords(value, `${path}.properties.${key}`));
        }
    }
    for (const [key, value] of Object.entries(record)) {
        if (key === "properties")
            continue;
        if (GOOGLE_SCHEMA_UNSUPPORTED_KEYWORDS.has(key)) {
            violations.push(`${path}.${key}`);
        }
        if (value && typeof value === "object") {
            violations.push(...findUnsupportedSchemaKeywords(value, `${path}.${key}`));
        }
    }
    return violations;
}
export function sanitizeToolsForGoogle(params) {
    if (params.provider !== "google-antigravity" && params.provider !== "google-gemini-cli") {
        return params.tools;
    }
    return params.tools.map((tool) => {
        if (!tool.parameters || typeof tool.parameters !== "object")
            return tool;
        return {
            ...tool,
            parameters: cleanToolSchemaForGemini(tool.parameters),
        };
    });
}
export function logToolSchemasForGoogle(params) {
    if (params.provider !== "google-antigravity" && params.provider !== "google-gemini-cli") {
        return;
    }
    const toolNames = params.tools.map((tool, index) => `${index}:${tool.name}`);
    const tools = sanitizeToolsForGoogle(params);
    log.info("google tool schema snapshot", {
        provider: params.provider,
        toolCount: tools.length,
        tools: toolNames,
    });
    for (const [index, tool] of tools.entries()) {
        const violations = findUnsupportedSchemaKeywords(tool.parameters, `${tool.name}.parameters`);
        if (violations.length > 0) {
            log.warn("google tool schema has unsupported keywords", {
                index,
                tool: tool.name,
                violations: violations.slice(0, 12),
                violationCount: violations.length,
            });
        }
    }
}
registerUnhandledRejectionHandler((reason) => {
    const message = describeUnknownError(reason);
    if (!isCompactionFailureError(message))
        return false;
    log.error(`Auto-compaction failed (unhandled): ${message}`);
    return true;
});
function hasGoogleTurnOrderingMarker(sessionManager) {
    try {
        return sessionManager
            .getEntries()
            .some((entry) => entry?.type === "custom" &&
            entry?.customType === GOOGLE_TURN_ORDERING_CUSTOM_TYPE);
    }
    catch {
        return false;
    }
}
function markGoogleTurnOrderingMarker(sessionManager) {
    try {
        sessionManager.appendCustomEntry(GOOGLE_TURN_ORDERING_CUSTOM_TYPE, {
            timestamp: Date.now(),
        });
    }
    catch {
        // ignore marker persistence failures
    }
}
export function applyGoogleTurnOrderingFix(params) {
    if (!isGoogleModelApi(params.modelApi)) {
        return { messages: params.messages, didPrepend: false };
    }
    const first = params.messages[0];
    if (first?.role !== "assistant") {
        return { messages: params.messages, didPrepend: false };
    }
    const sanitized = sanitizeGoogleTurnOrdering(params.messages);
    const didPrepend = sanitized !== params.messages;
    if (didPrepend && !hasGoogleTurnOrderingMarker(params.sessionManager)) {
        const warn = params.warn ?? ((message) => log.warn(message));
        warn(`google turn ordering fixup: prepended user bootstrap (sessionId=${params.sessionId})`);
        markGoogleTurnOrderingMarker(params.sessionManager);
    }
    return { messages: sanitized, didPrepend };
}
export async function sanitizeSessionHistory(params) {
    const isAntigravityClaudeModel = isAntigravityClaude(params.modelApi, params.modelId);
    const provider = (params.provider ?? "").toLowerCase();
    const modelId = (params.modelId ?? "").toLowerCase();
    const isOpenRouterGemini = (provider === "openrouter" || provider === "opencode") && modelId.includes("gemini");
    const isGeminiLike = isGoogleModelApi(params.modelApi) || isOpenRouterGemini;
    const sanitizedImages = await sanitizeSessionMessagesImages(params.messages, "session:history", {
        sanitizeToolCallIds: shouldSanitizeToolCallIds(params.modelApi),
        enforceToolCallLast: params.modelApi === "anthropic-messages",
        preserveSignatures: params.modelApi === "google-antigravity" && isAntigravityClaudeModel,
        sanitizeThoughtSignatures: isOpenRouterGemini
            ? { allowBase64Only: true, includeCamelCase: true }
            : undefined,
    });
    // TODO REMOVE when https://github.com/badlogic/pi-mono/pull/838 is merged.
    const openaiReasoningFiltered = filterOpenAIReasoningOnlyMessages(sanitizedImages, params.modelApi);
    const repairedTools = sanitizeToolUseResultPairing(openaiReasoningFiltered);
    const isAntigravityProvider = provider === "google-antigravity" || params.modelApi === "google-antigravity";
    const shouldDowngradeThinking = isGeminiLike && !isAntigravityClaudeModel;
    // Gemini rejects unsigned thinking blocks; downgrade them before send to avoid INVALID_ARGUMENT.
    const downgradedThinking = shouldDowngradeThinking
        ? downgradeGeminiThinkingBlocks(repairedTools)
        : repairedTools;
    const shouldDowngradeHistory = shouldDowngradeThinking && !isAntigravityProvider;
    const downgraded = shouldDowngradeHistory
        ? downgradeGeminiHistory(downgradedThinking)
        : downgradedThinking;
    return applyGoogleTurnOrderingFix({
        messages: downgraded,
        modelApi: params.modelApi,
        sessionManager: params.sessionManager,
        sessionId: params.sessionId,
    }).messages;
}
