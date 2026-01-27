/**
 * Auto Memory Save Hook
 *
 * Automatically saves session context to memory files after each assistant response.
 * Works in conjunction with the existing memory-flush system but provides more frequent saves.
 *
 * Triggers on:
 * - gateway:startup - Sets up periodic save interval
 * - session:message - After assistant messages (future enhancement)
 */

import fs from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import type { ClawdbotConfig } from "../../../config/config.js";
import { resolveAgentWorkspaceDir } from "../../../agents/agent-scope.js";
import { resolveSessionTranscriptsDirForAgent } from "../../../config/sessions/paths.js";
import type { HookHandler } from "../../hooks.js";

// Track last save time per session to avoid too-frequent saves
const lastSaveBySession = new Map<string, number>();
const MIN_SAVE_INTERVAL_MS = 10 * 60 * 1000; // 10 minutes between saves

// Track message counts for smarter saving
const messageCountBySession = new Map<string, number>();
const MESSAGES_BEFORE_SAVE = 5; // Save after every 5 messages

/**
 * Parse session transcript to extract recent messages
 */
async function parseRecentMessages(
  sessionFile: string,
  maxLines = 30,
): Promise<{ role: string; content: string; timestamp?: string }[]> {
  try {
    const content = await fs.readFile(sessionFile, "utf-8");
    const lines = content.trim().split("\n").slice(-maxLines);

    const messages: { role: string; content: string; timestamp?: string }[] = [];
    for (const line of lines) {
      try {
        const entry = JSON.parse(line);
        if (entry.type === "message" && entry.message) {
          const msg = entry.message;
          if ((msg.role === "user" || msg.role === "assistant") && msg.content) {
            const text = Array.isArray(msg.content)
              ? msg.content.find((c: { type: string; text?: string }) => c.type === "text")?.text
              : msg.content;
            if (text && typeof text === "string" && !text.startsWith("/")) {
              messages.push({
                role: msg.role,
                content: text.slice(0, 500), // Truncate long messages
                timestamp: entry.timestamp,
              });
            }
          }
        }
      } catch {
        // Skip invalid lines
      }
    }
    return messages;
  } catch {
    return [];
  }
}

/**
 * Generate a simple summary from messages without LLM
 */
function generateQuickSummary(messages: { role: string; content: string }[]): string {
  if (messages.length === 0) return "";

  const lines: string[] = [];
  for (const msg of messages.slice(-10)) {
    const prefix = msg.role === "user" ? "User" : "Assistant";
    const truncated = msg.content.length > 200 ? msg.content.slice(0, 200) + "..." : msg.content;
    lines.push(`**${prefix}**: ${truncated}`);
  }
  return lines.join("\n\n");
}

/**
 * Save session snapshot to memory
 */
async function saveSessionSnapshot(params: {
  sessionKey: string;
  sessionFile: string;
  workspaceDir: string;
  reason: string;
}): Promise<string | null> {
  const { sessionKey, sessionFile, workspaceDir, reason } = params;

  const messages = await parseRecentMessages(sessionFile);
  if (messages.length < 3) return null; // Not enough content

  const memoryDir = path.join(workspaceDir, "memory");
  await fs.mkdir(memoryDir, { recursive: true });

  const now = new Date();
  const dateStr = now.toISOString().split("T")[0];
  const timeStr = now.toISOString().split("T")[1]?.split(".")[0]?.replace(/:/g, "") ?? "000000";

  // Create unique filename
  const sessionSlug = sessionKey.replace(/[^a-zA-Z0-9]/g, "-").slice(0, 20);
  const filename = `${dateStr}-${timeStr}-${sessionSlug}.md`;
  const filePath = path.join(memoryDir, filename);

  // Build markdown content
  const summary = generateQuickSummary(messages);
  const content = [
    `# Session Snapshot: ${dateStr}`,
    "",
    `- **Session**: ${sessionKey}`,
    `- **Time**: ${now.toISOString()}`,
    `- **Reason**: ${reason}`,
    `- **Messages**: ${messages.length}`,
    "",
    "## Recent Conversation",
    "",
    summary,
    "",
  ].join("\n");

  await fs.writeFile(filePath, content, "utf-8");
  return filePath;
}

/**
 * Scan all active sessions and save snapshots if needed
 */
async function saveAllActiveSessions(cfg: ClawdbotConfig | undefined, agentId = "main"): Promise<number> {
  const sessionsDir = resolveSessionTranscriptsDirForAgent(agentId);
  const workspaceDir = cfg ? resolveAgentWorkspaceDir(cfg, agentId) : path.join(os.homedir(), "clawd");

  let savedCount = 0;

  try {
    const files = await fs.readdir(sessionsDir);
    const sessionFiles = files.filter((f) => f.endsWith(".jsonl") && !f.endsWith(".backup"));

    for (const file of sessionFiles) {
      const sessionFile = path.join(sessionsDir, file);
      const sessionKey = `agent:${agentId}:${path.basename(file, ".jsonl")}`;

      // Check if we should save this session
      const lastSave = lastSaveBySession.get(sessionKey) ?? 0;
      const timeSinceLastSave = Date.now() - lastSave;

      if (timeSinceLastSave < MIN_SAVE_INTERVAL_MS) continue;

      // Check file modification time
      try {
        const stat = await fs.stat(sessionFile);
        const fileAge = Date.now() - stat.mtimeMs;

        // Only save if file was modified recently (within last hour)
        if (fileAge > 60 * 60 * 1000) continue;

        const saved = await saveSessionSnapshot({
          sessionKey,
          sessionFile,
          workspaceDir,
          reason: "auto-save (periodic)",
        });

        if (saved) {
          lastSaveBySession.set(sessionKey, Date.now());
          savedCount++;
          console.log(`[auto-memory-save] Saved snapshot: ${path.basename(saved)}`);
        }
      } catch {
        // Skip files that can't be read
      }
    }
  } catch (err) {
    console.error("[auto-memory-save] Failed to scan sessions:", err);
  }

  return savedCount;
}

// Interval handle for periodic saves
let saveIntervalHandle: ReturnType<typeof setInterval> | null = null;

/**
 * Auto memory save hook handler
 */
const autoMemorySave: HookHandler = async (event) => {
  // On gateway startup, set up periodic saving
  if (event.type === "gateway" && event.action === "startup") {
    console.log("[auto-memory-save] Initializing auto-save (every 15 minutes)");

    const cfg = event.context?.cfg as ClawdbotConfig | undefined;

    // Clear any existing interval
    if (saveIntervalHandle) {
      clearInterval(saveIntervalHandle);
    }

    // Set up periodic save (every 15 minutes)
    saveIntervalHandle = setInterval(
      async () => {
        const count = await saveAllActiveSessions(cfg);
        if (count > 0) {
          console.log(`[auto-memory-save] Periodic save completed: ${count} sessions`);
        }
      },
      15 * 60 * 1000,
    );

    // Also run immediately on startup to capture any pending sessions
    setTimeout(() => saveAllActiveSessions(cfg), 30000);

    return;
  }

  // Future: Handle session:message events for per-message saving
  // if (event.type === "session" && event.action === "message") { ... }
};

export default autoMemorySave;
