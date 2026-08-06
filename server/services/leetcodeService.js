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

// Fallback: query LeetCode's own official GraphQL endpoint directly.
// Pulls solved counts, total question counts, acceptance rate, ranking, and
// contest rating in one request so this fallback path returns data as
// complete as the community API does.
async function fetchFromOfficialGraphQL(username) {
  const query = `
    query combinedQuery($username: String!) {
      allQuestionsCount { difficulty count }
      matchedUser(username: $username) {
        username
        submitStatsGlobal {
          acSubmissionNum { difficulty count }
          totalSubmissionNum { difficulty count }
        }
        profile { ranking }
      }
      userContestRanking(username: $username) { rating }
    }
  `;

  const { data } = await axios.post(
    GRAPHQL_URL,
    { query, variables: { username } },
    {
      timeout: 8000,
      headers: {
        "Content-Type": "application/json",
        Referer: `https://leetcode.com/${username}/`,
      },
    },
  );

  const user = data?.data?.matchedUser;
  if (!user) return null;

  const acByDifficulty = {};
  user.submitStatsGlobal.acSubmissionNum.forEach((s) => {
    acByDifficulty[s.difficulty] = s.count;
  });

  const totalByDifficulty = {};
  user.submitStatsGlobal.totalSubmissionNum.forEach((s) => {
    totalByDifficulty[s.difficulty] = s.count;
  });

  const totalQuestionsByDifficulty = {};
  (data?.data?.allQuestionsCount || []).forEach((q) => {
    totalQuestionsByDifficulty[q.difficulty] = q.count;
  });

  const acAll = acByDifficulty.All ?? 0;
  const totalAll = totalByDifficulty.All ?? 0;
  const acceptanceRate =
    totalAll > 0 ? Math.round((acAll / totalAll) * 1000) / 10 : null;

  const contestRating = data?.data?.userContestRanking?.rating
    ? Math.round(data.data.userContestRanking.rating)
    : null;

  return {
    totalSolved: acAll,
    totalQuestions: totalQuestionsByDifficulty.All ?? null,
    easySolved: acByDifficulty.Easy ?? 0,
    totalEasy: totalQuestionsByDifficulty.Easy ?? null,
    mediumSolved: acByDifficulty.Medium ?? 0,
    totalMedium: totalQuestionsByDifficulty.Medium ?? null,
    hardSolved: acByDifficulty.Hard ?? 0,
    totalHard: totalQuestionsByDifficulty.Hard ?? null,
    acceptanceRate,
    ranking: user.profile?.ranking ?? null,
    contributionPoints: 0,
    reputation: 0,
    contestRating,
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
    totalQuestions: data.totalQuestions ?? null,
    easySolved: data.easySolved ?? 0,
    totalEasy: data.totalEasy ?? null,
    mediumSolved: data.mediumSolved ?? 0,
    totalMedium: data.totalMedium ?? null,
    hardSolved: data.hardSolved ?? 0,
    totalHard: data.totalHard ?? null,
    // Keep null when truly unknown so the UI shows "N/A" instead of a misleading "0.0%"
    acceptanceRate: data.acceptanceRate ?? null,
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
