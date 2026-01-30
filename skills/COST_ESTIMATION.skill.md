---
name: cost-estimation
description: Always provide cost estimates and tier recommendations when building with APIs, databases, or purchasing software
---

# Cost Estimation Rule

**MANDATORY:** When building anything that involves APIs, databases, or software purchases, ALWAYS provide cost analysis before proceeding.

## When This Rule Applies

This rule is triggered when:
- Integrating any external API
- Setting up or recommending databases
- Suggesting software tools or services
- Building features that consume metered resources
- Deploying to cloud platforms

## Required Cost Analysis

### 1. API Cost Breakdown

For EVERY API integration, provide:

```
API: [Service Name]
-----------------------------------
Free Tier:
- Limits: [requests/month, rate limits]
- Features included: [list]
- Suitable for: [use case]

Recommended Tier: [Tier Name] - $X/month
- Why: [justification based on expected usage]
- Limits: [requests/month, rate limits]
- Features: [what's included]

Cost Projection:
- Estimated usage: [X calls/day × 30 = Y calls/month]
- Cost per request: $X.XX (if applicable)
- Monthly estimate: $XX - $XXX
- Annual estimate: $XXX - $X,XXX

Overage Warning:
- Overage rate: $X per 1,000 requests
- Budget alert threshold recommendation: $XX
```

### 2. Database Cost Analysis

For database recommendations:

```
Database: [Service Name]
-----------------------------------
Free Tier:
- Storage: [X GB]
- Connections: [X concurrent]
- Bandwidth: [X GB/month]
- Suitable for: [use case]

Recommended Tier: [Tier Name] - $X/month
- Why: [based on data volume, query frequency, scaling needs]
- Storage: [X GB included]
- Connections: [X concurrent]
- Bandwidth: [X GB included]

Growth Projection:
- Current data estimate: [X GB]
- Monthly growth rate: [X GB/month]
- Upgrade trigger: [When to move to next tier]

Hidden Costs:
- Backups: $X/month
- Replicas: $X/month (if needed)
- Egress: $X per GB over limit
```

### 3. Software/Tool Costs

For any recommended software:

```
Tool: [Name]
-----------------------------------
Pricing Model: [Per seat / Usage-based / Flat rate]

Options:
1. Free: [limitations]
2. [Tier 1]: $X/month - [features]
3. [Tier 2]: $X/month - [features]

Recommendation: [Tier] - $X/month
Reason: [why this tier fits the use case]

Alternatives Considered:
- [Alt 1]: $X/month - [why not chosen]
- [Alt 2]: $X/month - [why not chosen]
```

### 4. Total Cost Summary

Always end with a summary table:

```
TOTAL ESTIMATED COSTS
================================================
Component           | Monthly    | Annual
--------------------|------------|-------------
[API 1]             | $XX        | $XXX
[API 2]             | $XX        | $XXX
[Database]          | $XX        | $XXX
[Hosting]           | $XX        | $XXX
[Tools]             | $XX        | $XXX
--------------------|------------|-------------
TOTAL               | $XXX       | $X,XXX

Budget Recommendation: $XXX/month (includes 20% buffer)
```

## Tier Recommendation Logic

When recommending tiers, consider:

1. **Current needs** - What's required today
2. **Growth trajectory** - Expected scaling over 6-12 months
3. **Buffer room** - 20-30% headroom to avoid overage charges
4. **Cost efficiency** - Sometimes higher tier is cheaper than overages
5. **Feature requirements** - Don't pay for unused features

**Decision Framework:**
```
IF expected_usage < free_tier_limit * 0.7:
    Recommend: Free Tier

ELIF expected_usage < paid_tier_limit * 0.8:
    Recommend: Lowest paid tier that fits

ELSE:
    Recommend: Next tier up (avoid overage fees)
```

## Cost Optimization Tips

Always include relevant tips:

- **Caching strategies** that reduce API calls
- **Batch operations** to minimize request counts
- **Off-peak pricing** if applicable
- **Committed use discounts** for stable workloads
- **Alternative services** that might be cheaper

## Warning Flags

Raise alerts for:

- Usage-based pricing with no caps
- Per-seat pricing that scales poorly
- Data egress fees (common hidden cost)
- Features that require enterprise tier
- Vendor lock-in concerns

## Example Output

When asked "Let's build a Twitter monitoring tool":

```
COST ANALYSIS: Twitter Monitoring Tool
======================================

1. Twitter API (via RapidAPI - Twitter154)
   Free Tier: 100 requests/day
   Basic ($10/mo): 10,000 requests/month
   Pro ($35/mo): 50,000 requests/month

   Recommendation: Basic ($10/mo)
   - 5 searches × 4 times/day = 20 requests/day = 600/month
   - Well within Basic limits with room to grow

2. Supabase (Database)
   Free Tier: 500MB, 2 connections
   Pro ($25/mo): 8GB, unlimited connections

   Recommendation: Free Tier (for now)
   - Tweet data ~1KB per record
   - 500MB = ~500,000 tweets storage
   - Upgrade when reaching 400MB

3. Claude API (AI Analysis)
   Per-token pricing: ~$0.003/1K input, $0.015/1K output

   Estimate: 100 analyses/day × $0.02 = $2/day = $60/month

4. Vercel (Hosting)
   Hobby: Free
   Pro ($20/mo): Team features, more bandwidth

   Recommendation: Hobby (Free) for MVP

TOTAL MONTHLY COST
==================
Twitter API:  $10
Supabase:     $0 (free tier)
Claude API:   $60
Hosting:      $0 (free tier)
--------------------------
TOTAL:        $70/month
Buffer (20%): $84/month recommended budget
```

---

**Rule Priority:** HIGH - Cost analysis must be provided BEFORE implementation begins.

**Source:** User requirement for informed decision-making on all builds
