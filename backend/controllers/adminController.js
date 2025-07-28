// backend/controllers/adminController.js
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// Add User (only by admin)
exports.addUser = async (req, res) => {
  const { fullName, email, password, role } = req.body;

  // Validate input
  if (!fullName || !email || !password || !role) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Email already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
      role
    });

    await newUser.save();
    res.status(201).json({ message: 'User added successfully' });
  } catch (error) {
    console.error('Add user error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all users (only for admin)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, '-password'); // Exclude password field
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users' });
  }
};
const Fee = require('../models/Fee');

// Set or Update Monthly Fee for a Student
exports.setStudentFee = async (req, res) => {
  const { studentId, amount, currency } = req.body;

  if (!studentId || !amount) {
    return res.status(400).json({ message: 'Student ID and amount are required' });
  }

  try {
    const updated = await Fee.findOneAndUpdate(
      { studentId },
      { amount, currency: currency || 'USD', updatedAt: new Date() },
      { upsert: true, new: true }
    );

    res.status(200).json({ message: 'Fee updated successfully', fee: updated });
  } catch (error) {
    console.error('Error setting fee:', error.message);
    res.status(500).json({ message: 'Error setting fee' });
  }
};
const Payment = require('../models/Payment');

// Record a payment made by a student
exports.recordPayment = async (req, res) => {
  const { studentId, amountPaid, method, notes } = req.body;

  if (!studentId || !amountPaid) {
    return res.status(400).json({ message: 'Student ID and amountPaid are required' });
  }

  try {
    const payment = new Payment({
      studentId,
      amountPaid,
      method,
      notes
    });

    await payment.save();
    res.status(201).json({ message: 'Payment recorded successfully', payment });
  } catch (error) {
    console.error('Payment error:', error.message);
    res.status(500).json({ message: 'Error recording payment' });
  }
};

// Get all student fee records
exports.getAllFees = async (req, res) => {
  try {
    const fees = await Fee.find({})
      .populate('studentId', 'fullName email')
      .sort({ updatedAt: -1 });

    res.status(200).json(fees);
  } catch (error) {
    console.error('Error fetching fees:', error.message);
    res.status(500).json({ message: 'Error fetching fees' });
  }
};
