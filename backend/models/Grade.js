const mongoose = require('mongoose');

const gradeSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  subject: { type: String, required: true },
  score: { type: Number, required: true },
  total: { type: Number, required: true },
  comment: { type: String },
  dateRecorded: { type: Date, default: Date.now },
  term: { type: String, default: 'Term 1' },  // You can later expand with term selection
  year: { type: Number, default: new Date().getFullYear() }
});

module.exports = mongoose.model('Grade', gradeSchema);
