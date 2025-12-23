import { User } from '../models/User.js';
import { Startup } from '../models/Startup.js';

// Simple helper: normalize array of strings
function norm(list) {
  return (list || []).map(s => s.toLowerCase().trim()).filter(Boolean);
}

function overlapScore(a, b) {
  const setB = new Set(b);
  let count = 0;
  for (const x of a) if (setB.has(x)) count++;
  if (!a.length) return 0;
  return count / a.length; // proportion of startup industries matched
}

function budgetScore(investorBudget, min, max) {
  if (!investorBudget || (!min && !max)) return 0;
  if (min && investorBudget < min) return 0;
  if (max && investorBudget > max) return 0.3; // slightly above range but maybe flexible
  // inside range gives full score
  return 1;
}

function stageScore(preferences, stage) {
  if (!stage) return 0;
  if (!preferences || !preferences.length) return 0.5; // neutral if investor unspecified
  return preferences.includes(stage.toLowerCase()) ? 1 : 0;
}

function keywordSimilarity(startupKeywords, investorKeywords, investorInterests) {
  const sSet = new Set(startupKeywords);
  const combined = norm([...(investorKeywords||[]), ...(investorInterests||[])]);
  if (!startupKeywords.length || !combined.length) return 0;
  let match = 0;
  for (const w of combined) if (sSet.has(w)) match++;
  const unionSize = new Set([...startupKeywords, ...combined]).size;
  return match / unionSize; // Jaccard
}

function buildReason({ investor, scores, startup }) {
  const parts = [];
  if (scores.industryScore > 0) parts.push(`Matches your industry (${norm(startup.industry).join(', ')})`);
  if (scores.budgetScore > 0.9) parts.push('Budget fits your funding requirement');
  else if (scores.budgetScore > 0.3) parts.push('Budget near your funding range');
  if (scores.stageScore === 1) parts.push(`Interested in your stage (${startup.stage})`);
  if (scores.keywordSimilarity > 0) parts.push('Keywords align');
  if (!parts.length) parts.push('Partial alignment on some criteria');
  return parts.join(', ') + '.';
}

export async function computeMatches(startupId, { force = false } = {}) {
  const startup = await Startup.findById(startupId);
  if (!startup) throw new Error('Startup not found');

  // Simple cache: reuse existing if within last 2 hours
  if (!force && startup.aiMatches && startup.aiMatches.length) {
    const ageMinutes = (Date.now() - new Date(startup.updatedAt).getTime()) / 60000;
    if (ageMinutes < 120) {
      return startup.aiMatches.sort((a,b)=>b.score - a.score).slice(0, 25);
    }
  }

  const investors = await User.find({ role: 'investor' }).select('-password');
  const sIndustries = norm(startup.industry);
  const sKeywords = norm(startup.keywords);

  const matches = investors.map(inv => {
    const iIndustries = norm(inv.industriesInterestedIn);
    const iKeywords = norm(inv.keywords);
    const iInterests = norm(inv.interests);

    const industryScore = overlapScore(sIndustries, iIndustries); // 0..1
    const budgetScoreVal = budgetScore(inv.investmentBudget, startup.fundingRequirementMin, startup.fundingRequirementMax); // 0..1
    const stageScoreVal = stageScore(norm(inv.stagePreferences), startup.stage); // 0..1
    const keywordSim = keywordSimilarity(sKeywords, iKeywords, iInterests); // 0..1

    const score = (
      industryScore * 0.5 +
      budgetScoreVal * 0.2 +
      stageScoreVal * 0.15 +
      keywordSim * 0.15
    ) * 100; // scale to 0-100

    const scores = { industryScore, budgetScore: budgetScoreVal, stageScore: stageScoreVal, keywordSimilarity: keywordSim };
    const reason = buildReason({ investor: inv, scores, startup });

    return {
      investorId: inv._id,
      score: Math.round(score),
      reason
    };
  }).filter(m => m.score > 0); // discard zero relevance

  matches.sort((a,b)=> b.score - a.score);
  startup.aiMatches = matches.slice(0, 50); // store top 50
  await startup.save();

  return matches.slice(0, 25);
}
