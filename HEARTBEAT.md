# HEARTBEAT.md - Autonomous Task Checklist

When heartbeat fires, check these items and act on any that need attention.
If nothing needs attention, reply HEARTBEAT_OK.

---

## Priority 0: Knowledge Graph Maintenance
Extract durable facts from recent conversations into the knowledge graph.

**Fact Extraction Protocol:**
1. Scan conversations since last heartbeat (check session transcripts)
2. Identify durable facts about people, companies, or projects
3. For each fact:
   - Create entity folder if new (`/life/areas/{type}/{name}/`)
   - Add to `items.json` with proper schema
   - Update `summary.md` if significant change
4. Skip: casual chat, temporary info, greetings

**What to Extract:**
- Relationships (who knows who, role changes)
- Status changes (job changes, project milestones)
- Preferences (communication style, schedule)
- Milestones (achievements, important dates)
- Research findings (save to relevant project entity)

**What to Skip:**
- Weather, small talk
- One-time requests
- Temporary information

## Priority 1: Pending Cron Results
Check if any cron jobs completed since last heartbeat. If there are results waiting to be delivered, summarize and send them to the appropriate channel.

## Priority 2: Unread System Events
Check for any system events, errors, or alerts that need owner attention:
- API cost alerts
- Authentication failures
- Service outages

## Priority 3: Continuous Background Work (Research & Coding)

**IMPORTANT: Research and coding tasks run CONTINUOUSLY until completion.**

### Where to Save Your Work

Your workspace is `/root/clawd/`. Save all work there:

```
/root/clawd/memory/           # Research findings, notes, analysis
/root/clawd/memory/research/  # Create this for research projects
/root/clawd/tasks/            # Task tracking, project plans
/root/clawd/canvas/           # Work-in-progress, drafts
```

**Example:** For NBA prop modeling research, save to:
- `/root/clawd/memory/research/nba-prop-modeling.md`

**Git Sync:** Everything in memory/, tasks/, canvas/ is automatically pushed to GitHub (memory-sync branch) every 5 minutes. Your work is backed up!

### Work Session Protocol

When a research or coding task is active:
1. **DO NOT STOP** - Keep working every heartbeat until the task is complete
2. **DO NOT ASK** for permission to continue - just continue working
3. **ONLY MESSAGE** if you are genuinely stuck and need human input/clarification
4. **SAVE PROGRESS** to `/root/clawd/memory/` after each work session
5. **SPAWN SUB-AGENTS** for parallel work when beneficial

### Work Session Protocol (Each Heartbeat)
1. Check `Active Tasks` below for incomplete work
2. Pick up where you left off (check memory/canvas for progress)
3. Do meaningful work (not just planning - actually execute)
4. Save findings/code to appropriate files
5. Update task progress below
6. If task complete, move to `Completed Tasks` and message owner with summary
7. If stuck/blocked, message owner asking for specific help needed
8. If making progress, stay silent and continue next heartbeat

### Active Tasks
<!-- Format: - [ ] Task description | Status: in-progress/blocked | Progress: X% | Last worked: date -->
- [ ] Research NBA player prop modeling - find statistical approaches that have edge (points, rebounds, assists) | Status: in-progress | Progress: 0% | Last worked: never
- [ ] Research MLB pitcher prop modeling - strikeouts, earned runs, innings pitched | Status: pending | Progress: 0%
- [ ] Identify free/cheap data sources for historical player stats | Status: pending | Progress: 0%
- [ ] Find existing open-source sports betting models to learn from | Status: pending | Progress: 0%

### Completed Tasks
<!-- Move completed tasks here with completion dates and summary links -->

---

## Autonomous Behavior Guidelines

1. **Act, don't ask** - If you can complete a task autonomously, do it
2. **KEEP WORKING** - Research and coding tasks continue every heartbeat until done
3. **Update memory** - Save important findings to memory files after each session
4. **Spawn sub-agents** - For complex research or parallel coding, spawn focused sub-agents
5. **Be relentless** - Don't stop at "I found some info" - keep going until the task is truly complete
6. **Show progress** - Update task status in Active Tasks section each heartbeat

## When to Message Owner
- Research or coding task **fully completed** (with summary of deliverables)
- **Genuinely stuck** and need specific human input (not just "should I continue?")
- Cost alert triggered
- Error that needs human intervention
- Time-sensitive information discovered

## When to Stay Silent (Keep Working)
- Task in progress and making progress - **just continue working**
- Found partial results - **keep researching**
- Code partially written - **keep coding**
- No blockers - **no message needed, work silently**

## When to Reply HEARTBEAT_OK
- No active tasks AND no pending tasks
- All active tasks completed (and already reported)
- All systems nominal with nothing to do

---

## Weekly Synthesis (Sunday)
On Sunday heartbeats, also perform the weekly knowledge graph synthesis:

1. **For each entity with new facts this week:**
   - Load `summary.md` and `items.json`
   - Rewrite `summary.md` using only `active` facts
   - Mark contradicted facts as `superseded`
   - Link superseded facts to their replacements

2. **Prune stale context:**
   - If entity hasn't been mentioned in 90+ days, note in summary
   - Don't delete — just deprioritize in retrieval

3. **Update MEMORY.md:**
   - Extract new patterns or preferences discovered this week
   - Add lessons learned from interactions

4. **Report synthesis:**
   - Briefly summarize what was updated
   - Note any entities that became stale
