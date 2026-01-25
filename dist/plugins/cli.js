import { resolveAgentWorkspaceDir, resolveDefaultAgentId } from "../agents/agent-scope.js";
import { loadConfig } from "../config/config.js";
import { createSubsystemLogger } from "../logging/subsystem.js";
import { loadClawdbotPlugins } from "./loader.js";
const log = createSubsystemLogger("plugins");
export function registerPluginCliCommands(program, cfg) {
    const config = cfg ?? loadConfig();
    const workspaceDir = resolveAgentWorkspaceDir(config, resolveDefaultAgentId(config));
    const logger = {
        info: (msg) => log.info(msg),
        warn: (msg) => log.warn(msg),
        error: (msg) => log.error(msg),
        debug: (msg) => log.debug(msg),
    };
    const registry = loadClawdbotPlugins({
        config,
        workspaceDir,
        logger,
    });
    for (const entry of registry.cliRegistrars) {
        try {
            const result = entry.register({
                program,
                config,
                workspaceDir,
                logger,
            });
            if (result && typeof result.then === "function") {
                void result.catch((err) => {
                    log.warn(`plugin CLI register failed (${entry.pluginId}): ${String(err)}`);
                });
            }
        }
        catch (err) {
            log.warn(`plugin CLI register failed (${entry.pluginId}): ${String(err)}`);
        }
    }
}
