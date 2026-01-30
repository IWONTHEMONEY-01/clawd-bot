---
name: RapidAPI Twitter Quick Reference
description: Correct endpoints and response structures for RapidAPI Twitter APIs
version: 1.0
created: 2026-01-20
---

# RapidAPI Twitter API Quick Reference

## API Hosts

| Purpose | Host | API Name |
|---------|------|----------|
| Profiles | `twitter-aio.p.rapidapi.com` | Twitter AIO |
| Tweets | `twitter135.p.rapidapi.com` | Twitter135 |
| Search | `twitter135.p.rapidapi.com` | Twitter135 |

## Endpoints

### Get User Profile (Twitter AIO)
```
GET https://twitter-aio.p.rapidapi.com/user/by/username/{username}
```

Response structure:
```python
user_data = response['user']['result']
legacy = user_data['legacy']
core = user_data['core']

profile = {
    'user_id': user_data['rest_id'],  # NUMERIC ID - save this!
    'username': core['screen_name'],
    'name': core['name'],
    'bio': legacy['description'],
    'followers': legacy['followers_count'],
    'following': legacy['friends_count'],
    'verified': user_data['is_blue_verified']
}
```

### Get User Tweets (Twitter135)
```
GET https://twitter135.p.rapidapi.com/v2/UserTweets/
Params: id={numeric_user_id}, count=40
```

**IMPORTANT**: Requires numeric `user_id`, NOT username!

Response parsing:
```python
instructions = (data['data']['user']['result']
               ['timeline_v2']['timeline']
               ['instructions'])

for instruction in instructions:
    if instruction['type'] == 'TimelineAddEntries':
        for entry in instruction['entries']:
            content = entry['content']
            item_content = content['itemContent']
            tweet_results = item_content['tweet_results']
            result = tweet_results['result']
            legacy = result['legacy']

            tweet = {
                'text': legacy['full_text'],
                'likes': legacy['favorite_count'],
                'retweets': legacy['retweet_count']
            }
```

### Search Tweets (Twitter135)
```
GET https://twitter135.p.rapidapi.com/Search/
Params: q={query}, count=20, type=Latest
```

**IMPORTANT**: Endpoint is `/Search/` NOT `/v2/Search/`!

Response parsing:
```python
instructions = (data['data']['search_by_raw_query']
               ['search_timeline']['timeline']
               ['instructions'])

for instruction in instructions:
    if instruction['type'] == 'TimelineAddEntries':
        for entry in instruction['entries']:
            content = entry['content']
            item_content = content['itemContent']
            tweet_results = item_content['tweet_results']
            result = tweet_results['result']

            # Tweet data
            legacy = result['legacy']
            tweet_text = legacy['full_text']

            # User data (included in search results!)
            user_results = result['core']['user_results']['result']
            user_legacy = user_results['legacy']

            account = {
                'tweet_text': tweet_text,
                'username': user_legacy['screen_name'],
                'user_id': user_results['rest_id'],
                'name': user_legacy['name'],
                'followers': user_legacy['followers_count'],
                'bio': user_legacy['description']
            }
```

## Common Mistakes to Avoid

1. **Wrong search endpoint**: `/v2/Search/` returns 404. Use `/Search/`

2. **Username instead of user_id**: Twitter135 UserTweets needs numeric ID
   ```python
   # WRONG
   params = {'username': 'elonmusk'}

   # RIGHT
   params = {'id': '44196397'}  # numeric user_id
   ```

3. **Missing TimelineAddEntries check**: Must find the right instruction type
   ```python
   # WRONG - iterating all instructions
   for instruction in instructions:
       entries = instruction['entries']

   # RIGHT - find TimelineAddEntries first
   for instruction in instructions:
       if instruction.get('type') == 'TimelineAddEntries':
           entries = instruction['entries']
   ```

4. **Not handling empty responses**: API may return structure but no tweets
   ```python
   tweets = []
   # ... parsing logic ...
   if not tweets:
       return fallback_method()
   ```

## Headers Template
```python
headers = {
    'x-rapidapi-host': host,  # Must match the API you're calling
    'x-rapidapi-key': api_key
}
```
