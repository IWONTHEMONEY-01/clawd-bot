#!/bin/bash
# Bootstrap auto-persist on a new Linux instance (Railway-compatible)
#
# Automatically uses GITHUB_TOKEN env var if available (Railway sets this)
#
# Usage on Railway: Just run this script - it uses existing env vars
# Usage elsewhere:  bash bootstrap-instance.sh <github-user> <repo-name>
#                   Or set GITHUB_TOKEN, GITHUB_USER, GITHUB_REPO env vars

set -e

CLAWDBOT_DIR="${CLAWDBOT_STATE_DIR:-$HOME/.clawdbot}"

echo "=== Clawdbot Auto-Persist Bootstrap ==="

# Check for required tools
for cmd in git node; do
    if ! command -v $cmd &>/dev/null; then
        echo "Error: $cmd is required but not installed."
        exit 1
    fi
done

# GITHUB_TOKEN should already be set on Railway instances
if [ -z "$GITHUB_TOKEN" ]; then
    echo "Warning: GITHUB_TOKEN not found in environment"
    read -sp "GitHub Personal Access Token: " GITHUB_TOKEN
    echo ""
else
    echo "Using GITHUB_TOKEN from environment"
fi

# Get user/repo from args, env, or prompt
GITHUB_USER="${1:-${GITHUB_USER:-afrad}}"
REPO_NAME="${2:-${GITHUB_REPO:-clawdbot-state}}"

echo "GitHub User: $GITHUB_USER"
echo "Repository: $REPO_NAME"

# Setup git credentials
git config --global credential.helper store
echo "https://${GITHUB_USER}:${GITHUB_TOKEN}@github.com" >> ~/.git-credentials
chmod 600 ~/.git-credentials

# Clone or pull the state repo
if [ -d "$CLAWDBOT_DIR/.git" ]; then
    echo "Updating existing clawdbot state..."
    cd "$CLAWDBOT_DIR"
    git pull origin master || git pull origin main
else
    echo "Cloning clawdbot state..."
    mkdir -p "$(dirname "$CLAWDBOT_DIR")"
    git clone "https://${GITHUB_USER}:${GITHUB_TOKEN}@github.com/${GITHUB_USER}/${REPO_NAME}.git" "$CLAWDBOT_DIR"
fi

cd "$CLAWDBOT_DIR"

# Setup cron job
echo "Setting up cron job..."
chmod +x auto-persist/setup-cron.sh auto-persist/run-persist.sh
bash auto-persist/setup-cron.sh

# Verify
echo ""
echo "=== Bootstrap Complete ==="
echo "Clawdbot state: $CLAWDBOT_DIR"
echo "Cron job installed (every 5 minutes)"
echo ""
echo "Verify with: crontab -l | grep persist"
