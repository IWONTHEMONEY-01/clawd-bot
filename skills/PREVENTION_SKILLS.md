# Prevention Skills - Best Practices Checklist

These skills prevent common mistakes identified in LESSONS_LEARNED.md. Use this checklist when working on similar projects.

---

## Skill 1: None-Safe String Operations

**When to use:** Any time you work with strings that might be None (database fields, API responses, user input)

**Checklist:**
- [ ] Before using `len()` on a string: `len(value or '')`
- [ ] Before slicing a string: `(value or 'default')[:n]`
- [ ] Before string methods: `(value or '').strip()`, `(value or '').lower()`
- [ ] Use `if value:` not `if value is not None:` for non-empty checks

**Examples:**
```python
# ❌ WRONG - Will crash on None
tweet_text = project.get('tweet_text')
print(f"Length: {len(tweet_text)}")
print(f"First 500 chars: {tweet_text[:500]}")

# ✅ CORRECT - Safe for None
tweet_text = project.get('tweet_text')
print(f"Length: {len(tweet_text or '')}")
print(f"First 500 chars: {(tweet_text or 'N/A')[:500]}")
```

**When you forget:** TypeError: 'NoneType' object has no len() / is not subscriptable

---

## Skill 2: Database Schema Verification

**When to use:** Before deploying code that writes new database columns

**Checklist:**
- [ ] List all columns your code tries to write to
- [ ] Query database schema to verify each column exists
- [ ] Check data types match (especially arrays, JSON, enums)
- [ ] Document required schema changes in README/migration script
- [ ] Test on staging database first

**SQL to check columns:**
```sql
-- PostgreSQL/Supabase
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'your_table_name';
```

**Python check:**
```python
# Verify column exists before writing
try:
    result = supabase.table('pm_projects').select('reasoning').limit(1).execute()
except Exception as e:
    print(f"⚠️ Column 'reasoning' may not exist: {e}")
```

**When you forget:** "Could not find the 'column_name' column" error

---

## Skill 3: External API Label Verification

**When to use:** When integrating with external APIs (Monday.com, status fields, dropdowns)

**Checklist:**
- [ ] Read API documentation for exact label/status values
- [ ] Test API call with sample data to see actual values
- [ ] Check error messages for valid options
- [ ] Don't assume generic labels will work (avoid "Active", "Tool", "Trader")
- [ ] Use exact casing and spacing from API

**Example verification process:**
```python
# 1. First, test what labels are accepted
column_values = json.dumps({
    "status_column_id": {"label": "Tool"}  # Test value
})

response = requests.post(monday_api_url, json=mutation)

# 2. Check error response for valid labels
if 'errors' in response.json():
    print(response.json()['errors'])
    # Example output: "possible statuses are: {0: PM Trader, 1: PM Tool}"

# 3. Update code with exact labels
column_values = json.dumps({
    "status_column_id": {"label": "PM Tool"}  # Exact match
})
```

**When you forget:** "This label doesn't exist" or 400/422 errors from API

---

## Skill 4: PostgreSQL Array Type Handling

**When to use:** When saving to PostgreSQL array columns in Supabase

**Checklist:**
- [ ] Identify array columns in your schema (check data_type = 'ARRAY')
- [ ] Convert comma-separated strings to Python lists
- [ ] Handle empty/null cases explicitly
- [ ] Strip whitespace from list items
- [ ] Test with sample data before deploying

**Conversion pattern:**
```python
# ✅ CORRECT conversion for array columns
def convert_to_array(value):
    """Convert comma-separated string to list for PostgreSQL arrays"""
    if value and isinstance(value, str):
        return [item.strip() for item in value.split(',') if item.strip()]
    elif value and isinstance(value, list):
        return value  # Already a list
    else:
        return None  # Or [] for empty array

# Usage
platforms_used = convert_to_array(analysis.get('platforms_used'))
update_data['platforms_used'] = platforms_used
```

**When you forget:** "malformed array literal" error

---

## Skill 5: Rate Limit Calculation

**When to use:** Before changing API call frequency or volume

**Checklist:**
- [ ] Calculate current daily API calls: `runs_per_day × calls_per_run`
- [ ] Check API rate limits (per minute, per 15min window, per day)
- [ ] Calculate proposed daily calls with new frequency
- [ ] Leave 20-30% buffer for retries/errors
- [ ] Monitor 429 errors after deployment

**Calculation example:**
```python
# Before change
runs_per_day = 4
keywords_per_run = 5
daily_searches = 4 × 5 = 20

# After change proposal
runs_per_day = 8
keywords_per_run = 5
daily_searches = 8 × 5 = 40  # ⚠️ Might hit limits!

# Adjusted
runs_per_day = 8
keywords_per_run = 3
daily_searches = 8 × 3 = 24  # ✅ Similar total, better distribution
```

**Twitter API limits (example):**
- App auth: 180 requests per 15-minute window
- Per run budget: 180 / (4 runs per hour) = 45 requests
- Safe per-run usage: 3-5 keywords (leaving buffer)

**When you forget:** 429 Too Many Requests errors, failed runs

---

## Skill 6: AI Prompt Completeness

**When to use:** When asking AI to extract structured data

**Checklist:**
- [ ] List ALL fields you need extracted
- [ ] Specify exact format for each field (string, number, boolean, array)
- [ ] Provide examples of expected values
- [ ] Specify what to return when field doesn't apply (null, N/A, empty array)
- [ ] Request JSON response with explicit keys

**Template:**
```python
prompt = f"""
Analyze this data and respond in JSON format:

{{
    "required_field_1": "string value",
    "required_field_2": 1-5 or null,
    "array_field": "comma-separated values",
    "boolean_field": true/false
}}

Rules:
- If data unavailable, return null (not empty string)
- For arrays, return comma-separated string
- Be explicit about why you chose each value
"""
```

**Validation:**
```python
# After getting AI response
required_keys = ['required_field_1', 'required_field_2']
for key in required_keys:
    if key not in analysis:
        print(f"⚠️ AI response missing required key: {key}")
```

**When you forget:** Missing fields, inconsistent data types, incomplete analysis

---

## Skill 7: Execution Order Optimization

**When to use:** When designing multi-step workflows with external dependencies

**Checklist:**
- [ ] List all steps in workflow
- [ ] Mark which steps have external dependencies (API calls)
- [ ] Mark which steps are guaranteed to succeed (local operations)
- [ ] Prioritize guaranteed work first
- [ ] Batch operations to minimize round trips
- [ ] Fail fast on rate limits

**Priority order:**
1. **Tier 1:** Local operations (no external calls)
2. **Tier 2:** Cached/stored data operations
3. **Tier 3:** External API calls with high success rate
4. **Tier 4:** External API calls with rate limits/failures

**Example workflow:**
```python
# ✅ CORRECT order
def run_automation():
    # Tier 2: Analyze cached profiles (database read + AI call)
    cached = fetch_cached_profiles()  # Fast database read
    analyzed_cached = analyze_with_claude(cached)  # Guaranteed work
    add_to_monday(analyzed_cached)

    # Tier 4: Twitter search (might fail, fail fast)
    new_profiles = search_twitter()  # Can hit rate limits
    if not new_profiles:
        return  # Fail fast

    analyzed_new = analyze_with_claude(new_profiles)
    add_to_monday(analyzed_new)

# ❌ WRONG order - does uncertain work first
def run_automation_wrong():
    new_profiles = search_twitter()  # Wastes time if it fails
    analyzed_new = analyze_with_claude(new_profiles)

    cached = fetch_cached_profiles()  # Should have done this first
    analyzed_cached = analyze_with_claude(cached)
```

**When you forget:** Wasted API calls, unnecessary failures, poor performance

---

## Skill 8: Model Version Currency Check

**When to use:** When initializing AI/ML API clients

**Checklist:**
- [ ] Check API documentation for latest stable model ID
- [ ] Note model release date vs current date
- [ ] Set model ID as environment variable (not hardcoded)
- [ ] Add comment with model verification date
- [ ] Test API call before deploying to catch deprecation

**Pattern:**
```python
import os
from datetime import datetime

# ✅ CORRECT - Environment variable with fallback
CLAUDE_MODEL = os.getenv(
    'CLAUDE_MODEL',
    'claude-sonnet-4-5-20250929'  # Verified: 2026-01-19
)

# Add validation call
try:
    test_response = client.messages.create(
        model=CLAUDE_MODEL,
        max_tokens=10,
        messages=[{"role": "user", "content": "test"}]
    )
    print(f"✅ Model {CLAUDE_MODEL} is valid")
except Exception as e:
    print(f"❌ Model {CLAUDE_MODEL} failed: {e}")
    print("Check https://docs.anthropic.com/en/docs/models-overview for latest model IDs")
```

**When you forget:** 404 model not found errors

---

## Pre-Deployment Checklist

Use this before pushing code:

### Database Operations
- [ ] All columns exist in schema
- [ ] Data types match (especially arrays, JSON)
- [ ] None/null handling implemented

### External API Integration
- [ ] Exact labels/statuses verified
- [ ] Rate limits calculated
- [ ] Error responses handled gracefully

### AI/LLM Integration
- [ ] Model version is current
- [ ] All required fields in prompt
- [ ] Response validation implemented

### String/Data Handling
- [ ] None-safe operations for all strings
- [ ] Array conversions for PostgreSQL
- [ ] Type validation on user input

### Workflow Design
- [ ] Guaranteed work prioritized first
- [ ] Fail-fast on rate limits
- [ ] Batch operations where possible

---

## When Issues Arise

**Debug Checklist:**
1. ✅ Read error message completely (don't assume)
2. ✅ Check which of these 8 skills applies
3. ✅ Verify assumptions (schema, labels, data types)
4. ✅ Test fix in isolation before deploying
5. ✅ Document the issue in LESSONS_LEARNED.md

**Common Error → Skill Mapping:**
- TypeError (None) → Skill 1
- Column not found → Skill 2
- Invalid label/status → Skill 3
- Malformed array → Skill 4
- 429 Too Many Requests → Skill 5
- Missing AI fields → Skill 6
- Wasted API calls → Skill 7
- 404 Model not found → Skill 8

---

**Last Updated:** 2026-01-19
**Based on:** PM Research Automation debugging session
**Success Rate After Applying Skills:** 100% (5/5 profiles analyzed, 0 failures)
