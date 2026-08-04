const axios = require('axios');
const { ApiError } = require('../middleware/errorHandler');

const BASE_URL = 'https://api.github.com';

const client = axios.create({
  baseURL: BASE_URL,
  timeout: 8000,
  headers: {
    Accept: 'application/vnd.github+json',
    ...(process.env.GITHUB_TOKEN && { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` })
  }
});

/**
 * Fetches public GitHub profile stats: repos, followers, stars, top languages,
 * and recent commit / contribution activity.
 */
async function fetchGitHubStats(username) {
  if (!username) throw new ApiError(400, 'GitHub username is required');

  try {
    const { data: user } = await client.get(`/users/${encodeURIComponent(username)}`);

    // Pull up to 100 repos (owner's most recently pushed) to compute stars/languages.
    const { data: repos } = await client.get(`/users/${encodeURIComponent(username)}/repos`, {
      params: { per_page: 100, sort: 'pushed' }
    });

    const totalStars = repos.reduce((sum, r) => sum + (r.stargazers_count || 0), 0);

    const languageCounts = {};
    repos.forEach((r) => {
      if (r.language) {
        languageCounts[r.language] = (languageCounts[r.language] || 0) + 1;
      }
    });
    const topLanguages = Object.entries(languageCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([name, count]) => ({ name, count }));

    // Recent public events approximate "recent activity" without needing GraphQL/auth.
    let recentEvents = [];
    try {
      const { data: events } = await client.get(`/users/${encodeURIComponent(username)}/events/public`, {
        params: { per_page: 30 }
      });
      recentEvents = events;
    } catch (e) {
      recentEvents = []; // Non-fatal; some accounts restrict this.
    }

    const pushEvents = recentEvents.filter((e) => e.type === 'PushEvent');
    const recentCommitCount = pushEvents.reduce((sum, e) => sum + (e.payload?.size || 0), 0);
    const activeDays = new Set(recentEvents.map((e) => e.created_at?.slice(0, 10))).size;

    return {
      username: user.login,
      name: user.name,
      avatarUrl: user.avatar_url,
      publicRepos: user.public_repos ?? 0,
      followers: user.followers ?? 0,
      following: user.following ?? 0,
      totalStars,
      topLanguages,
      recentCommitCount,
      contributionStreakDays: activeDays,
      profileUrl: user.html_url,
      createdAt: user.created_at
    };
  } catch (err) {
    if (err instanceof ApiError) throw err;
    if (err.response && err.response.status === 404) {
      throw new ApiError(404, `GitHub user "${username}" not found`);
    }
    if (err.response && err.response.status === 403) {
      throw new ApiError(429, 'GitHub API rate limit exceeded. Try again later or set GITHUB_TOKEN.');
    }
    throw new ApiError(502, `Failed to fetch GitHub data: ${err.message}`);
  }
}

module.exports = { fetchGitHubStats };
