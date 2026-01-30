# Fix Clawdbot OAuth on Railway

When Clawdbot on Railway shows "The AI service returned an error", the OAuth token has likely expired.

## Quick Fix Steps

1. **Get fresh OAuth credentials from Claude Code:**
   ```bash
   cat "C:/Users/afrad/.claude/.credentials.json"
   ```
   This shows: `accessToken`, `refreshToken`, and `expiresAt`

2. **Update the Dockerfile.railway** at `C:\Users\afrad\.clawdbot\clawd\clawdbot-telegram\Dockerfile.railway`:

   Find the line with `auth-profiles.json` and update it with fresh credentials:
   ```dockerfile
   RUN echo '{"version":1,"profiles":{"anthropic:default":{"type":"oauth","provider":"anthropic","access":"ACCESS_TOKEN_HERE","refresh":"REFRESH_TOKEN_HERE","expires":EXPIRES_TIMESTAMP_HERE}}}' > /root/.clawdbot/agents/main/agent/auth-profiles.json
   ```

3. **Commit and push:**
   ```bash
   cd "C:\Users\afrad\.clawdbot\clawd\clawdbot-telegram"
   git add Dockerfile.railway
   git commit -m "Update OAuth credentials for Railway"
   git push origin HEAD
   ```

4. **Redeploy on Railway:**
   ```bash
   cd "C:\Users\afrad\.clawdbot\clawd\clawdbot-telegram"
   railway redeploy --yes
   ```

5. **Verify it's working:**
   ```bash
   railway logs --tail 20
   ```
   Look for `[telegram] [default] starting provider (@iwtm_clawd_bot)` without errors.

## Key Files

- **Claude Code credentials:** `C:/Users/afrad/.claude/.credentials.json`
- **Clawdbot Dockerfile:** `C:\Users\afrad\.clawdbot\clawd\clawdbot-telegram\Dockerfile.railway`
- **Local auth profiles:** `C:\Users\afrad\.clawdbot\agents\main\agent\auth-profiles.json`

## Token Format

OAuth credentials have three parts:
- `access` (sk-ant-oat01-...): Short-lived access token
- `refresh` (sk-ant-ort01-...): Long-lived refresh token
- `expires`: Unix timestamp in milliseconds

The refresh token allows automatic renewal. If both expire, re-authenticate in Claude Code.

## Railway Config

- **Project:** clawdbot
- **Service:** gateway
- **URL:** https://gateway-production-c9e7.up.railway.app
- **Bot:** @iwtm_clawd_bot

## Environment Variables on Railway

- `TELEGRAM_BOT_TOKEN`: 8376642115:AAFdVZ7l8qPqx71VFpeoSGzlI_574tOcb3o
- `CLAWDBOT_GATEWAY_TOKEN`: d60ff600754da51af6eb87deb0fbcc56e99f4e26d78c1ec6
- `CLAWDBOT_DISABLE_BONJOUR`: 1
