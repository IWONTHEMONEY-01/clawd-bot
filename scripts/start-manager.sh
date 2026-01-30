#!/bin/bash
# Start Manager Bot Session
# Run this script to start a manager session in Claude Code

echo -e "\033[36mStarting Manager Bot Session...\033[0m"
echo ""

# Navigate to clawdbot directory
cd ~/.clawdbot || cd ~/clawd || exit 1

# Pull latest changes
echo -e "\033[33mPulling latest changes...\033[0m"
git pull origin main

# Set the role
export BOT_ROLE="manager"

echo ""
echo -e "\033[32mManager Bot Ready!\033[0m"
echo ""
echo -e "\033[36mQuick Commands:\033[0m"
echo "  - Check bot status: Read all tasks/*.md files"
echo "  - Issue directive: Edit tasks/handoffs.md"
echo "  - Assign work: Edit tasks/[bot]-tasks.md"
echo ""
echo "Starting Claude Code with manager context..."
echo ""

# Start Claude Code with manager context
claude --resume "Read AGENTS-manager.md and give me a status report on all bots"
