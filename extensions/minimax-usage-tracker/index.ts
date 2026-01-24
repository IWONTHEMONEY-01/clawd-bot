import { Type } from "@sinclair/typebox";
import type { ClawdbotPluginDefinition } from "../../src/plugins/types.js";

const MINIMAX_HOURLY_LIMIT = 100;

// Config schema for the plugin
const configSchema = {
  jsonSchema: {
    type: "object",
    properties: {
      supabaseUrl: {
        type: "string",
        description: "Supabase project URL (e.g., https://xxx.supabase.co)",
      },
      supabaseKey: {
        type: "string",
        description: "Supabase service role key",
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
  },
  uiHints: {
    supabaseUrl: {
      label: "Supabase URL",
      help: "Your Supabase project URL",
    },
    supabaseKey: {
      label: "Supabase Service Key",
      help: "Service role key from Project Settings → API",
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

// Types for Supabase client
type SupabaseClient = {
  from: (table: string) => {
    insert: (data: Record<string, unknown>) => Promise<{ error: unknown }>;
    select: (columns?: string) => {
      gt: (column: string, value: string) => Promise<{ data: unknown[]; error: unknown }>;
      gte: (column: string, value: string) => {
        order: (column: string, opts: { ascending: boolean }) => Promise<{ data: unknown[]; error: unknown }>;
      };
    };
  };
  rpc: (fn: string, params?: Record<string, unknown>) => Promise<{ data: unknown; error: unknown }>;
};

// Helper to get a Supabase client
async function getClient(supabaseUrl: string, supabaseKey: string): Promise<SupabaseClient> {
  const { createClient } = await import("@supabase/supabase-js");
  return createClient(supabaseUrl, supabaseKey) as unknown as SupabaseClient;
}

// Log a MiniMax API call
async function logUsage(
  supabaseUrl: string,
  supabaseKey: string,
  appName: string,
  model: string
) {
  try {
    const client = await getClient(supabaseUrl, supabaseKey);
    const { error } = await client.from("minimax_usage").insert({
      app_name: appName,
      model: model,
    });
    if (error) {
      console.error("[minimax-usage-tracker] Failed to log usage:", error);
    }
  } catch (err) {
    console.error("[minimax-usage-tracker] Failed to log usage:", err);
  }
}

// Check remaining quota
async function checkRemaining(
  supabaseUrl: string,
  supabaseKey: string,
  hourlyLimit: number
) {
  try {
    const client = await getClient(supabaseUrl, supabaseKey);
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();

    const { data, error } = await client
      .from("minimax_usage")
      .select("id")
      .gt("called_at", oneHourAgo);

    if (error) {
      console.error("[minimax-usage-tracker] Failed to check usage:", error);
      return { error: String(error) };
    }

    const used = data?.length ?? 0;
    return {
      used,
      remaining: Math.max(0, hourlyLimit - used),
      limit: hourlyLimit,
      percentUsed: Math.round((used / hourlyLimit) * 100),
    };
  } catch (err) {
    console.error("[minimax-usage-tracker] Failed to check usage:", err);
    return { error: String(err) };
  }
}

// Get detailed usage breakdown
async function getDetailedUsage(supabaseUrl: string, supabaseKey: string) {
  try {
    const client = await getClient(supabaseUrl, supabaseKey);
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();

    const { data, error } = await client
      .from("minimax_usage")
      .select("app_name, model, called_at")
      .gte("called_at", oneHourAgo)
      .order("called_at", { ascending: false });

    if (error) {
      console.error("[minimax-usage-tracker] Failed to get detailed usage:", error);
      return [];
    }

    // Aggregate by app_name and model
    const aggregated = new Map<string, { app_name: string; model: string; calls: number }>();
    for (const row of (data ?? []) as Array<{ app_name: string; model: string }>) {
      const key = `${row.app_name}:${row.model}`;
      const existing = aggregated.get(key);
      if (existing) {
        existing.calls++;
      } else {
        aggregated.set(key, { app_name: row.app_name, model: row.model, calls: 1 });
      }
    }

    return Array.from(aggregated.values()).sort((a, b) => b.calls - a.calls);
  } catch (err) {
    console.error("[minimax-usage-tracker] Failed to get detailed usage:", err);
    return [];
  }
}

const plugin: ClawdbotPluginDefinition = {
  id: "minimax-usage-tracker",
  name: "MiniMax Usage Tracker",
  description: "Track MiniMax API usage in Supabase and monitor quota",
  version: "1.1.0",
  configSchema,

  async register(api) {
    const config = api.pluginConfig as {
      supabaseUrl?: string;
      supabaseKey?: string;
      appName?: string;
      hourlyLimit?: number;
    } | undefined;

    const supabaseUrl = config?.supabaseUrl ?? process.env.MINIMAX_USAGE_SUPABASE_URL;
    const supabaseKey = config?.supabaseKey ?? process.env.MINIMAX_USAGE_SUPABASE_KEY;
    const appName = config?.appName ?? "clawdbot";
    const hourlyLimit = config?.hourlyLimit ?? MINIMAX_HOURLY_LIMIT;

    if (!supabaseUrl || !supabaseKey) {
      api.logger.warn(
        "Supabase not configured. Set MINIMAX_USAGE_SUPABASE_URL and MINIMAX_USAGE_SUPABASE_KEY or configure the plugin."
      );
      return;
    }

    api.logger.info(`MiniMax usage tracker enabled (app: ${appName}, limit: ${hourlyLimit}/hr)`);

    // Register agent_end hook to track MiniMax API calls
    api.on("agent_end", async (_event, ctx) => {
      // Check if this was a MiniMax call
      const provider = ctx.messageProvider?.toLowerCase() ?? "";
      if (!provider.includes("minimax")) {
        return;
      }

      // Extract model name from provider string if available
      const model = provider.includes("/")
        ? provider.split("/").pop() ?? "unknown"
        : "MiniMax-M2.1";

      await logUsage(supabaseUrl, supabaseKey, appName, model);
      api.logger.info(`Logged MiniMax API call (model: ${model})`);

      // Check if approaching limit
      const usage = await checkRemaining(supabaseUrl, supabaseKey, hourlyLimit);
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
          const usage = await checkRemaining(supabaseUrl, supabaseKey, hourlyLimit);

          if ("error" in usage) {
            return { type: "text" as const, text: `Error checking usage: ${usage.error}` };
          }

          let response = `MiniMax API Usage (Last Hour):\n`;
          response += `- Used: ${usage.used} / ${usage.limit} calls\n`;
          response += `- Remaining: ${usage.remaining} calls\n`;
          response += `- Usage: ${usage.percentUsed}%`;

          if (usage.remaining <= 10) {
            response += `\n\n⚠️ WARNING: Approaching rate limit!`;
          }

          if (params.showDetails) {
            const details = await getDetailedUsage(supabaseUrl, supabaseKey);
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
