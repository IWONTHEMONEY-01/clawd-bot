---
name: quant-trading
description: Quantitative trading strategies, signal generation, backtesting, and algorithmic execution. Building systematic trading approaches.
homepage: https://www.quantconnect.com
metadata: {"clawdbot":{"emoji":"📈","requires":{"tools":["web_search","web_fetch"]}}}
---

# Quantitative Trading

Systematic, data-driven approaches to financial markets.

## Core Concepts

### Alpha vs. Beta
```
Beta: Market exposure (index returns)
Alpha: Excess returns from skill

Total Return = Alpha + (Beta × Market Return)

Goal: Generate alpha independent of market direction
```

### Sharpe Ratio
```
Sharpe = (Return - Risk-Free Rate) / Std Dev

Measures risk-adjusted returns
< 1: Poor
1-2: Good
> 2: Excellent
> 3: Suspicious (check for overfitting)
```

### Maximum Drawdown
```
MaxDD = (Peak - Trough) / Peak × 100

Largest decline from peak to trough
Critical for risk management
Target: < 20% for most strategies
```

### Calmar Ratio
```
Calmar = Annual Return / Max Drawdown

Return per unit of drawdown risk
> 1 is desirable
```

---

## Strategy Categories

### Momentum
```
Trend Following:
- Buy assets going up, sell those going down
- Works across timeframes
- High hit rate, small wins

Cross-sectional momentum:
- Long top performers, short bottom
- Monthly rebalancing typical
- Sector-neutral versions reduce risk
```

### Mean Reversion
```
Assumption: Prices revert to average
- Buy oversold, sell overbought
- Short-term (days to weeks)
- Higher win rate, risk of regime change

Pairs Trading:
- Find correlated assets
- Trade the spread when it diverges
- Market-neutral
```

### Statistical Arbitrage
```
- Large portfolio of small edges
- High frequency, many positions
- Market-neutral, low correlation
- Requires sophisticated execution
```

### Factor Investing
```
Known factors with risk premiums:
- Value: Buy cheap, sell expensive
- Momentum: Buy winners, sell losers
- Size: Small caps outperform
- Quality: High profitability premium
- Low Vol: Low volatility anomaly

Multi-factor models combine several
```

---

## Signal Generation

### Technical Signals
```python
# Moving Average Crossover
fast_ma = price.rolling(20).mean()
slow_ma = price.rolling(50).mean()
signal = (fast_ma > slow_ma).astype(int)

# RSI (Relative Strength Index)
delta = price.diff()
gain = (delta.where(delta > 0, 0)).rolling(14).mean()
loss = (-delta.where(delta < 0, 0)).rolling(14).mean()
rsi = 100 - (100 / (1 + gain/loss))

# Bollinger Bands
mid = price.rolling(20).mean()
std = price.rolling(20).std()
upper = mid + 2*std
lower = mid - 2*std
```

### Fundamental Signals
```python
# Value factor
pb_ratio = market_cap / book_value
value_signal = 1 / pb_ratio  # Higher = cheaper

# Quality factor
roe = net_income / shareholder_equity
quality_signal = roe

# Combined score
signal = (value_signal.rank() + quality_signal.rank()) / 2
```

### Alternative Data
```
- Sentiment: News, social media
- Satellite: Parking lots, shipping
- Web traffic: Company activity
- Credit card: Consumer spending
- Weather: Commodity impact
```

---

## Backtesting

### Basic Framework
```python
def backtest(prices, signals, initial_capital=100000):
    positions = signals.shift(1)  # No look-ahead
    returns = prices.pct_change()
    strategy_returns = positions * returns

    equity = initial_capital * (1 + strategy_returns).cumprod()

    return {
        'total_return': equity.iloc[-1] / initial_capital - 1,
        'sharpe': strategy_returns.mean() / strategy_returns.std() * np.sqrt(252),
        'max_drawdown': (equity / equity.cummax() - 1).min()
    }
```

### Critical Rules

1. **No Look-Ahead Bias**
   ```
   Use only data available at decision time
   Shift signals, not prices
   ```

2. **Survivorship Bias**
   ```
   Include delisted stocks in historical data
   Point-in-time data for fundamentals
   ```

3. **Transaction Costs**
   ```
   Include: Commissions, spread, slippage, market impact
   Rule of thumb: 10-50 bps per trade
   ```

4. **Out-of-Sample Testing**
   ```
   Train on 60-70% of data
   Test on remaining 30-40%
   Walk-forward validation preferred
   ```

5. **Overfitting Prevention**
   ```
   Fewer parameters = more robust
   Cross-validation
   Multiple asset classes
   Economic intuition for signals
   ```

---

## Risk Management

### Position Sizing
```python
# Volatility-based sizing
target_vol = 0.10  # 10% annual volatility
asset_vol = returns.std() * np.sqrt(252)
position_size = target_vol / asset_vol

# Equal risk contribution
weights = 1 / volatilities
weights = weights / weights.sum()
```

### Stop Losses
```
Fixed: Exit at -2% loss
Trailing: Exit if drops 2% from high
Volatility-based: Exit at 2× ATR

Note: Stops can hurt momentum strategies
Backtest with and without
```

### Portfolio Construction
```python
# Maximum position size: 10%
# Sector max: 25%
# Long/short balance
# Correlation limits between positions
```

### Hedging
```
Beta hedge: Short index futures
Factor hedge: Neutralize known factors
Options: Tail risk protection
```

---

## Execution

### Market Microstructure
```
Bid: Highest price buyers will pay
Ask: Lowest price sellers will accept
Spread: Ask - Bid (your cost)
Depth: Volume at each price level
```

### Order Types
```
Market: Immediate, pay the spread
Limit: Price guarantee, no fill guarantee
Stop: Becomes market when triggered
Iceberg: Hide large order size
TWAP: Time-weighted average price
VWAP: Volume-weighted average price
```

### Execution Algorithms
```python
# Simple TWAP
def twap_order(total_qty, duration_minutes, interval_seconds):
    num_orders = duration_minutes * 60 / interval_seconds
    order_size = total_qty / num_orders
    for i in range(int(num_orders)):
        place_order(order_size)
        sleep(interval_seconds)
```

### Slippage Estimation
```
Market impact ≈ sigma × sqrt(V/ADV) × sign(V)

Where:
sigma = volatility
V = order volume
ADV = average daily volume

Large orders: Use algos to minimize impact
```

---

## Tools & Platforms

### Backtesting
- **QuantConnect**: Cloud-based, multi-asset
- **Zipline**: Python, Quantopian legacy
- **Backtrader**: Python, flexible
- **VectorBT**: Fast vectorized backtesting

### Data Sources
- **Yahoo Finance**: Free EOD data
- **Alpha Vantage**: Free API, rate limited
- **Polygon.io**: Real-time, historical
- **Quandl**: Alternative data
- **IEX Cloud**: Affordable professional data

### Execution
- **Interactive Brokers**: Best for retail quants
- **Alpaca**: Commission-free API
- **TD Ameritrade**: Free API access
- **FTX / Binance**: Crypto markets

---

## Strategy Development Process

### 1. Hypothesis
```
Start with economic intuition
Why should this edge exist?
Who is on the other side?
```

### 2. Data Collection
```
Clean, validate, handle missing
Point-in-time for fundamentals
Adjust for splits, dividends
```

### 3. Signal Research
```
Exploratory analysis
Feature engineering
Correlation with returns
```

### 4. Backtest
```
In-sample development
Out-of-sample validation
Multiple market regimes
```

### 5. Paper Trading
```
Real-time signal generation
Simulated execution
Debug data/execution issues
```

### 6. Live Trading
```
Start small (10-20% of target)
Monitor closely
Scale up if performance matches backtest
```

### 7. Monitoring
```
Track vs. backtest expectations
Factor exposure drift
Correlation with other strategies
Capacity constraints
```

---

## Common Pitfalls

1. **Overfitting**: Too many parameters, magical backtest
2. **Data snooping**: Testing many strategies, only showing winners
3. **Ignoring costs**: Strategies that don't survive transaction costs
4. **Regime change**: What worked in 2010 may not work now
5. **Crowding**: Popular strategies lose edge
6. **Leverage**: Amplifies mistakes, margin calls
7. **Fat tails**: Extreme events happen more than normal distribution suggests

---

## Research Agenda

Continuously explore:
1. New alternative data sources
2. Machine learning for signal generation
3. Execution algorithm improvements
4. Cross-asset correlations
5. Regime detection methods
6. Options strategies integration

Document all findings for strategy building.
