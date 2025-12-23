import express from 'express';
import { auth } from '../middleware/auth.js';
import { Startup } from '../models/Startup.js';
import { User } from '../models/User.js';
import axios from 'axios';

const router = express.Router();

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';

async function callAIService(startup, investors) {
  try {
    const response = await axios.post(`${AI_SERVICE_URL}/match`, {
      startup: {
        id: startup._id.toString(),
        name: startup.name,
        industry: startup.industry || [],
        stage: startup.stage || '',
        funding_min: startup.fundingRequirementMin || 0,
        funding_max: startup.fundingRequirementMax || 0,
        keywords: startup.keywords || [],
        description: startup.description || ''
      },
      investors: investors.map(inv => ({
        id: inv._id.toString(),
        name: inv.name,
        email: inv.email,
        industries: inv.industriesInterestedIn || [],
        keywords: inv.keywords || [],
        budget_min: inv.investmentBudget?.min || 0,
        budget_max: inv.investmentBudget?.max || inv.investmentBudget || 0,
        preferred_stages: inv.stagePreferences || []
      }))
    });
    return response.data.matches;
  } catch (error) {
    console.error('AI Service error:', error.message);
    throw new Error('Failed to connect to AI matching service');
  }
}

router.get('/match/:startupId', auth(['startup','admin']), async (req, res) => {
  try {
    // Fetch startup
    const startup = await Startup.findById(req.params.startupId);
    if (!startup) {
      return res.status(404).json({ message: 'Startup not found' });
    }

    // Fetch all investors
    const investors = await User.find({ role: 'investor' });
    if (investors.length === 0) {
      return res.json({ startupId: req.params.startupId, matches: [] });
    }

    // Call FastAPI AI service
    const matches = await callAIService(startup, investors);

    // Update startup with AI matches
    startup.aiMatches = matches.map(m => ({
      investorId: m.investor_id,
      score: m.score,
      reason: m.reason
    }));
    await startup.save();

    res.json({ 
      startupId: req.params.startupId, 
      matches: matches.map(m => ({
        investorId: m.investor_id,
        investorName: m.investor_name,
        email: m.investor_email,
        score: m.score,
        reason: m.reason
      }))
    });
  } catch (err) {
    console.error('Match error:', err);
    res.status(500).json({ message: err.message });
  }
});

export default router;
