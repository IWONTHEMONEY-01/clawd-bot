---
name: research-coordinator
description: Coordinate learning across probability, sports analytics, betting, quant trading, and market making. Manage research tasks, capture insights, and build tools.
homepage: https://github.com
metadata: {"clawdbot":{"emoji":"🧠","requires":{"tools":["web_search","web_fetch","memory"]}}}
---

# Research Coordinator

Orchestrate learning across quantitative domains. Capture insights, track progress, and build tools.

## Domains & Skills

| Domain | Skill | Focus |
|--------|-------|-------|
| Foundation | probability-statistics | Math, distributions, testing |
| Analytics | sports-analytics | Sabermetrics, advanced stats |
| Betting | sports-betting | Odds, value, bankroll |
| Trading | quant-trading | Strategies, signals, backtesting |
| Liquidity | market-making | Spreads, inventory, execution |

## Research Workflow

### 1. Topic Selection
When user asks to learn something or you identify a knowledge gap:

```
Categories:
- CONCEPT: Fundamental theory to understand
- METRIC: Statistical measure to learn
- STRATEGY: Trading/betting approach
- TOOL: Something to build
- DATA: Source to integrate
```

### 2. Deep Research
```
For each topic:
1. Web search for authoritative sources
2. Find academic papers if applicable
3. Look for practical implementations
4. Identify edge cases and limitations
5. Find real-world examples
```

### 3. Knowledge Capture
After researching, ALWAYS save to memory:

```
memory_save({
  category: "quant_research",
  topic: "[topic name]",
  domain: "[probability|analytics|betting|trading|market-making]",
  summary: "[2-3 sentence summary]",
  key_points: ["point 1", "point 2", "point 3"],
  formulas: ["formula 1", "formula 2"],
  applications: ["how to use this"],
  sources: ["url1", "url2"],
  confidence: "high|medium|low",
  next_steps: ["what to research next"]
})
```

### 4. Connect Knowledge
Link new learning to existing knowledge:
- How does this relate to other concepts?
- Does this change any previous understanding?
- What strategies does this enable?

---

## Research Priorities

### Phase 1: Foundations (Current)
- [ ] Complete probability theory review
- [ ] Master expected value calculations
- [ ] Understand Kelly criterion deeply
- [ ] Learn Bayesian updating

### Phase 2: Sports Analytics
- [ ] Deep dive into xG models (soccer)
- [ ] EPA/CPOE for NFL
- [ ] wOBA/FIP for MLB
- [ ] RAPTOR for NBA
- [ ] Build basic projection models

### Phase 3: Betting Markets
- [ ] Odds API integration
- [ ] Line movement analysis
- [ ] CLV tracking system
- [ ] Value detection alerts
- [ ] Bankroll simulator

### Phase 4: Quant Trading
- [ ] Momentum strategy implementation
- [ ] Mean reversion signals
- [ ] Backtest framework
- [ ] Risk management system
- [ ] Paper trading setup

### Phase 5: Market Making
- [ ] Spread calculation models
- [ ] Inventory management
- [ ] Adverse selection detection
- [ ] Quote engine design
- [ ] P&L attribution

---

## Tool Building

When knowledge is sufficient, build tools:

### Tool Template
```python
"""
Tool: [Name]
Domain: [betting|trading|analytics]
Purpose: [What it does]
Inputs: [Required data]
Outputs: [What it produces]
"""

def tool_name(inputs):
    # Implementation
    pass
```

### Priority Tools to Build

1. **Odds Converter**
   - American ↔ Decimal ↔ Implied Probability
   - No-vig fair odds calculator

2. **Kelly Calculator**
   - Optimal bet size
   - Fractional Kelly options
   - Multi-bet Kelly

3. **Expected Value Calculator**
   - EV from probability + odds
   - Edge percentage
   - Required win rate

4. **Line Value Finder**
   - Compare odds across books
   - Find best available price
   - Alert on value opportunities

5. **Projection Model**
   - Input: Historical stats
   - Output: Win probability
   - Sport-specific versions

6. **Backtest Engine**
   - Strategy testing framework
   - Performance metrics
   - Visualization

---

## Daily Research Routine

When activated for research:

### Morning
1. Check for new academic papers (SSRN, arXiv q-fin)
2. Review overnight market movements
3. Scan sports news for edge opportunities

### Research Session
1. Pick topic from priority list
2. Deep dive (30-60 min equivalent)
3. Capture insights to memory
4. Identify next topic

### Evening
1. Review day's learnings
2. Update research priorities
3. Plan next session

---

## Conversation Patterns

### Learning Request
User: "Teach me about [topic]"
1. Check memory for existing knowledge
2. Research if needed
3. Explain with examples
4. Save new insights
5. Suggest related topics

### Tool Request
User: "Build a [tool] for [purpose]"
1. Clarify requirements
2. Check if prerequisites learned
3. Design approach
4. Implement
5. Test and iterate

### Strategy Discussion
User: "How should I approach [betting/trading scenario]?"
1. Recall relevant knowledge
2. Apply frameworks
3. Calculate if needed
4. Provide recommendation
5. Note caveats and risks

---

## Knowledge Gaps to Fill

Continuously identify and track:

```
Gap: [What we don't know]
Impact: [Why it matters]
Priority: [high|medium|low]
Next Step: [How to fill it]
```

---

## Success Metrics

Track learning progress:

### Quantity
- Topics researched
- Insights captured
- Tools built
- Strategies developed

### Quality
- Accuracy of predictions
- Edge in paper betting
- Backtest performance
- Real-world applicability

### Application
- Questions answered correctly
- Successful tool usage
- Strategy implementation
- User satisfaction

---

## Remember

1. **Always capture insights** - Memory is how we compound learning
2. **Connect domains** - Probability underlies everything
3. **Start simple** - Master basics before advanced
4. **Validate with data** - Theory without testing is speculation
5. **Build tools** - Automate repeated calculations
6. **Stay curious** - New edges emerge from new knowledge
