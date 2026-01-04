import express from 'express';
import multer from 'multer';
import path from 'path';
import { CommunityInteraction } from '../models/CommunityInteraction.js';
import { StartupUser } from '../models/StartupUser.js';
import { InvestorUser } from '../models/InvestorUser.js';
import { Notification } from '../models/Notification.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Configure multer for media uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'backend/uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|mp4|mov|avi|webm/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only image and video files are allowed'));
  }
});

// Create a new post
router.post('/posts', protect, upload.array('media', 10), async (req, res) => {
  try {
    const { content, tags, visibility } = req.body;
    
    // Process uploaded media files
    const media = req.files ? req.files.map(file => ({
      url: `/uploads/${file.filename}`,
      type: file.mimetype.startsWith('image') ? 'image' : 'video',
      filename: file.filename
    })) : [];
    
    const post = await CommunityInteraction.create({
      userId: req.user.id,
      userType: req.user.role === 'startup' ? 'StartupUser' : 'InvestorUser',
      userName: req.user.name,
      userRole: req.user.role,
      interactionType: 'post',
      content,
      media,
      tags: tags ? (Array.isArray(tags) ? tags : JSON.parse(tags)) : [],
      visibility: visibility || 'public'
    });
    
    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all posts (feed)
router.get('/posts', protect, async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    
    const posts = await CommunityInteraction.find({ 
      interactionType: 'post',
      isActive: true,
      visibility: { $in: ['public', 'connections'] }
    })
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();
    
    // Return posts directly for simplicity
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get single post
router.get('/posts/:id', protect, async (req, res) => {
  try {
    const post = await CommunityInteraction.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Like a post
router.post('/posts/:id/like', protect, async (req, res) => {
  try {
    const post = await CommunityInteraction.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    
    const alreadyLiked = post.likes.some(
      like => like.userId.toString() === req.user.id
    );
    
    if (alreadyLiked) {
      post.likes = post.likes.filter(
        like => like.userId.toString() !== req.user.id
      );
    } else {
      post.likes.push({
        userId: req.user.id,
        userType: req.user.role === 'startup' ? 'StartupUser' : 'InvestorUser'
      });
      
      // Create notification for post owner if it's not their own post
      if (post.userId.toString() !== req.user.id) {
        await Notification.create({
          recipientId: post.userId,
          recipientType: post.userType,
          senderId: req.user.id,
          senderType: req.user.role === 'startup' ? 'StartupUser' : 'InvestorUser',
          senderName: req.user.name,
          type: 'like',
          title: 'New Like',
          message: `${req.user.name} liked your post`,
          link: '/community',
          metadata: { postId: post._id }
        });
      }
    }
    
    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add comment to post
router.post('/posts/:id/comments', protect, async (req, res) => {
  try {
    const { content } = req.body;
    const post = await CommunityInteraction.findById(req.params.id);
    
    if (!post) return res.status(404).json({ message: 'Post not found' });
    
    post.comments.push({
      userId: req.user.id,
      userType: req.user.role === 'startup' ? 'StartupUser' : 'InvestorUser',
      userName: req.user.name,
      content
    });
    
    // Create notification for post owner if it's not their own post
    if (post.userId.toString() !== req.user.id) {
      await Notification.create({
        recipientId: post.userId,
        recipientType: post.userType,
        senderId: req.user.id,
        senderType: req.user.role === 'startup' ? 'StartupUser' : 'InvestorUser',
        senderName: req.user.name,
        type: 'comment',
        title: 'New Comment',
        message: `${req.user.name} commented on your post: "${content.substring(0, 50)}${content.length > 50 ? '...' : ''}"`,
        link: '/community',
        metadata: { postId: post._id }
      });
    }
    
    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get user's posts
router.get('/users/:userId/posts', protect, async (req, res) => {
  try {
    const posts = await CommunityInteraction.find({
      userId: req.params.userId,
      interactionType: 'post',
      isActive: true
    }).sort({ createdAt: -1 });
    
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update post
router.put('/posts/:id', protect, async (req, res) => {
  try {
    const { content } = req.body;
    const post = await CommunityInteraction.findById(req.params.id);
    
    if (!post) return res.status(404).json({ message: 'Post not found' });
    
    if (post.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this post' });
    }
    
    post.content = content;
    await post.save();
    
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete post
router.delete('/posts/:id', protect, async (req, res) => {
  try {
    const post = await CommunityInteraction.findById(req.params.id);
    
    if (!post) return res.status(404).json({ message: 'Post not found' });
    
    if (post.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this post' });
    }
    
    post.isActive = false;
    await post.save();
    
    res.json({ message: 'Post deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Search posts by tags
router.get('/posts/search/tags', protect, async (req, res) => {
  try {
    const { tags } = req.query;
    const tagArray = tags.split(',').map(tag => tag.trim());
    
    const posts = await CommunityInteraction.find({
      interactionType: 'post',
      isActive: true,
      tags: { $in: tagArray }
    }).sort({ createdAt: -1 });
    
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
