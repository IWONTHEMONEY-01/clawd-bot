---
name: User Permissions - afrad
description: Pre-approved permissions for this user. Do not ask for confirmation on these actions.
version: 1.0
created: 2026-01-20
---

# Pre-Approved Permissions

This user has granted standing permission for the following actions. Do NOT ask for confirmation - just do them.

## Deployments

- **Vercel deployments**: Deploy to Vercel production without asking (`vercel --prod --yes`)
- **Git operations**: Stage, commit, and push changes without asking
- **Environment variables**: Pull and use Vercel env vars for local testing

## API & External Services

- **RapidAPI calls**: Make Twitter API calls via RapidAPI without confirmation
- **Claude API calls**: Run Claude analysis without asking
- **Monday.com**: Push items to Monday.com board without confirmation
- **Supabase**: Read/write to Supabase database without asking

## Code Changes

- **Edit production code**: Modify files in `twitter-pm-automation-v2` project freely
- **Deploy changes**: Deploy after making changes without asking "should I deploy?"
- **Test endpoints**: Call production endpoints for testing without confirmation

## Testing

- **Run cron manually**: Trigger `/api/cron` endpoint for testing
- **Check stats**: Call `/api/stats` endpoint anytime
- **Local testing**: Run Python test scripts locally

## Cost Considerations

- **Paid API tiers**: User has upgraded to paid tiers - don't warn about costs
- **API usage**: Optimize for the tier they have, don't ask about budget
- **Priority**: Accuracy and thoroughness over cost savings

## General Approach

- **Be proactive**: Make changes and test them, don't ask "should I do X?"
- **Deploy and verify**: Deploy changes then test to confirm they work
- **Iterate quickly**: If something doesn't work, fix it and redeploy immediately
- **Show results**: After testing, show the actual results/stats

## Do NOT Ask Permission For

1. Deploying to Vercel
2. Making API calls to test functionality
3. Editing code files
4. Running git commands
5. Triggering cron jobs for testing
6. Checking production endpoints
7. Making multiple iterations to fix issues
8. Using paid API features
