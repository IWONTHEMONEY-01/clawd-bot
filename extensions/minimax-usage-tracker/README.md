# MiniMax Usage Tracker

Track MiniMax API usage across all your apps in PostgreSQL and monitor quota limits.

## Features

- Automatically logs every MiniMax API call to PostgreSQL
- Tracks usage by app name and model
- Warns when approaching the 100 calls/hour limit
- Provides a `minimax_usage` tool for checking remaining quota

## Database Setup

Create the usage table in your PostgreSQL database:

```sql
CREATE TABLE minimax_usage (
  id SERIAL PRIMARY KEY,
  app_name VARCHAR(100) NOT NULL,
  model VARCHAR(100) NOT NULL,
  called_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for efficient hourly queries
CREATE INDEX idx_minimax_usage_called_at ON minimax_usage(called_at);

-- Optional: Auto-cleanup old records (keeps last 30 days)
-- Run this periodically or set up a cron job
DELETE FROM minimax_usage WHERE called_at < NOW() - INTERVAL '30 days';
```

## Installation

1. Install the `pg` package:
   ```bash
   npm install pg
   ```

2. Set the database URL environment variable:
   ```bash
   export MINIMAX_USAGE_DB_URL="postgres://user:password@host:5432/database"
   ```

   Or add to your `.env` file:
   ```
   MINIMAX_USAGE_DB_URL=postgres://user:password@host:5432/database
   ```

3. Enable the plugin in your clawdbot config:
   ```json5
   {
     "plugins": {
       "minimax-usage-tracker": {
         "enabled": true,
         "config": {
           "appName": "clawdbot",
           "hourlyLimit": 100
         }
       }
     }
   }
   ```

## Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `databaseUrl` | string | `$MINIMAX_USAGE_DB_URL` | PostgreSQL connection URL |
| `appName` | string | `"clawdbot"` | App identifier in the database |
| `hourlyLimit` | number | `100` | Hourly API call limit |

## Usage

### Automatic Tracking

The plugin automatically logs every MiniMax API call after each agent turn. No action needed.

### Check Remaining Quota

Ask your clawd:
> "How many MiniMax API calls do I have left?"

Or the agent can use the `minimax_usage` tool:
```
minimax_usage({ showDetails: true })
```

### Query the Database Directly

```sql
-- Check remaining calls this hour
SELECT 100 - COUNT(*) as remaining
FROM minimax_usage
WHERE called_at > NOW() - INTERVAL '1 hour';

-- Usage by app in the last hour
SELECT app_name, model, COUNT(*) as calls
FROM minimax_usage
WHERE called_at > NOW() - INTERVAL '1 hour'
GROUP BY app_name, model
ORDER BY calls DESC;

-- Daily usage summary
SELECT
  DATE(called_at) as day,
  app_name,
  COUNT(*) as total_calls
FROM minimax_usage
WHERE called_at > NOW() - INTERVAL '7 days'
GROUP BY DATE(called_at), app_name
ORDER BY day DESC, total_calls DESC;
```

## How It Works

1. The plugin registers an `agent_end` hook
2. After each agent turn, it checks if MiniMax was the provider
3. If yes, it logs the call to PostgreSQL with app name, model, and timestamp
4. If remaining quota is <= 10 calls, it logs a warning
5. The `minimax_usage` tool queries the database to show current usage
