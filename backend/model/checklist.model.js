const mongoose = require('mongoose');

const checkListSchema = mongoose.Schema({
    name: { type: String, required: true },
    completed: { type: Boolean, default: false },
    userId: { type: String, required: true },
    topic: { type: String, default: 'General' } 
});

const checkListModel = mongoose.model('checklist', checkListSchema);

module.exports = checkListModel;
