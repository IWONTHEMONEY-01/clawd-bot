---
name: sports-analytics
description: Advanced sports analytics and sabermetrics across all major sports. Statistical methods for player evaluation, game prediction, and edge finding.
homepage: https://www.baseball-reference.com
metadata: {"clawdbot":{"emoji":"⚾","requires":{"tools":["web_search","web_fetch"]}}}
---

# Sports Analytics & Sabermetrics

Advanced statistical analysis for all major sports. Originally "sabermetrics" (baseball), now applied universally.

## Universal Principles

### 1. Outcome vs. Process
- **Results**: What happened (wins, points scored)
- **Process**: Quality of decisions/execution
- Focus on process metrics - results follow over time

### 2. Context Matters
- Adjust for opponent strength
- Adjust for venue (home/away)
- Adjust for era/league average

### 3. Sample Size Requirements
| Metric Type | Games Needed |
|-------------|--------------|
| Shooting % | 50-100 |
| Batting outcomes | 200-400 PA |
| Team win rate | 30-50 games |
| Pitcher ERA | 150+ IP |

---

## ⚾ Baseball (MLB)

### Batting Metrics

**wOBA (Weighted On-Base Average)**
```
wOBA = (0.69×BB + 0.72×HBP + 0.89×1B + 1.27×2B + 1.62×3B + 2.10×HR) / PA

League average: ~.320
Elite: .400+
```

**wRC+ (Weighted Runs Created Plus)**
```
100 = league average
150 = 50% better than average
Adjusts for park and league
```

**BABIP (Batting Average on Balls in Play)**
```
BABIP = (H - HR) / (AB - K - HR + SF)
League average: ~.300
Used to identify luck vs. skill
```

### Pitching Metrics

**FIP (Fielding Independent Pitching)**
```
FIP = ((13×HR) + (3×(BB+HBP)) - (2×K)) / IP + constant

Isolates pitcher from defense
Better predictor than ERA
```

**xFIP (Expected FIP)**
```
Normalizes HR/FB rate to league average
Even more stable than FIP
```

**SIERA (Skill-Interactive ERA)**
```
Most predictive pitching metric
Accounts for GB/FB tendencies
```

### Team Metrics

**Pythagorean Expectation**
```
Win% = RS^1.83 / (RS^1.83 + RA^1.83)

Where RS = runs scored, RA = runs allowed
Predicts future wins better than actual record
```

**BaseRuns**
```
Expected runs from component events
Better than just RS for projection
```

---

## 🏀 Basketball (NBA)

### Efficiency Metrics

**True Shooting % (TS%)**
```
TS% = PTS / (2 × (FGA + 0.44 × FTA))

Accounts for 3PT and FT value
League average: ~.570
Elite: .620+
```

**Effective FG% (eFG%)**
```
eFG% = (FGM + 0.5 × 3PM) / FGA
Weights 3-pointers appropriately
```

### Player Impact

**BPM (Box Plus/Minus)**
```
Points above average per 100 possessions
Based on box score stats
0 = average, +5 = All-Star, +10 = MVP
```

**RAPTOR (538's metric)**
```
Combines box score + on/off data
Includes luck adjustment
Best public all-in-one metric
```

**PER (Player Efficiency Rating)**
```
Per-minute rating, 15 = average
Older metric, overvalues volume
```

### Team Metrics

**Offensive/Defensive Rating**
```
ORtg = (Points × 100) / Possessions
DRtg = (Points allowed × 100) / Possessions

Net Rating = ORtg - DRtg
```

**Pace**
```
Possessions per 48 minutes
Affects raw counting stats
Always adjust for pace
```

**Four Factors (Dean Oliver)**
```
1. eFG% (shooting)
2. TOV% (turnovers)
3. ORB% (offensive rebounding)
4. FT rate (free throws)

Weights: 40%, 25%, 20%, 15%
```

---

## 🏈 Football (NFL)

### Passing Metrics

**EPA (Expected Points Added)**
```
Points added above expectation per play
Context-dependent (down, distance, field position)
Best single measure of play value
```

**CPOE (Completion % Over Expected)**
```
Actual completion % - Expected completion %
Accounts for throw difficulty
Elite: +4%+
```

**ANY/A (Adjusted Net Yards/Attempt)**
```
ANY/A = (Yards + 20×TD - 45×INT - Sack Yards) / (Attempts + Sacks)
Quick QB evaluation
```

### Rushing Metrics

**Yards After Contact**
```
Isolates RB skill from blocking
```

**Success Rate**
```
% of runs gaining "expected" yards
1st down: 40%+ of needed
2nd down: 60%+ of needed
3rd/4th: 100% of needed
```

### Team Metrics

**DVOA (Defense-adjusted Value Over Average)**
```
Football Outsiders' comprehensive metric
0% = average, positive = better
Opponent and situation adjusted
```

**Win Probability Models**
```
Real-time probability based on:
- Score differential
- Time remaining
- Field position
- Timeouts
```

---

## ⚽ Soccer (Football)

### Shooting Metrics

**xG (Expected Goals)**
```
Probability a shot becomes a goal
Based on: distance, angle, body part, assist type
Sum xG = expected goals from chances

xG difference (xGD) best predictor of future results
```

**xGOT (xG on Target)**
```
Adds shot placement quality
Separates finishing skill
```

### Possession Metrics

**xT (Expected Threat)**
```
Value of moving ball to dangerous areas
Rewards progressive passing/carrying
```

**PPDA (Passes Per Defensive Action)**
```
Pressing intensity measure
Lower = more aggressive press
```

### Player Metrics

**xA (Expected Assists)**
```
Quality of chances created
Independent of teammate finishing
```

**Progressive Passes/Carries**
```
Passes/carries moving ball 10+ yards toward goal
Measures ball progression ability
```

---

## 🏒 Hockey (NHL)

### Shot Metrics

**Corsi (CF%)**
```
Shot attempts for / (for + against)
50% = average possession
Best simple possession metric
```

**xG (Expected Goals)**
```
Like soccer, probability-weighted shots
Accounts for shot location, type, rebound
```

**Fenwick**
```
Corsi minus blocked shots
Some prefer for repeatability
```

### Goalie Metrics

**GSAx (Goals Saved Above Expected)**
```
Goals allowed vs. xG faced
Positive = better than expected
```

**HDSV% (High-Danger Save %)**
```
Save % on high-danger chances only
Better signal than overall SV%
```

---

## Data Sources

### Free
- Baseball: FanGraphs, Baseball-Reference, Baseball Savant
- Basketball: Basketball-Reference, NBA.com/stats, PBPStats
- Football: Pro-Football-Reference, NFLfastR, rbsdm.com
- Soccer: FBref, Understat, WhoScored
- Hockey: Natural Stat Trick, Hockey-Reference, MoneyPuck

### Paid (for edges)
- Statcast raw data
- Second Spectrum (NBA tracking)
- SkillCorner (soccer tracking)
- Sportradar feeds

---

## Building Models

### Process
1. **Identify question**: What are we predicting?
2. **Gather data**: Historical stats, context variables
3. **Feature engineering**: Create predictive inputs
4. **Train model**: Regression, random forest, neural net
5. **Validate**: Out-of-sample testing, cross-validation
6. **Monitor**: Track real-world performance

### Common Pitfalls
- Overfitting to small samples
- Ignoring park/venue effects
- Using counting stats without rate adjustment
- Correlation ≠ causation
- Survivorship bias in historical data

---

## Research Agenda

Continuously explore:
1. New metrics being developed
2. Tracking data applications
3. Injury impact modeling
4. Weather/environmental effects
5. Schedule/rest advantages
6. Referee/umpire tendencies

Save all findings to memory for building betting/trading edges.
