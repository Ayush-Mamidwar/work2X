const express = require('express');
const router = express.Router();
const Calendar = require('../model/calendar.model');
const { authenticateToken } = require('../utilities'); // Ensure this utility is implemented properly

// Get events for a specific user
router.get('/calendar', authenticateToken, async (req, res) => {
  try {
    const user = req.user.user;

    const results = await Calendar.find({ userId: user._id });
    res.json({ error: false, results });
  } catch (err) {
    console.error("Error fetching events:", err);
    res.status(500).json({ error: true, message: "Internal server error" });
  }
});

// Add a new event
router.post('/calendar', authenticateToken, async (req, res) => {
  try {
    const user = req.user.user;
    const { start, end, topic } = req.body;

    if (!start || !end || !topic) {
      return res.status(400).json({ error: true, message: "Missing required fields" });
    }

    const newEvent = new Calendar({ start, end, topic, userId: user._id });
    await newEvent.save();
    res.status(201).json({ error: false, message: "Item added successfully" });
  } catch (err) {
    console.error("Error adding event:", err);
    res.status(500).json({ error: true, message: "Internal server error" });
  }
});

module.exports = router;
