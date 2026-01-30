# Composio Integration

Secure integration with Composio for 800+ SaaS app connections.

## When to Use

Use when you need to interact with external services:
- Gmail: Send/read emails
- Slack: Post messages, manage channels
- GitHub: Create issues, PRs, manage repos
- Notion: Create/update pages
- Google Calendar: Manage events
- Trello, Jira, Linear: Task management
- And 800+ more apps

## Setup Requirements

### Environment Variables (Required)

```bash
COMPOSIO_API_KEY=your_composio_api_key
```

Get your API key from: https://app.composio.dev/settings

### Security Rules

1. **NEVER hardcode API keys** - Always use environment variables
2. **Use specific tools** - Request only the tools you need, not all
3. **Validate user intent** - Confirm destructive actions before executing
4. **Log tool usage** - Track what actions are taken

## Usage Patterns

### Pattern 1: Direct API Call (Recommended for Clawdbot)

Use bash + curl for simple integrations:

```bash
# List available tools
curl -s -H "x-api-key: $COMPOSIO_API_KEY" \
  "https://backend.composio.dev/api/v1/apps" | jq '.items[:10]'

# Get tools for a specific app
curl -s -H "x-api-key: $COMPOSIO_API_KEY" \
  "https://backend.composio.dev/api/v1/apps/github/actions"
```

### Pattern 2: Python SDK

```python
from composio import ComposioToolSet, Action

# Initialize with API key from environment
toolset = ComposioToolSet()

# Get specific tools (not all - security best practice)
tools = toolset.get_tools(actions=[
    Action.GITHUB_CREATE_ISSUE,
    Action.GMAIL_SEND_EMAIL
])

# Execute an action
result = toolset.execute_action(
    action=Action.GITHUB_CREATE_ISSUE,
    params={
        "owner": "myorg",
        "repo": "myrepo",
        "title": "Bug report",
        "body": "Description here"
    }
)
```

### Pattern 3: MCP Server (Advanced)

Composio can run as an MCP server for Claude Code:

```bash
# Install Composio MCP
npx composio-mcp setup

# This adds to ~/.claude/mcp_servers.json
```

## Available App Categories

| Category | Apps |
|----------|------|
| **Email** | Gmail, Outlook, SendGrid |
| **Calendar** | Google Calendar, Outlook Calendar |
| **Project Management** | Jira, Linear, Trello, Asana, Notion |
| **Dev Tools** | GitHub, GitLab, Bitbucket |
| **Communication** | Slack, Discord, Teams |
| **CRM** | Salesforce, HubSpot, Pipedrive |
| **Storage** | Google Drive, Dropbox, OneDrive |
| **Analytics** | Google Analytics, Mixpanel |
| **Payments** | Stripe, PayPal |

## Security Checklist

Before using Composio actions:

- [ ] Confirm COMPOSIO_API_KEY is set (not hardcoded)
- [ ] Request only specific tools needed (not all)
- [ ] Confirm destructive actions with user
- [ ] Don't expose API responses containing secrets
- [ ] Use connected accounts properly (OAuth flows)

## Connecting Apps (OAuth)

Most apps require OAuth connection:

1. User visits Composio dashboard
2. Connects their account (Gmail, GitHub, etc.)
3. Composio stores tokens securely
4. Your agent uses the connection

```python
# Check if user has connected GitHub
from composio import ComposioToolSet

toolset = ComposioToolSet()
connections = toolset.get_connected_accounts()

if not any(c.app == "github" for c in connections):
    # Generate OAuth link for user
    url = toolset.initiate_connection(app="github")
    print(f"Please connect GitHub: {url}")
```

## Error Handling

```python
from composio import ComposioToolSet
from composio.exceptions import ComposioError

try:
    result = toolset.execute_action(action, params)
except ComposioError as e:
    if "authentication" in str(e).lower():
        # User needs to reconnect their account
        print("BLOCKED: Please reconnect your account at composio.dev")
    else:
        raise
```

## Rate Limits

Composio has rate limits per plan:
- Free: 1000 actions/month
- Pro: 10,000 actions/month
- Enterprise: Unlimited

Track usage to avoid hitting limits.
