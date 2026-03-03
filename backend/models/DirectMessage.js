import mongoose from 'mongoose';

const directMessageSchema = new mongoose.Schema({
  senderId: { type: mongoose.Schema.Types.ObjectId, required: true },
  senderType: { type: String, enum: ['StartupUser', 'InvestorUser', 'User'], required: true },
  recipientId: { type: mongoose.Schema.Types.ObjectId, required: true },
  recipientType: { type: String, enum: ['StartupUser', 'InvestorUser', 'User'], required: true },
  content: { type: String, required: true, trim: true },
  isRead: { type: Boolean, default: false },
  readAt: { type: Date }
}, { timestamps: true });

directMessageSchema.index({ senderId: 1, recipientId: 1, createdAt: -1 });
directMessageSchema.index({ recipientId: 1, isRead: 1, createdAt: -1 });

export const DirectMessage = mongoose.model('DirectMessage', directMessageSchema);
