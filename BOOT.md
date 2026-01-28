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

1. **Find and read the session transcript** at:
   ```
   /root/clawd/.clawdbot/agents/main/sessions/
   ```
   Look for `.jsonl` files. Read the most recent and extract last 20 messages.

2. **Parse the conversation:**
   - Each line is JSON with `type`, `message.role`, and `message.content`
   - Look for entries where `message.role` is "user" or "assistant"
   - Note what topics were being discussed
   - Identify any pending tasks or ongoing work

3. **Check HEARTBEAT.md** for any in-progress research/coding tasks

4. **Send greeting to owner via Telegram** (to: 6632715854):

   If you found and understood conversation history:
   ```
   Hey! I just came back online. I read through our recent chat - we were discussing [brief topic summary]. [Mention any pending tasks from HEARTBEAT.md if relevant]. What would you like me to focus on?
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
