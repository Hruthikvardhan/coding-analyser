const { getOrFetch } = require('../middleware/cacheMiddleware');
const { fetchLeetCodeStats } = require('../services/leetcodeService');
const { fetchGitHubStats } = require('../services/githubService');
const { fetchGfgStats } = require('../services/gfgService');
const { fetchHackerRankStats } = require('../services/hackerrankService');
const { calculateOverallScore, deriveInsights } = require('../services/scoreCalculator');
const { ApiError } = require('../middleware/errorHandler');
const Search = require('../models/Search');

const TTL = Number(process.env.CACHE_TTL_SECONDS) || 3600;

async function logSearch(platform, username, resultData) {
  try {
    await Search.create({
      platform,
      username,
      resultData,
      cacheExpiry: new Date(Date.now() + TTL * 1000)
    });
  } catch (e) {
    console.warn('Failed to log search:', e.message);
  }
}

function makeHandler(platform, fetchFn) {
  return async (req, res, next) => {
    try {
      const { username } = req.body;
      if (!username) throw new ApiError(400, 'username is required');

      const { data, cached, cachedAt } = await getOrFetch(platform, username, fetchFn);
      await logSearch(platform, username, data);

      res.json({ success: true, platform, cached, cachedAt, data });
    } catch (err) {
      next(err);
    }
  };
}

const getLeetCode = makeHandler('leetcode', fetchLeetCodeStats);
const getGitHub = makeHandler('github', fetchGitHubStats);
const getGfg = makeHandler('gfg', fetchGfgStats);
const getHackerRank = makeHandler('hackerrank', fetchHackerRankStats);

/**
 * Fetches all platforms in parallel. Individual platform failures do not
 * fail the whole request — they're returned with an `error` field instead.
 */
async function getAll(req, res, next) {
  try {
    const { leetcode, github, gfg, hackerrank } = req.body;

    const tasks = [
      leetcode ? safeFetch('leetcode', leetcode, fetchLeetCodeStats) : Promise.resolve(null),
      github ? safeFetch('github', github, fetchGitHubStats) : Promise.resolve(null),
      gfg ? safeFetch('gfg', gfg, fetchGfgStats) : Promise.resolve(null),
      hackerrank ? safeFetch('hackerrank', hackerrank, fetchHackerRankStats) : Promise.resolve(null)
    ];

    const [leetcodeResult, githubResult, gfgResult, hackerrankResult] = await Promise.all(tasks);

    const leetcodeData = leetcodeResult?.data || null;
    const githubData = githubResult?.data || null;
    const gfgData = gfgResult?.data || null;
    const hackerrankData = hackerrankResult?.data || null;

    const { overallScore, breakdown } = calculateOverallScore({
      leetcodeData,
      githubData,
      gfgData,
      hackerrankData
    });
    const insights = deriveInsights({ leetcodeData, githubData, breakdown });

    res.json({
      success: true,
      overallScore,
      breakdown,
      insights,
      platforms: {
        leetcode: leetcodeResult,
        github: githubResult,
        gfg: gfgResult,
        hackerrank: hackerrankResult
      }
    });
  } catch (err) {
    next(err);
  }
}

async function safeFetch(platform, username, fetchFn) {
  try {
    const { data, cached, cachedAt } = await getOrFetch(platform, username, fetchFn);
    logSearch(platform, username, data); // fire and forget
    return { data, cached, cachedAt, error: null };
  } catch (err) {
    return { data: null, cached: false, cachedAt: null, error: err.message || 'Fetch failed' };
  }
}

module.exports = { getLeetCode, getGitHub, getGfg, getHackerRank, getAll };
