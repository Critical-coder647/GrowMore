import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  recipientId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'recipientType'
  },
  recipientType: {
    type: String,
    required: true,
    enum: ['StartupUser', 'InvestorUser']
  },
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'senderType'
  },
  senderType: {
    type: String,
    enum: ['StartupUser', 'InvestorUser', 'System']
  },
  senderName: {
    type: String,
    default: 'System'
  },
  type: {
    type: String,
    required: true,
    enum: ['like', 'comment', 'mention', 'funding_alert', 'investor_interest', 'message', 'system', 'community', 'connection']
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  link: {
    type: String
  },
  read: {
    type: Boolean,
    default: false
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed
  }
}, {
  timestamps: true
});

// Index for efficient querying
notificationSchema.index({ recipientId: 1, createdAt: -1 });
notificationSchema.index({ recipientId: 1, read: 1 });

export const Notification = mongoose.model('Notification', notificationSchema);
