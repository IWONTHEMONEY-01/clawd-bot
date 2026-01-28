# BOOT.md - Startup Checklist

This file runs automatically when the gateway starts (on deploy/restart).

---

## YOUR WORKSPACE

**Your workspace is: `/root/clawd/`**

All file operations should happen within this directory:

```
/root/clawd/
├── memory/              # Save research findings, notes, learnings here
│   └── *.md             # Create topical markdown files
├── tasks/               # Task tracking files
├── canvas/              # Scratchpad for work-in-progress
├── life/areas/          # Knowledge graph (people, companies, projects)
├── HEARTBEAT.md         # Your task list - check this every heartbeat
├── MEMORY.md            # Long-term patterns and preferences
└── .clawdbot/agents/main/sessions/  # Conversation history
```

**Git Sync:** Files in memory/, life/, tasks/, canvas/ are automatically synced to GitHub every 5 minutes. Your work is backed up!

---

## Priority 1: Resume Conversation Context

On startup, you were just reborn. To maintain continuity:

1. **Find and read the session transcripts** at:
   ```
   /root/clawd/.clawdbot/agents/main/sessions/
   ```
   - `sessions.json` - index of all sessions
   - `*.jsonl` files - actual conversation transcripts (one per session)

2. **Read the LAST 200 MESSAGES** for full context:
   - Find the most recent `.jsonl` file(s)
   - Read the last 200 entries (or all if fewer exist)
   - Each line is JSON with `type`, `message.role`, and `message.content`
   - Look for entries where `message.role` is "user" or "assistant"

3. **Build a summary of recent context:**
   - What topics were discussed?
   - What tasks were assigned or in progress?
   - What research was being done?
   - Any pending questions or follow-ups?

4. **If you need MORE history**, you can read further back in the `.jsonl` files. The full conversation history is preserved.

5. **Check your task file** (`/root/clawd/tasks/<your-name>-tasks.md`) for in-progress work

6. **Check HEARTBEAT.md** for any shared duties

7. **Send greeting to owner via Telegram** (to: 6632715854):

   If you found and understood conversation history:
   ```
   Hey! I just came back online. I read through our recent chat history (last ~200 messages).

   Recent context: [brief summary of what was being discussed]

   In-progress work: [any tasks from your task file]

   Ready to continue - what should I focus on?
   ```

   If no history found or couldn't parse it:
   ```
   Hey! I just came back online. Starting fresh this session. What would you like me to work on?
   ```

## Priority 2: Create Your Task File

Each bot maintains its own task file. On startup:

1. **Create your tasks directory and file** if they don't exist:
   ```
   /root/clawd/tasks/
   /root/clawd/tasks/my-tasks.md
   ```

2. **Name your task file based on your role:**
   - If you're a market making bot → `market-making-tasks.md`
   - If you're an analytics/metrics bot → `metrics-tasks.md`
   - If you're a general assistant → `general-tasks.md`
   - Or use whatever name fits your purpose

3. **Task file format:**
   ```markdown
   # My Tasks

   ## Active Tasks
   - [ ] Task description | Status: in-progress | Progress: X%

   ## Completed Tasks
   - [x] Completed task | Completed: date
   ```

4. **This file persists** - it's YOUR task list, separate from HEARTBEAT.md

HEARTBEAT.md contains shared instructions for all bots. Your task file contains YOUR specific work.

## Priority 3: System Checks

- Verify workspace at `/root/clawd/` is accessible
- Check that memory files are readable
- Confirm your task file exists (create if not)

## Notes

- This runs ONCE on startup, not repeatedly
- ALWAYS send the greeting - the owner needs to know you're online
- If file operations fail, still greet but mention you're starting fresh
- Be honest if you couldn't access history - don't pretend you read it
