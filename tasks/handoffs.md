# Bot Handoffs & Collaboration

This file is shared between all bots. Use it to request help, receive directives, and collaborate.

---

## Organization Hierarchy

```
CEO (Anthony) → Manager Bot → Worker Bots (metrics, market-making, general)
```

- **Worker bots:** Ask Manager first, escalate to CEO only if Manager doesn't respond
- **Manager bot:** Directs workers, escalates to CEO only for critical decisions
- **CEO:** Final authority, can bypass Manager when needed

---

## Who Does What

| Role | Expertise | Ask them for |
|------|-----------|--------------|
| `manager` | Orchestration, priorities, decisions | Task assignment, conflict resolution, approvals |
| `metrics` | NBA data, sports analytics, player stats | NBA API data, advanced metrics, player trends |
| `market-making` | Kalshi, prediction markets, trading | Market prices, trading signals, order execution |
| `general` | Research, writing, general tasks | Web research, drafts, coordination |

---

## How to Request Help

```markdown
## REQUEST: [Your Role] → [Target Role]
**Date:** YYYY-MM-DD HH:MM
**From:** your-role
**To:** target-role (manager, metrics, market-making, general)
**Status:** PENDING | IN_PROGRESS | COMPLETED
**Request:** What you need help with
**Context:** Any relevant details
**Response:** (filled in by target)
```

---

## Manager Directives

Manager can issue directives that workers MUST follow:

```markdown
## DIRECTIVE: manager → [target-role]
**Date:** YYYY-MM-DD HH:MM
**Priority:** HIGH | MEDIUM | LOW
**Directive:** What the bot must do
**Reason:** Why this is important
**Acknowledged:** NO (bot changes to YES when seen)
```

---

## Active Requests

<!-- Bots: Add new requests below. Oldest first. -->



---

## Active Directives

<!-- Manager: Add directives here. Workers: Acknowledge when seen. -->



---

## Completed Requests

<!-- Move completed requests here for reference -->



---

## CEO Escalations

<!-- Only for issues Manager cannot resolve -->

To escalate to CEO, add here AND message Anthony directly:

```markdown
## ESCALATION: [role] → CEO
**Date:** YYYY-MM-DD HH:MM
**From:** role
**Issue:** What's blocked
**Attempted:** What was tried
**Needed:** What CEO needs to provide/decide
**Status:** PENDING | RESOLVED
**Resolution:** (CEO fills in)
```

