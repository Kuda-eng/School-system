const express = require('express');
const router = express.Router();
const Fee = require('../models/Fee');

// 1. Record new fee payment
router.post('/pay', async (req, res) => {
  try {
    const { studentId, amount, method } = req.body;

    const fee = await Fee.findOne({ studentId });

    if (!fee) {
      return res.status(404).json({ message: 'Fee record not found.' });
    }

    fee.totalAmountPaid += amount;
    fee.paymentHistory.push({ amount, method });
    fee.updatedAt = new Date();

    await fee.save();
    res.json({ message: '✅ Payment recorded successfully.', fee });
  } catch (error) {
    console.error('Payment error:', error);
    res.status(500).json({ message: '❌ Failed to record payment.' });
  }
});

// 2. Get student's fee status and payment history
router.get('/student/:studentId', async (req, res) => {
  try {
    const fee = await Fee.findOne({ studentId: req.params.studentId }).populate('studentId', 'name email');

    if (!fee) {
      return res.status(404).json({ message: 'Fee record not found.' });
    }

    res.json(fee);
  } catch (error) {
    console.error('Fetch fee error:', error);
    res.status(500).json({ message: '❌ Failed to get fee data.' });
  }
});

// 3. Admin: get all student fee records
router.get('/all', async (req, res) => {
  try {
    const allFees = await Fee.find().populate('studentId', 'name email');
    res.json(allFees);
  } catch (error) {
    console.error('Admin fetch error:', error);
    res.status(500).json({ message: '❌ Failed to fetch all fee records.' });
  }
});

// 4. Admin: update total amount due for a student
router.put('/update/:studentId', async (req, res) => {
  try {
    const { totalAmountDue } = req.body;
    const fee = await Fee.findOne({ studentId: req.params.studentId });

    if (!fee) {
      return res.status(404).json({ message: 'Fee record not found.' });
    }

    fee.totalAmountDue = totalAmountDue;
    fee.updatedAt = new Date();

    await fee.save();
    res.json({ message: '✅ Fee updated successfully.', fee });
  } catch (error) {
    console.error('Update fee error:', error);
    res.status(500).json({ message: '❌ Failed to update fee.' });
  }
});

module.exports = router;
