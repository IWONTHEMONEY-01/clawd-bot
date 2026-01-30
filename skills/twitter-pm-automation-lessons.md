---
name: Twitter PM Automation Lessons
description: Technical lessons learned building the Twitter PM Automation v2 system
version: 1.0
created: 2026-01-20
---

# Twitter PM Automation - Lessons Learned

## RapidAPI Twitter APIs

### Two Different APIs for Different Purposes
- **Twitter AIO** (`twitter-aio.p.rapidapi.com`): Use for profile data
  - Endpoint: `/user/by/username/{username}`
  - Returns: user_id, name, bio, followers, following, verified status

- **Twitter135** (`twitter135.p.rapidapi.com`): Use for tweets and search
  - Tweets endpoint: `/v2/UserTweets/` (requires numeric user_id, NOT username)
  - Search endpoint: `/Search/` (NOT `/v2/Search/` - that returns 404)

### Twitter135 User ID Requirement
- Twitter135 `/v2/UserTweets/` requires numeric `user_id`, not username
- If you only have username, fetch profile from Twitter AIO first to get the user_id
- Search results include user_id, so accounts discovered via search don't need extra profile fetch

### Response Parsing Structure
Twitter135 responses have deeply nested structure:
```
data → user → result → timeline_v2 → timeline → instructions → [find type="TimelineAddEntries"] → entries
```

For search results:
```
data → search_by_raw_query → search_timeline → timeline → instructions → [TimelineAddEntries] → entries
```

### Tweet Parsing Best Practices
- Separate original tweets from retweets: `tweet.startswith('RT @')`
- Prioritize original tweets - they show actual trading activity
- Fetch 40+ tweets to get past retweets and find original content
- Retweets still useful - show what they're interested in

## Rate Limiting & API Tiers

### 10K Tier Budget Math
- 10K calls/month = ~333 calls/day
- 288 crons/day (every 5 minutes)
- Budget: ~1.15 calls per cron average

### Optimal Configuration for 10K Tier
- Analyze: 1 account per cron = ~288 calls/day for tweets
- Search: Only when queue < 10 pending = ~30 calls/day
- Total: ~318 calls/day = 9,540/month (under 10K)

### Search Efficiency
- 1 search API call returns ~15-20 accounts
- Search results include profile data (no extra API call needed)
- Only need tweets fetch for analysis = 1 call per account

## Cron Job Design

### Don't Gate Actions on Empty Queue
BAD: `if has_qualified and not has_pending:` (Monday push waits for empty queue)
- Queue will never empty if search refills at < 10 pending
- Monday push will never happen

GOOD: `if has_qualified:` (Monday push runs alongside analysis)
- Both actions happen in parallel
- Continuous flow through pipeline

### Vercel Timeout Considerations
- Claude analysis takes ~20-30 seconds per account
- Vercel serverless timeout limits concurrent analyses
- Safe limit: 1-2 accounts per cron run

### Cron Schedule
- Vercel free tier: minimum 5 minute intervals
- 288 crons per day
- Use this constraint when calculating API budgets

## Search Keywords Strategy

### Focus on Competitors
Good keywords for PM trader discovery:
- Kalshi: `kalshi bet`, `kalshi trader`, `kalshi profit`, `kalshi position`, `kalshi payout`
- Polymarket: `polymarket whale`, `polymarket position`, `polymarket profit`, `polymarket payout`
- NoVig: `novig bet`, `novig sports`, `novig picks`
- Sports: `sports prediction market`, `NFL prediction market`, `NBA prediction market`

### Don't Search Your Own Brand
- Remove your own platform from search keywords
- Goal is finding competitor users to convert

## Debugging Tips

### Local Testing Without Claude
Create standalone test scripts that only use `requests` library:
- Avoids Python version compatibility issues with anthropic library
- Faster iteration for API debugging
- Example: `test_tweets_only.py`

### Vercel Logs
- `vercel logs <deployment-url> --since 2m` can be slow/timeout
- Better to add print statements and check via test endpoint calls
- Include key data in cron response JSON for easy debugging

### Profile Data Caching
- Search results include profile data - save it immediately
- Check `account.get('followers', 0) == 0` before fetching profile again
- Saves API calls for accounts discovered via search
