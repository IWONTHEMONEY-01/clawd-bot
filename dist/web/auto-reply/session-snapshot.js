import { evaluateSessionFreshness, loadSessionStore, resolveThreadFlag, resolveSessionResetPolicy, resolveSessionResetType, resolveSessionKey, resolveStorePath, } from "../../config/sessions.js";
import { normalizeMainKey } from "../../routing/session-key.js";
export function getSessionSnapshot(cfg, from, isHeartbeat = false, ctx) {
    const sessionCfg = cfg.session;
    const scope = sessionCfg?.scope ?? "per-sender";
    const key = ctx?.sessionKey?.trim() ??
        resolveSessionKey(scope, { From: from, To: "", Body: "" }, normalizeMainKey(sessionCfg?.mainKey));
    const store = loadSessionStore(resolveStorePath(sessionCfg?.store));
    const entry = store[key];
    const isThread = resolveThreadFlag({
        sessionKey: key,
        messageThreadId: ctx?.messageThreadId ?? null,
        threadLabel: ctx?.threadLabel ?? null,
        threadStarterBody: ctx?.threadStarterBody ?? null,
        parentSessionKey: ctx?.parentSessionKey ?? null,
    });
    const resetType = resolveSessionResetType({ sessionKey: key, isGroup: ctx?.isGroup, isThread });
    const idleMinutesOverride = isHeartbeat ? sessionCfg?.heartbeatIdleMinutes : undefined;
    const resetPolicy = resolveSessionResetPolicy({
        sessionCfg,
        resetType,
        idleMinutesOverride,
    });
    const now = Date.now();
    const freshness = entry
        ? evaluateSessionFreshness({ updatedAt: entry.updatedAt, now, policy: resetPolicy })
        : { fresh: false };
    return {
        key,
        entry,
        fresh: freshness.fresh,
        resetPolicy,
        resetType,
        dailyResetAt: freshness.dailyResetAt,
        idleExpiresAt: freshness.idleExpiresAt,
    };
}
