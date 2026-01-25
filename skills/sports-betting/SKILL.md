---
name: sports-betting
description: Sports betting strategy, odds analysis, value identification, bankroll management, and market dynamics. Finding edges and managing risk.
homepage: https://www.the-odds-api.com
metadata: {"clawdbot":{"emoji":"🎰","requires":{"tools":["web_search","web_fetch"]}}}
---

# Sports Betting

Finding edges, managing risk, and building sustainable betting strategies.

## Odds Fundamentals

### Odds Formats
```
American: +150 (underdog), -150 (favorite)
Decimal: 2.50 (total return per $1)
Fractional: 3/2 (profit per stake)

Conversions:
+American to Decimal: (American/100) + 1
-American to Decimal: (100/|American|) + 1
Decimal to Implied %: 1/Decimal × 100
```

### Implied Probability
```
From American odds:
+odds: 100 / (odds + 100)
-odds: |odds| / (|odds| + 100)

Example: -150 → 150/250 = 60%
Example: +200 → 100/300 = 33.3%
```

### The Vig (Juice)
```
Book offers: Team A -110, Team B -110
Implied: 52.4% + 52.4% = 104.8%
Vig = 4.8% (book's edge)

No-vig fair odds:
Fair % = Implied % / Total Implied %
```

---

## Value Betting

### Expected Value (EV)
```
EV = (Your Prob × Profit) - (1 - Your Prob) × Stake

Positive EV = profitable long-term
Need 2-5% edge minimum to overcome variance

Example:
You estimate: 55% win probability
Odds offered: +110 (47.6% implied)
Edge: 55% - 47.6% = 7.4%
EV per $100: (0.55 × $110) - (0.45 × $100) = +$15.50
```

### Closing Line Value (CLV)
```
If your bet price is better than closing line:
You likely have long-term edge

Track: Your odds vs. closing odds
Consistent CLV = sustainable edge
```

### Finding Value

1. **Model-based**: Build predictive models, compare to market
2. **Steam chasing**: Follow sharp money movement
3. **Market inefficiencies**: Props, derivatives, live betting
4. **Information edge**: Injury news, lineup info before market

---

## Bet Types & Strategies

### Moneyline
```
Simplest: Pick the winner
Best for: Heavy underdogs, low-scoring sports
Edge source: Probability estimation
```

### Spread/Handicap
```
Team must win by X points
More liquid, tighter lines
Edge source: Margin of victory modeling
```

### Totals (Over/Under)
```
Combined score prediction
Often less efficient than sides
Edge source: Pace, weather, matchup analysis
```

### Props (Player/Team)
```
Individual performance bets
Often soft lines, less liquid
Edge source: Player-specific modeling

Examples:
- Points/rebounds/assists
- Strikeouts, passing yards
- First scorer, method of victory
```

### Parlays
```
Multiple bets combined
Odds multiply, so does risk
Generally -EV due to correlation mispricing

Exception: Correlated parlays where book underestimates
(Same game parlays, weather-affected totals)
```

### Live Betting
```
In-game wagering
Fastest-moving markets
Edge source: Real-time analysis, model updates
Risk: Latency, emotional decisions
```

---

## Bankroll Management

### Unit Sizing
```
1 unit = 1-2% of bankroll
Never bet more than 5% on single play
```

### Kelly Criterion
```
Kelly % = (bp - q) / b
Optimal for maximizing long-term growth

Problems:
- Assumes known edge (we estimate)
- High variance
- Assumes unlimited time horizon

Solution: Fractional Kelly (1/4 to 1/2 Kelly)
```

### Flat Betting
```
Same amount every bet
Lower variance, slower growth
Good for uncertain edge sizing
```

### Drawdown Protection
```
If bankroll drops 20%: Reduce unit size
If bankroll drops 40%: Stop, reassess
Never chase losses
```

---

## Market Dynamics

### Sharp vs. Square
```
Sharp (Professional):
- Bet early, move lines
- Focus on +EV, not outcomes
- Sophisticated models
- Bet large amounts

Square (Recreational):
- Bet favorites, overs, prime time
- Chase losses
- Emotional decisions
- Smaller, more frequent bets
```

### Line Movement
```
Opener → Early sharp action → Public betting → Closer

Reverse line movement: Line moves against public
Often indicates sharp action
```

### Market Efficiency
```
NFL sides: Very efficient (hard to beat)
NBA totals: Moderately efficient
MLB props: Less efficient
Minor leagues/sports: Least efficient

Trade-off: Less efficient = less liquidity
```

### Steam Moves
```
Rapid line movement across books
Indicates coordinated sharp action
Can be followed (with caution)
```

---

## Odds API Integration

### The Odds API
```bash
# Get current odds
curl "https://api.the-odds-api.com/v4/sports/basketball_nba/odds/?apiKey=${ODDS_API_KEY}&regions=us&markets=h2h,spreads,totals"

# Available sports
curl "https://api.the-odds-api.com/v4/sports/?apiKey=${ODDS_API_KEY}"
```

### Key Data Points
```json
{
  "sport": "basketball_nba",
  "home_team": "Lakers",
  "away_team": "Celtics",
  "bookmakers": [
    {
      "key": "fanduel",
      "markets": [
        {
          "key": "h2h",
          "outcomes": [
            {"name": "Lakers", "price": -150},
            {"name": "Celtics", "price": +130}
          ]
        }
      ]
    }
  ]
}
```

### Building an Odds Comparison Tool
1. Fetch odds from multiple books
2. Calculate no-vig fair odds
3. Find best price for each side
4. Alert when edge exceeds threshold
5. Track line movement over time

---

## Record Keeping

### Essential Tracking
```
For each bet:
- Date/time placed
- Sport/league/event
- Bet type (ML, spread, total, prop)
- Your odds
- Closing odds (CLV tracking)
- Your estimated probability
- Result
- Units wagered
- Profit/loss
```

### Analysis Metrics
```
ROI = Total Profit / Total Wagered × 100
Win Rate = Wins / Total Bets
CLV = Average (Your Odds - Closing Odds)
Yield by bet type, sport, book
```

---

## Psychological Discipline

### Rules
1. **Pre-commit**: Set bets before games, limit live betting
2. **No chasing**: Losses happen, stick to process
3. **No tilt**: Take breaks after bad beats
4. **No parlays for action**: Only +EV correlated parlays
5. **Track everything**: Data reveals truth

### Warning Signs
- Betting more after losses
- "Gut feel" overriding model
- Betting sports you don't analyze
- Ignoring bankroll limits
- Emotional attachment to teams

---

## Legal & Practical

### Shop for Lines
```
Small odds differences compound:
-110 vs -105 over 1000 bets = significant $$$
Use multiple books, always take best price
```

### Book Selection
```
Sharp-friendly: Pinnacle, Circa, Bookmaker
Recreational: DraftKings, FanDuel, BetMGM

Note: Some books limit winning bettors
Diversify to avoid getting limited
```

### Tax Considerations
```
US: Gambling winnings are taxable income
Keep detailed records
Consult tax professional for large profits
```

---

## Building Your Edge

### Development Path
1. Master probability & statistics
2. Specialize in 1-2 sports deeply
3. Build predictive models
4. Paper bet to validate
5. Start small with real money
6. Track religiously, iterate
7. Scale what works

### Research Priorities
- Market inefficiencies in props
- Live betting opportunities
- Correlated parlay edges
- Weather/injury impact models
- Referee/umpire tendencies
