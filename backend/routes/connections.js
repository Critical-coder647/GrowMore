import express from 'express';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// In-memory storage for demo purposes
// In production, this should be a database collection/table
const connectionRequests = [];
const connections = [];

function toId(value) {
  return String(value || '');
}

function findConnectionBetween(userA, userB) {
  const a = toId(userA);
  const b = toId(userB);
  return connections.find(
    (conn) =>
      (toId(conn.userId1) === a && toId(conn.userId2) === b) ||
      (toId(conn.userId1) === b && toId(conn.userId2) === a)
  );
}

// Send a connection request
router.post('/request', auth(['startup', 'investor', 'admin']), async (req, res) => {
  try {
    const senderId = toId(req.user.id);
    const senderRole = req.user.role;
    const { investorId, startupId } = req.body;
    
    // Determine recipient based on sender role
    const recipientId = toId(senderRole === 'startup' ? investorId : startupId);
    
    if (!recipientId) {
      return res.status(400).json({ message: 'Recipient ID is required' });
    }
    
    // Check if connection request already exists
    const existingRequest = connectionRequests.find(
      (req) =>
        toId(req.senderId) === senderId &&
        toId(req.recipientId) === recipientId &&
        req.status === 'pending'
    );
    
    if (existingRequest) {
      return res.status(400).json({ message: 'Connection request already sent' });
    }
    
    // Check if already connected
    const alreadyConnected = findConnectionBetween(senderId, recipientId);
    
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
    const userId = toId(req.user.id);
    
    const incoming = connectionRequests.filter(
      (req) => toId(req.recipientId) === userId && req.status === 'pending'
    );
    
    res.json(incoming);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get outgoing connection requests
router.get('/requests/outgoing', auth(['startup', 'investor', 'admin']), async (req, res) => {
  try {
    const userId = toId(req.user.id);
    
    const outgoing = connectionRequests.filter(
      (req) => toId(req.senderId) === userId
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
    const userId = toId(req.user.id);
    
    const request = connectionRequests.find(
      (req) => toId(req.id) === toId(requestId) && toId(req.recipientId) === userId
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
    const userId = toId(req.user.id);
    
    const request = connectionRequests.find(
      (req) => toId(req.id) === toId(requestId) && toId(req.recipientId) === userId
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
    const userId = toId(req.user.id);
    
    const userConnections = connections.filter(
      (conn) => toId(conn.userId1) === userId || toId(conn.userId2) === userId
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
    const userId = toId(req.user.id);
    
    const connectionIndex = connections.findIndex(
      (conn) =>
        toId(conn.id) === toId(connectionId) &&
        (toId(conn.userId1) === userId || toId(conn.userId2) === userId)
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

router.get('/status/:targetUserId', auth(['startup', 'investor', 'admin']), async (req, res) => {
  try {
    const userId = toId(req.user.id);
    const targetUserId = toId(req.params.targetUserId);

    if (!targetUserId) {
      return res.status(400).json({ message: 'Target user id is required' });
    }

    if (userId === targetUserId) {
      return res.json({
        relationship: 'self',
        isConnected: false,
        outgoingPending: false,
        incomingPending: false,
        connectionId: null,
        requestId: null,
        myConnectionCount: connections.filter((conn) => toId(conn.userId1) === userId || toId(conn.userId2) === userId).length,
        targetConnectionCount: connections.filter((conn) => toId(conn.userId1) === targetUserId || toId(conn.userId2) === targetUserId).length
      });
    }

    const existingConnection = findConnectionBetween(userId, targetUserId);
    const outgoingRequest = connectionRequests.find(
      (req) => toId(req.senderId) === userId && toId(req.recipientId) === targetUserId && req.status === 'pending'
    );
    const incomingRequest = connectionRequests.find(
      (req) => toId(req.senderId) === targetUserId && toId(req.recipientId) === userId && req.status === 'pending'
    );

    const relationship = existingConnection
      ? 'connected'
      : outgoingRequest
      ? 'outgoing_pending'
      : incomingRequest
      ? 'incoming_pending'
      : 'none';

    res.json({
      relationship,
      isConnected: Boolean(existingConnection),
      outgoingPending: Boolean(outgoingRequest),
      incomingPending: Boolean(incomingRequest),
      connectionId: existingConnection ? toId(existingConnection.id) : null,
      requestId: outgoingRequest ? toId(outgoingRequest.id) : incomingRequest ? toId(incomingRequest.id) : null,
      myConnectionCount: connections.filter((conn) => toId(conn.userId1) === userId || toId(conn.userId2) === userId).length,
      targetConnectionCount: connections.filter((conn) => toId(conn.userId1) === targetUserId || toId(conn.userId2) === targetUserId).length
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/request/:requestId', auth(['startup', 'investor', 'admin']), async (req, res) => {
  try {
    const userId = toId(req.user.id);
    const requestId = toId(req.params.requestId);

    const request = connectionRequests.find(
      (req) => toId(req.id) === requestId && req.status === 'pending'
    );

    if (!request) {
      return res.status(404).json({ message: 'Connection request not found' });
    }

    if (toId(request.senderId) !== userId) {
      return res.status(403).json({ message: 'Only sender can withdraw request' });
    }

    request.status = 'withdrawn';
    request.withdrawnAt = new Date();

    res.json({ message: 'Connection request withdrawn' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
