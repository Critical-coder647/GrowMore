import express from 'express';
import multer from 'multer';
import path from 'path';
import { Startup } from '../models/Startup.js';
import { auth } from '../middleware/auth.js';

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
    const { name, founders, industry, stage, fundingRequirementMin, fundingRequirementMax, fundingGoal, traction, description, keywords } = req.body;
    const pitchDeckPath = req.files?.pitchDeck ? req.files.pitchDeck[0].path : undefined;
    const logoPath = req.files?.logo ? req.files.logo[0].path : undefined;
    
    // Handle both fundingGoal (from frontend form) and fundingRequirementMin/Max
    const fundingMin = fundingRequirementMin || fundingGoal || 0;
    const fundingMax = fundingRequirementMax || fundingGoal || 0;
    
    const startup = await Startup.create({
      name,
      founders: founders ? (Array.isArray(founders) ? founders : founders.split(',').map(s=>s.trim())) : [],
      industry: industry ? (Array.isArray(industry) ? industry : [industry.trim()]) : [],
      stage,
      fundingRequirementMin: Number(fundingMin),
      fundingRequirementMax: Number(fundingMax),
      traction,
      description,
      keywords: keywords ? (Array.isArray(keywords) ? keywords : keywords.split(',').map(s=>s.trim().toLowerCase())) : [],
      pitchDeckPath,
      logoPath,
      owner: req.user.id
    });
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
  const list = await Startup.find(filter).select('name industry stage fundingRequirementMin fundingRequirementMax description logoPath').limit(100);
  res.json(list);
});

router.get('/:id', auth(['startup','admin','investor']), async (req, res) => {
  const s = await Startup.findById(req.params.id);
  if (!s) return res.status(404).json({ message: 'Not found' });
  res.json(s);
});

export default router;
