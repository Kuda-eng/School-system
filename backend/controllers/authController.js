// backend/controllers/authController.js
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// Register User
exports.register = async (req, res) => {
  const { fullName, email, password, role } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Email already registered' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ fullName, email, password: hashedPassword, role });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error registering user', error: err.message });
  }
};

// Login User
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid email or password' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid email or password' });

    // Save user session
    req.session.userId = user._id;
    req.session.userRole = user.role;

    res.status(200).json({ message: 'Login successful', role: user.role });
  } catch (err) {
    res.status(500).json({ message: 'Error logging in', error: err.message });
  }
};

// Logout User
exports.logout = (req, res) => {
  req.session.destroy(() => {
    res.clearCookie('connect.sid'); // default session cookie name
    res.status(200).json({ message: 'Logout successful' });
  });
};
