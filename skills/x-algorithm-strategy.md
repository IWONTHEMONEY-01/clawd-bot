---
name: X Algorithm Strategy
description: Strategy guide based on X's open-sourced recommendation algorithm
version: 1.0
created: 2026-01-22
last_algorithm_check: 2026-01-22
next_check_due: 2026-02-19
algorithm_repo: https://github.com/twitter/the-algorithm
algorithm_ml_repo: https://github.com/twitter/the-algorithm-ml
---

# X Algorithm Strategy Guide for ProphetX

Based on analysis of X's open-sourced recommendation algorithm (last updated Sept 2025).

## Algorithm Architecture Overview

X's recommendation system uses a **multi-stage pipeline**:

1. **Candidate Generation** (~50% in-network from followed accounts, 50% out-of-network discovery)
2. **Light Ranking** - Initial filtering by search-index model
3. **Heavy Ranking** - Neural network scores each candidate post
4. **Filtering & Mixing** - Visibility filters + final feed construction

### Key ML Components
- **SimClusters**: Community detection (sparse embeddings) - groups users into interest communities
- **TwHIN**: Dense knowledge graph embeddings for users and posts
- **Real-Graph**: Predicts user-to-user interaction likelihood
- **Tweepcred**: PageRank-based user reputation scoring
- **Heavy Ranker**: Grok-based transformer predicting engagement probabilities

---

## Ranking Signals (Priority Order)

### 1. REPLIES (Highest Weight)
Replies are the **most important signal** in the ranking formula. The algorithm heavily weights:
- Reply count
- Reply velocity (replies in first 30 minutes)
- Quality of repliers (high-reputation accounts)

**ProphetX Strategy:**
- Prompt replies with questions in posts ("Who's winning tonight?", "What's your prediction?")
- Use alliance engagement to seed early replies on key posts
- Account Managers should reply to own posts from other ProphetX accounts

### 2. RETWEETS
Second most weighted engagement action.

**ProphetX Strategy:**
- Create highly retweetable content (hot takes, stat nuggets, breaking news)
- Alliance engagement for retweet amplification within first 10 minutes
- Time posts around game events when retweet velocity peaks

### 3. LIKES
Third most weighted, but still significant.

**ProphetX Strategy:**
- Likes are the "minimum viable engagement"
- Auto-like strategy should focus on accounts likely to reciprocate
- Alliance like loops amplify post visibility

### 4. DWELL TIME (Implicit Signal)
The algorithm tracks how long users pause on posts while scrolling. **You don't need to click or like** - just reading trains the model.

**ProphetX Strategy:**
- Longer, more engaging posts that hold attention
- Use images/videos to increase pause time
- Thread format keeps users dwelling longer

### 5. PROFILE VISITS & CLICKS
Clicking into a conversation and staying 2+ minutes is a predicted action.

**ProphetX Strategy:**
- Write posts that encourage clicking to see full thread
- "Thread coming..." posts drive profile visits
- Link to previous related posts in replies

---

## Negative Signals (Avoid These)

| Signal | Impact | Mitigation |
|--------|--------|------------|
| "Not interested" taps | High negative weight | Don't spam unrelated niches |
| Mutes | Moderate negative | Vary content types |
| Blocks | High negative | Stay on-brand, avoid controversy |
| Reports | **Largest negative weight** | Content safety filtering critical |

**ProphetX Strategy:**
- Safety filter must catch anything reportable
- Never engage with controversial topics
- Keep content strictly sports/betting focused

---

## Author Diversity Scorer

The algorithm **attenuates scores when the same author appears multiple times** in a feed batch. Each additional post from you in a single refresh gets progressively discounted.

**ProphetX Implications:**
- Posting 10 times in an hour won't get 10x visibility
- Space posts 2-4 hours apart for maximum individual post visibility
- Use multiple accounts (alliance) to get more total ProphetX visibility

---

## Content Type Performance

### Native Video: 10x Engagement
Native video receives approximately **10x more engagement** than text-only posts. Video uploaded directly to X performs dramatically better than linked YouTube videos.

**ProphetX Strategy:**
- Upload videos directly to X, never link from YouTube
- Short clips (15-60 seconds) of game highlights, predictions, reactions
- Use video for key announcements

### Images
2-3x engagement boost over text-only.

**ProphetX Strategy:**
- Always include an image when possible
- Stats graphics, team logos, player photos
- Custom branded templates for consistency

### Text-Only
Lowest baseline but can still perform with high engagement.

**ProphetX Strategy:**
- Reserve for hot takes and breaking news where speed matters
- Use for questions that prompt replies

---

## Engagement Velocity Windows

The algorithm weighs **real-time engagement velocity** heavily, especially in the first 30 minutes.

### Critical Window: 0-30 Minutes
- Alliance engagement should happen within 5 minutes
- Push notifications for viral comment opportunities
- Account Managers should monitor for immediate response

### Secondary Window: 30-120 Minutes
- Still important for sustained visibility
- Follow-up engagement continues to boost

### After 2 Hours
- Diminishing returns on engagement
- Focus shifts to next post

---

## Tweepcred (Reputation Score)

Based on PageRank algorithm - measures account authority.

**Factors that increase Tweepcred:**
- Followers with high Tweepcred following you
- Engagement from high-reputation accounts
- Consistent, quality posting history
- Account age and verification status

**ProphetX Strategy:**
- Target follows from verified accounts and sports journalists
- Engage with high-authority accounts (reply to their posts)
- Alliance structure should include some higher-authority accounts

---

## Real-Graph (Interaction Prediction)

Predicts likelihood of User A interacting with User B based on:
- Previous interactions between users
- Mutual follows
- Similar engagement patterns
- Community overlap

**ProphetX Strategy:**
- Consistent engagement with target accounts builds prediction score
- Follow-back targets should be accounts we've engaged with
- Alliance accounts should regularly interact to strengthen network

---

## SimClusters (Community Detection)

Groups users into interest communities. Being strongly associated with a community increases visibility to that community.

**ProphetX Strategy:**
- Each account should be deeply embedded in its sports niche
- Use niche-specific hashtags consistently
- Engage primarily with same-niche accounts
- Avoid diluting niche by posting off-topic content

---

## Optimal Posting Strategy

### Timing
- Post during "active hours" for account's timezone
- Avoid posting during configured quiet hours
- Peak times: 30 minutes before games, during games, immediately after games

### Frequency
- 2-4 posts per day per account (quality over quantity)
- Space posts 2-4 hours apart
- Increase frequency on game days for relevant teams

### Content Mix
| Type | Percentage | Purpose |
|------|------------|---------|
| Hot takes/opinions | 30% | Drives replies |
| Stats/insights | 25% | Drives retweets |
| News/updates | 20% | Timely relevance |
| Engagement bait | 15% | Questions, polls |
| ProphetX promotion | 10% | Brand awareness |

---

## Alliance Engagement Protocol

Based on algorithm's weighting of early engagement velocity:

### Immediate (0-2 minutes)
1. Post goes live from Account A
2. Accounts B, C, D like immediately (staggered 10-30 seconds)

### Fast (2-5 minutes)
3. Accounts B, C reply with relevant comments
4. Account A replies to create conversation

### Amplification (5-10 minutes)
5. Accounts with highest Tweepcred retweet
6. Additional alliance accounts engage

### Safeguards
- Randomize which accounts engage first (avoid patterns)
- Never have same accounts always first
- Skip some posts to appear natural
- Use different comment styles per account

---

## Follow/Unfollow Optimization

### Who to Follow (Algorithm-Informed)
1. **Active engagers** - Accounts that reply/retweet frequently (likely to reciprocate)
2. **Niche community members** - Strengthens SimClusters association
3. **High Tweepcred accounts** - Boosts your own reputation if they follow back
4. **Accounts with favorable following/follower ratio** - More likely to follow back

### Follow Timing
- Spread across active hours (not overnight)
- 10 per 10-minute window maximum
- 400 per day maximum
- Don't follow during quiet hours

### Unfollow Strategy
- Wait 7 days for follow-back
- Whitelist high-value accounts regardless of follow-back
- Unfollow at same rate as follows

---

## Viral Comment Strategy

Based on algorithm's reply weighting:

### Opportunity Detection
1. Monitor trending posts in account's niche
2. Identify posts with high engagement velocity
3. Look for posts from high Tweepcred accounts

### Timing
- Earlier comments get more visibility
- First 100 replies get most algorithmic boost
- Aim to comment within 15 minutes of viral detection

### Comment Quality
- Add value (insight, humor, relevant stat)
- Don't just agree or use generic responses
- Include relevant hashtags sparingly

---

## Content Safety for Algorithm

The algorithm's Trust & Safety models detect:
- NSFW content
- Abusive content
- Policy violations

**Reports have the LARGEST negative weight** in ranking.

### Safety Filter Requirements
- Block all slurs and hate speech
- Block gambling addiction triggers ("problem gambling", "lost it all")
- Block ProphetX negative sentiment
- Block political/controversial topics
- AI tone check for subtle issues

---

## Metrics to Track (Algorithm-Aligned)

| Metric | Why It Matters |
|--------|----------------|
| Reply rate | Highest-weighted signal |
| Engagement in first 30 min | Velocity window |
| Profile visits | Indicates content interest |
| Follower growth | Tweepcred improvement |
| Avg dwell time (if available) | Implicit interest signal |

---

## Algorithm Update Monitoring

**Schedule:** Check every 4 weeks

**What to Monitor:**
1. https://github.com/twitter/the-algorithm - commits and changes
2. https://github.com/twitter/the-algorithm-ml - ML model updates
3. X engineering blog posts
4. Industry analysis of algorithm changes

**Next Review Due:** 2026-02-19

### Recent Changes (as of Jan 2026)
- Grok-based transformer now used for Heavy Ranker
- Video weighting increased to ~10x text
- Author Diversity Scorer actively penalizes post flooding

---

## Quick Reference Card

### DO
- Reply prompts in posts
- Native video uploads
- Post timing around events
- Alliance engagement within 5 minutes
- Deep niche focus
- Space posts 2-4 hours apart
- Target high-Tweepcred follows

### DON'T
- Flood timeline (diversity penalty)
- Link external videos
- Post off-topic content
- Same accounts always engage first
- Ignore safety filtering
- Post during quiet hours
- Generic AI-sounding content

---

## Implementation Checklist for ProphetX

- [ ] Update post composer to encourage reply-prompting questions
- [ ] Implement alliance engagement queue with staggered timing
- [ ] Add video upload prioritization in content calendar
- [ ] Configure 2-4 hour spacing recommendation
- [ ] Build viral comment opportunity detection
- [ ] Track engagement velocity in first 30 minutes
- [ ] Add Tweepcred-like scoring for follow targets
- [ ] Monthly algorithm update check calendar event
