const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  subject: { type: String, required: true },
  grade: { type: String, required: true },
  fileUrl: { type: String, required: true }, // URL to read online (PDF, etc.)
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  uploadedAt: { type: Date, default: Date.now },
  isSyllabus: { type: Boolean, default: false } // differentiate books vs syllabuses
});

module.exports = mongoose.model('Book', bookSchema);
