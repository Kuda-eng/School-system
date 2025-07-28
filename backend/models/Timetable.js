// models/Timetable.js
const mongoose = require('mongoose');

const timetableSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ['student', 'teacher'],
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'role',
    required: true
  },
  entries: [
    {
      day: { type: String, required: true },      // e.g., Monday
      subject: String,
      startTime: String,                          // e.g., 08:00
      endTime: String,                            // e.g., 09:00
      location: String
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('Timetable', timetableSchema);
