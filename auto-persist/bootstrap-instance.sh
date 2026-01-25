#!/bin/bash
# Bootstrap auto-persist on a new Linux instance
# Usage: curl -sSL https://raw.githubusercontent.com/YOUR_USER/clawdbot-state/master/auto-persist/bootstrap-instance.sh | bash
#    Or: bash bootstrap-instance.sh <github-pat> <github-user> <repo-name>

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

# Get credentials from args or prompt
GITHUB_TOKEN="${1:-$GITHUB_TOKEN}"
GITHUB_USER="${2:-$GITHUB_USER}"
REPO_NAME="${3:-${GITHUB_REPO:-clawdbot-state}}"

if [ -z "$GITHUB_TOKEN" ]; then
    read -sp "GitHub Personal Access Token: " GITHUB_TOKEN
    echo ""
fi

if [ -z "$GITHUB_USER" ]; then
    read -p "GitHub Username: " GITHUB_USER
fi

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
