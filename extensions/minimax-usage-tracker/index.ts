import { Type } from "@sinclair/typebox";
import type { ClawdbotPluginDefinition } from "../../src/plugins/types.js";

const MINIMAX_HOURLY_LIMIT = 100;

// Config schema for the plugin
const configSchema = {
  jsonSchema: {
    type: "object",
    properties: {
      databaseUrl: {
        type: "string",
        description: "PostgreSQL connection URL for usage tracking",
      },
      appName: {
        type: "string",
        default: "clawdbot",
        description: "App name to log in the database",
      },
      hourlyLimit: {
        type: "number",
        default: 100,
        description: "Hourly API call limit",
      },
    },
    required: ["databaseUrl"],
  },
  uiHints: {
    databaseUrl: {
      label: "Database URL",
      help: "PostgreSQL connection string (e.g., postgres://user:pass@host:5432/db)",
      sensitive: true,
    },
    appName: {
      label: "App Name",
      help: "Identifier for this app in the usage table",
    },
    hourlyLimit: {
      label: "Hourly Limit",
      help: "Maximum API calls per hour",
    },
  },
};

// Tool schema for checking usage
const CheckUsageSchema = Type.Object({
  showDetails: Type.Optional(Type.Boolean({ description: "Show detailed breakdown" })),
});

// Helper to get a postgres client
async function getClient(databaseUrl: string) {
  // Dynamic import to avoid requiring pg if not used
  const { default: pg } = await import("pg");
  const client = new pg.Client({ connectionString: databaseUrl });
  await client.connect();
  return client;
}

// Log a MiniMax API call
async function logUsage(databaseUrl: string, appName: string, model: string) {
  let client;
  try {
    client = await getClient(databaseUrl);
    await client.query(
      `INSERT INTO minimax_usage (app_name, model) VALUES ($1, $2)`,
      [appName, model]
    );
  } catch (err) {
    console.error("[minimax-usage-tracker] Failed to log usage:", err);
  } finally {
    if (client) await client.end().catch(() => {});
  }
}

// Check remaining quota
async function checkRemaining(databaseUrl: string, hourlyLimit: number) {
  let client;
  try {
    client = await getClient(databaseUrl);
    const result = await client.query(
      `SELECT COUNT(*) as count FROM minimax_usage WHERE called_at > NOW() - INTERVAL '1 hour'`
    );
    const used = parseInt(result.rows[0]?.count ?? "0", 10);
    return {
      used,
      remaining: Math.max(0, hourlyLimit - used),
      limit: hourlyLimit,
      percentUsed: Math.round((used / hourlyLimit) * 100),
    };
  } catch (err) {
    console.error("[minimax-usage-tracker] Failed to check usage:", err);
    return { error: String(err) };
  } finally {
    if (client) await client.end().catch(() => {});
  }
}

// Get detailed usage breakdown
async function getDetailedUsage(databaseUrl: string) {
  let client;
  try {
    client = await getClient(databaseUrl);
    const result = await client.query(`
      SELECT
        app_name,
        model,
        COUNT(*) as calls,
        MIN(called_at) as first_call,
        MAX(called_at) as last_call
      FROM minimax_usage
      WHERE called_at > NOW() - INTERVAL '1 hour'
      GROUP BY app_name, model
      ORDER BY calls DESC
    `);
    return result.rows;
  } catch (err) {
    console.error("[minimax-usage-tracker] Failed to get detailed usage:", err);
    return [];
  } finally {
    if (client) await client.end().catch(() => {});
  }
}

const plugin: ClawdbotPluginDefinition = {
  id: "minimax-usage-tracker",
  name: "MiniMax Usage Tracker",
  description: "Track MiniMax API usage in PostgreSQL and monitor quota",
  version: "1.0.0",
  configSchema,

  async register(api) {
    const config = api.pluginConfig as {
      databaseUrl?: string;
      appName?: string;
      hourlyLimit?: number;
    } | undefined;

    const databaseUrl = config?.databaseUrl ?? process.env.MINIMAX_USAGE_DB_URL;
    const appName = config?.appName ?? "clawdbot";
    const hourlyLimit = config?.hourlyLimit ?? MINIMAX_HOURLY_LIMIT;

    if (!databaseUrl) {
      api.logger.warn(
        "No database URL configured. Set MINIMAX_USAGE_DB_URL or configure plugins.minimax-usage-tracker.databaseUrl"
      );
      return;
    }

    api.logger.info(`MiniMax usage tracker enabled (app: ${appName}, limit: ${hourlyLimit}/hr)`);

    // Register agent_end hook to track MiniMax API calls
    api.on("agent_end", async (event, ctx) => {
      // Check if this was a MiniMax call
      const provider = ctx.messageProvider?.toLowerCase() ?? "";
      if (!provider.includes("minimax")) {
        return;
      }

      // Extract model name from provider string if available
      const model = provider.includes("/")
        ? provider.split("/").pop() ?? "unknown"
        : "MiniMax-M2.1";

      await logUsage(databaseUrl, appName, model);
      api.logger.info(`Logged MiniMax API call (model: ${model})`);

      // Check if approaching limit
      const usage = await checkRemaining(databaseUrl, hourlyLimit);
      if ("remaining" in usage && usage.remaining <= 10) {
        api.logger.warn(
          `MiniMax quota warning: ${usage.remaining} calls remaining this hour (${usage.percentUsed}% used)`
        );
      }
    });

    // Register tool for checking usage
    api.registerTool(
      {
        name: "minimax_usage",
        description:
          "Check MiniMax API usage and remaining quota. Use this to monitor API limits before making calls.",
        parameters: CheckUsageSchema,
        execute: async (_toolCallId, args) => {
          const params = args as { showDetails?: boolean };
          const usage = await checkRemaining(databaseUrl, hourlyLimit);

          if ("error" in usage) {
            return { type: "text" as const, text: `Error checking usage: ${usage.error}` };
          }

          let response = `MiniMax API Usage (Last Hour):\n`;
          response += `- Used: ${usage.used} / ${usage.limit} calls\n`;
          response += `- Remaining: ${usage.remaining} calls\n`;
          response += `- Usage: ${usage.percentUsed}%`;

          if (usage.remaining <= 10) {
            response += `\n\n WARNING: Approaching rate limit!`;
          }

          if (params.showDetails) {
            const details = await getDetailedUsage(databaseUrl);
            if (details.length > 0) {
              response += `\n\nBreakdown by app:\n`;
              for (const row of details) {
                response += `- ${row.app_name} (${row.model}): ${row.calls} calls\n`;
              }
            }
          }

          return { type: "text" as const, text: response };
        },
      },
      { name: "minimax_usage" }
    );
  },
};

export default plugin;
