const express = require('express');
const router = express.Router();
const { getLeetCode, getGitHub, getGfg, getHackerRank, getAll } = require('../controllers/analyseController');

router.post('/leetcode', getLeetCode);
router.post('/github', getGitHub);
router.post('/gfg', getGfg);
router.post('/hackerrank', getHackerRank);
router.post('/all', getAll);

module.exports = router;
