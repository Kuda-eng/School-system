const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  method: { type: String }, // e.g. 'cash', 'EcoCash', 'bank'
  date: { type: Date, default: Date.now }
});

const feeSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  totalAmountDue: { type: Number, required: true, default: 0 },
  totalAmountPaid: { type: Number, required: true, default: 0 },
  paymentHistory: [paymentSchema],
  currency: { type: String, default: 'USD' },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Fee', feeSchema);
