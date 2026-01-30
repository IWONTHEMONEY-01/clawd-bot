---
name: database-api-integration-best-practices
description: Prevent common bugs in database operations, API integrations, and data handling based on real production debugging experience
---

# Database and API Integration Best Practices

Critical patterns for preventing TypeErrors, database schema errors, API label mismatches, and data type conversion bugs.

## 1. None-Safe String Operations

**ALWAYS use this pattern for strings from databases or APIs:**

```python
# ❌ CRASHES on None
len(tweet_text)
tweet_text[:500]
tweet_text.strip()

# ✅ SAFE - handles None
len(tweet_text or '')
(tweet_text or 'N/A')[:500]
(tweet_text or '').strip()
```

**Rule:** Before ANY string operation (len, slice, method), wrap with `or ''` or `or 'default'`

**Error prevented:** `TypeError: 'NoneType' object has no len()` / `is not subscriptable`

## 2. Database Column Verification

**BEFORE deploying code that writes new columns:**

```python
# Step 1: List all columns you're writing to
columns_to_write = ['reasoning', 'platforms_used', 'trading_topics']

# Step 2: Verify schema
# PostgreSQL/Supabase:
query = """
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'your_table_name';
"""

# Step 3: Test write with try/except
try:
    supabase.table('table').update({'new_column': 'test'}).eq('id', 1).execute()
except Exception as e:
    print(f"Column doesn't exist: {e}")
```

**Rule:** Never assume columns exist. Query schema or test first.

**Error prevented:** `Could not find the 'column_name' column`

## 3. PostgreSQL Array Type Conversion

**PostgreSQL array columns require Python lists, not strings:**

```python
# ❌ WRONG - sends string
update_data['platforms_used'] = "Polymarket, Kalshi"

# ✅ CORRECT - converts to list
def convert_to_array(value):
    if value and isinstance(value, str):
        return [item.strip() for item in value.split(',') if item.strip()]
    elif value and isinstance(value, list):
        return value
    else:
        return None

platforms_used = convert_to_array(analysis.get('platforms_used'))
update_data['platforms_used'] = platforms_used
```

**Rule:** For PostgreSQL array columns, ALWAYS convert comma-separated strings to Python lists.

**Error prevented:** `malformed array literal: "value"`

## 4. External API Label Verification

**NEVER assume generic labels work. Get exact values from API:**

```python
# Step 1: Test with sample value
response = api.create_item(status="Tool")

# Step 2: Read error for valid options
if 'errors' in response:
    print(response['errors'])
    # Output: "possible statuses are: {0: PM Trader, 1: PM Tool}"

# Step 3: Use EXACT labels
response = api.create_item(status="PM Tool")  # Match exactly
```

**Rule:** Check API docs or error messages for exact label values. Don't guess.

**Error prevented:** `This status label doesn't exist` / 400/422 errors

## 5. Rate Limit Budget Calculation

**BEFORE changing API call frequency:**

```python
# Calculate total daily calls
current_daily_calls = runs_per_day × calls_per_run
# Example: 4 runs × 5 keywords = 20 calls/day

# Check API limits
# Twitter: 180 requests per 15-minute window
# Per-hour budget: 180 / 4 = 45 requests/hour

# Proposed change
new_daily_calls = 8 runs × 5 keywords = 40 calls/day
# ⚠️ More concentrated - might hit 15-min window limit

# Adjusted
optimal_daily_calls = 8 runs × 3 keywords = 24 calls/day
# ✅ Spread across more windows, same total volume
```

**Rule:** Calculate `total_daily_calls = runs × calls_per_run`. Leave 20-30% buffer. Check per-window limits.

**Error prevented:** `429 Too Many Requests`

## 6. AI Prompt Field Completeness

**When extracting structured data from AI, specify EVERY field:**

```python
# ❌ WRONG - vague prompt
prompt = "Analyze this account and return JSON"

# ✅ CORRECT - explicit fields and formats
prompt = f"""
Analyze account and return JSON with EXACTLY these fields:

{{
    "type": "tool" or "trader" or "other",
    "category": "category name" or null,
    "platforms_used": "comma-separated platforms" or null,
    "trading_topics": "comma-separated topics" or null,
    "is_sports_focused": true or false,
    "reasoning": "1-2 sentence explanation"
}}

Rules:
- Return null for missing data (not empty string)
- For arrays, use comma-separated strings
- Include reasoning field explaining your decision
"""

# Validate response
required_keys = ['type', 'category', 'reasoning']
for key in required_keys:
    if key not in response:
        raise ValueError(f"Missing required field: {key}")
```

**Rule:** List ALL fields with exact types. Validate response has all keys.

**Error prevented:** Missing fields, inconsistent data, incomplete analysis

## 7. Execution Order: Guaranteed Work First

**Prioritize operations by failure probability:**

```python
# ✅ CORRECT order
def run_automation():
    # 1. Database operations (fast, reliable)
    cached_profiles = db.get_cached_profiles()

    # 2. AI analysis (reliable, has quota)
    analyzed = analyze_with_ai(cached_profiles)

    # 3. Save results
    save_to_database(analyzed)

    # 4. External API calls (can fail, fail fast)
    new_profiles = twitter_search()  # Might hit rate limit
    if not new_profiles:
        return  # Don't waste time on failed searches

    analyzed_new = analyze_with_ai(new_profiles)
    save_to_database(analyzed_new)

# ❌ WRONG order - does risky work first
def run_automation_wrong():
    new_profiles = twitter_search()  # Can fail
    analyzed = analyze_with_ai(new_profiles)  # Wasted if search failed

    cached = db.get_cached_profiles()  # Should do this first
```

**Rule:** Database ops → AI analysis → Save → External API calls. Fail fast on rate limits.

**Error prevented:** Wasted API quota, unnecessary failures

## 8. Model Version Currency

**Check model versions before deploying:**

```python
# ❌ WRONG - hardcoded old version
model = "claude-3-5-sonnet-20241022"  # October 2024

# ✅ CORRECT - env variable + validation
import os

MODEL = os.getenv('CLAUDE_MODEL', 'claude-sonnet-4-5-20250929')  # Jan 2025

# Validate model exists
try:
    client.messages.create(
        model=MODEL,
        max_tokens=10,
        messages=[{"role": "user", "content": "test"}]
    )
except Exception as e:
    print(f"❌ Model {MODEL} not found: {e}")
    print("Check docs.anthropic.com for latest model IDs")
```

**Rule:** Use environment variables for model IDs. Test before deploying. Check docs for latest versions.

**Error prevented:** `404 model not found`

---

## Pre-Deployment Checklist

**Database Operations:**
- [ ] All columns exist in schema (query to verify)
- [ ] Data types match (strings, arrays, JSON)
- [ ] None-safe operations on all string fields

**API Integration:**
- [ ] Exact labels/statuses from API docs or error messages
- [ ] Rate limit budget calculated: `runs × calls_per_run`
- [ ] 429 error handling implemented

**AI/LLM:**
- [ ] Model version is current (check API docs)
- [ ] All required fields explicitly listed in prompt
- [ ] Response validation checks all keys present

**Data Handling:**
- [ ] PostgreSQL arrays: comma-separated → Python list
- [ ] None handling: `value or ''` for strings
- [ ] Type validation on external data

---

## Error → Solution Map

| Error | Solution | Skill |
|-------|----------|-------|
| `TypeError: 'NoneType' has no len()` | Use `len(value or '')` | #1 |
| `Column 'x' not found` | Query schema before writing | #2 |
| `malformed array literal` | Convert string to list for arrays | #3 |
| `This label doesn't exist` | Get exact labels from API | #4 |
| `429 Too Many Requests` | Calculate rate limit budget | #5 |
| Missing AI response fields | Specify all fields in prompt | #6 |
| Wasted API calls | Do guaranteed work first | #7 |
| `404 model not found` | Update model version | #8 |

---

## Real Production Example

**Problem:** Twitter PM automation crashed with multiple errors

**Bugs found:**
1. `len(tweet_text)` crashed when tweet_text was None
2. Monday.com rejected "Tool" label (expected "PM Tool")
3. Supabase rejected string "Polymarket" for array column
4. Claude model 404 error (outdated version)
5. Missing reasoning field in Claude prompt

**Applied fixes using these skills:**
- Skill #1: Changed to `len(tweet_text or '')`
- Skill #4: Changed "Tool" to "PM Tool" (exact match)
- Skill #3: Converted "Polymarket, Kalshi" → ["Polymarket", "Kalshi"]
- Skill #8: Updated to claude-sonnet-4-5-20250929
- Skill #6: Added reasoning field to Claude prompt JSON

**Result:** 100% success rate (5/5 profiles analyzed, 0 failures)

---

**Source:** Production debugging session for Twitter PM Research Automation (2026-01-19)
**Success metrics:** 0% → 100% success rate after applying these patterns
