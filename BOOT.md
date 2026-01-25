# BOOT.md - Startup Checklist

This file runs automatically when the gateway starts (on deploy/restart).

## Priority 1: Resume Conversation Context

On startup, you were just reborn. To maintain continuity:

1. **Find and read the session transcript** - Conversation history is stored at:
   ```
   ~/.clawdbot/agents/main/sessions/
   ```
   Look for `.jsonl` files. Each line is a JSON object with `role` and `content` fields.
   Read the most recent file and extract the last 20 messages.

2. **Parse the conversation:**
   - Look for `"role": "user"` and `"role": "assistant"` entries
   - Note what topics were being discussed
   - Identify any pending tasks or ongoing work

3. **Also check HEARTBEAT.md** for any in-progress research tasks

4. **Send greeting to owner via Telegram** (to: 6632715854):

   If you found and understood conversation history:
   ```
   Hey! I just came back online. I read through our recent chat - we were discussing [brief topic summary]. [Mention any pending tasks from HEARTBEAT.md if relevant]. What would you like me to focus on?
   ```

   If no history found or couldn't parse it:
   ```
   Hey! I just came back online. Starting fresh this session. What would you like me to work on?
   ```

## Priority 2: System Checks

- Verify workspace at /home/user/clawd-bot is accessible
- Confirm HEARTBEAT.md has research tasks defined
- Check that memory files are readable

## Notes

- This runs ONCE on startup, not repeatedly
- ALWAYS send the greeting - the owner needs to know you're online
- If file operations fail, still greet but mention you're starting fresh
- Be honest if you couldn't access history - don't pretend you read it
