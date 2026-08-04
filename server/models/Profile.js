const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    leetcode: { type: String, default: '' },
    gfg: { type: String, default: '' },
    github: { type: String, default: '' },
    hackerrank: { type: String, default: '' },
    codechef: { type: String, default: '' },
    savedAt: { type: Date, default: Date.now },
    leetcodeData: { type: mongoose.Schema.Types.Mixed, default: null },
    githubData: { type: mongoose.Schema.Types.Mixed, default: null },
    gfgData: { type: mongoose.Schema.Types.Mixed, default: null },
    hackerrankData: { type: mongoose.Schema.Types.Mixed, default: null },
    overallScore: { type: Number, default: 0 }
  },
  { timestamps: true }
);

ProfileSchema.index({ overallScore: -1 });

module.exports = mongoose.model('Profile', ProfileSchema);
