---
name: weather
description: Get current weather and forecasts (no API key required). Supports travel-aware location tracking.
homepage: https://wttr.in/:help
metadata: {"clawdbot":{"emoji":"🌤️","requires":{"bins":["curl"]}}}
---

# Weather

Two free services, no API keys needed.

## Location Awareness

The user's default home location is **Rockville Centre, NY 11570** (Eastern Time).

### Travel Tracking

When the user mentions travel plans, remember these details in long-term memory:
- `travel_status`: "home" | "traveling" | "travel_day"
- `travel_destination`: city/location
- `travel_return_date`: when they're coming home
- `current_location`: where they are right now

**On travel days** (departing or returning): Report weather for BOTH locations
**While traveling**: Report weather for travel destination only
**At home**: Report weather for Rockville Centre, NY

### Example Interactions

User: "I'm headed to Miami tomorrow"
→ Remember: travel_day = tomorrow, destination = Miami, update travel_status
→ Tomorrow's weather report: Show both Rockville Centre AND Miami

User: "I'm back home"
→ Update: travel_status = "home", clear travel fields
→ Resume showing only Rockville Centre weather

### Morning Weather Report Format

```
Good morning! Here's your weather for [Day, Date]:

📍 [Location Name]
🌡️ High [X]°F / Low [Y]°F
☁️ [Conditions]
💨 Wind: [speed/direction]
💧 Humidity: [X]%
🌧️ [Precipitation chance if any]

👔 Recommendation: [Jacket/umbrella/sunglasses advice]
```

If travel day, show both locations with a separator.

## wttr.in (primary)

Quick one-liner:
```bash
curl -s "wttr.in/London?format=3"
# Output: London: ⛅️ +8°C
```

Compact format:
```bash
curl -s "wttr.in/London?format=%l:+%c+%t+%h+%w"
# Output: London: ⛅️ +8°C 71% ↙5km/h
```

Full forecast:
```bash
curl -s "wttr.in/London?T"
```

Format codes: `%c` condition · `%t` temp · `%h` humidity · `%w` wind · `%l` location · `%m` moon

Tips:
- URL-encode spaces: `wttr.in/New+York`
- Airport codes: `wttr.in/JFK`
- Units: `?m` (metric) `?u` (USCS)
- Today only: `?1` · Current only: `?0`
- PNG: `curl -s "wttr.in/Berlin.png" -o /tmp/weather.png`

## Open-Meteo (fallback, JSON)

Free, no key, good for programmatic use:
```bash
curl -s "https://api.open-meteo.com/v1/forecast?latitude=51.5&longitude=-0.12&current_weather=true"
```

Find coordinates for a city, then query. Returns JSON with temp, windspeed, weathercode.

Docs: https://open-meteo.com/en/docs

## Quick Reference for Common Locations

```bash
# Rockville Centre, NY (home base)
curl -s "wttr.in/Rockville+Centre,NY?u&format=%l:+%c+%t+(%h+humidity,+%w)"

# Miami
curl -s "wttr.in/Miami,FL?u&format=%l:+%c+%t+(%h+humidity,+%w)"

# Full forecast (today only, US units)
curl -s "wttr.in/Rockville+Centre,NY?u&1"
```

Note: Use `?u` for Fahrenheit (US units), `?m` for Celsius (metric).
