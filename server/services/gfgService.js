const axios = require('axios');
const cheerio = require('cheerio');
const { ApiError } = require('../middleware/errorHandler');

// GeeksForGeeks has no official public API. We use their (unofficial, community-run)
// GFG stats API mirror first, and fall back to scraping the profile page.
// NOTE: Both approaches are unofficial and may break if GFG changes their markup.
const UNOFFICIAL_API = 'https://geeks-for-geeks-api.vercel.app/api';
const PROFILE_URL = (u) => `https://auth.geeksforgeeks.org/user/${encodeURIComponent(u)}/practice/`;

async function fetchGfgStats(username) {
  if (!username) throw new ApiError(400, 'GeeksForGeeks username is required');

  // 1) Try the unofficial JSON API first (fast, structured).
  try {
    const { data } = await axios.get(`${UNOFFICIAL_API}?userName=${encodeURIComponent(username)}`, {
      timeout: 8000
    });

    if (data && !data.error && (data.info || data.solvedStats)) {
      const info = data.info || {};
      return {
        username,
        codingScore: info.codingScore ?? 0,
        problemsSolved: info.totalProblemsSolved ?? 0,
        instituteRank: info.instituteRank ?? null,
        streak: info.currentStreak ?? info.streak ?? 0,
        institute: info.institution ?? null,
        source: 'unofficial-api'
      };
    }
  } catch (e) {
    // fall through to scraping
  }

  // 2) Fallback: scrape the public practice profile page.
  try {
    const { data: html } = await axios.get(PROFILE_URL(username), {
      timeout: 8000,
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; CodingProfileAnalyser/1.0)' }
    });
    const $ = cheerio.load(html);

    const codingScoreText = $('.score_card_value').eq(0).text().trim();
    const problemsSolvedText = $('.score_card_value').eq(1).text().trim();
    const instituteRankText = $('.rankNum').first().text().trim();

    if (!codingScoreText && !problemsSolvedText) {
      throw new Error('Profile markup not found');
    }

    return {
      username,
      codingScore: parseInt(codingScoreText, 10) || 0,
      problemsSolved: parseInt(problemsSolvedText, 10) || 0,
      instituteRank: instituteRankText ? parseInt(instituteRankText.replace(/,/g, ''), 10) : null,
      streak: 0,
      institute: null,
      source: 'scrape'
    };
  } catch (err) {
    throw new ApiError(
      404,
      `Could not fetch GeeksForGeeks data for "${username}". The profile may not exist or GFG may be blocking automated requests.`
    );
  }
}

module.exports = { fetchGfgStats };
