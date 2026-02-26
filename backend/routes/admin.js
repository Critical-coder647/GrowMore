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

const resolveProfileModel = (userType) => {
  if (userType === 'StartupUser' || userType === 'startup') return StartupUser;
  if (userType === 'InvestorUser' || userType === 'investor') return InvestorUser;
  return null;
};

router.get('/profiles', auth(['admin']), async (req, res) => {
  try {
    const { status = 'pending' } = req.query;
    let query = {};
    if (status === 'pending') {
      query = {
        $or: [
          { verificationStatus: 'pending' },
          { verificationStatus: { $exists: false } },
          { verificationStatus: null }
        ]
      };
    } else if (status !== 'all') {
      query = { verificationStatus: status };
    }

    const [startups, investors] = await Promise.all([
      StartupUser.find(query).select('-password').sort({ createdAt: -1 }),
      InvestorUser.find(query).select('-password').sort({ createdAt: -1 })
    ]);

    res.json({ startups, investors });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.patch('/profiles/:userType/:id/review', auth(['admin']), async (req, res) => {
  try {
    const { userType, id } = req.params;
    const { status, note } = req.body;

    if (!['approved', 'rejected', 'pending'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const Model = resolveProfileModel(userType);
    if (!Model) return res.status(400).json({ message: 'Invalid user type' });

    const user = await Model.findById(id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.verificationStatus = status;
    user.verificationReviewedAt = new Date();
    user.verificationReviewedBy = req.user.id;
    user.verificationNote = note || '';
    await user.save();

    res.json({
      id: user._id,
      userType,
      verificationStatus: user.verificationStatus,
      verificationReviewedAt: user.verificationReviewedAt
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

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
