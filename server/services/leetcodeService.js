const axios = require('axios');
const { ApiError } = require('../middleware/errorHandler');

const BASE_URL = 'https://leetcode-stats-api.herokuapp.com';

/**
 * Fetches public LeetCode stats for a username.
 * Docs: https://github.com/JeromeLefebvre/LeetCode-Stats-API
 */
async function fetchLeetCodeStats(username) {
  if (!username) throw new ApiError(400, 'LeetCode username is required');

  try {
    const { data } = await axios.get(`${BASE_URL}/${encodeURIComponent(username)}`, {
      timeout: 8000
    });

    if (!data || data.status === 'error') {
      throw new ApiError(404, `LeetCode user "${username}" not found`);
    }

    return {
      username,
      totalSolved: data.totalSolved ?? 0,
      totalQuestions: data.totalQuestions ?? 0,
      easySolved: data.easySolved ?? 0,
      totalEasy: data.totalEasy ?? 0,
      mediumSolved: data.mediumSolved ?? 0,
      totalMedium: data.totalMedium ?? 0,
      hardSolved: data.hardSolved ?? 0,
      totalHard: data.totalHard ?? 0,
      acceptanceRate: data.acceptanceRate ?? 0,
      ranking: data.ranking ?? null,
      contributionPoints: data.contributionPoints ?? 0,
      reputation: data.reputation ?? 0,
      // Contest fields aren't in this API; default gracefully.
      contestRating: data.contestRating ?? null,
      topPercentage: data.ranking && data.ranking > 0 ? estimateTopPercentage(data.ranking) : null
    };
  } catch (err) {
    if (err instanceof ApiError) throw err;
    if (err.response && err.response.status === 404) {
      throw new ApiError(404, `LeetCode user "${username}" not found`);
    }
    throw new ApiError(502, `Failed to fetch LeetCode data: ${err.message}`);
  }
}

// Rough heuristic since the public API doesn't expose total registered users directly.
function estimateTopPercentage(ranking) {
  const ESTIMATED_TOTAL_USERS = 30_000_000;
  const pct = (ranking / ESTIMATED_TOTAL_USERS) * 100;
  return Math.max(0.01, Math.round(pct * 100) / 100);
}

module.exports = { fetchLeetCodeStats };
