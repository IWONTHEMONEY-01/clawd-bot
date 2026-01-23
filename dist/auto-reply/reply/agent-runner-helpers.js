import { loadSessionStore } from "../../config/sessions.js";
import { isAudioFileName } from "../../media/mime.js";
import { normalizeVerboseLevel } from "../thinking.js";
import { scheduleFollowupDrain } from "./queue.js";
const hasAudioMedia = (urls) => Boolean(urls?.some((url) => isAudioFileName(url)));
export const isAudioPayload = (payload) => hasAudioMedia(payload.mediaUrls ?? (payload.mediaUrl ? [payload.mediaUrl] : undefined));
export const createShouldEmitToolResult = (params) => {
    return () => {
        if (!params.sessionKey || !params.storePath) {
            return params.resolvedVerboseLevel !== "off";
        }
        try {
            const store = loadSessionStore(params.storePath);
            const entry = store[params.sessionKey];
            const current = normalizeVerboseLevel(entry?.verboseLevel);
            if (current)
                return current !== "off";
        }
        catch {
            // ignore store read failures
        }
        return params.resolvedVerboseLevel !== "off";
    };
};
export const createShouldEmitToolOutput = (params) => {
    return () => {
        if (!params.sessionKey || !params.storePath) {
            return params.resolvedVerboseLevel === "full";
        }
        try {
            const store = loadSessionStore(params.storePath);
            const entry = store[params.sessionKey];
            const current = normalizeVerboseLevel(entry?.verboseLevel);
            if (current)
                return current === "full";
        }
        catch {
            // ignore store read failures
        }
        return params.resolvedVerboseLevel === "full";
    };
};
export const finalizeWithFollowup = (value, queueKey, runFollowupTurn) => {
    scheduleFollowupDrain(queueKey, runFollowupTurn);
    return value;
};
export const signalTypingIfNeeded = async (payloads, typingSignals) => {
    const shouldSignalTyping = payloads.some((payload) => {
        const trimmed = payload.text?.trim();
        if (trimmed)
            return true;
        if (payload.mediaUrl)
            return true;
        if (payload.mediaUrls && payload.mediaUrls.length > 0)
            return true;
        return false;
    });
    if (shouldSignalTyping) {
        await typingSignals.signalRunStart();
    }
};
