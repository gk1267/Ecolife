const mongoose = require('mongoose');

const ActivitySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    category: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true // e.g., 'Car', 'Bus', 'Vegetarian Meal', 'Electricity Usage'
    },
    amount: {
        type: Number,
        required: true // Distance in km, or kWh, or meals, etc.
    },
    co2ImpactKg: {
        type: Number,
        required: true // Calculated impact
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Activity', ActivitySchema);
