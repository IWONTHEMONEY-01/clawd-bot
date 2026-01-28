# Sports Betting Model System

**Project Status:** Active | **Started:** 2026-01-28 | **Sports:** NBA, MLB

## Overview

A data-driven sports betting model system focused on player props for NBA and MLB. The project combines statistical modeling, machine learning, and disciplined bankroll management to identify value betting opportunities.

## Research Completed

### 1. NBA Player Prop Modeling
- **Statistical Approaches:** Linear regression, gradient boosting (XGBoost), neural networks
- **Key Predictors:** Recent performance (last 5-10 games), opponent strength metrics, rest days, home/away split, usage rate, minutes played
- **Evaluation:** RMSE, MAE, Sharpe ratio, ROI tracking

### 2. MLB Pitcher Prop Modeling
- **Statistical Approaches:** Poisson regression, random forest, XGBoost, Bayesian methods
- **Key Predictors:** FIP (Fielding Independent Pitching), ERA, strikeouts/9, walk rate, opponent lineup quality, ballpark factors
- **Critical Insight:** Pitcher performance exhibits strong regression to mean; recent form less reliable than season averages

### 3. Data Sources
- **Free APIs:**
  - nba_api (official NBA stats)
  - MLB-StatsAPI (official MLB stats)
  - baseball-scraper (scraped MLB data)
- **Paid/Cheap Providers:**
  - Action Network API (betting consensus)
  - BetRivers API (live odds)
  - OddsMatrix (comprehensive odds)
- **Access:** RESTful APIs, WebSocket for live data, CSV exports for historical data

### 4. Open Source Models
- **Catalog:** 15+ GitHub repos analyzed
- **Common Techniques:**
  - Kelly criterion for bet sizing
  - Elo ratings for team strength
  - Poisson distribution for scoring
  - Bayesian inference for uncertainty
- **Best Practices:**
  - Unit-based staking (1-2% of bankroll)
  - Comprehensive bankroll tracking
  - Emotional discipline (avoiding tilt)
  - Record keeping for continuous improvement

## Tech Stack

```
Python 3.10+
├── Database: SQLAlchemy (PostgreSQL)
├── Data Fetching:
│   ├── nba_api (NBA)
│   └── MLB-StatsAPI (MLB)
├── Machine Learning:
│   ├── scikit-learn (classical ML)
│   ├── xgboost (gradient boosting)
│   └── tensorflow (neural networks)
├── Data Processing: pandas, numpy
└── APIs: requests, websockets
```

## Files Created

### Core Infrastructure
- `database.py` - SQLAlchemy ORM models for games, players, props, bets
- `data_fetcher.py` - API integration for fetching NBA/MLB data
- `main.py` - Application entry point and orchestration

### Research Documentation
- `nba-player-prop-research.md` - NBA modeling research
- `mlb-pitcher-prop-research.md` - MLB modeling research
- `data-sources-research.md` - API and data provider research
- `open-source-models-research.md` - GitHub analysis and best practices

## Next Steps

1. **Feature Engineering**
   - Rolling averages (last 5, 10, 20 games)
   - Player matchup analysis
   - Situational factors (travel, rest, scheduling)
   - Advanced metrics (usage rate, offensive/defensive rating)

2. **Baseline Model Implementation**
   - Simple linear regression baseline
   - Feature importance analysis
   - Cross-validation setup

3. **Backtesting Framework**
   - Historical data pipeline
   - Performance metrics tracking
   - Simulated betting with Kelly sizing

4. **Live Odds Integration**
   - Real-time odds fetching
   - Value detection (model vs market)
   - Alert system for positive EV opportunities

## Key Insights

1. **Predictive Power:** Recent form is more predictive than season averages for NBA; MLB pitchers show stronger regression to mean
2. **Situational Context Matters:** Back-to-back games, travel distance, and rest days significantly impact performance
3. **Discipline Over Complexity:** Simple models with robust risk management outperform complex models without discipline
4. **Data Quality:** Garbage in, garbage out; invest in reliable, consistent data sources

## Risk Management Principles

- Fixed unit sizing (1-2% of bankroll per bet)
- Maximum daily exposure limit (5% of bankroll)
- Avoid parlays and high-variability bets
- Track all bets with results and rationale
- Review performance weekly

---

*Last Updated: 2026-01-28*
