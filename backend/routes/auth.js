import express from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { StartupUser } from '../models/StartupUser.js';
import { InvestorUser } from '../models/InvestorUser.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

function sign(user) {
  return jwt.sign({ id: user._id, role: user.role, name: user.name }, process.env.JWT_SECRET, { expiresIn: process.env.TOKEN_EXPIRY || '7d' });
}

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    
    // Check if user exists in either collection
    const existingStartup = await StartupUser.findOne({ email });
    const existingInvestor = await InvestorUser.findOne({ email });
    const existingUser = await User.findOne({ email });
    
    if (existingStartup || existingInvestor || existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }
    
    let user;
    if (role === 'startup') {
      user = await StartupUser.create({ name, email, password, role });
    } else if (role === 'investor') {
      user = await InvestorUser.create({ name, email, password, role });
    } else {
      user = await User.create({ name, email, password, role });
    }
    
    res.json({ token: sign(user), user: { id: user._id, name: user.name, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Try to find user in all collections
    let user = await StartupUser.findOne({ email });
    if (!user) user = await InvestorUser.findOne({ email });
    if (!user) user = await User.findOne({ email });
    
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });
    
    const match = await user.comparePassword(password);
    if (!match) return res.status(400).json({ message: 'Invalid credentials' });
    
    res.json({ token: sign(user), user: { id: user._id, name: user.name, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get current user profile
router.get('/me', protect, async (req, res) => {
  try {
    // Try to find user in appropriate collection based on role
    let user;
    if (req.user.role === 'startup') {
      user = await StartupUser.findById(req.user.id).select('-password');
    } else if (req.user.role === 'investor') {
      user = await InvestorUser.findById(req.user.id).select('-password');
    } else {
      user = await User.findById(req.user.id).select('-password');
    }
    
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
