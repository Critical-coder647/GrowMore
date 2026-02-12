import express from 'express';
import { auth } from '../middleware/auth.js';
import { StartupUser } from '../models/StartupUser.js';
import { InvestorUser } from '../models/InvestorUser.js';
import { User } from '../models/User.js';

const router = express.Router();

const resolveModel = (userType) => {
  if (userType === 'StartupUser' || userType === 'startup') return StartupUser;
  if (userType === 'InvestorUser' || userType === 'investor') return InvestorUser;
  return User;
};

router.post('/users/:id/suspend', auth(['admin']), async (req, res) => {
  try {
    const { userType, days, until, reason } = req.body;
    const Model = resolveModel(userType);
    const user = await Model.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    let suspendUntil = null;
    if (until) {
      suspendUntil = new Date(until);
    } else {
      const durationDays = Number(days || 7);
      suspendUntil = new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000);
    }

    user.suspendedUntil = suspendUntil;
    user.suspensionReason = reason || 'Policy violation';
    await user.save();

    res.json({ id: user._id, suspendedUntil: user.suspendedUntil });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
