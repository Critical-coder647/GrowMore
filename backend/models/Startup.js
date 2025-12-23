import mongoose from 'mongoose';

const matchSchema = new mongoose.Schema({
  investorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  score: Number,
  reason: String
}, { _id: false });

const startupSchema = new mongoose.Schema({
  name: { type: String, required: true },
  founders: [{ type: String }],
  industry: [{ type: String }],
  stage: { type: String },
  fundingRequirementMin: { type: Number, default: 0 },
  fundingRequirementMax: { type: Number, default: 0 },
  traction: { type: String },
  description: { type: String },
  pitchDeckPath: { type: String },
  logoPath: { type: String },
  keywords: [{ type: String }],
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  aiMatches: [matchSchema]
}, { timestamps: true });

export const Startup = mongoose.model('Startup', startupSchema);
