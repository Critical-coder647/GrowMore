import express from 'express';
import mongoose from 'mongoose';
import { auth } from '../middleware/auth.js';
import { DirectMessage } from '../models/DirectMessage.js';
import { StartupUser } from '../models/StartupUser.js';
import { InvestorUser } from '../models/InvestorUser.js';
import { User } from '../models/User.js';

const router = express.Router();
const ACTIVE_WINDOW_MS = 2 * 60 * 1000;

function mapSenderType(role) {
  if (role === 'startup') return 'StartupUser';
  if (role === 'investor') return 'InvestorUser';
  return 'User';
}

async function resolveUserById(id) {
  const [startup, investor, user] = await Promise.all([
    StartupUser.findById(id).select('name role companyName lastSeenAt'),
    InvestorUser.findById(id).select('name role firmName lastSeenAt'),
    User.findById(id).select('name role lastSeenAt')
  ]);

  const record = startup || investor || user;
  if (!record) return null;

  return {
    id: String(record._id),
    name: record.name,
    role: record.role,
    subtitle: startup?.companyName || investor?.firmName || record.role,
    lastSeenAt: record.lastSeenAt || null,
    isActive: record.lastSeenAt
      ? Date.now() - new Date(record.lastSeenAt).getTime() <= ACTIVE_WINDOW_MS
      : false
  };
}

router.get('/conversations', auth(['startup', 'investor', 'admin']), async (req, res) => {
  try {
    const userId = String(req.user.id);

    const messages = await DirectMessage.find({
      $or: [{ senderId: userId }, { recipientId: userId }]
    }).sort({ createdAt: -1 }).limit(1000);

    const conversationMap = new Map();

    messages.forEach((msg) => {
      const senderId = String(msg.senderId);
      const recipientId = String(msg.recipientId);
      const partnerId = senderId === userId ? recipientId : senderId;
      const isUnreadForCurrentUser = recipientId === userId && !msg.isRead;

      if (!conversationMap.has(partnerId)) {
        conversationMap.set(partnerId, {
          partnerId,
          lastMessage: msg.content,
          lastMessageAt: msg.createdAt,
          unreadCount: isUnreadForCurrentUser ? 1 : 0
        });
      } else if (isUnreadForCurrentUser) {
        conversationMap.get(partnerId).unreadCount += 1;
      }
    });

    const partnerIds = [...conversationMap.keys()];
    const partners = await Promise.all(partnerIds.map((id) => resolveUserById(id)));

    const conversations = partnerIds
      .map((partnerId, index) => {
        const base = conversationMap.get(partnerId);
        const partner = partners[index];
        if (!partner) return null;
        return {
          ...base,
          partnerName: partner.name,
          partnerRole: partner.role,
          partnerSubtitle: partner.subtitle,
          partnerLastSeenAt: partner.lastSeenAt,
          partnerIsActive: partner.isActive
        };
      })
      .filter(Boolean)
      .sort((a, b) => new Date(b.lastMessageAt) - new Date(a.lastMessageAt));

    res.json(conversations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:partnerId', auth(['startup', 'investor', 'admin']), async (req, res) => {
  try {
    const userId = String(req.user.id);
    const { partnerId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(partnerId)) {
      return res.status(400).json({ message: 'Invalid partner id' });
    }

    const thread = await DirectMessage.find({
      $or: [
        { senderId: userId, recipientId: partnerId },
        { senderId: partnerId, recipientId: userId }
      ]
    }).sort({ createdAt: 1 });

    await DirectMessage.updateMany(
      { senderId: partnerId, recipientId: userId, isRead: false },
      { $set: { isRead: true, readAt: new Date() } }
    );

    res.json(thread);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/:partnerId', auth(['startup', 'investor', 'admin']), async (req, res) => {
  try {
    const { partnerId } = req.params;
    const { content } = req.body;

    if (!mongoose.Types.ObjectId.isValid(partnerId)) {
      return res.status(400).json({ message: 'Invalid partner id' });
    }

    if (!content || !String(content).trim()) {
      return res.status(400).json({ message: 'Message content is required' });
    }

    const partner = await resolveUserById(partnerId);
    if (!partner) {
      return res.status(404).json({ message: 'Recipient not found' });
    }

    const message = await DirectMessage.create({
      senderId: req.user.id,
      senderType: mapSenderType(req.user.role),
      recipientId: partnerId,
      recipientType: mapSenderType(partner.role),
      content: String(content).trim()
    });

    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
