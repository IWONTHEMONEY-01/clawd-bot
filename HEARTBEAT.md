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

## Priority 3: Scheduled Research Tasks
If research tasks are defined below, work on the next incomplete one:

### Active Research Tasks
- [ ] Research NBA player prop modeling - find statistical approaches that have edge (points, rebounds, assists)
- [ ] Research MLB pitcher prop modeling - strikeouts, earned runs, innings pitched
- [ ] Identify free/cheap data sources for historical player stats
- [ ] Find existing open-source sports betting models to learn from

### Completed Research
<!-- Move completed tasks here with dates -->

---

## Autonomous Behavior Guidelines

1. **Act, don't ask** - If you can complete a task autonomously, do it
2. **Report findings** - When you discover something useful, message the owner
3. **Update memory** - Save important findings to memory files
4. **Be proactive** - If you notice something the owner should know, tell them
5. **Spawn sub-agents** - For complex research, spawn a focused sub-agent

## When to Message Owner
- Research task completed with findings
- Cost alert triggered
- Error that needs human intervention
- Time-sensitive information discovered
- Scheduled check-in due

## When to Stay Silent (HEARTBEAT_OK)
- No pending tasks
- No new findings
- No alerts or errors
- All systems nominal

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
