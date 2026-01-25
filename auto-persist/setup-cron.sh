#!/bin/bash
# Setup Linux cron job for Auto-Persist
# Run with: bash setup-cron.sh

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CLAWDBOT_DIR="$(dirname "$SCRIPT_DIR")"
PERSIST_SCRIPT="$SCRIPT_DIR/persist-service.js"

# Check if node is available
if ! command -v node &> /dev/null; then
    echo "Error: node is not installed or not in PATH"
    exit 1
fi

# Get absolute path to node
NODE_PATH=$(which node)

# Create the cron entry (every 5 minutes)
CRON_CMD="*/5 * * * * cd \"$CLAWDBOT_DIR\" && \"$NODE_PATH\" \"$PERSIST_SCRIPT\" --once >> \"$SCRIPT_DIR/persist.log\" 2>&1"

# Check if cron job already exists
if crontab -l 2>/dev/null | grep -q "persist-service.js"; then
    echo "Cron job already exists. Removing old entry..."
    crontab -l 2>/dev/null | grep -v "persist-service.js" | crontab -
fi

# Add the new cron job
(crontab -l 2>/dev/null; echo "$CRON_CMD") | crontab -

echo "Cron job installed successfully!"
echo ""
echo "The persist service will run every 5 minutes."
echo "Logs: $SCRIPT_DIR/persist.log"
echo ""
echo "To verify: crontab -l"
echo "To remove: crontab -l | grep -v persist-service.js | crontab -"
