import { formatUserTime, resolveUserTimeFormat, resolveUserTimezone, } from "./date-time.js";
export function buildSystemPromptParams(params) {
    const userTimezone = resolveUserTimezone(params.config?.agents?.defaults?.userTimezone);
    const userTimeFormat = resolveUserTimeFormat(params.config?.agents?.defaults?.timeFormat);
    const userTime = formatUserTime(new Date(), userTimezone, userTimeFormat);
    return {
        runtimeInfo: {
            agentId: params.agentId,
            ...params.runtime,
        },
        userTimezone,
        userTime,
        userTimeFormat,
    };
}
