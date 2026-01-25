---
name: probability-statistics
description: Foundational probability theory, statistics, and mathematical concepts for quantitative analysis. Core knowledge for betting, trading, and analytics.
homepage: https://en.wikipedia.org/wiki/Probability_theory
metadata: {"clawdbot":{"emoji":"📊","requires":{"tools":["web_search"]}}}
---

# Probability & Statistics Foundation

Core mathematical foundation for sports analytics, betting, and trading.

## Core Probability Concepts

### Basic Probability Rules
```
P(A) = favorable outcomes / total outcomes
P(A and B) = P(A) × P(B|A)                    # Multiplication rule
P(A or B) = P(A) + P(B) - P(A and B)          # Addition rule
P(A|B) = P(B|A) × P(A) / P(B)                 # Bayes' theorem
```

### Expected Value (EV)
The foundation of all betting and trading decisions:
```
EV = Σ (probability × outcome)
EV = (P_win × profit) - (P_lose × stake)

Example: Bet $100 at +150 odds (60% implied, you estimate 65% true)
EV = (0.65 × $150) - (0.35 × $100) = $97.50 - $35 = +$62.50
```

### Variance and Standard Deviation
```
Variance (σ²) = Σ(x - μ)² / n
Std Dev (σ) = √Variance

# For betting: measures bankroll volatility
# For trading: measures price volatility
```

### Kelly Criterion
Optimal bet sizing for edge exploitation:
```
Kelly % = (bp - q) / b

Where:
b = decimal odds - 1 (net odds)
p = probability of winning
q = probability of losing (1 - p)

Example: 55% edge at even odds (+100)
Kelly = (1 × 0.55 - 0.45) / 1 = 10% of bankroll

# Half-Kelly (conservative): Kelly% / 2
# Quarter-Kelly (very conservative): Kelly% / 4
```

## Distributions

### Normal Distribution
```
Most market returns, measurement errors
μ = mean, σ = standard deviation

68% within 1σ, 95% within 2σ, 99.7% within 3σ

Z-score = (x - μ) / σ
```

### Poisson Distribution
Perfect for modeling rare events (goals, touchdowns, home runs):
```
P(k events) = (λ^k × e^(-λ)) / k!

Where λ = average rate of occurrence

Example: Team averages 2.5 goals/game
P(exactly 3 goals) = (2.5³ × e^(-2.5)) / 3! = 21.4%
```

### Binomial Distribution
For win/loss sequences:
```
P(k successes in n trials) = C(n,k) × p^k × (1-p)^(n-k)

Example: 60% win rate, probability of 7+ wins in 10 bets
Sum P(k) for k = 7 to 10
```

## Regression & Correlation

### Linear Regression
```
y = mx + b
m = Σ(x-x̄)(y-ȳ) / Σ(x-x̄)²
b = ȳ - m×x̄

R² = explained variance / total variance
```

### Correlation
```
r = Σ(x-x̄)(y-ȳ) / √[Σ(x-x̄)² × Σ(y-ȳ)²]

-1 = perfect negative, 0 = none, +1 = perfect positive
```

### Regression to the Mean
Critical concept: extreme performances tend to move toward average
- Hot streaks cool off
- Cold streaks warm up
- Use larger sample sizes for true talent estimation

## Bayesian Thinking

### Prior → Evidence → Posterior
```
P(hypothesis|evidence) = P(evidence|hypothesis) × P(hypothesis) / P(evidence)

# Start with prior belief
# Update with new data
# Get posterior (updated belief)
```

### Application to Sports/Betting
```
Prior: Team's historical win rate = 55%
Evidence: Won 8 of last 10 games
Question: What's their true win rate?

Use beta distribution:
α = wins + prior_α
β = losses + prior_β
Expected = α / (α + β)
```

## Statistical Testing

### Hypothesis Testing
```
Null hypothesis (H₀): No effect / no edge
Alternative (H₁): There is an effect / edge

p-value: Probability of seeing results this extreme if H₀ is true
p < 0.05: Statistically significant (reject H₀)
```

### Sample Size for Significance
```
n = (Z² × p × (1-p)) / E²

Where:
Z = 1.96 for 95% confidence
p = expected proportion
E = margin of error

Example: Verify 55% win rate ± 3%
n = (1.96² × 0.55 × 0.45) / 0.03² = 1,056 bets needed
```

## Monte Carlo Simulation

For complex scenarios, simulate thousands of outcomes:
```python
import random

def simulate_season(win_prob, games=162):
    wins = sum(random.random() < win_prob for _ in range(games))
    return wins

# Run 10,000 simulations
results = [simulate_season(0.55) for _ in range(10000)]
# Analyze distribution of outcomes
```

## Key Mental Models

1. **Law of Large Numbers**: Results converge to expected value over time
2. **Gambler's Fallacy**: Past results don't change future probabilities
3. **Base Rate Neglect**: Always consider prior probabilities
4. **Survivorship Bias**: Don't learn only from winners
5. **Overfitting**: More parameters ≠ better predictions

## When to Use What

| Scenario | Tool |
|----------|------|
| Bet sizing | Kelly Criterion |
| Goal/score prediction | Poisson Distribution |
| Win probability | Binomial/Beta |
| Price movement | Normal Distribution |
| True talent estimation | Regression to Mean + Bayesian |
| Strategy validation | Monte Carlo + Hypothesis Testing |

## Research Tasks

When learning new concepts, always:
1. Understand the mathematical foundation
2. Find real-world applications
3. Test with historical data
4. Document edge cases and limitations
5. Save insights to memory for future reference
