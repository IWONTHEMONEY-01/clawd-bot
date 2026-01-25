@echo off
set CLAWDBOT_NO_RESPAWN=1
cd /d C:\Users\afrad\.clawdbot\clawd\clawdbot-telegram
node dist/entry.js gateway
