const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Optional auth middleware - doesn't fail if no token
const optionalAuth = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-__v');
    } catch (error) {
      // Token invalid but continue anyway
      req.user = null;
    }
  }

  next();
};

module.exports = { optionalAuth };
