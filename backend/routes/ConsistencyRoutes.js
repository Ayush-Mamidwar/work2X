const express = require('express');
const router = express.Router();
const Consistency = require('../model/consistency.model');
const { authenticateToken } = require('../utilities');

// Get all consistent days for the authenticated user
router.get('/consistent-days', authenticateToken, async (req, res) => {
  try {
    const consistentDays = await Consistency.find({ userId: req.user.user._id });
    res.json(consistentDays);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add or update a consistent day for the authenticated user
router.post('/consistent-days', authenticateToken, async (req, res) => {
  const { date } = req.body;
  const userId = req.user.user._id;
  try {
    // Check if the consistent day already exists
    const existingConsistency = await Consistency.findOne({ date, userId });
    if (existingConsistency) {
      // If it exists, update it
      existingConsistency.date = date;
      await existingConsistency.save();
      res.json(existingConsistency);
    } else {
      // If it doesn't exist, create a new one
      const newConsistency = new Consistency({ date, userId });
      const savedConsistency = await newConsistency.save();
      res.status(201).json(savedConsistency);
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Remove a consistent day for the authenticated user
router.delete('/consistent-days/:date', authenticateToken, async (req, res) => {
  const { date } = req.params;
  const userId = req.user.user._id;

  try {
    const deletedConsistency = await Consistency.findOneAndDelete({ date, userId });
    if (!deletedConsistency) {
      return res.status(404).json({ message: 'Consistent day not found' });
    }
    res.json({ message: 'Consistent day deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
