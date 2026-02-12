import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const startupUserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  role: { type: String, default: 'startup' },
  companyName: { type: String },
  industry: [{ type: String }],
  stage: { type: String },
  fundingRequirement: {
    min: { type: Number, default: 0 },
    max: { type: Number, default: 0 }
  },
  traction: { type: String },
  description: { type: String },
  pitchDeckUrl: { type: String },
  logoUrl: { type: String },
  keywords: [{ type: String }],
  location: { type: String },
  founders: [{ type: String }],
  website: { type: String },
  pastActivity: [{ type: String }],
  suspendedUntil: { type: Date },
  suspensionReason: { type: String }
}, { timestamps: true });

startupUserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

startupUserSchema.methods.comparePassword = async function(candidate) {
  return bcrypt.compare(candidate, this.password);
};

export const StartupUser = mongoose.model('StartupUser', startupUserSchema);
