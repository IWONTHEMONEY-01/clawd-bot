Set-Location "C:\Users\afrad\.clawdbot\clawd\clawdbot-telegram"
$env:CLAWDBOT_NO_RESPAWN = "1"
node dist/entry.js gateway
