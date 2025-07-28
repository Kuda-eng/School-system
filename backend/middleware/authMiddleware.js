const User = require('../models/User');

// Middleware to check if authenticated and populate req.user
const isAuthenticated = async (req, res, next) => {
  try {
    if (req.session && req.session.userId) {
      const user = await User.findById(req.session.userId).select('_id role name email');
      if (!user) {
        return res.status(401).json({ message: 'Unauthorized. User not found.' });
      }
      req.user = {
        id: user._id,
        role: user.role,
        name: user.name,
        email: user.email,
      };
      next();
    } else {
      res.status(401).json({ message: 'Unauthorized. Please login first.' });
    }
  } catch (err) {
    console.error('Auth middleware error:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Middleware to check if user has specific roles
const isRole = (allowedRoles) => {
  return (req, res, next) => {
    if (req.user && allowedRoles.includes(req.user.role)) {
      next();
    } else {
      res.status(403).json({ message: 'Forbidden: Insufficient permissions.' });
    }
  };
};

module.exports = {
  isAuthenticated,
  isRole,
};
