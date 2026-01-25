# Auto-Persist System for Clawdbot

Automatically saves state to git every 5 minutes to protect against crashes and redeployments.

## Quick Start

### Linux (cron) - Recommended
```bash
# Make script executable and run setup
chmod +x ~/.clawdbot/auto-persist/setup-cron.sh
bash ~/.clawdbot/auto-persist/setup-cron.sh
```

### Windows (Scheduled Task)
```powershell
# Run PowerShell as Administrator
powershell -ExecutionPolicy Bypass -File "C:\Users\afrad\.clawdbot\auto-persist\setup-scheduled-task.ps1"
```

### Manual run (any platform)
```bash
node ~/.clawdbot/auto-persist/persist-service.js --once
```

### Daemon mode (foreground, any platform)
```bash
node ~/.clawdbot/auto-persist/persist-service.js --daemon
```

## What Gets Saved

Every 5 minutes, the service:
1. Creates a JSON snapshot of critical state files
2. Commits all changes to local git
3. Pushes to GitHub (if remote is configured)

## Connecting to GitHub

### Railway Instances (automatic)

Railway instances already have `GITHUB_TOKEN` set. Just run:

```bash
bash ~/.clawdbot/auto-persist/setup-github.sh
# Or for a fresh instance:
bash ~/.clawdbot/auto-persist/bootstrap-instance.sh
```

The scripts auto-detect `GITHUB_TOKEN` from the environment - no prompts needed.

**Defaults:** User=`afrad`, Repo=`clawdbot-state`
Override with: `bash setup-github.sh <username> <repo-name>`

### Local/Other Machines

**Linux:**
```bash
bash ~/.clawdbot/auto-persist/setup-github.sh
```

**Windows:**
```powershell
powershell -ExecutionPolicy Bypass -File "C:\Users\afrad\.clawdbot\auto-persist\setup-github.ps1"
```

### Bootstrap Fresh Instance

```bash
# On Railway (uses existing GITHUB_TOKEN):
bash <(curl -sSL https://raw.githubusercontent.com/afrad/clawdbot-state/master/auto-persist/bootstrap-instance.sh)

# Elsewhere (provide token):
GITHUB_TOKEN="ghp_xxx" bash <(curl -sSL https://raw.githubusercontent.com/afrad/clawdbot-state/master/auto-persist/bootstrap-instance.sh)
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

## Removing the scheduled job

### Linux
```bash
crontab -l | grep -v persist-service.js | crontab -
```

### Windows
```powershell
Unregister-ScheduledTask -TaskName "ClawdbotAutoPersist" -Confirm:$false
```
