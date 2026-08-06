const axios = require("axios");
const cheerio = require("cheerio");
const { ApiError } = require("../middleware/errorHandler");

const BASE_URL = "https://api.github.com";

const client = axios.create({
  baseURL: BASE_URL,
  timeout: 8000,
  headers: {
    Accept: "application/vnd.github+json",
    ...(process.env.GITHUB_TOKEN && {
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
    }),
  },
});

/**
 * GitHub's REST API doesn't expose the real contribution calendar without
 * authenticated GraphQL access. Instead, we fetch the same public HTML fragment
 * GitHub itself uses to render the profile contribution graph
 * (https://github.com/users/{username}/contributions), which requires no auth.
 * Each day cell has a data-date and data-level (0-4) attribute we can read directly.
 */
async function fetchContributionCalendar(username) {
  try {
    const { data: html } = await axios.get(
      `https://github.com/users/${encodeURIComponent(username)}/contributions`,
      {
        timeout: 8000,
        headers: {
          "User-Agent": "Mozilla/5.0 (compatible; CodingProfileAnalyser/1.0)",
        },
      },
    );
    const $ = cheerio.load(html);

    const days = [];
    $(
      "table.ContributionCalendar-grid td.ContributionCalendar-day, td[data-date]",
    ).each((_, el) => {
      const date = $(el).attr("data-date");
      const level = parseInt($(el).attr("data-level") ?? "0", 10);
      if (date) days.push({ date, level });
    });

    // GitHub shows a heading like "126 contributions in the last year" near the top.
    const totalText = $("h2, .f4")
      .filter((_, el) => /contributions? in the last year/i.test($(el).text()))
      .first()
      .text();
    const totalMatch = totalText.match(/([\d,]+)\s+contributions?/i);
    const totalLastYear = totalMatch
      ? parseInt(totalMatch[1].replace(/,/g, ""), 10)
      : null;

    const last30 = days.slice(-30);
    const activeDaysLast30 = last30.filter((d) => d.level > 0).length;

    return { days: last30, totalLastYear, activeDaysLast30 };
  } catch (e) {
    // Non-fatal: the rest of the GitHub card still works without the calendar.
    return { days: [], totalLastYear: null, activeDaysLast30: 0 };
  }
}

/**
 * Fetches public GitHub profile stats: repos, followers, stars, top languages,
 * and a real contribution calendar (last 30 days).
 */
async function fetchGitHubStats(username) {
  if (!username) throw new ApiError(400, "GitHub username is required");

  try {
    const { data: user } = await client.get(
      `/users/${encodeURIComponent(username)}`,
    );

    // Pull up to 100 repos (owner's most recently pushed) to compute stars/languages.
    const { data: repos } = await client.get(
      `/users/${encodeURIComponent(username)}/repos`,
      {
        params: { per_page: 100, sort: "pushed" },
      },
    );

    const totalStars = repos.reduce(
      (sum, r) => sum + (r.stargazers_count || 0),
      0,
    );

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

    const calendar = await fetchContributionCalendar(username);

    return {
      username: user.login,
      name: user.name,
      avatarUrl: user.avatar_url,
      publicRepos: user.public_repos ?? 0,
      followers: user.followers ?? 0,
      following: user.following ?? 0,
      totalStars,
      topLanguages,
      contributionCalendar: calendar.days,
      contributionsLastYear: calendar.totalLastYear,
      contributionStreakDays: calendar.activeDaysLast30,
      profileUrl: user.html_url,
      createdAt: user.created_at,
    };
  } catch (err) {
    if (err instanceof ApiError) throw err;
    if (err.response && err.response.status === 404) {
      throw new ApiError(404, `GitHub user "${username}" not found`);
    }
    if (err.response && err.response.status === 403) {
      throw new ApiError(
        429,
        "GitHub API rate limit exceeded. Try again later or set GITHUB_TOKEN.",
      );
    }
    throw new ApiError(502, `Failed to fetch GitHub data: ${err.message}`);
  }
}

module.exports = { fetchGitHubStats };
