import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['startup', 'investor', 'admin'], required: true },
  interests: [{ type: String }],
  keywords: [{ type: String }],
  investmentBudget: {
    min: { type: Number, default: 0 },
    max: { type: Number, default: 0 }
  },
  industriesInterestedIn: [{ type: String }],
  stagePreferences: [{ type: String }],
  location: { type: String },
  pastActivity: [{ type: String }]
}, { timestamps: true });

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = async function(candidate) {
  return bcrypt.compare(candidate, this.password);
};

export const User = mongoose.model('User', userSchema);
