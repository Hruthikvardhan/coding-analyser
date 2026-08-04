const express = require('express');
const router = express.Router();
const { compareProfiles, getLeaderboard } = require('../controllers/statsController');

router.get('/compare', compareProfiles);
router.get('/leaderboard', getLeaderboard);

module.exports = router;
