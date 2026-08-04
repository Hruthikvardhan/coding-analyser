const Profile = require('../models/Profile');
const { ApiError } = require('../middleware/errorHandler');

/**
 * GET /api/stats/compare?id1=...&id2=...
 * Compares two saved profiles category by category, marking a winner per category.
 */
async function compareProfiles(req, res, next) {
  try {
    const { id1, id2 } = req.query;
    if (!id1 || !id2) throw new ApiError(400, 'id1 and id2 query params are required');

    const [p1, p2] = await Promise.all([Profile.findById(id1), Profile.findById(id2)]);
    if (!p1 || !p2) throw new ApiError(404, 'One or both profiles not found');

    const categories = [
      {
        key: 'leetcodeSolved',
        label: 'LeetCode Problems Solved',
        v1: p1.leetcodeData?.totalSolved || 0,
        v2: p2.leetcodeData?.totalSolved || 0
      },
      {
        key: 'githubStars',
        label: 'GitHub Stars',
        v1: p1.githubData?.totalStars || 0,
        v2: p2.githubData?.totalStars || 0
      },
      {
        key: 'githubRepos',
        label: 'GitHub Repos',
        v1: p1.githubData?.publicRepos || 0,
        v2: p2.githubData?.publicRepos || 0
      },
      {
        key: 'gfgScore',
        label: 'GFG Coding Score',
        v1: p1.gfgData?.codingScore || 0,
        v2: p2.gfgData?.codingScore || 0
      },
      {
        key: 'hackerrankBadges',
        label: 'HackerRank Badges',
        v1: p1.hackerrankData?.badgeCount || 0,
        v2: p2.hackerrankData?.badgeCount || 0
      }
    ].map((c) => ({ ...c, winner: c.v1 === c.v2 ? 'tie' : c.v1 > c.v2 ? 'p1' : 'p2' }));

    const overallWinner =
      p1.overallScore === p2.overallScore ? 'tie' : p1.overallScore > p2.overallScore ? 'p1' : 'p2';

    res.json({
      success: true,
      profiles: { p1, p2 },
      categories,
      overallWinner
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/stats/leaderboard
 * Top saved profiles by overallScore, plus per-platform top lists.
 */
async function getLeaderboard(req, res, next) {
  try {
    const limit = Number(req.query.limit) || 20;

    const overall = await Profile.find().sort({ overallScore: -1 }).limit(limit);
    const profiles = await Profile.find();

    const byLeetCode = [...profiles]
      .sort((a, b) => (b.leetcodeData?.totalSolved || 0) - (a.leetcodeData?.totalSolved || 0))
      .slice(0, limit);

    const byGitHub = [...profiles]
      .sort((a, b) => (b.githubData?.totalStars || 0) - (a.githubData?.totalStars || 0))
      .slice(0, limit);

    res.json({
      success: true,
      overall,
      platformRankings: {
        leetcode: byLeetCode,
        github: byGitHub
      }
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { compareProfiles, getLeaderboard };
