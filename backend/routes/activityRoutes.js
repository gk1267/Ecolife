const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const Activity = require('../models/Activity');
const User = require('../models/User');

// @route   GET api/activities
// @desc    Get all activities for the logged-in user
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        const activities = await Activity.find({ user: req.user.id }).sort({ date: -1 });
        res.json(activities);
    } catch (err) {
        console.error("Fetch Activities Error:", err.message);
        res.status(500).json({ msg: 'Fetch Error: ' + err.message });
    }
});

// @route   POST api/activities
// @desc    Add new activity
// @access  Private
router.post('/', auth, async (req, res) => {
    const { category, type, amount, co2ImpactKg } = req.body;
    console.log("Incoming Activity Request:", req.body);

    try {
        const newActivity = new Activity({
            category,
            type,
            amount,
            co2ImpactKg,
            user: req.user.id
        });

        const activity = await newActivity.save();

        // Update user's total score
        await User.findByIdAndUpdate(
            req.user.id,
            { $inc: { sustainabilityScore: -co2ImpactKg } }
        );

        res.json(activity);
    } catch (err) {
        console.error("Activity Save Error:", err.message);
        res.status(500).json({ msg: 'Database Error: ' + err.message });
    }
});

// @route   DELETE api/activities/:id
// @desc    Delete activity
// @access  Private
router.delete('/:id', auth, async (req, res) => {
    try {
        if (req.params.id.startsWith('mock')) {
            return res.json({ msg: 'Sample data removed from view' });
        }
        let activity = await Activity.findById(req.params.id);
        if (!activity) return res.status(404).json({ msg: 'Activity not found' });

        // Ensure user owns the activity
        if (activity.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        await User.findByIdAndUpdate(
            req.user.id,
            { $inc: { sustainabilityScore: activity.co2ImpactKg } }
        );

        await Activity.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Activity removed' });
    } catch (err) {
        console.error("Activity Delete Error:", err.message);
        res.status(500).json({ msg: 'Delete Error: ' + err.message });
    }
});

// @route   PUT api/activities/:id
// @desc    Update activity
// @access  Private
router.put('/:id', auth, async (req, res) => {
    const { category, type, amount, co2ImpactKg, date } = req.body;

    try {
        let activity = await Activity.findById(req.params.id);
        if (!activity) return res.status(404).json({ msg: 'Activity not found' });

        // Ensure user owns the activity
        if (activity.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        const impactDiff = co2ImpactKg - activity.co2ImpactKg;
        await User.findByIdAndUpdate(
            req.user.id,
            { $inc: { sustainabilityScore: -impactDiff } }
        );

        activity.category = category || activity.category;
        activity.type = type || activity.type;
        activity.amount = amount || activity.amount;
        activity.co2ImpactKg = co2ImpactKg !== undefined ? co2ImpactKg : activity.co2ImpactKg;
        activity.date = date || activity.date;

        await activity.save();
        res.json(activity);
    } catch (err) {
        console.error("Activity Update Error:", err.message);
        res.status(500).json({ msg: 'Update Error: ' + err.message });
    }
});

module.exports = router;
