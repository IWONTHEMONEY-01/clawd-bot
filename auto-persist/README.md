# Auto-Persist System for Clawdbot

Automatically saves state to git every 5 minutes to protect against crashes and redeployments.

## Quick Start

### Option 1: Run as background daemon
```bash
# Start the daemon (runs continuously)
auto-persist\start-daemon.cmd
```

### Option 2: Setup Windows Scheduled Task (recommended)
```powershell
# Run as Administrator
powershell -ExecutionPolicy Bypass -File auto-persist\setup-scheduled-task.ps1
```

### Option 3: Manual run
```bash
node auto-persist\persist-service.js --once
```

## What Gets Saved

Every 5 minutes, the service:
1. Creates a JSON snapshot of critical state files
2. Commits all changes to local git
3. Pushes to GitHub (if remote is configured)

## Adding GitHub Remote (for cloud backup)

```bash
cd C:\Users\afrad\.clawdbot
git remote add origin https://github.com/YOUR_USERNAME/clawdbot-state.git
git push -u origin master
```

## Files Tracked

- Session state (`sessions.json`, `agents/`)
- Configuration (`clawdbot.json`)
- Cron jobs (`cron/`)
- Memory files (`memory/`)
- Device pairings (`devices/`, `identity/`)

## Files Excluded (see .gitignore)

- Credentials and secrets
- Embedded git repos (clawd-bot, clawdbot-telegram)
- Lock files and temp files
- SQLite WAL/SHM files

## Snapshots

State snapshots are saved to `auto-persist/snapshots/` with 1-hour retention (12 snapshots at 5-min intervals).

## Logs

View persist logs at `auto-persist/persist.log`
