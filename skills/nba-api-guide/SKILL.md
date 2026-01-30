# NBA API Guide

## CRITICAL: Correct Endpoint

**WRONG:** `api.nba.com` - This is a developer portal, requires auth, will return 401

**RIGHT:** `stats.nba.com/stats/` - This is the public stats API, no auth needed

## Required Headers (MANDATORY)

Without these headers, you will be blocked:

```python
headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    'Referer': 'https://www.nba.com/',
    'Accept': 'application/json',
    'Accept-Language': 'en-US,en;q=0.9',
    'Origin': 'https://www.nba.com'
}
```

## Working Python Example

```python
import urllib.request
import json

def get_nba_stats(endpoint, params):
    """Fetch data from NBA stats API"""
    base_url = "https://stats.nba.com/stats/"

    # Build URL with params
    param_str = "&".join(f"{k}={v}" for k, v in params.items())
    url = f"{base_url}{endpoint}?{param_str}"

    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Referer': 'https://www.nba.com/',
        'Accept': 'application/json',
        'Accept-Language': 'en-US,en;q=0.9',
        'Origin': 'https://www.nba.com'
    }

    req = urllib.request.Request(url, headers=headers)

    with urllib.request.urlopen(req, timeout=30) as resp:
        return json.loads(resp.read().decode())

# Example: Get player stats
data = get_nba_stats('leaguedashplayerstats', {
    'Season': '2024-25',
    'SeasonType': 'Regular Season',
    'PerMode': 'PerGame',
    'LastNGames': '0'
})

headers = data['resultSets'][0]['headers']
rows = data['resultSets'][0]['rowSet']
print(f"Got {len(rows)} players")
```

## Working curl Example

```bash
curl -s "https://stats.nba.com/stats/leaguedashplayerstats?Season=2024-25&SeasonType=Regular%20Season&PerMode=PerGame" \
  -H "User-Agent: Mozilla/5.0" \
  -H "Referer: https://www.nba.com/" \
  -H "Accept: application/json"
```

## Common Endpoints

| Endpoint | Description | Key Params |
|----------|-------------|------------|
| `leaguedashplayerstats` | All player stats | Season, PerMode |
| `leaguedashteamstats` | All team stats | Season, PerMode |
| `playergamelog` | Player game log | PlayerID, Season |
| `boxscoretraditionalv2` | Box score | GameID |
| `shotchartdetail` | Shot chart | PlayerID, Season |
| `playbyplayv2` | Play by play | GameID |
| `leaguestandingsv3` | Standings | Season |
| `commonplayerinfo` | Player info | PlayerID |

## Common Parameters

```
Season=2024-25
SeasonType=Regular Season  (or Playoffs, Pre Season)
PerMode=PerGame  (or Totals, Per36, Per100Possessions)
LastNGames=0  (0 = all games, or N for last N games)
PlayerID=201939  (example: Stephen Curry)
TeamID=1610612744  (example: Golden State Warriors)
```

## Rate Limiting

- Max 1 request per second
- Cache responses to avoid re-fetching
- Use `time.sleep(1)` between requests

## If Still Getting Errors

1. Check you're using `stats.nba.com` NOT `api.nba.com`
2. Verify all headers are included
3. URL-encode spaces as `%20` in parameters
4. Check timeout (use 30+ seconds)
5. Try different User-Agent strings

## Alternative: nba_api Package

```python
# Install: pip install nba_api
from nba_api.stats.endpoints import leaguedashplayerstats

# This handles headers automatically
stats = leaguedashplayerstats.LeagueDashPlayerStats(
    season='2024-25',
    per_mode_detailed='PerGame'
)
df = stats.get_data_frames()[0]
```

Note: nba_api still uses stats.nba.com under the hood.
