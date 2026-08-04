const NodeCache = require('node-cache');

const TTL = Number(process.env.CACHE_TTL_SECONDS) || 3600; // 1 hour default
const cache = new NodeCache({ stdTTL: TTL, checkperiod: 120 });

/**
 * Wraps an async fetch function with an in-memory cache.
 * Key format: `${platform}:${username}`
 * Returns { data, cached, cachedAt }
 */
async function getOrFetch(platform, username, fetchFn) {
  const key = `${platform}:${username.toLowerCase()}`;
  const hit = cache.get(key);

  if (hit) {
    return { ...hit, cached: true };
  }

  const data = await fetchFn(username);
  const payload = { data, cachedAt: new Date().toISOString() };
  cache.set(key, payload, TTL);
  return { ...payload, cached: false };
}

function clearCache(platform, username) {
  if (platform && username) {
    cache.del(`${platform}:${username.toLowerCase()}`);
  } else {
    cache.flushAll();
  }
}

module.exports = { cache, getOrFetch, clearCache, TTL };
