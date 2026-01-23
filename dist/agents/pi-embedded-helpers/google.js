import { sanitizeGoogleTurnOrdering } from "./bootstrap.js";
export function isGoogleModelApi(api) {
    return (api === "google-gemini-cli" || api === "google-generative-ai" || api === "google-antigravity");
}
export function isAntigravityClaude(api, modelId) {
    if (api !== "google-antigravity")
        return false;
    return modelId?.toLowerCase().includes("claude") ?? false;
}
export { sanitizeGoogleTurnOrdering };
export function downgradeGeminiThinkingBlocks(messages) {
    const out = [];
    for (const msg of messages) {
        if (!msg || typeof msg !== "object") {
            out.push(msg);
            continue;
        }
        const role = msg.role;
        if (role !== "assistant") {
            out.push(msg);
            continue;
        }
        const assistantMsg = msg;
        if (!Array.isArray(assistantMsg.content)) {
            out.push(msg);
            continue;
        }
        // Gemini rejects thinking blocks that lack a signature; downgrade to text for safety.
        let hasDowngraded = false;
        const nextContent = assistantMsg.content.flatMap((block) => {
            if (!block || typeof block !== "object")
                return [block];
            const record = block;
            if (record.type !== "thinking")
                return [block];
            const thinkingSig = typeof record.thinkingSignature === "string" ? record.thinkingSignature.trim() : "";
            if (thinkingSig.length > 0)
                return [block];
            const thinking = typeof record.thinking === "string" ? record.thinking : "";
            const trimmed = thinking.trim();
            hasDowngraded = true;
            if (!trimmed)
                return [];
            return [{ type: "text", text: thinking }];
        });
        if (!hasDowngraded) {
            out.push(msg);
            continue;
        }
        if (nextContent.length === 0) {
            continue;
        }
        out.push({ ...assistantMsg, content: nextContent });
    }
    return out;
}
export function downgradeGeminiHistory(messages) {
    const droppedToolCallIds = new Set();
    const out = [];
    const resolveToolResultId = (msg) => {
        const toolCallId = msg.toolCallId;
        if (typeof toolCallId === "string" && toolCallId)
            return toolCallId;
        const toolUseId = msg.toolUseId;
        if (typeof toolUseId === "string" && toolUseId)
            return toolUseId;
        return undefined;
    };
    for (const msg of messages) {
        if (!msg || typeof msg !== "object") {
            out.push(msg);
            continue;
        }
        const role = msg.role;
        if (role === "assistant") {
            const assistantMsg = msg;
            if (!Array.isArray(assistantMsg.content)) {
                out.push(msg);
                continue;
            }
            let dropped = false;
            const nextContent = assistantMsg.content.filter((block) => {
                if (!block || typeof block !== "object")
                    return true;
                const blockRecord = block;
                const type = blockRecord.type;
                if (type === "toolCall" || type === "functionCall" || type === "toolUse") {
                    const signature = blockRecord.thought_signature ?? blockRecord.thoughtSignature;
                    const hasSignature = Boolean(signature);
                    if (!hasSignature) {
                        const id = typeof blockRecord.id === "string"
                            ? blockRecord.id
                            : typeof blockRecord.toolCallId === "string"
                                ? blockRecord.toolCallId
                                : undefined;
                        if (id)
                            droppedToolCallIds.add(id);
                        dropped = true;
                        return false;
                    }
                }
                return true;
            });
            if (dropped && nextContent.length === 0) {
                continue;
            }
            out.push(dropped ? { ...assistantMsg, content: nextContent } : msg);
            continue;
        }
        if (role === "toolResult") {
            const toolMsg = msg;
            const toolResultId = resolveToolResultId(toolMsg);
            if (toolResultId && droppedToolCallIds.has(toolResultId)) {
                continue;
            }
        }
        out.push(msg);
    }
    return out;
}
