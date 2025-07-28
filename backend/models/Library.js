const mongoose = require('mongoose');

const librarySchema = new mongoose.Schema({
  title: { type: String, required: true },
  subject: { type: String },
  grade: { type: String },
  description: { type: String },
  isSyllabus: { type: Boolean, default: false },
  fileUrl: { type: String, required: true }, // This should be a URL or path to file
  uploadedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Library', librarySchema);
