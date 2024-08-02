const mongoose = require('mongoose')

const calendarSchema = mongoose.Schema({
    start: {type: Date, required: true},
    end: {type: Date, required: true},
    topic: {type: String, required: true},
    userId: {type: String, required: true},
})

module.exports = mongoose.model('calendar',calendarSchema)