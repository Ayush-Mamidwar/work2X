const express = require('express');
const checkListModel = require('../model/checklist.model'); 
const router = express.Router();
const { authenticateToken } = require('../utilities');

// Route to get all checklist items for a user
router.get('/allCheckLists', authenticateToken, async (req, res) => {
    const user = req.user.user; 
    try {
        const allItems = await checkListModel.find({ userId: user._id });
        res.json({ error: false, allItems });
    } catch (err) {
        console.log('Checklist get backend error');
        res.status(500).json({ error: true, message: 'Failed to retrieve checklists' });
    }
});

// Route to add a checklist item
router.post('/add-checklistItem', authenticateToken, async (req, res) => {
    const user = req.user.user;
    const { name, completed = false, topic = 'General' } = req.body; 

    if (!name) {
        return res.status(400).json({ error: true, message: "Enter item name" });
    }

    try {
        const newItem = await checkListModel.create({ userId: user._id, name, completed, topic });
        res.json({ error: false, newItem });
    } catch (err) {
        console.log('Checklist post backend error');
        res.status(500).json({ error: true, message: 'Failed to add checklist item' });
    }
});


// Route to update a checklist item
router.put('/update-checklist-item', authenticateToken, async (req, res) => {
    const user = req.user.user;
    const {completed,id } = req.body;

    try {
        const item = await checkListModel.findOne({ userId: user._id,_id:id });

        if (!item) {
            return res.status(404).json({ error: true, message: "Item not found" });
        }

        item.completed = completed;
        await item.save();
        res.json({ error: false, item });
    } catch (err) {
        console.log('Checklist put backend error');
        res.status(500).json({ error: true, message: 'Failed to update checklist item' });
    }
});



// Route to delete a checklist item
router.delete('/delete-checklist-item', authenticateToken, async (req, res) => {
    const user = req.user.user;
    const { id } = req.body;

    try {
        await checkListModel.deleteOne({ userId: user._id, _id: id });
        res.json({ error: false, message: "Item deleted successfully" });
    } catch (err) {
        console.log('Checklist delete backend error', err);
        res.status(500).json({ error: true, message: 'Failed to delete checklist item' });
    }
});


module.exports = router;
