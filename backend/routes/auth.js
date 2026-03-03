import express from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { StartupUser } from '../models/StartupUser.js';
import { InvestorUser } from '../models/InvestorUser.js';
import { Startup } from '../models/Startup.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

function sign(user) {
  return jwt.sign({ id: user._id, role: user.role, name: user.name }, process.env.JWT_SECRET, { expiresIn: process.env.TOKEN_EXPIRY || '7d' });
}

function escapeRegex(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
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
    
    res.json({
      token: sign(user),
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
        verificationStatus: user.verificationStatus || null
      }
    });
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
    
    res.json({
      token: sign(user),
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
        verificationStatus: user.verificationStatus || null
      }
    });
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

router.put('/profile', protect, async (req, res) => {
  try {
    let user;
    if (req.user.role === 'startup') {
      user = await StartupUser.findById(req.user.id);
    } else if (req.user.role === 'investor') {
      user = await InvestorUser.findById(req.user.id);
    } else {
      user = await User.findById(req.user.id);
    }

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const {
      firstName,
      lastName,
      email,
      phone,
      headline,
      bio,
      linkedin,
      twitter,
      website,
      location
    } = req.body || {};

    if (typeof firstName === 'string' || typeof lastName === 'string') {
      const composedName = `${String(firstName || '').trim()} ${String(lastName || '').trim()}`.trim();
      if (composedName) user.name = composedName;
    }

    if (typeof email === 'string' && email.trim()) {
      const normalizedEmail = email.trim().toLowerCase();
      const currentId = String(user._id);
      const [existingStartup, existingInvestor, existingUser] = await Promise.all([
        StartupUser.findOne({ email: normalizedEmail }).select('_id'),
        InvestorUser.findOne({ email: normalizedEmail }).select('_id'),
        User.findOne({ email: normalizedEmail }).select('_id')
      ]);

      const isTaken = [existingStartup, existingInvestor, existingUser]
        .filter(Boolean)
        .some((record) => String(record._id) !== currentId);

      if (isTaken) {
        return res.status(400).json({ message: 'Email already exists' });
      }

      user.email = normalizedEmail;
    }

    if (typeof phone === 'string') user.phone = phone.trim();
    if (typeof headline === 'string') user.headline = headline.trim();
    if (typeof bio === 'string') user.bio = bio.trim();
    if (typeof linkedin === 'string') user.linkedin = linkedin.trim();
    if (typeof twitter === 'string') user.twitter = twitter.trim();
    if (typeof website === 'string') user.website = website.trim();
    if (typeof location === 'string') user.location = location.trim();

    if (req.user.role === 'startup' && typeof bio === 'string') {
      user.description = bio.trim();
    }
    if (req.user.role === 'investor' && typeof bio === 'string') {
      user.thesis = bio.trim();
    }

    await user.save();

    const safeUser = user.toObject();
    delete safeUser.password;

    res.json({
      message: 'Profile updated successfully',
      user: {
        ...safeUser,
        firstName: (safeUser.name || '').split(' ')[0] || '',
        lastName: (safeUser.name || '').split(' ').slice(1).join(' ') || ''
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/search-users', protect, async (req, res) => {
  try {
    const query = String(req.query.q || '').trim();
    const limit = Math.min(Math.max(Number(req.query.limit) || 8, 1), 25);

    const nameRegex = query ? new RegExp(escapeRegex(query), 'i') : null;
    const baseFilter = { _id: { $ne: req.user.id } };

    if (nameRegex) {
      baseFilter.name = nameRegex;
    }

    const sortBy = query ? { name: 1 } : { createdAt: -1 };

    const [startupUsers, investorUsers, genericUsers] = await Promise.all([
      StartupUser.find(baseFilter).select('name role companyName createdAt').sort(sortBy).limit(limit),
      InvestorUser.find(baseFilter).select('name role firmName createdAt').sort(sortBy).limit(limit),
      User.find({ ...baseFilter, role: { $in: ['startup', 'investor'] } })
        .select('name role createdAt')
        .sort(sortBy)
        .limit(limit)
    ]);

    const results = [
      ...startupUsers.map((user) => ({
        id: String(user._id),
        name: user.name,
        role: user.role,
        subtitle: user.companyName || 'startup',
        createdAt: user.createdAt
      })),
      ...investorUsers.map((user) => ({
        id: String(user._id),
        name: user.name,
        role: user.role,
        subtitle: user.firmName || 'investor',
        createdAt: user.createdAt
      })),
      ...genericUsers.map((user) => ({
        id: String(user._id),
        name: user.name,
        role: user.role,
        subtitle: user.role === 'startup' ? 'startup' : 'investor',
        createdAt: user.createdAt
      }))
    ]
      .sort((a, b) => {
        if (query) return a.name.localeCompare(b.name);
        return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
      })
      .slice(0, limit);

    res.json(results);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/public-profile/:id', protect, async (req, res) => {
  try {
    const { id } = req.params;

    const [startupUser, investorUser, adminUser, startupProfile] = await Promise.all([
      StartupUser.findById(id)
        .select('name role email companyName industry stage fundingRequirement traction description logoUrl keywords location founders website pastActivity'),
      InvestorUser.findById(id)
        .select('name role email firmName investmentBudget industriesInterestedIn stagePreferences location keywords interests portfolioCompanies checkSize thesis'),
      User.findById(id).select('name role email location keywords interests'),
      Startup.findOne({ owner: id })
        .sort({ createdAt: -1 })
        .select('name founders industry stage fundingRequirementMin fundingRequirementMax traction description pitchDeckPath logoPath keywords createdAt')
    ]);

    const record = startupUser || investorUser || adminUser;
    if (!record) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isStartup = record.role === 'startup';
    const isInvestor = record.role === 'investor';

    const profile = {
      id: String(record._id),
      role: record.role,
      name: record.name,
      email: record.email,
      location: record.location || 'San Francisco, CA',
      subtitle: isStartup
        ? (record.companyName || startupProfile?.name || record.name)
        : isInvestor
        ? (record.firmName || 'Investor')
        : 'Member',
      heroTitle: isStartup
        ? (record.companyName || startupProfile?.name || record.name)
        : isInvestor
        ? `${record.name} • ${record.firmName || 'Investor'}`
        : record.name,
      description: isStartup
        ? (record.description || startupProfile?.description || 'Building the future with a scalable and resilient startup.')
        : isInvestor
        ? (record.thesis || 'Focused on supporting exceptional founders with long-term capital and guidance.')
        : 'Active member of the GrowMore network.',
      website: record.website || null,
      startup: isStartup
        ? {
            companyName: record.companyName || startupProfile?.name || record.name,
            founders: (record.founders && record.founders.length ? record.founders : startupProfile?.founders) || [record.name],
            industries: (record.industry && record.industry.length ? record.industry : startupProfile?.industry) || [],
            stage: record.stage || startupProfile?.stage || 'Early Stage',
            fundingRequirementMin: Number(record.fundingRequirement?.min || startupProfile?.fundingRequirementMin || 0),
            fundingRequirementMax: Number(record.fundingRequirement?.max || startupProfile?.fundingRequirementMax || 0),
            traction: record.traction || startupProfile?.traction || '',
            keywords: (record.keywords && record.keywords.length ? record.keywords : startupProfile?.keywords) || [],
            pitchDeckPath: startupProfile?.pitchDeckPath || null,
            logoPath: startupProfile?.logoPath || record.logoUrl || null,
            foundedYear: new Date(startupProfile?.createdAt || record.createdAt || Date.now()).getFullYear()
          }
        : null,
      investor: isInvestor
        ? {
            firmName: record.firmName || `${record.name} Capital`,
            checkSize: Number(record.checkSize || 0),
            industries: record.industriesInterestedIn || [],
            stagePreferences: record.stagePreferences || [],
            interests: record.interests || [],
            keywords: record.keywords || [],
            portfolioCompanies: record.portfolioCompanies || [],
            investmentBudget: {
              min: Number(record.investmentBudget?.min || 0),
              max: Number(record.investmentBudget?.max || 0)
            }
          }
        : null
    };

    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
