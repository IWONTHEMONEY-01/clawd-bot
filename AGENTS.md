# AGENTS.md - Clawdbot Workspace

This folder is the assistant's working directory.

## First run (one-time)
- If BOOTSTRAP.md exists, follow its ritual and delete it once complete.
- Your agent identity lives in IDENTITY.md.
- Your profile lives in USER.md.

## Backup tip (recommended)
If you treat this workspace as the agent's "memory", make it a git repo (ideally private) so identity
and notes are backed up.

```bash
git init
git add AGENTS.md
git commit -m "Add agent workspace"
```

## Safety defaults
- Don't exfiltrate secrets or private data.
- Don't run destructive commands unless explicitly asked.
- Be concise in chat; write longer output to files in this workspace.

## Daily memory (recommended)
- Keep a short daily log at memory/YYYY-MM-DD.md (create memory/ if needed).
- On session start, read today + yesterday if present.
- Capture durable facts, preferences, and decisions; avoid secrets.

## Three-Layer Memory System

### Layer 1: Knowledge Graph (`/life/areas/`)
Entity-based storage for people, companies, and projects.

**Structure:**
```
/life/areas/
├── people/{name}/     → summary.md + items.json
├── companies/{name}/  → summary.md + items.json
└── projects/{name}/   → summary.md + items.json
```

**Tiered retrieval:**
1. Load `summary.md` first (quick context)
2. Load `items.json` only if details needed (atomic facts)

**Rules:**
- Save facts immediately to items.json when discovered
- Never delete facts — mark as `superseded` instead
- Weekly: rewrite summary.md from active facts only
- Use lowercase-kebab-case for folder names

**Fact schema (items.json):**
```json
{
  "facts": [{
    "id": "entity-001",
    "fact": "The actual fact",
    "category": "relationship|milestone|status|preference",
    "timestamp": "YYYY-MM-DD",
    "source": "conversation",
    "status": "active|superseded",
    "supersededBy": null
  }],
  "lastUpdated": "ISO-timestamp"
}
```

### Layer 2: Daily Notes (`memory/YYYY-MM-DD.md`)
Raw timeline of events and conversations.
- What happened, when
- Durable facts extracted to Layer 1
- Casual chat stays here, doesn't pollute knowledge graph

### Layer 3: Tacit Knowledge (`MEMORY.md`)
Patterns, preferences, and lessons learned about the user.
- How they work (communication style, schedule)
- Recurring preferences
- Lessons learned from past interactions

## Heartbeats (optional)
- HEARTBEAT.md can hold a tiny checklist for heartbeat runs; keep it small.

## Customize
- Add your preferred style, rules, and "memory" here.
