---
name: auto-memory-save
description: "Automatically save session context to memory without requiring /new command"
homepage: https://docs.clawd.bot/hooks#auto-memory-save
metadata:
  {
    "clawdbot":
      {
        "emoji": "🔄",
        "events": ["gateway:startup"],
        "requires": { "config": ["workspace.dir"] },
        "install": [{ "id": "bundled", "kind": "bundled", "label": "Bundled with Clawdbot" }],
      },
  }
---

# Auto Memory Save Hook

Automatically saves session context to memory files without requiring the `/new` command.

## What It Does

Unlike `session-memory` which only saves on `/new`, this hook:

1. **Runs on gateway startup** - Initializes a background timer
2. **Scans every 15 minutes** - Checks all active sessions for recent activity
3. **Auto-saves snapshots** - Creates memory files for sessions modified in the last hour
4. **Deduplicates** - Won't save the same session more than once per 10 minutes

## How It Works

```
Gateway Startup
    ↓
Initialize 15-minute timer
    ↓
Every 15 minutes:
├─ Scan all session transcripts
├─ Filter to recently-active sessions
├─ Extract last 30 messages from each
└─ Save to memory/YYYY-MM-DD-HHMMSS-session.md
```

## Output Format

Memory snapshots are created with this format:

```markdown
# Session Snapshot: 2026-01-27

- **Session**: agent:main:telegram-dm-123456
- **Time**: 2026-01-27T14:30:00.000Z
- **Reason**: auto-save (periodic)
- **Messages**: 12

## Recent Conversation

**User**: What's the status of the project?

**Assistant**: The project is progressing well...
```

## Syncing to Git

When `GITHUB_TOKEN` is configured, the generated memory files are automatically:

1. Committed to the `memory-sync` branch
2. Pushed every 10 minutes
3. Restored on the next deployment

This means your bot remembers conversations across deployments.

## Configuration

Enable in `clawdbot.json`:

```json
{
  "hooks": {
    "internal": {
      "enabled": true,
      "entries": {
        "auto-memory-save": { "enabled": true }
      }
    }
  }
}
```

## Requirements

- **Config**: `workspace.dir` must be set
- **Optional**: `GITHUB_TOKEN` for cross-deployment persistence

## Disabling

```bash
clawdbot hooks disable auto-memory-save
```

Or in config:

```json
{
  "hooks": {
    "internal": {
      "entries": {
        "auto-memory-save": { "enabled": false }
      }
    }
  }
}
```

## Related Hooks

- `session-memory` - Manual save on `/new` command (with LLM-generated slugs)
- Memory flush system - Saves before context window compaction
