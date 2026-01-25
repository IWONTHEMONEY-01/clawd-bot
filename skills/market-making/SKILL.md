---
name: market-making
description: Market making fundamentals, bid-ask spread management, inventory risk, and liquidity provision strategies across financial and betting markets.
homepage: https://en.wikipedia.org/wiki/Market_maker
metadata: {"clawdbot":{"emoji":"⚖️","requires":{"tools":["web_search","web_fetch"]}}}
---

# Market Making

Providing liquidity by continuously quoting bid and ask prices. Profit from the spread while managing inventory risk.

## Core Concepts

### The Spread
```
Bid: Price you'll buy at (lower)
Ask: Price you'll sell at (higher)
Spread = Ask - Bid

Profit per round-trip = Spread
Risk = Adverse selection + Inventory
```

### Market Making Equation
```
Profit = (Spread Revenue) - (Adverse Selection Cost) - (Inventory Cost)

You make money from uninformed traders
You lose money to informed traders
You carry risk from holding inventory
```

### Who Market Makes?
```
Financial Markets:
- Designated market makers (DMMs)
- High-frequency trading firms
- Bank trading desks

Sports Betting:
- Sportsbooks (bookmakers)
- Betting exchanges

Crypto:
- Exchange market makers
- DeFi liquidity providers
```

---

## Spread Setting

### Basic Framework
```
Fair Value = True expected price
Bid = Fair Value - Half Spread
Ask = Fair Value + Half Spread

Spread Width determined by:
1. Volatility (wider for volatile assets)
2. Competition (tighter with more makers)
3. Adverse selection risk
4. Inventory position
```

### Volatility-Based Spread
```python
def calculate_spread(volatility, confidence=0.95):
    # Z-score for confidence interval
    z = 1.96 if confidence == 0.95 else 1.645

    # Spread as multiple of volatility
    half_spread = z * volatility

    return half_spread * 2
```

### Competition Adjustment
```
Monopoly: Wide spreads, high profit/trade
Competition: Tight spreads, volume-based profit

Optimal: Just tight enough to attract flow
Too tight: Adverse selection dominates
```

---

## Inventory Management

### The Problem
```
If you buy more than sell: Long inventory
- Risk: Price drops, you lose
- Opportunity cost: Capital tied up

If you sell more than buy: Short inventory
- Risk: Price rises, you lose
- May need to cover at worse prices
```

### Inventory Skew
```python
def skewed_quotes(fair_value, base_spread, inventory, max_inventory):
    # Skew factor based on inventory
    skew = inventory / max_inventory

    # Adjust quotes to reduce inventory
    bid = fair_value - (base_spread/2) * (1 + skew)
    ask = fair_value + (base_spread/2) * (1 - skew)

    # Long inventory: lower bid (buy less), lower ask (sell more)
    # Short inventory: higher bid (buy more), higher ask (sell less)

    return bid, ask
```

### Position Limits
```
Set maximum inventory thresholds:
- Soft limit: Start aggressive unwinding
- Hard limit: Stop quoting one side

Example:
Max position: $100,000
At $50,000: Skew quotes 10%
At $80,000: Skew quotes 25%
At $100,000: Only quote to reduce
```

### Hedging
```
If inventory accumulates beyond tolerance:
1. Trade in correlated market
2. Use derivatives
3. Accept the loss and flatten

Cost of hedging vs. cost of inventory risk
```

---

## Adverse Selection

### The Information Problem
```
Who trades with you?
- Uninformed: Random flow, you profit
- Informed: They know something, you lose

"Getting picked off" by informed traders
```

### Detection
```python
def detect_adverse_selection(trades, price_changes):
    # Measure price impact of trades
    # Large impact = likely informed

    impacts = []
    for trade in trades:
        future_return = price_change_after(trade, window='5min')
        impact = future_return * trade.direction
        impacts.append(impact)

    # High average impact = being adversely selected
    return np.mean(impacts)
```

### Protection Strategies
```
1. Widen spreads for large orders
2. Reduce size at each price level
3. Speed: Update quotes faster than informed can hit
4. Pattern recognition: Identify toxic flow
5. Last-look: Option to reject trades (controversial)
```

### Order Flow Toxicity (VPIN)
```
Volume-Synchronized Probability of Informed Trading
Measures imbalance between buy/sell pressure
High VPIN = High adverse selection risk = Widen spreads
```

---

## Sportsbook Market Making

### Setting Lines
```
Opening Line: Initial estimate of fair value
Movement: Adjust based on betting flow

Fair odds + vig on both sides = profit
```

### The Vig (Juice)
```
Example: True probability 50/50
Fair odds: +100 / +100
With 5% vig: -110 / -110

Implied prob: 52.4% + 52.4% = 104.8%
Book edge: 4.8% / 2 = 2.4% per bet
```

### Line Management
```python
def adjust_line(current_line, money_on_favorite, total_money):
    imbalance = (money_on_favorite / total_money) - 0.5

    # Move line to balance action
    # Also consider: Are bettors sharp or square?
    adjustment = imbalance * sensitivity_factor

    return current_line + adjustment
```

### Sharp vs. Square
```
Sharp action: Respect it, likely informed
Square action: Fade it, use for balance

Key: Identify which is which
- Timing (early = sharp)
- Bet size patterns
- Account history
```

---

## Crypto/DeFi Market Making

### Centralized Exchange MM
```
Same principles as traditional finance
Faster, 24/7, more volatile
API-based quoting and execution
```

### Automated Market Makers (AMMs)
```
Constant Product: x * y = k (Uniswap)

Price determined by pool ratio
Liquidity providers earn fees
Impermanent loss risk
```

### Impermanent Loss
```
When prices diverge from entry:
IL = 2 * sqrt(price_ratio) / (1 + price_ratio) - 1

Example: Price doubles
IL = 2 * sqrt(2) / 3 - 1 = -5.7%

You'd be better off just holding
Fees must exceed IL to profit
```

### Concentrated Liquidity (Uniswap v3)
```
Provide liquidity in price range
Higher capital efficiency
Higher risk if price exits range
```

---

## Execution Technology

### Latency Matters
```
Faster quote updates = less adverse selection
Stale quotes = getting picked off

Typical requirements:
- Crypto: 10-100ms
- Equities: Microseconds
- HFT: Nanoseconds
```

### Quote Management
```python
class QuoteManager:
    def __init__(self, fair_value_model, risk_params):
        self.model = fair_value_model
        self.risk = risk_params
        self.inventory = 0

    def update_quotes(self, market_data):
        fair_value = self.model.estimate(market_data)
        spread = self.calculate_spread()
        bid, ask = self.skew_for_inventory(fair_value, spread)

        self.cancel_existing_quotes()
        self.send_quotes(bid, ask)

    def on_fill(self, trade):
        self.inventory += trade.signed_quantity
        self.update_quotes(latest_data)
```

### Risk Controls
```
- Maximum position size
- Maximum daily loss
- Kill switch for anomalies
- Quote validity checks
- Connectivity monitoring
```

---

## P&L Analysis

### Components
```
Total P&L = Spread P&L + Position P&L

Spread P&L = Σ (trades × half_spread)
Position P&L = Inventory × Price Change

Good: Positive spread P&L, flat position P&L
Bad: Losing on both (being picked off)
```

### Metrics
```python
def market_maker_metrics(trades, positions, prices):
    # Spread capture
    spread_pnl = sum(t.spread_earned for t in trades)

    # Position P&L
    position_pnl = sum(p.quantity * price_change for p in positions)

    # Fill rate
    fill_rate = filled_quotes / total_quotes

    # Adverse selection
    avg_slippage = mean(t.fill_price - t.fair_value for t in trades)

    return {
        'spread_pnl': spread_pnl,
        'position_pnl': position_pnl,
        'total_pnl': spread_pnl + position_pnl,
        'fill_rate': fill_rate,
        'adverse_selection': avg_slippage
    }
```

---

## Strategy Variations

### Passive Market Making
```
Wide spreads, patient execution
Lower volume, higher profit per trade
Less adverse selection exposure
```

### Aggressive Market Making
```
Tight spreads, high volume
Compete on speed and technology
Thin margins, scale required
```

### Informed Market Making
```
Use signals to adjust fair value
Skew quotes based on prediction
Hybrid of MM and directional trading
```

### Cross-Market Making
```
Arbitrage across venues
Quote based on best prices elsewhere
Requires fast connectivity to multiple venues
```

---

## Getting Started

### Simulated Environment
1. Build a simple quote engine
2. Backtest against historical order book
3. Measure spread capture vs. adverse selection
4. Iterate on parameters

### Small Scale Live
```
Start with wide spreads (safety)
Small position limits
Monitor continuously
Tighten as you learn the market
```

### Scaling
```
Increase size per quote
Add more instruments
Improve latency
Reduce spreads competitively
```

---

## Research Priorities

1. Optimal spread models for different assets
2. Inventory management algorithms
3. Adverse selection detection
4. Cross-market signals
5. Regime-dependent parameters
6. AMM LP strategies and IL mitigation

Document all learnings for strategy refinement.
