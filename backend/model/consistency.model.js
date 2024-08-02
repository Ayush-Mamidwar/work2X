const mongoose = require('mongoose');

const consistencySchema = new mongoose.Schema({
  date: { type: Date, required: true },
  userId: { type: String, required: true },
});

module.exports = mongoose.model('Consistency', consistencySchema);
