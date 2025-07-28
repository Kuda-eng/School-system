// backend/models/Payment.js
const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amountPaid: { type: Number, required: true },
  paidAt: { type: Date, default: Date.now },
  method: { type: String, default: 'cash' },
  notes: { type: String }
});

module.exports = mongoose.model('Payment', paymentSchema);
