# HEARTBEAT.md - Autonomous Task Checklist

When heartbeat fires, check these items and act on any that need attention.
If nothing needs attention, reply HEARTBEAT_OK.

---

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
