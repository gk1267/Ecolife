const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    location: {
        type: String,
        default: ''
    },
    householdSize: {
        type: Number,
        default: 1
    },
    phoneNumber: {
        type: String,
        default: ''
    },
    profilePicture: {
        type: String, // Base64 or URL
        default: ''
    },
    preferences: {
        notifications: { type: Boolean, default: true },
        darkMode: { type: Boolean, default: false },
        units: { type: String, enum: ['kg', 'lb', 'tonnes'], default: 'kg' },
        distanceUnit: { type: String, enum: ['km', 'miles'], default: 'km' },
        volumeUnit: { type: String, enum: ['liters', 'gallons'], default: 'liters' }
    },
    sustainabilityScore: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('User', UserSchema);
