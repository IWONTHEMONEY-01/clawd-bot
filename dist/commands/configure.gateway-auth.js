import { ensureAuthProfileStore } from "../agents/auth-profiles.js";
import { applyAuthChoice, resolvePreferredProviderForAuthChoice } from "./auth-choice.js";
import { promptAuthChoiceGrouped } from "./auth-choice-prompt.js";
import { applyPrimaryModel, promptDefaultModel } from "./model-picker.js";
export function buildGatewayAuthConfig(params) {
    const allowTailscale = params.existing?.allowTailscale;
    const base = {};
    if (typeof allowTailscale === "boolean")
        base.allowTailscale = allowTailscale;
    if (params.mode === "off") {
        return Object.keys(base).length > 0 ? base : undefined;
    }
    if (params.mode === "token") {
        return { ...base, mode: "token", token: params.token };
    }
    return { ...base, mode: "password", password: params.password };
}
export async function promptAuthConfig(cfg, runtime, prompter) {
    const authChoice = await promptAuthChoiceGrouped({
        prompter,
        store: ensureAuthProfileStore(undefined, {
            allowKeychainPrompt: false,
        }),
        includeSkip: true,
        includeClaudeCliIfMissing: true,
    });
    let next = cfg;
    if (authChoice !== "skip") {
        const applied = await applyAuthChoice({
            authChoice,
            config: next,
            prompter,
            runtime,
            setDefaultModel: true,
        });
        next = applied.config;
        // Auth choice already set a sensible default model; skip the model picker.
        return next;
    }
    const modelSelection = await promptDefaultModel({
        config: next,
        prompter,
        allowKeep: true,
        ignoreAllowlist: true,
        preferredProvider: resolvePreferredProviderForAuthChoice(authChoice),
    });
    if (modelSelection.model) {
        next = applyPrimaryModel(next, modelSelection.model);
    }
    return next;
}
