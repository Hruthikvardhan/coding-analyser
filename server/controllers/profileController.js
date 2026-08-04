const Profile = require('../models/Profile');
const { ApiError } = require('../middleware/errorHandler');

async function saveProfile(req, res, next) {
  try {
    const {
      name,
      leetcode,
      gfg,
      github,
      hackerrank,
      codechef,
      leetcodeData,
      githubData,
      gfgData,
      hackerrankData,
      overallScore
    } = req.body;

    if (!name) throw new ApiError(400, 'name is required');

    const profile = await Profile.create({
      name,
      leetcode,
      gfg,
      github,
      hackerrank,
      codechef,
      leetcodeData,
      githubData,
      gfgData,
      hackerrankData,
      overallScore: overallScore || 0,
      savedAt: new Date()
    });

    res.status(201).json({ success: true, data: profile });
  } catch (err) {
    next(err);
  }
}

async function getProfiles(req, res, next) {
  try {
    const profiles = await Profile.find().sort({ savedAt: -1 }).limit(100);
    res.json({ success: true, count: profiles.length, data: profiles });
  } catch (err) {
    next(err);
  }
}

async function getProfileById(req, res, next) {
  try {
    const profile = await Profile.findById(req.params.id);
    if (!profile) throw new ApiError(404, 'Profile not found');
    res.json({ success: true, data: profile });
  } catch (err) {
    next(err);
  }
}

async function deleteProfile(req, res, next) {
  try {
    const profile = await Profile.findByIdAndDelete(req.params.id);
    if (!profile) throw new ApiError(404, 'Profile not found');
    res.json({ success: true, message: 'Profile deleted' });
  } catch (err) {
    next(err);
  }
}

module.exports = { saveProfile, getProfiles, getProfileById, deleteProfile };
