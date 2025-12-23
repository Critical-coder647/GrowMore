import express from 'express';
import { User } from '../models/User.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

router.get('/', auth(['startup','admin','investor']), async (req, res) => {
  const investors = await User.find({ role: 'investor' }).select('-password').limit(200);
  res.json(investors);
});

router.patch('/:id', auth(['investor','admin']), async (req, res) => {
  try {
    const updates = ['interests','keywords','investmentBudget','industriesInterestedIn','stagePreferences','location'].reduce((acc, key) => {
      if (req.body[key] !== undefined) acc[key] = Array.isArray(req.body[key]) ? req.body[key] : key.includes('Budget') ? req.body[key] : String(req.body[key]).split(',').map(s=>s.trim().toLowerCase());
      return acc;
    }, {});
    const investor = await User.findByIdAndUpdate(req.params.id, updates, { new: true }).select('-password');
    res.json(investor);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
