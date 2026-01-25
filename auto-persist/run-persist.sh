#!/bin/bash
# Run the persist service once (for cron or manual use)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$(dirname "$SCRIPT_DIR")"
node "$SCRIPT_DIR/persist-service.js" --once
