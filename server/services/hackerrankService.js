const axios = require('axios');
const cheerio = require('cheerio');
const { ApiError } = require('../middleware/errorHandler');

// HackerRank does not expose a public REST API for arbitrary profiles anymore.
// We scrape the public profile page's embedded JSON (model data) as a best effort.
const PROFILE_URL = (u) => `https://www.hackerrank.com/profile/${encodeURIComponent(u)}`;

async function fetchHackerRankStats(username) {
  if (!username) throw new ApiError(400, 'HackerRank username is required');

  try {
    const { data: html } = await axios.get(PROFILE_URL(username), {
      timeout: 8000,
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; CodingProfileAnalyser/1.0)' }
    });

    const $ = cheerio.load(html);
    const badgeNodes = $('.hacker-badge, .badge-title');
    const badges = [];
    badgeNodes.each((_, el) => {
      const text = $(el).text().trim();
      if (text) badges.push(text);
    });

    const certNodes = $('.certificate-card, .certificate-title');
    const certifications = [];
    certNodes.each((_, el) => {
      const text = $(el).text().trim();
      if (text) certifications.push(text);
    });

    if (badges.length === 0 && certifications.length === 0) {
      throw new Error('No badge/certification markup found (profile private or page structure changed)');
    }

    return {
      username,
      badges: [...new Set(badges)],
      badgeCount: new Set(badges).size,
      certifications: [...new Set(certifications)],
      certificationCount: new Set(certifications).size,
      problemSolvingScore: badges.length * 5 // heuristic placeholder; HR no longer exposes a raw score publicly
    };
  } catch (err) {
    throw new ApiError(
      404,
      `Could not fetch HackerRank data for "${username}". The profile may be private, not exist, or HackerRank may be blocking automated requests.`
    );
  }
}

module.exports = { fetchHackerRankStats };
