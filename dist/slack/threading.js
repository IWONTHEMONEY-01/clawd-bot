export function resolveSlackThreadTargets(params) {
    const incomingThreadTs = params.message.thread_ts;
    const eventTs = params.message.event_ts;
    const messageTs = params.message.ts ?? eventTs;
    const replyThreadTs = incomingThreadTs ?? (params.replyToMode === "all" ? messageTs : undefined);
    const statusThreadTs = replyThreadTs ?? messageTs;
    return { replyThreadTs, statusThreadTs };
}
