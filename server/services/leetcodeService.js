const axios = require("axios");
const { ApiError } = require("../middleware/errorHandler");

const BASE_URL = "https://leetcode-stats-api.herokuapp.com";
const GRAPHQL_URL = "https://leetcode.com/graphql";

async function fetchFromCommunityApi(username, retries = 2) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const { data } = await axios.get(
        `${BASE_URL}/${encodeURIComponent(username)}`,
        {
          timeout: 8000,
        },
      );
      if (data && data.status !== "error") return data;
    } catch (err) {
      if (attempt === retries) throw err;
      await new Promise((r) => setTimeout(r, 800 * (attempt + 1))); // backoff
    }
  }
  return null;
}

// Fallback: query LeetCode's own public GraphQL endpoint directly.
async function fetchFromOfficialGraphQL(username) {
  const query = `
    query userProblemsSolved($username: String!) {
      matchedUser(username: $username) {
        username
        submitStatsGlobal { acSubmissionNum { difficulty count } }
        profile { ranking }
      }
    }
  `;
  const { data } = await axios.post(
    GRAPHQL_URL,
    { query, variables: { username } },
    { timeout: 8000, headers: { "Content-Type": "application/json" } },
  );

  const user = data?.data?.matchedUser;
  if (!user) return null;

  const counts = {};
  user.submitStatsGlobal.acSubmissionNum.forEach((s) => {
    counts[s.difficulty] = s.count;
  });

  return {
    totalSolved: counts.All ?? 0,
    easySolved: counts.Easy ?? 0,
    mediumSolved: counts.Medium ?? 0,
    hardSolved: counts.Hard ?? 0,
    totalEasy: null,
    totalMedium: null,
    totalHard: null,
    totalQuestions: null,
    acceptanceRate: null,
    ranking: user.profile?.ranking ?? null,
    contributionPoints: 0,
    reputation: 0,
    contestRating: null,
  };
}

async function fetchLeetCodeStats(username) {
  if (!username) throw new ApiError(400, "LeetCode username is required");

  let data = null;

  try {
    data = await fetchFromCommunityApi(username);
  } catch (err) {
    data = null; // fall through to GraphQL fallback
  }

  if (!data) {
    try {
      data = await fetchFromOfficialGraphQL(username);
    } catch (err) {
      throw new ApiError(
        502,
        `Failed to fetch LeetCode data (both sources unavailable): ${err.message}`,
      );
    }
  }

  if (!data) {
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
    contestRating: data.contestRating ?? null,
    topPercentage:
      data.ranking && data.ranking > 0
        ? estimateTopPercentage(data.ranking)
        : null,
  };
}

function estimateTopPercentage(ranking) {
  const ESTIMATED_TOTAL_USERS = 30_000_000;
  const pct = (ranking / ESTIMATED_TOTAL_USERS) * 100;
  return Math.max(0.01, Math.round(pct * 100) / 100);
}

module.exports = { fetchLeetCodeStats };
