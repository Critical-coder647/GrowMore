import mongoose from 'mongoose';

const communityInteractionSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    refPath: 'userType',
    required: true 
  },
  userType: { 
    type: String, 
    required: true,
    enum: ['StartupUser', 'InvestorUser']
  },
  userName: { type: String, required: true },
  userRole: { type: String, enum: ['startup', 'investor'], required: true },
  interactionType: { 
    type: String, 
    required: true,
    enum: ['post', 'comment', 'like', 'share', 'message', 'connection_request']
  },
  content: { type: String },
  postId: { type: mongoose.Schema.Types.ObjectId, ref: 'CommunityInteraction' },
  media: [{
    type: { type: String, enum: ['image', 'video', 'document'] },
    url: { type: String }
  }],
  likes: [{
    userId: { type: mongoose.Schema.Types.ObjectId, refPath: 'userType' },
    userType: { type: String, enum: ['StartupUser', 'InvestorUser'] },
    timestamp: { type: Date, default: Date.now }
  }],
  comments: [{
    userId: { type: mongoose.Schema.Types.ObjectId, refPath: 'userType' },
    userType: { type: String, enum: ['StartupUser', 'InvestorUser'] },
    userName: { type: String },
    content: { type: String },
    timestamp: { type: Date, default: Date.now }
  }],
  tags: [{ type: String }],
  visibility: { 
    type: String, 
    enum: ['public', 'connections', 'private'], 
    default: 'public' 
  },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

// Index for faster queries
communityInteractionSchema.index({ userId: 1, createdAt: -1 });
communityInteractionSchema.index({ interactionType: 1, createdAt: -1 });
communityInteractionSchema.index({ tags: 1 });

export const CommunityInteraction = mongoose.model('CommunityInteraction', communityInteractionSchema);
