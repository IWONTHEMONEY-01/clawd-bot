---
name: restaurant-reservations
description: Find restaurants, check availability on OpenTable/Resy, and get direct booking links. User completes final reservation. Triggers: find restaurant, book dinner, reservation, table for.
homepage: https://www.opentable.com
metadata: {"clawdbot":{"emoji":"🍽️","requires":{"tools":["web_search","web_fetch"]},"optional":{"bins":["goplaces"],"env":["GOOGLE_PLACES_API_KEY"]}}}
---

# Restaurant Reservations

Find restaurants, check real-time availability, and provide direct links for the user to complete reservations on OpenTable or Resy.

## Important Notes

- This skill helps **discover** restaurants and **check availability** only
- The user must complete the final booking themselves (TOS compliant)
- Always provide direct links to reservation pages
- If browser tool is available, offer to navigate to the booking page

## Workflow

### 1. Understand the Request

Extract these details from the user's message:
- **Location**: City, neighborhood, or "near me"
- **Date/Time**: When they want to dine
- **Party size**: Number of guests (default: 2)
- **Cuisine**: Type of food (optional)
- **Price range**: Budget level (optional)
- **Special requirements**: Outdoor seating, private dining, etc.

Example prompts:
- "Find me a table for 4 at an Italian restaurant in SoHo tomorrow at 7pm"
- "What's available at Carbone tonight?"
- "Book dinner near me this Saturday"

### 2. Find Restaurants

**Option A: Web Search (always available)**
```
web_search: "best [cuisine] restaurants [location] OpenTable reservations"
web_search: "[restaurant name] [city] reservations"
web_search: "[restaurant name] Resy OR OpenTable"
```

**Option B: goplaces CLI (if available)**
```bash
goplaces search "italian restaurant" --lat 40.7128 --lng -74.0060 --radius-m 2000 --min-rating 4 --limit 10 --json
```

### 3. Check Availability

**OpenTable Availability Check**

Use web_fetch to check availability on OpenTable:
```
web_fetch: https://www.opentable.com/s?dateTime=2025-01-25T19%3A00&covers=2&term=[restaurant-name]&queryUnderstandingType=none
prompt: "Find restaurants matching [name] and their available time slots for [party size] on [date]"
```

Direct restaurant page (if you have the slug):
```
web_fetch: https://www.opentable.com/r/[restaurant-slug]
prompt: "What reservation times are available for [party size] on [date] at [time]?"
```

**Resy Availability Check**

Use web_fetch to check Resy pages:
```
web_fetch: https://resy.com/cities/[city]/venues/[restaurant-slug]
prompt: "What reservation slots are available? List all available times for [date]"
```

Search on Resy:
```
web_fetch: https://resy.com/cities/[city]?date=[YYYY-MM-DD]&seats=[party-size]
prompt: "Find [restaurant name] and list available reservation times"
```

### 4. Present Results

Format availability clearly:

```
## [Restaurant Name]
Rating: 4.7 | $$$ | Italian | SoHo

Available times for [Date], party of [N]:
- 6:30 PM
- 7:00 PM
- 7:30 PM
- 9:15 PM

Book now: [Direct link to reservation page]
```

### 5. Provide Booking Links

Always give the user direct links to complete the reservation:

**OpenTable direct booking URL format:**
```
https://www.opentable.com/r/[restaurant-slug]?dateTime=[YYYY-MM-DDTHH:MM]&covers=[party-size]&restref=[restaurant-id]
```

**Resy direct booking URL format:**
```
https://resy.com/cities/[city]/venues/[restaurant-slug]?date=[YYYY-MM-DD]&seats=[party-size]
```

### 6. Browser Navigation (Optional)

If the user wants help navigating to the booking page:

```
browser_navigate: [reservation URL]
```

Then describe what they see and guide them through the booking process.

## Common Cities (Resy URL slugs)

- New York: `ny/new-york`
- Los Angeles: `la/los-angeles`
- San Francisco: `sf/san-francisco`
- Chicago: `chi/chicago`
- Miami: `mia/miami`
- London: `ldn/london`
- Austin: `atx/austin`

## Handling No Availability

If no slots available at requested time:
1. Suggest alternative times (earlier/later)
2. Suggest alternative dates
3. Offer to check waitlist/notify options
4. Suggest similar restaurants with availability

## Example Conversation

**User**: "Find me a table at Carbone in NYC for Saturday at 7pm, party of 4"

**Assistant**:
1. Search for Carbone NYC on OpenTable and Resy
2. Check availability for Saturday, 4 guests, around 7pm
3. Report: "Carbone is fully booked at 7pm, but I found these options:"
   - 5:30 PM available on Resy
   - 9:30 PM available on Resy
4. Provide direct Resy link: `https://resy.com/cities/ny/venues/carbone?date=2025-01-25&seats=4`
5. Offer alternatives: "Would you like me to check similar Italian restaurants with 7pm availability?"

## Tips

- Popular restaurants book weeks in advance - suggest checking multiple dates
- Some restaurants release tables at specific times (e.g., midnight for next month)
- Resy often has exclusive restaurants not on OpenTable
- Bar seating usually has more availability than dining room
- Lunch reservations are typically easier to get than dinner
