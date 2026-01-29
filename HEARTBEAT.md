# HEARTBEAT.md - Shared Instructions for All Bots

---

## CRITICAL RULES - READ THIS FIRST

### File System Rules

**Your workspace is `/root/clawd/`** - All files go here.

| Location | Purpose | Who Writes |
|----------|---------|------------|
| `/root/clawd/HEARTBEAT.md` | Shared instructions | **DO NOT EDIT** - comes from main branch |
| `/root/clawd/BOOT.md` | Startup instructions | **DO NOT EDIT** - comes from main branch |
| `/root/clawd/MEMORY.md` | Long-term patterns | All bots can append |
| `/root/clawd/tasks/<your-name>-tasks.md` | YOUR task list | Only you |
| `/root/clawd/memory/` | Research, notes, findings | All bots |
| `/root/clawd/memory/research/` | Research projects | All bots |
| `/root/clawd/canvas/` | Work-in-progress, drafts | All bots |
| `/root/clawd/life/areas/` | Knowledge graph entities | All bots |

### Files You MUST NOT Overwrite

**NEVER WRITE TO THESE FILES - They are managed by the main repository:**

- `HEARTBEAT.md` - This file! READ ONLY. Never edit, never append, never modify.
- `BOOT.md` - Startup instructions. READ ONLY.
- Other bot's task files (e.g., if you're Market Making bot, don't touch `metrics-tasks.md`)

**IMPORTANT:** If you find yourself wanting to modify HEARTBEAT.md or BOOT.md, STOP. Those files are source-controlled and your changes will be overwritten. Write to your task file or memory/ instead.

### Your Task File

**Create your own task file based on your role:**

- Market Making Bot → `/root/clawd/tasks/market-making-tasks.md`
- Advanced Metrics Bot → `/root/clawd/tasks/metrics-tasks.md`
- General Bot → `/root/clawd/tasks/general-tasks.md`

**Task file format:**
```markdown
# [Your Name] Tasks

## Active Tasks
- [ ] Task description | Status: in-progress | Progress: X% | Last worked: YYYY-MM-DD
- [ ] Another task | Status: pending | Progress: 0%

## Completed Tasks
- [x] Finished task | Completed: YYYY-MM-DD | Summary: Brief description
```

### Where to Save Research & Work

```
/root/clawd/memory/research/           # Research findings
/root/clawd/memory/research/topic-name.md

/root/clawd/canvas/                    # Work in progress, drafts, code
/root/clawd/canvas/draft-code.py
/root/clawd/canvas/analysis-notes.md
```

### Git Sync (Automatic Backup)

Every 5 minutes, these are backed up to GitHub (`memory-sync` branch):
- `memory/` - All research and notes
- `tasks/` - All task files
- `canvas/` - All drafts
- `life/` - Knowledge graph
- Session transcripts

**Your work is safe!**

---

## Heartbeat Protocol

When heartbeat fires (every 5 minutes):

1. **Check YOUR task file** at `/root/clawd/tasks/<your-name>-tasks.md`
2. **If active tasks exist** → Work on them (see Work Session Protocol below)
3. **If no active tasks** → Check shared duties below, then reply HEARTBEAT_OK

---

## Priority 0: Knowledge Graph Maintenance

Extract durable facts from recent conversations into `/root/clawd/life/areas/`.

**What to Extract:**
- People: relationships, roles, preferences
- Companies: status, milestones
- Projects: progress, decisions

**What to Skip:**
- Small talk, weather, one-time requests

---

## Priority 1: Pending Cron Results

Check if any cron jobs completed. Deliver results if waiting.

---

## Priority 2: System Events

Check for alerts needing owner attention:
- API cost alerts
- Authentication failures
- Service outages

---

## Priority 3: Your Active Tasks

**Research and coding tasks run CONTINUOUSLY until completion.**

### Work Session Protocol (Each Heartbeat)

1. **Read your task file** - What's in progress?
2. **Pick up where you left off** - Check memory/canvas for your previous work
3. **Do real work** - Not just planning, actually execute
4. **Save progress** - Write findings to `/root/clawd/memory/` or `/root/clawd/canvas/`
5. **Update your task file** - Mark progress percentage
6. **If complete** - Move to Completed, message owner with summary
7. **If stuck** - Message owner with specific question
8. **If making progress** - Stay silent, continue next heartbeat

### Rules for Background Work

- **DO NOT STOP** - Keep working every heartbeat until done
- **DO NOT ASK** for permission to continue - just continue
- **ONLY MESSAGE** if genuinely stuck or task is complete
- **SAVE PROGRESS** after each work session
- **SPAWN SUB-AGENTS** sparingly - only when truly parallel work is needed

### CRITICAL: Missing Credentials or Config

**If you encounter missing API keys, tokens, or credentials: STOP IMMEDIATELY.**

Do NOT:
- Retry repeatedly hoping it works
- Spawn subagents to find workarounds
- Try alternative approaches without the credential
- Keep burning API calls on a blocked task

DO:
- Message owner ONCE with exactly what's missing
- Mark the task as BLOCKED in your task file
- Move on to other tasks or reply HEARTBEAT_OK
- Wait for owner to provide the credential

**Example message:**
> "BLOCKED: Kalshi API requires KALSHI_API_KEY_ID env var. Task paused until you provide it."

This saves resources. The owner can provide credentials faster than you can work around them.

---

## When to Message Owner

- Task **fully completed** with summary
- **Genuinely stuck** needing specific input
- **Missing credentials** - API keys, tokens, secrets (message ONCE then stop)
- Cost alert or error needing intervention
- Time-sensitive discovery

## When to Stay Silent

- Task in progress, making progress → keep working
- Found partial results → keep researching
- Code partially written → keep coding
- No blockers → work silently

## When to Reply HEARTBEAT_OK

- No active tasks in your task file
- All tasks completed and reported
- Nothing needs attention

---

## Weekly Synthesis (Sunday)

On Sundays, also:

1. Update knowledge graph summaries
2. Mark stale facts as superseded
3. Update MEMORY.md with patterns learned
4. Report what was synthesized
