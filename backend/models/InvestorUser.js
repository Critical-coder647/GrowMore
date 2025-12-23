import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const investorUserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  role: { type: String, default: 'investor' },
  firmName: { type: String },
  investmentBudget: {
    min: { type: Number, default: 0 },
    max: { type: Number, default: 0 }
  },
  industriesInterestedIn: [{ type: String }],
  stagePreferences: [{ type: String }],
  location: { type: String },
  keywords: [{ type: String }],
  interests: [{ type: String }],
  portfolioCompanies: [{ type: String }],
  pastActivity: [{ type: String }],
  checkSize: { type: Number },
  thesis: { type: String }
}, { timestamps: true });

investorUserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

investorUserSchema.methods.comparePassword = async function(candidate) {
  return bcrypt.compare(candidate, this.password);
};

export const InvestorUser = mongoose.model('InvestorUser', investorUserSchema);
