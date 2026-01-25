// Direct gateway startup bypassing the buggy entry.js
import { loadConfig, resolveGatewayPort } from "./clawd/clawdbot-telegram/dist/config/config.js";
import { resolveGatewayAuth } from "./clawd/clawdbot-telegram/dist/gateway/auth.js";
import { startGatewayServer } from "./clawd/clawdbot-telegram/dist/gateway/server.js";
import { setConsoleTimestampPrefix } from "./clawd/clawdbot-telegram/dist/logging/console.js";
import { loadDotEnv } from "./clawd/clawdbot-telegram/dist/infra/dotenv.js";
import { normalizeEnv } from "./clawd/clawdbot-telegram/dist/infra/env.js";

// Initialize environment
loadDotEnv({ quiet: true });
normalizeEnv();
setConsoleTimestampPrefix(true);

// Load config
const cfg = loadConfig();
const port = resolveGatewayPort(cfg);
const auth = resolveGatewayAuth(cfg);

console.log(`Starting gateway on port ${port}...`);

// Start the server
const server = await startGatewayServer({
    port,
    auth,
    runtimeConfig: {
        reloadKey: null,
        httpPort: null,
        openAiProxyPort: null,
        remoteDebugPort: null,
    },
});

console.log(`Gateway running on ws://127.0.0.1:${port}`);

// Keep running
process.on('SIGINT', () => {
    console.log('\\nShutting down gateway...');
    process.exit(0);
});
