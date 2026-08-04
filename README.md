# Coding Profile Analyser (MERN Stack)

Analyse and compare public coding profiles across LeetCode, GitHub, GeeksForGeeks,
and HackerRank in one dashboard, with a weighted overall score.

## Stack
- **M**ongoDB + Mongoose
- **E**xpress.js
- **R**eact.js (Vite) + Tailwind CSS + Recharts + Framer Motion
- **N**ode.js

## Project structure

```
coding-analyser/
  server/     -> Express API (see server/README below)
  client/     -> React frontend (Vite)
```

## Getting started

### 1. Backend

```bash
cd server
npm install
cp .env.example .env   # edit MONGO_URI if needed
npm run dev             # or: npm start
```

Runs on `http://localhost:5000`. Requires a running MongoDB instance
(local `mongod`, or a free MongoDB Atlas cluster — paste its connection
string into `MONGO_URI`).

### 2. Frontend

```bash
cd client
npm install
npm run dev
```

Runs on `http://localhost:5173` and proxies `/api` calls to the backend
(see `vite.config.js`).

## Notes on data sources

| Platform     | Source                                              | Reliability |
|--------------|------------------------------------------------------|-------------|
| LeetCode     | `leetcode-stats-api.herokuapp.com` (public, free)     | Good        |
| GitHub       | Official GitHub REST API (`api.github.com`)           | Good — add a `GITHUB_TOKEN` env var to raise rate limits |
| GeeksForGeeks| Unofficial community API + HTML scrape fallback       | Fragile — GFG has no official public API and may block scraping |
| HackerRank   | HTML scrape of the public profile page                | Fragile — HackerRank has no official public profile API |

Because GFG and HackerRank don't offer official APIs, those two services are
the most likely to break if the sites change their markup. The backend
degrades gracefully: `/api/analyse/all` returns whatever platforms it could
fetch, with an `error` field on the ones that failed, instead of failing
the whole request.

## Caching

All platform fetches are cached in-memory for 1 hour (`node-cache`) per
`platform:username` key, so repeated lookups don't hammer the source sites.
Every API response includes `cached` (boolean) and `cachedAt` (timestamp) so
the UI can show freshness to the user.

## Overall score formula

```
overallScore = 0.4 * LeetCodeScore
             + 0.3 * GitHubScore
             + 0.2 * GfgScore
             + 0.1 * HackerRankScore
```

Each sub-score is normalized to 0–100 first (see
`server/services/scoreCalculator.js` for the exact weighting of solved
counts, stars, repos, followers, badges, etc.).

## License

MIT — build on it freely.
