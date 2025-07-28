// backend/models/Result.js
const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  score: {
    type: Number,
    required: true
  },
  total: {
    type: Number,
    required: true
  },
  grade: {
    type: String
  },
  term: {
    type: String,
    default: 'Term 1'
  },
  year: {
    type: String
  },
  comment: {
    type: String
  }
}, { timestamps: true });

module.exports = mongoose.model('Result', resultSchema);
