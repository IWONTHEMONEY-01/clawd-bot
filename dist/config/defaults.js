import { resolveTalkApiKey } from "./talk.js";
import { DEFAULT_AGENT_MAX_CONCURRENT, DEFAULT_SUBAGENT_MAX_CONCURRENT } from "./agent-limits.js";
let defaultWarnState = { warned: false };
const DEFAULT_MODEL_ALIASES = {
    // Anthropic (pi-ai catalog uses "latest" ids without date suffix)
    opus: "anthropic/claude-opus-4-5",
    sonnet: "anthropic/claude-sonnet-4-5",
    // OpenAI
    gpt: "openai/gpt-5.2",
    "gpt-mini": "openai/gpt-5-mini",
    // Google Gemini (3.x are preview ids in the catalog)
    gemini: "google/gemini-3-pro-preview",
    "gemini-flash": "google/gemini-3-flash-preview",
};
export function applyMessageDefaults(cfg) {
    const messages = cfg.messages;
    const hasAckScope = messages?.ackReactionScope !== undefined;
    if (hasAckScope)
        return cfg;
    const nextMessages = messages ? { ...messages } : {};
    nextMessages.ackReactionScope = "group-mentions";
    return {
        ...cfg,
        messages: nextMessages,
    };
}
export function applySessionDefaults(cfg, options = {}) {
    const session = cfg.session;
    if (!session || session.mainKey === undefined)
        return cfg;
    const trimmed = session.mainKey.trim();
    const warn = options.warn ?? console.warn;
    const warnState = options.warnState ?? defaultWarnState;
    const next = {
        ...cfg,
        session: { ...session, mainKey: "main" },
    };
    if (trimmed && trimmed !== "main" && !warnState.warned) {
        warnState.warned = true;
        warn('session.mainKey is ignored; main session is always "main".');
    }
    return next;
}
export function applyTalkApiKey(config) {
    const resolved = resolveTalkApiKey();
    if (!resolved)
        return config;
    const existing = config.talk?.apiKey?.trim();
    if (existing)
        return config;
    return {
        ...config,
        talk: {
            ...config.talk,
            apiKey: resolved,
        },
    };
}
export function applyModelDefaults(cfg) {
    const existingAgent = cfg.agents?.defaults;
    if (!existingAgent)
        return cfg;
    const existingModels = existingAgent.models ?? {};
    if (Object.keys(existingModels).length === 0)
        return cfg;
    let mutated = false;
    const nextModels = {
        ...existingModels,
    };
    for (const [alias, target] of Object.entries(DEFAULT_MODEL_ALIASES)) {
        const entry = nextModels[target];
        if (!entry)
            continue;
        if (entry.alias !== undefined)
            continue;
        nextModels[target] = { ...entry, alias };
        mutated = true;
    }
    if (!mutated)
        return cfg;
    return {
        ...cfg,
        agents: {
            ...cfg.agents,
            defaults: { ...existingAgent, models: nextModels },
        },
    };
}
export function applyAgentDefaults(cfg) {
    const agents = cfg.agents;
    const defaults = agents?.defaults;
    const hasMax = typeof defaults?.maxConcurrent === "number" && Number.isFinite(defaults.maxConcurrent);
    const hasSubMax = typeof defaults?.subagents?.maxConcurrent === "number" &&
        Number.isFinite(defaults.subagents.maxConcurrent);
    if (hasMax && hasSubMax)
        return cfg;
    let mutated = false;
    const nextDefaults = defaults ? { ...defaults } : {};
    if (!hasMax) {
        nextDefaults.maxConcurrent = DEFAULT_AGENT_MAX_CONCURRENT;
        mutated = true;
    }
    const nextSubagents = defaults?.subagents ? { ...defaults.subagents } : {};
    if (!hasSubMax) {
        nextSubagents.maxConcurrent = DEFAULT_SUBAGENT_MAX_CONCURRENT;
        mutated = true;
    }
    if (!mutated)
        return cfg;
    return {
        ...cfg,
        agents: {
            ...agents,
            defaults: {
                ...nextDefaults,
                subagents: nextSubagents,
            },
        },
    };
}
export function applyLoggingDefaults(cfg) {
    const logging = cfg.logging;
    if (!logging)
        return cfg;
    if (logging.redactSensitive)
        return cfg;
    return {
        ...cfg,
        logging: {
            ...logging,
            redactSensitive: "tools",
        },
    };
}
export function applyContextPruningDefaults(cfg) {
    const defaults = cfg.agents?.defaults;
    if (!defaults)
        return cfg;
    const contextPruning = defaults?.contextPruning;
    if (contextPruning?.mode)
        return cfg;
    return {
        ...cfg,
        agents: {
            ...cfg.agents,
            defaults: {
                ...defaults,
                contextPruning: {
                    ...contextPruning,
                    mode: "adaptive",
                },
            },
        },
    };
}
export function applyCompactionDefaults(cfg) {
    const defaults = cfg.agents?.defaults;
    if (!defaults)
        return cfg;
    const compaction = defaults?.compaction;
    if (compaction?.mode)
        return cfg;
    return {
        ...cfg,
        agents: {
            ...cfg.agents,
            defaults: {
                ...defaults,
                compaction: {
                    ...compaction,
                    mode: "safeguard",
                },
            },
        },
    };
}
export function resetSessionDefaultsWarningForTests() {
    defaultWarnState = { warned: false };
}
