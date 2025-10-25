import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({ name, email, password });

    res.status(201).json({
      token: generateToken(user._id),
      user: user.getPublicProfile()
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Need to explicitly select password since it's excluded by default
    const user = await User.findOne({ email }).select('+password');
    
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.json({
      token: generateToken(user._id),
      user: user.getPublicProfile()
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Google OAuth callback
export const googleCallback = async (req, res) => {
  try {
    const user = req.user;
    const token = generateToken(user._id);
    
    // Redirect to frontend with token
    const clientURL = process.env.CLIENT_URL || 'http://localhost:3000';
    res.redirect(`${clientURL}/auth/google/callback?token=${token}`);
  } catch (error) {
    console.error('Google callback error:', error);
    const clientURL = process.env.CLIENT_URL || 'http://localhost:3000';
    res.redirect(`${clientURL}/login?error=auth_failed`);
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user.getPublicProfile());
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Update basic info
    if (req.body.name !== undefined) user.name = req.body.name;
    
    // Update profile details
    if (req.body.age !== undefined) user.age = req.body.age;
    if (req.body.weight !== undefined) user.weight = req.body.weight;
    if (req.body.height !== undefined) user.height = req.body.height;
    if (req.body.goal !== undefined) user.goal = req.body.goal;
    
    // Update settings
    if (req.body.theme) user.theme = req.body.theme;
    
    // Update preferences
    if (req.body.preferences) {
      user.preferences = { 
        ...user.preferences.toObject(), 
        ...req.body.preferences 
      };
    }

    await user.save();
    
    res.json(user.getPublicProfile());
  } catch (error) {
    console.error('Update profile error:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: errors.join(', ') });
    }
    
    res.status(500).json({ message: error.message });
  }
};
