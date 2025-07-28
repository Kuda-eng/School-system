// backend/controllers/studentController.js

const Fee = require('../models/Fee');
const Payment = require('../models/Payment');
const Grade = require('../models/Grade');

exports.getMyFee = async (req, res) => {
  try {
    const studentId = req.session.userId;

    const fee = await Fee.findOne({ studentId });

    if (!fee) {
      return res.status(404).json({ message: 'No fee record found.' });
    }

    res.status(200).json({
      amount: fee.amount,
      currency: fee.currency,
      updatedAt: fee.updatedAt
    });
  } catch (err) {
    console.error('Error fetching fee:', err);
    res.status(500).json({ message: 'Server error.' });
  }
};

exports.getMyPaymentHistory = async (req, res) => {
  const studentId = req.session.userId;

  try {
    // Get fee record
    const fee = await Fee.findOne({ studentId });
    const monthlyFee = fee ? fee.amount : 0;

    // Get all payments
    const payments = await Payment.find({ studentId }).sort({ paidAt: -1 });

    const totalPaid = payments.reduce((sum, p) => sum + p.amountPaid, 0);
    const balance = monthlyFee - totalPaid;

    res.status(200).json({
      fee: monthlyFee,
      totalPaid,
      balance: balance < 0 ? 0 : balance,
      payments
    });
  } catch (err) {
    console.error('Payment history error:', err.message);
    res.status(500).json({ message: 'Failed to fetch payment history' });
  }
};

// Get all grades for the logged-in student
exports.getMyGrades = async (req, res) => {
  try {
    const studentId = req.session.userId;
    const grades = await Grade.find({ studentId }).sort({ dateRecorded: -1 });

    res.status(200).json(grades);
  } catch (err) {
    console.error('Error loading grades:', err.message);
    res.status(500).json({ message: 'Error fetching grades' });
  }
};
