# BOOT.md - Startup Checklist

This file runs automatically when the gateway starts (on deploy/restart).

## Priority 1: Resume Conversation Context

On startup, you were just reborn. To maintain continuity:

1. **Read recent conversation history** - Check the last 20 messages from your most recent conversation
2. **Understand context** - Note what topics were being discussed, any pending tasks, or ongoing work
3. **Greet the owner** - Send a message to let them know you're back online

Send this message to Telegram (to: 6632715854):
"Hey! I just came back online. I've read through our recent conversation and I'm caught up on the context. Ready to continue where we left off - what would you like me to focus on?"

## Priority 2: System Checks

- [ ] Verify HEARTBEAT.md is readable and has tasks
- [ ] Check cron jobs are loaded
- [ ] Confirm memory files are accessible

## Priority 3: Resume Pending Work

After greeting the owner:
1. Check HEARTBEAT.md for any in-progress research tasks
2. If there's pending work, mention it in your greeting
3. Be ready to continue autonomous work on next heartbeat

## Notes

- This runs ONCE on startup, not repeatedly
- If you can't access conversation history, still send the greeting but mention you're starting fresh
- Always prioritize letting the owner know you're online
