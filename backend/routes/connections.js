import express from 'express';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// In-memory storage for demo purposes
// In production, this should be a database collection/table
const connectionRequests = [];
const connections = [];

// Send a connection request
router.post('/request', auth(['startup', 'investor', 'admin']), async (req, res) => {
  try {
    const senderId = req.user.id;
    const senderRole = req.user.role;
    const { investorId, startupId } = req.body;
    
    // Determine recipient based on sender role
    const recipientId = senderRole === 'startup' ? investorId : startupId;
    
    if (!recipientId) {
      return res.status(400).json({ message: 'Recipient ID is required' });
    }
    
    // Check if connection request already exists
    const existingRequest = connectionRequests.find(
      req => req.senderId === senderId && req.recipientId === recipientId
    );
    
    if (existingRequest) {
      return res.status(400).json({ message: 'Connection request already sent' });
    }
    
    // Check if already connected
    const alreadyConnected = connections.find(
      conn => (conn.userId1 === senderId && conn.userId2 === recipientId) ||
              (conn.userId1 === recipientId && conn.userId2 === senderId)
    );
    
    if (alreadyConnected) {
      return res.status(400).json({ message: 'Already connected' });
    }
    
    // Create connection request
    const request = {
      id: Date.now().toString(),
      senderId,
      senderRole,
      recipientId,
      status: 'pending',
      createdAt: new Date(),
      message: req.body.message || ''
    };
    
    connectionRequests.push(request);
    
    res.json({ 
      message: 'Connection request sent successfully', 
      request 
    });
  } catch (err) {
    console.error('Error sending connection request:', err);
    res.status(500).json({ message: err.message });
  }
});

// Get incoming connection requests
router.get('/requests/incoming', auth(['startup', 'investor', 'admin']), async (req, res) => {
  try {
    const userId = req.user.id;
    
    const incoming = connectionRequests.filter(
      req => req.recipientId === userId && req.status === 'pending'
    );
    
    res.json(incoming);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get outgoing connection requests
router.get('/requests/outgoing', auth(['startup', 'investor', 'admin']), async (req, res) => {
  try {
    const userId = req.user.id;
    
    const outgoing = connectionRequests.filter(
      req => req.senderId === userId
    );
    
    res.json(outgoing);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Accept a connection request
router.post('/accept/:requestId', auth(['startup', 'investor', 'admin']), async (req, res) => {
  try {
    const { requestId } = req.params;
    const userId = req.user.id;
    
    const request = connectionRequests.find(
      req => req.id === requestId && req.recipientId === userId
    );
    
    if (!request) {
      return res.status(404).json({ message: 'Connection request not found' });
    }
    
    if (request.status !== 'pending') {
      return res.status(400).json({ message: 'Connection request already processed' });
    }
    
    // Update request status
    request.status = 'accepted';
    request.acceptedAt = new Date();
    
    // Create connection
    const connection = {
      id: Date.now().toString(),
      userId1: request.senderId,
      userId2: request.recipientId,
      createdAt: new Date()
    };
    
    connections.push(connection);
    
    res.json({ 
      message: 'Connection request accepted', 
      connection 
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Reject a connection request
router.post('/reject/:requestId', auth(['startup', 'investor', 'admin']), async (req, res) => {
  try {
    const { requestId } = req.params;
    const userId = req.user.id;
    
    const request = connectionRequests.find(
      req => req.id === requestId && req.recipientId === userId
    );
    
    if (!request) {
      return res.status(404).json({ message: 'Connection request not found' });
    }
    
    if (request.status !== 'pending') {
      return res.status(400).json({ message: 'Connection request already processed' });
    }
    
    // Update request status
    request.status = 'rejected';
    request.rejectedAt = new Date();
    
    res.json({ message: 'Connection request rejected' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all connections for a user
router.get('/my-connections', auth(['startup', 'investor', 'admin']), async (req, res) => {
  try {
    const userId = req.user.id;
    
    const userConnections = connections.filter(
      conn => conn.userId1 === userId || conn.userId2 === userId
    );
    
    res.json(userConnections);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Remove a connection
router.delete('/:connectionId', auth(['startup', 'investor', 'admin']), async (req, res) => {
  try {
    const { connectionId } = req.params;
    const userId = req.user.id;
    
    const connectionIndex = connections.findIndex(
      conn => conn.id === connectionId && 
              (conn.userId1 === userId || conn.userId2 === userId)
    );
    
    if (connectionIndex === -1) {
      return res.status(404).json({ message: 'Connection not found' });
    }
    
    connections.splice(connectionIndex, 1);
    
    res.json({ message: 'Connection removed successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
