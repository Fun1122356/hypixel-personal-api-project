# Personal Hypixel Discord Bot

This is a private Discord bot for my own personal server. It fetches basic Hypixel player stats.

## Security & Architecture
- The API Key is stored in environment variables (`process.env.HYPIXEL_API_KEY`).
- The bot runs as a backend service, so the key is never exposed to users.
- It implements a 10-minute in-memory cache (`CACHE_TTL_MS = 600000`) to strictly comply with Hypixel API rate limits (300 requests/5 minutes).
- Error handling for 429 Rate Limit responses is implemented.
