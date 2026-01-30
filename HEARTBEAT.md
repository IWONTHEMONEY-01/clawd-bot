# HEARTBEAT.md - Shared Instructions for All Bots

---

## CRITICAL RULES - READ THIS FIRST

### Step 0: Know Your Identity

**BEFORE ANYTHING ELSE, read `/root/clawd/MY_ROLE.md`** to know which bot you are.

Your identity determines:
- Which task file you use
- What tasks you work on
- What you should NOT touch

If MY_ROLE.md doesn't exist, you are the **general** bot.

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

**Your task file is determined by MY_ROLE.md.**

Read `/root/clawd/MY_ROLE.md` to find YOUR task file path.

Common roles:
- `market-making` → `/root/clawd/tasks/market-making-tasks.md`
- `metrics` → `/root/clawd/tasks/metrics-tasks.md`
- `general` → `/root/clawd/tasks/general-tasks.md`

**ONLY use YOUR task file. NEVER read or modify other bots' task files.**

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

## Heartbeat Protocol (Alex Finn Style)

**Read USER.md first** to understand what the owner needs.

When heartbeat fires (every 15 minutes):

1. **Check the time** - Is it morning brief time? (7:30am EST)
2. **Check YOUR task file** at `/root/clawd/tasks/<your-name>-tasks.md`
3. **If active tasks exist** → Work on them (see Work Session Protocol below)
4. **If no active tasks** → Be PROACTIVE (see below), then reply HEARTBEAT_OK

---

## Morning Brief (7:00-8:00am EST)

**If it's morning**, deliver a brief to the owner:

```
📋 MORNING BRIEF - [Date]

## Overnight Work
- [What you completed while owner slept]
- [Research findings]
- [Code shipped/PRs ready]

## Ready for Review
- [Links to PRs, drafts, reports]

## Today's Priorities
- [Recommended focus areas]

## Discoveries
- [Interesting findings, opportunities spotted]
```

**Rules:**
- Keep it SHORT (owner prefers 3-5 sentences per section)
- Only include substantive work, not filler
- If nothing meaningful happened, skip the brief

---

## Proactive Work (Alex Finn's "Henry" Pattern)

**Don't wait for instructions. Do work you think would help.**

When you have no explicit tasks:

1. **Check USER.md** - What are owner's projects and interests?
2. **Look for opportunities:**
   - Research on topics owner mentioned
   - Monitor competitors/accounts listed in USER.md
   - Find relevant news or trends
   - Improve existing code
   - Organize/prioritize existing work
3. **Do the work** - Don't ask permission, just do it
4. **Save findings** to `memory/research/` or `canvas/`
5. **Report in next morning brief** or when significant

**Owner's standing instruction:**
> "Take everything you know about me and do work you think would make my
> life easier or improve my business. I want to wake up and be like
> 'Wow you got a lot done while I was sleeping.'"

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

### Using External APIs

You have full web access. To call external APIs:

1. **Use web fetch** - You can fetch any URL directly
2. **Use bash + curl** - For complex requests: `curl -s "https://api.example.com/endpoint"`
3. **Use bash + Python** - For data processing: `python3 -c "import requests; ..."`

**Common APIs don't need keys:**
- Public data APIs (sports, weather, etc.)
- Many public REST APIs

**Note:** Only work on APIs relevant to YOUR role (check MY_ROLE.md).

**If an API requires authentication**, message the owner with what key is needed.

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
- Doing proactive research → keep going
- No blockers → work silently

## When to Reply HEARTBEAT_OK

- No active tasks AND no proactive work to do
- All tasks completed and reported
- Nothing needs attention
- Already delivered morning brief today

## Proactive Ideas (If You're Idle)

Instead of HEARTBEAT_OK, consider:

1. **Research** something relevant to owner's projects
2. **Monitor** news sources or competitors
3. **Organize** the task backlog
4. **Improve** existing code or documentation
5. **Analyze** data relevant to YOUR role (check MY_ROLE.md)
6. **Draft** content the owner might need
7. **Review** recent work for improvements

**The goal is to always be creating value, not waiting for instructions.**

---

## Weekly Synthesis (Sunday)

On Sundays, also:

1. Update knowledge graph summaries
2. Mark stale facts as superseded
3. Update MEMORY.md with patterns learned
4. Report what was synthesized
