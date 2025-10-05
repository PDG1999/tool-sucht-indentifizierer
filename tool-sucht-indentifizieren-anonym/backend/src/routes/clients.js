const express = require('express');
const router = express.Router();
const Client = require('../models/Client');
const { authenticateToken } = require('../middleware/auth');

// Get all clients for a counselor
router.get('/', authenticateToken, async (req, res) => {
  try {
    const clients = await Client.getAllByCounselor(req.user.id);
    res.json(clients);
  } catch (error) {
    console.error('Error fetching clients:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get a single client
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const client = await Client.getById(req.params.id);
    
    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }
    
    // Check if client belongs to counselor
    if (client.counselor_id !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    res.json(client);
  } catch (error) {
    console.error('Error fetching client:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create a new client
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { name, email, phone, notes } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }
    
    const client = await Client.create({
      name,
      email,
      phone,
      counselor_id: req.user.id,
      notes
    });
    
    res.status(201).json(client);
  } catch (error) {
    console.error('Error creating client:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update a client
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { name, email, phone, status, notes } = req.body;
    
    const client = await Client.getById(req.params.id);
    
    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }
    
    // Check if client belongs to counselor
    if (client.counselor_id !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    const updatedClient = await Client.update(req.params.id, {
      name,
      email,
      phone,
      status,
      notes
    });
    
    res.json(updatedClient);
  } catch (error) {
    console.error('Error updating client:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete a client
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const client = await Client.getById(req.params.id);
    
    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }
    
    // Check if client belongs to counselor
    if (client.counselor_id !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    await Client.delete(req.params.id);
    
    res.json({ message: 'Client deleted successfully' });
  } catch (error) {
    console.error('Error deleting client:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;

