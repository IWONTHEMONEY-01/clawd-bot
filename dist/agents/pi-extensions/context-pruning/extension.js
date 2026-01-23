import { pruneContextMessages } from "./pruner.js";
import { getContextPruningRuntime } from "./runtime.js";
export default function contextPruningExtension(api) {
    api.on("context", (event, ctx) => {
        const runtime = getContextPruningRuntime(ctx.sessionManager);
        if (!runtime)
            return undefined;
        const next = pruneContextMessages({
            messages: event.messages,
            settings: runtime.settings,
            ctx,
            isToolPrunable: runtime.isToolPrunable,
            contextWindowTokensOverride: runtime.contextWindowTokens ?? undefined,
        });
        if (next === event.messages)
            return undefined;
        return { messages: next };
    });
}
