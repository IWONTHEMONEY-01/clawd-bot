import { getChannelPlugin, listChannelPlugins } from "../channels/plugins/index.js";
/**
 * Get the list of supported message actions for a specific channel.
 * Returns an empty array if channel is not found or has no actions configured.
 */
export function listChannelSupportedActions(params) {
    if (!params.channel)
        return [];
    const plugin = getChannelPlugin(params.channel);
    if (!plugin?.actions?.listActions)
        return [];
    const cfg = params.cfg ?? {};
    return plugin.actions.listActions({ cfg });
}
/**
 * Get the list of all supported message actions across all configured channels.
 */
export function listAllChannelSupportedActions(params) {
    const actions = new Set();
    for (const plugin of listChannelPlugins()) {
        if (!plugin.actions?.listActions)
            continue;
        const cfg = params.cfg ?? {};
        const channelActions = plugin.actions.listActions({ cfg });
        for (const action of channelActions) {
            actions.add(action);
        }
    }
    return Array.from(actions);
}
export function listChannelAgentTools(params) {
    // Channel docking: aggregate channel-owned tools (login, etc.).
    const tools = [];
    for (const plugin of listChannelPlugins()) {
        const entry = plugin.agentTools;
        if (!entry)
            continue;
        const resolved = typeof entry === "function" ? entry(params) : entry;
        if (Array.isArray(resolved))
            tools.push(...resolved);
    }
    return tools;
}
