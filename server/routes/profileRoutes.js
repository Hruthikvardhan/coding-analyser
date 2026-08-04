const express = require('express');
const router = express.Router();
const {
  saveProfile,
  getProfiles,
  getProfileById,
  deleteProfile
} = require('../controllers/profileController');

router.post('/save', saveProfile);
router.get('/', getProfiles);
router.get('/:id', getProfileById);
router.delete('/:id', deleteProfile);

module.exports = router;
