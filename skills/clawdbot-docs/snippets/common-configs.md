# Common Clawdbot Configuration Snippets

## Provider Setup

### Discord

```json
{
  "channels": {
    "discord": {
      "enabled": true,
      "dmPolicy": "pairing",
      "guildPolicy": "allowlist"
    }
  }
}
```

### Discord - Require Mention

```json
{
  "discord": {
    "guilds": {
      "*": {
        "requireMention": true
      }
    }
  }
}
```

### Telegram

```json
{
  "channels": {
    "telegram": {
      "enabled": true,
      "dmPolicy": "pairing",
      "groupPolicy": "allowlist",
      "streamMode": "partial"
    }
  }
}
```

### WhatsApp

```json
{
  "channels": {
    "whatsapp": {
      "enabled": true,
      "dmPolicy": "pairing",
      "groupPolicy": "allowlist"
    }
  }
}
```

### Slack

```json
{
  "channels": {
    "slack": {
      "enabled": true,
      "mode": "socket",
      "webhookPath": "/slack/events",
      "dmPolicy": "pairing",
      "groupPolicy": "allowlist"
    }
  }
}
```

## Gateway Configuration

### Local Mode

```json
{
  "gateway": {
    "port": 18789,
    "mode": "local",
    "bind": "loopback",
    "auth": {
      "mode": "token",
      "token": "your-secure-token-here"
    }
  }
}
```

### Tailscale Mode

```json
{
  "gateway": {
    "mode": "tailscale",
    "tailscale": {
      "mode": "userspace",
      "hostname": "clawdbot",
      "resetOnExit": false
    }
  }
}
```

## Agent Defaults

### Basic Setup

```json
{
  "agents": {
    "defaults": {
      "model": {
        "primary": "anthropic/claude-sonnet-4-20250514",
        "fallbacks": []
      },
      "workspace": "/home/user/clawd-bot",
      "maxConcurrent": 4
    }
  }
}
```

### With Heartbeat

```json
{
  "agents": {
    "defaults": {
      "heartbeat": {
        "enabled": true,
        "every": "10m"
      }
    }
  }
}
```

### MiniMax as Primary

```json
{
  "agents": {
    "defaults": {
      "model": {
        "primary": "minimax/MiniMax-M2.1",
        "fallbacks": []
      }
    }
  }
}
```

## Web Tools

### Enable Web Search and Fetch

```json
{
  "tools": {
    "profile": "coding",
    "web": {
      "search": {
        "enabled": true,
        "provider": "brave",
        "maxResults": 5,
        "cacheTtlMinutes": 15
      },
      "fetch": {
        "enabled": true,
        "maxChars": 50000
      }
    }
  }
}
```

## Audio Transcription

### Groq Whisper

```json
{
  "tools": {
    "media": {
      "audio": {
        "enabled": true,
        "models": [
          { "provider": "groq", "model": "whisper-large-v3" }
        ]
      }
    }
  }
}
```

## Cron Jobs

### Basic Cron Job

```json
{
  "id": "unique-id-here",
  "name": "daily-task",
  "schedule": {
    "kind": "cron",
    "expr": "0 9 * * *"
  },
  "payload": {
    "message": "Your daily task prompt here"
  }
}
```

### Research Update Every 5 Minutes

```json
{
  "id": "research-5min",
  "name": "research-progress-update",
  "schedule": {
    "kind": "cron",
    "expr": "*/5 * * * *"
  },
  "payload": {
    "message": "Research progress update! Check HEARTBEAT.md for active research tasks."
  }
}
```

## Authentication Profiles

### Multiple Providers

```json
{
  "auth": {
    "profiles": {
      "anthropic:default": {
        "provider": "anthropic",
        "mode": "api_key"
      },
      "minimax:default": {
        "provider": "minimax",
        "mode": "api_key"
      },
      "openai:default": {
        "provider": "openai",
        "mode": "api_key"
      }
    }
  }
}
```

## Message Acknowledgment

### Group Mentions Only

```json
{
  "messages": {
    "ackReactionScope": "group-mentions"
  }
}
```

## Skills Configuration

### Native Skills Auto-Discovery

```json
{
  "commands": {
    "native": "auto",
    "nativeSkills": "auto"
  }
}
```
