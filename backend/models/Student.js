const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  className: { type: String, required: true },
  rollNumber: { type: String, required: true, unique: true },
  gender: { type: String, enum: ['Male', 'Female'] },
  dateOfBirth: { type: Date },
  // Add more fields as needed
}, { timestamps: true });

module.exports = mongoose.model('Student', studentSchema);
