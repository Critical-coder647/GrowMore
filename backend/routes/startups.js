import express from 'express';
import multer from 'multer';
import path from 'path';
import { Startup } from '../models/Startup.js';
import { StartupUser } from '../models/StartupUser.js';
import { auth } from '../middleware/auth.js';
import { Notification } from '../models/Notification.js';

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(process.cwd(), 'backend', 'uploads'));
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + '-' + file.originalname);
  }
});

const upload = multer({ storage });

router.post('/', auth(['startup','admin']), upload.fields([{ name: 'pitchDeck' }, { name: 'logo' }]), async (req, res) => {
  try {
    const {
      name,
      companyName,
      founders,
      industry,
      stage,
      fundingRequirementMin,
      fundingRequirementMax,
      fundingGoal,
      traction,
      description,
      keywords,
      website,
      location,
      problemStatement,
      solution,
      fundingPurpose,
      usageBreakdown,
      tam,
      sam,
      som
    } = req.body;

    const pitchDeckPath = req.files?.pitchDeck ? `/uploads/${req.files.pitchDeck[0].filename}` : undefined;
    const logoPath = req.files?.logo ? `/uploads/${req.files.logo[0].filename}` : undefined;
    
    // Handle both fundingGoal (from frontend form) and fundingRequirementMin/Max
    const fundingMin = fundingRequirementMin || fundingGoal || 0;
    const fundingMax = fundingRequirementMax || fundingGoal || 0;
    
    const parsedFounders = founders
      ? (Array.isArray(founders) ? founders : String(founders).split(',').map((item) => item.trim()).filter(Boolean))
      : [];
    const parsedIndustry = industry
      ? (Array.isArray(industry) ? industry : [String(industry).trim()]).filter(Boolean)
      : [];
    const parsedKeywords = keywords
      ? (Array.isArray(keywords) ? keywords : String(keywords).split(',').map((item) => item.trim().toLowerCase())).filter(Boolean)
      : [];

    const startupPayload = {
      name: name || companyName,
      founders: parsedFounders,
      industry: parsedIndustry,
      stage,
      fundingRequirementMin: Number(fundingMin),
      fundingRequirementMax: Number(fundingMax),
      traction,
      description,
      keywords: parsedKeywords,
      owner: req.user.id
    };

    if (pitchDeckPath) startupPayload.pitchDeckPath = pitchDeckPath;
    if (logoPath) startupPayload.logoPath = logoPath;

    const startup = await Startup.findOneAndUpdate(
      { owner: req.user.id },
      { $set: startupPayload },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    const startupUserUpdate = {
      companyName: companyName || name,
      industry: parsedIndustry,
      stage,
      fundingRequirement: {
        min: Number(fundingMin),
        max: Number(fundingMax)
      },
      traction,
      description,
      website,
      location,
      founders: parsedFounders,
      keywords: parsedKeywords,
      problemStatement,
      solution,
      fundingPurpose,
      usageBreakdown,
      tam,
      sam,
      som,
      verificationStatus: 'pending'
    };

    if (pitchDeckPath) startupUserUpdate.pitchDeckUrl = pitchDeckPath;
    if (logoPath) startupUserUpdate.logoUrl = logoPath;

    await StartupUser.findByIdAndUpdate(
      req.user.id,
      { $set: startupUserUpdate },
      { new: true }
    );

    res.json(startup);
  } catch (err) {
    console.error('Error creating startup:', err);
    res.status(500).json({ message: err.message });
  }
});

router.get('/', auth(['admin']), async (req, res) => {
  const list = await Startup.find().limit(100);
  res.json(list);
});

// Discover list for investors (and admin) with lightweight fields
router.get('/discover', auth(['investor','admin']), async (req, res) => {
  const { q, industry, stage } = req.query;
  const filter = {};
  if (industry) filter.industry = { $in: String(industry).split(',').map(s=>s.trim()) };
  if (stage) filter.stage = String(stage);
  if (q) filter.$or = [
    { name: new RegExp(q, 'i') },
    { description: new RegExp(q, 'i') },
    { keywords: { $in: [String(q).toLowerCase()] } }
  ];
  const list = await Startup.find(filter)
    .select('name founders owner industry stage fundingRequirementMin fundingRequirementMax description logoPath pitchDeckPath keywords fundingProposal createdAt')
    .limit(100);
  res.json(list);
});

router.post('/funding-request', auth(['startup']), async (req, res) => {
  try {
    const {
      targetAmount,
      minTicket,
      stage,
      valuation,
      elevatorPitch,
      summary,
      shareToFeed
    } = req.body || {};

    const startupUser = await StartupUser.findById(req.user.id).select('verificationStatus');
    if (!startupUser) {
      return res.status(404).json({ message: 'Startup user not found' });
    }

    if (String(startupUser.verificationStatus || 'pending').toLowerCase() !== 'approved') {
      return res.status(403).json({ message: 'Profile must be approved before creating funding proposals' });
    }

    let startup = await Startup.findOne({ owner: req.user.id });
    if (!startup) {
      const startupUserForInit = await StartupUser.findById(req.user.id);
      startup = await Startup.create({
        owner: req.user.id,
        name: startupUserForInit?.companyName || startupUserForInit?.name || 'Startup',
        founders: startupUserForInit?.founders || [startupUserForInit?.name || 'Founder'],
        industry: startupUserForInit?.industry || [],
        stage: stage || startupUserForInit?.stage || '',
        fundingRequirementMin: Number(minTicket || startupUserForInit?.fundingRequirement?.min || 0),
        fundingRequirementMax: Number(targetAmount || startupUserForInit?.fundingRequirement?.max || 0),
        traction: startupUserForInit?.traction || '',
        description: startupUserForInit?.description || '',
        keywords: startupUserForInit?.keywords || [],
        pitchDeckPath: startupUserForInit?.pitchDeckUrl || undefined,
        logoPath: startupUserForInit?.logoUrl || undefined
      });
    }

    startup.fundingProposal = {
      targetAmount: Number(targetAmount || 0),
      minTicket: Number(minTicket || 0),
      stage: stage || startup.stage || '',
      valuation: valuation || '',
      elevatorPitch: elevatorPitch || '',
      summary: summary || '',
      shareToFeed: Boolean(shareToFeed),
      status: 'active',
      createdAt: new Date()
    };

    if (Number(targetAmount || 0) > 0) {
      startup.fundingRequirementMin = Number(minTicket || startup.fundingRequirementMin || 0);
      startup.fundingRequirementMax = Number(targetAmount);
    }
    if (stage) {
      startup.stage = stage;
    }
    if (summary) {
      startup.description = summary;
    }

    await startup.save();

    res.json({ message: 'Funding request created successfully', startup });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:id', auth(['startup','admin','investor']), async (req, res) => {
  const s = await Startup.findById(req.params.id);
  if (!s) return res.status(404).json({ message: 'Not found' });
  res.json(s);
});

router.post('/reapply-verification', auth(['startup']), async (req, res) => {
  try {
    const startupUser = await StartupUser.findById(req.user.id);
    if (!startupUser) {
      return res.status(404).json({ message: 'Startup user not found' });
    }

    if (startupUser.verificationStatus !== 'rejected') {
      return res.status(400).json({ message: 'You can reapply only after rejection' });
    }

    startupUser.verificationStatus = 'pending';
    startupUser.verificationReviewedAt = null;
    startupUser.verificationReviewedBy = null;
    startupUser.verificationNote = '';
    await startupUser.save();

    await Notification.create({
      recipientId: startupUser._id,
      recipientType: 'StartupUser',
      senderType: 'System',
      senderName: 'GrowMore',
      type: 'system',
      title: 'Verification Reapplication Submitted',
      message: 'Your profile has been resubmitted for admin verification.',
      link: '/startup-dashboard',
      metadata: { verificationStatus: 'pending' }
    });

    res.json({ message: 'Reapplied for verification', verificationStatus: 'pending' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
