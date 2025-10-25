import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  try {
    let token;

    // Check for Bearer token in Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      console.log('❌ No token provided');
      return res.status(401).json({ message: 'Not authorized, no token provided' });
    }

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('✅ Token verified for user:', decoded.id);
    } catch (err) {
      console.log('❌ Token verification failed:', err.message);
      if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({ message: 'Invalid token' });
      }
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Token expired' });
      }
      return res.status(401).json({ message: 'Token verification failed' });
    }

    // Get user from token (don't explicitly select -password, let schema handle it)
    const user = await User.findById(decoded.id);
    
    if (!user) {
      console.log('❌ User not found:', decoded.id);
      return res.status(401).json({ message: 'User not found' });
    }

    // Attach user to request (remove password field if it exists)
    req.user = {
      _id: user._id,
      id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      googleId: user.googleId,
      theme: user.theme,
      preferences: user.preferences
    };

    console.log('✅ User authenticated:', user.email);
    next();
  } catch (error) {
    console.error('❌ Auth middleware error:', error);
    res.status(401).json({ 
      message: 'Authentication failed',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
