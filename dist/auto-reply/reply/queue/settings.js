import { normalizeQueueDropPolicy, normalizeQueueMode } from "./normalize.js";
import { DEFAULT_QUEUE_CAP, DEFAULT_QUEUE_DEBOUNCE_MS, DEFAULT_QUEUE_DROP } from "./state.js";
function defaultQueueModeForChannel(_channel) {
    return "collect";
}
export function resolveQueueSettings(params) {
    const channelKey = params.channel?.trim().toLowerCase();
    const queueCfg = params.cfg.messages?.queue;
    const providerModeRaw = channelKey && queueCfg?.byChannel
        ? queueCfg.byChannel[channelKey]
        : undefined;
    const resolvedMode = params.inlineMode ??
        normalizeQueueMode(params.sessionEntry?.queueMode) ??
        normalizeQueueMode(providerModeRaw) ??
        normalizeQueueMode(queueCfg?.mode) ??
        defaultQueueModeForChannel(channelKey);
    const debounceRaw = params.inlineOptions?.debounceMs ??
        params.sessionEntry?.queueDebounceMs ??
        queueCfg?.debounceMs ??
        DEFAULT_QUEUE_DEBOUNCE_MS;
    const capRaw = params.inlineOptions?.cap ??
        params.sessionEntry?.queueCap ??
        queueCfg?.cap ??
        DEFAULT_QUEUE_CAP;
    const dropRaw = params.inlineOptions?.dropPolicy ??
        params.sessionEntry?.queueDrop ??
        normalizeQueueDropPolicy(queueCfg?.drop) ??
        DEFAULT_QUEUE_DROP;
    return {
        mode: resolvedMode,
        debounceMs: typeof debounceRaw === "number" ? Math.max(0, debounceRaw) : undefined,
        cap: typeof capRaw === "number" ? Math.max(1, Math.floor(capRaw)) : undefined,
        dropPolicy: dropRaw,
    };
}
