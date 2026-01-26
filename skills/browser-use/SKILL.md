---
name: browser-use
description: Cloud browsers and autonomous browser automation via API. Spin up cloud browsers for direct control, persist logins with profiles, or run autonomous browser tasks as a subagent.
---

# Browser Use

Browser Use provides cloud browsers and autonomous browser automation via API.

**Docs:**
- Open source library: https://docs.browser-use.com
- Cloud API: https://docs.cloud.browser-use.com

## Setup

API Key is read from clawdbot config at `skills.entries.browser-use.apiKey`.

If not configured, tell the user:

> To use Browser Use, you need an API key. Get one at https://cloud.browser-use.com. Then configure it:
> ```
> clawdbot config set skills.entries.browser-use.apiKey "bu_your_key_here"
> ```

**Base URL:** `https://api.browser-use.com/api/v2`

**All requests need header:** `X-Browser-Use-API-Key: <apiKey>`

---

## 1. Browser Sessions (Primary)

Spin up cloud browsers for Clawdbot to control directly. Use profiles to persist logins and cookies.

### Create browser session

```bash
# With profile (recommended - keeps you logged in)
curl -X POST "https://api.browser-use.com/api/v2/browsers" \
  -H "X-Browser-Use-API-Key: $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"profileId": "<profile-uuid>", "timeout": 60}'

# Without profile (fresh browser)
curl -X POST "https://api.browser-use.com/api/v2/browsers" \
  -H "X-Browser-Use-API-Key: $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"timeout": 60}'
```

**Response:**
```json
{
  "id": "session-uuid",
  "cdpUrl": "https://<id>.cdp2.browser-use.com",
  "liveUrl": "https://...",
  "status": "active"
}
```

### Connect Clawdbot to the browser

```bash
gateway config.patch '{"browser":{"profiles":{"browseruse":{"cdpUrl":"<cdpUrl-from-response>"}}}}'
```

Now use the browser tool with `profile=browseruse` to control it.

### List/stop browser sessions

```bash
# List active sessions
curl "https://api.browser-use.com/api/v2/browsers" -H "X-Browser-Use-API-Key: $API_KEY"

# Get session status
curl "https://api.browser-use.com/api/v2/browsers/<session-id>" -H "X-Browser-Use-API-Key: $API_KEY"

# Stop session (unused time is refunded)
curl -X PATCH "https://api.browser-use.com/api/v2/browsers/<session-id>" \
  -H "X-Browser-Use-API-Key: $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"status": "stopped"}'
```

---

## 2. Profiles

Profiles persist cookies and login state across browser sessions. Create one, log into your accounts in the browser, and reuse it.

```bash
# List profiles
curl "https://api.browser-use.com/api/v2/profiles" -H "X-Browser-Use-API-Key: $API_KEY"

# Create profile
curl -X POST "https://api.browser-use.com/api/v2/profiles" \
  -H "X-Browser-Use-API-Key: $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"name": "My Profile"}'

# Delete profile
curl -X DELETE "https://api.browser-use.com/api/v2/profiles/<profile-id>" \
  -H "X-Browser-Use-API-Key: $API_KEY"
```

**Tip:** You can also sync cookies from your local Chrome using the Browser Use Chrome extension.

---

## 3. Tasks (Subagent)

Run autonomous browser tasks - like a subagent that handles browser interactions for you. Give it a prompt and it completes the task.

**Always use `browser-use-llm`** - optimized for browser tasks, 3-5x faster than other models.

```bash
curl -X POST "https://api.browser-use.com/api/v2/tasks" \
  -H "X-Browser-Use-API-Key: $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "task": "Go to amazon.com and find the price of the MacBook Air M3",
    "llm": "browser-use-llm"
  }'
```

### Poll for completion

```bash
curl "https://api.browser-use.com/api/v2/tasks/<task-id>" -H "X-Browser-Use-API-Key: $API_KEY"
```

**Response:**
```json
{
  "status": "finished",
  "output": "The MacBook Air M3 is priced at $1,099",
  "isSuccess": true
}
```

**Status values:** `pending`, `running`, `finished`, `failed`, `stopped`

### Task options

| Option | Description |
|--------|-------------|
| `task` | Your prompt (required) |
| `llm` | Always use `browser-use-llm` |
| `startUrl` | Starting page |
| `maxSteps` | Max actions (default 100) |
| `sessionId` | Reuse existing session |
| `profileId` | Use a profile for auth |
| `flashMode` | Even faster execution |
| `vision` | Visual understanding |

---

## Quick Examples

### Check a price

```bash
# Create task
TASK=$(curl -s -X POST "https://api.browser-use.com/api/v2/tasks" \
  -H "X-Browser-Use-API-Key: $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"task": "Find the current Bitcoin price on coinbase.com", "llm": "browser-use-llm"}')

TASK_ID=$(echo $TASK | jq -r '.id')

# Poll until done
while true; do
  STATUS=$(curl -s "https://api.browser-use.com/api/v2/tasks/$TASK_ID" -H "X-Browser-Use-API-Key: $API_KEY")
  STATE=$(echo $STATUS | jq -r '.status')
  if [ "$STATE" = "finished" ] || [ "$STATE" = "failed" ]; then
    echo $STATUS | jq '.output'
    break
  fi
  sleep 2
done
```

### Interactive browser session

```bash
# 1. Create session with profile
SESSION=$(curl -s -X POST "https://api.browser-use.com/api/v2/browsers" \
  -H "X-Browser-Use-API-Key: $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"profileId": "your-profile-id", "timeout": 30}')

CDP_URL=$(echo $SESSION | jq -r '.cdpUrl')
SESSION_ID=$(echo $SESSION | jq -r '.id')

# 2. Connect Clawdbot
gateway config.patch "{\"browser\":{\"profiles\":{\"browseruse\":{\"cdpUrl\":\"$CDP_URL\"}}}}"

# 3. Use browser tool with profile=browseruse
# ... do your work ...

# 4. Stop session when done (get refund for unused time)
curl -X PATCH "https://api.browser-use.com/api/v2/browsers/$SESSION_ID" \
  -H "X-Browser-Use-API-Key: $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"status": "stopped"}'
```
