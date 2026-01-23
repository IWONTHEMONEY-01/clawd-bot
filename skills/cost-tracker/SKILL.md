---
name: cost-tracker
description: Track ClawdBot API costs and alert when spending threshold is reached. Use when asked about usage, costs, spending, or to check/set spending alerts.
metadata: {"clawdbot":{"emoji":"💰","invocable":true,"triggers":["cost","spending","usage","budget"]}}
---

# Cost Tracker

Track ClawdBot API spending and get alerts when thresholds are reached.

## Quick Commands

```bash
# Check current cost and threshold status
python "{baseDir}/scripts/track_cost.py" check

# Get full report
python "{baseDir}/scripts/track_cost.py" report

# Set threshold (default: $10)
python "{baseDir}/scripts/track_cost.py" set-threshold --threshold 10

# Reset tracker (recalculate from scratch)
python "{baseDir}/scripts/track_cost.py" reset

# Reset alert flag (after acknowledging)
python "{baseDir}/scripts/track_cost.py" reset-alert

# JSON output
python "{baseDir}/scripts/track_cost.py" report --json
```

## How It Works

1. Parses all session JSONL files in `~/.clawdbot/agents/main/sessions/`
2. Extracts cost data from assistant messages (already tracked by ClawdBot)
3. Sums total cost and compares to threshold
4. Stores state in `~/.clawdbot/cost-tracker.json`

## Cron Integration

To get automatic alerts, set up a cron job:

```bash
# Check every hour and alert via Telegram if threshold exceeded
clawdbot cron add --name cost-alert --schedule "0 * * * *" --prompt "Check API costs using the cost-tracker skill. If threshold is exceeded, alert me."
```

## Cost Data Source

ClawdBot automatically tracks cost per API call in session files:
```json
{
  "usage": {
    "input": 14,
    "output": 666,
    "cost": {
      "input": 0.00004,
      "output": 0.01,
      "total": 0.48
    }
  }
}
```

## Files

- `~/.clawdbot/cost-tracker.json` - Tracker state (total, threshold, alert status)
- `~/.clawdbot/agents/main/sessions/*.jsonl` - Source session files
