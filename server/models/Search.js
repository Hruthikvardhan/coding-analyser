const mongoose = require('mongoose');

const SearchSchema = new mongoose.Schema(
  {
    platform: { type: String, required: true, enum: ['leetcode', 'github', 'gfg', 'hackerrank'] },
    username: { type: String, required: true },
    searchedAt: { type: Date, default: Date.now },
    resultData: { type: mongoose.Schema.Types.Mixed, default: null },
    cacheExpiry: { type: Date, required: true }
  },
  { timestamps: true }
);

SearchSchema.index({ platform: 1, username: 1 });

module.exports = mongoose.model('Search', SearchSchema);
