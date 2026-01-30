# Start Manager Bot Session
# Run this script to start a manager session in Claude Code

Write-Host "Starting Manager Bot Session..." -ForegroundColor Cyan
Write-Host ""

# Navigate to clawdbot directory
Set-Location $env:USERPROFILE\.clawdbot

# Pull latest changes from all bots
Write-Host "Pulling latest changes..." -ForegroundColor Yellow
git pull origin main

# Set the role
$env:BOT_ROLE = "manager"

Write-Host ""
Write-Host "Manager Bot Ready!" -ForegroundColor Green
Write-Host ""
Write-Host "Quick Commands:" -ForegroundColor Cyan
Write-Host "  - Check bot status: Read all tasks/*.md files"
Write-Host "  - Issue directive: Edit tasks/handoffs.md"
Write-Host "  - Assign work: Edit tasks/[bot]-tasks.md"
Write-Host ""
Write-Host "Starting Claude Code with manager context..."
Write-Host ""

# Start Claude Code with manager context
claude --resume "Read AGENTS-manager.md and give me a status report on all bots"
