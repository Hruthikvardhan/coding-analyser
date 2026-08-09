/**
 * Overall Score = weighted combination of whichever platforms were
 * actually analysed. Each platform sub-score is first normalized to
 * 0-100, then combined using weights that are dynamically rebalanced
 * based on which platforms have data — so a profile analysed with only
 * LeetCode + GitHub can still reach a full 100, instead of being capped
 * at 70 just because GFG/HackerRank weren't provided.
 *
 * Base weights (used when ALL four platforms are present):
 *   LeetCode 40% · GitHub 30% · GFG 20% · HackerRank 10%
 */

const BASE_WEIGHTS = {
  leetcode: 0.4,
  github: 0.3,
  gfg: 0.2,
  hackerrank: 0.1,
};

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

function leetcodeScore(data) {
  if (!data) return 0;
  const raw =
    (data.easySolved || 0) * 1 +
    (data.mediumSolved || 0) * 3 +
    (data.hardSolved || 0) * 5 +
    (data.contestRating ? clamp((data.contestRating - 1200) / 20, 0, 40) : 0);

  // Normalize: ~600 raw points ≈ a very strong profile -> 100
  return clamp((raw / 600) * 100, 0, 100);
}

function githubScore(data) {
  if (!data) return 0;
  const repoPts = Math.min((data.publicRepos || 0) * 2, 20);
  const starPts = Math.min((data.totalStars || 0) * 1, 10);
  const followerPts = Math.min((data.followers || 0) * 0.5, 10);
  const streakBonus = Math.min((data.contributionStreakDays || 0) * 1, 10);

  const raw = repoPts + starPts + followerPts + streakBonus; // max 50
  return clamp((raw / 50) * 100, 0, 100);
}

function gfgScore(data) {
  if (!data) return 0;
  const scorePts = (data.codingScore || 0) / 10;
  const rankBonus =
    data.instituteRank && data.instituteRank <= 100
      ? 10
      : data.instituteRank && data.instituteRank <= 500
        ? 5
        : 0;

  const raw = scorePts + rankBonus;
  return clamp(raw * 2, 0, 100); // scale up since coding scores are typically modest
}

function hackerrankScore(data) {
  if (!data) return 0;
  const raw = (data.badgeCount || 0) * 5 + (data.certificationCount || 0) * 10;
  return clamp(raw, 0, 100);
}

/**
 * Combines platform sub-scores into a single 0-100 overall score.
 * Only platforms with actual data contribute — their base weights are
 * rebalanced proportionally so the max achievable score stays 100
 * regardless of how many platforms were analysed.
 */
function calculateOverallScore({
  leetcodeData,
  githubData,
  gfgData,
  hackerrankData,
}) {
  const scores = {
    leetcode: leetcodeData ? leetcodeScore(leetcodeData) : null,
    github: githubData ? githubScore(githubData) : null,
    gfg: gfgData ? gfgScore(gfgData) : null,
    hackerrank: hackerrankData ? hackerrankScore(hackerrankData) : null,
  };

  const activeEntries = Object.entries(scores).filter(
    ([, value]) => value !== null,
  );
  const activeWeightSum = activeEntries.reduce(
    (sum, [key]) => sum + BASE_WEIGHTS[key],
    0,
  );

  let overall = 0;
  if (activeWeightSum > 0) {
    overall = activeEntries.reduce((sum, [key, value]) => {
      const normalizedWeight = BASE_WEIGHTS[key] / activeWeightSum;
      return sum + value * normalizedWeight;
    }, 0);
  }

  return {
    overallScore: Math.round(overall * 100) / 100,
    breakdown: {
      leetcode:
        scores.leetcode !== null
          ? Math.round(scores.leetcode * 100) / 100
          : null,
      github:
        scores.github !== null ? Math.round(scores.github * 100) / 100 : null,
      gfg: scores.gfg !== null ? Math.round(scores.gfg * 100) / 100 : null,
      hackerrank:
        scores.hackerrank !== null
          ? Math.round(scores.hackerrank * 100) / 100
          : null,
    },
  };
}

/**
 * Derives simple strengths/weaknesses text from the breakdown + raw data,
 * used by the frontend's Strengths/Weaknesses/Suggestions sections.
 * Every check is null-safe so a platform that wasn't analysed simply
 * contributes nothing, instead of being treated as "weak".
 */
function deriveInsights({ leetcodeData, githubData, breakdown }) {
  const strengths = [];
  const weaknesses = [];
  const suggestions = [];

  if (breakdown.leetcode !== null) {
    if (breakdown.leetcode >= 60) {
      strengths.push("Data Structures & Algorithms");
    } else {
      weaknesses.push("Algorithmic problem solving");
      suggestions.push(
        "Solve 3-5 LeetCode problems per week, mixing Medium and Hard difficulty.",
      );
    }

    if ((leetcodeData?.hardSolved ?? 0) < 10) {
      weaknesses.push("Hard problems");
      suggestions.push(
        "Dedicate one session weekly to Hard-rated LeetCode problems to build depth.",
      );
    } else {
      strengths.push("Hard problems");
    }
  }

  if (breakdown.github !== null) {
    if (breakdown.github >= 60) {
      strengths.push("Open-source / project building");
    } else {
      weaknesses.push("Public project activity");
      suggestions.push(
        "Push more original repos and contribute to open-source projects on GitHub.",
      );
    }

    if (githubData?.topLanguages?.length) {
      strengths.push(
        githubData.topLanguages
          .slice(0, 3)
          .map((l) => l.name)
          .join(", "),
      );
    }
  }

  if (breakdown.hackerrank !== null && breakdown.hackerrank < 30) {
    weaknesses.push("Contests & certifications");
    suggestions.push(
      "Participate in more contests and complete a few HackerRank certifications.",
    );
  }

  return {
    strengths: [...new Set(strengths)].slice(0, 6),
    weaknesses: [...new Set(weaknesses)].slice(0, 6),
    suggestions: [...new Set(suggestions)].slice(0, 6),
  };
}

module.exports = {
  calculateOverallScore,
  deriveInsights,
  leetcodeScore,
  githubScore,
  gfgScore,
  hackerrankScore,
};
