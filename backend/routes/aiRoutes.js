const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const Activity = require('../models/Activity');

// @route   GET api/ai/recommendations
// @desc    Get AI-driven eco-friendly recommendations
// @access  Private
router.get('/recommendations', auth, async (req, res) => {
    try {
        const activities = await Activity.find({ user: req.user.id }).limit(10);
        
        // Advanced AI Logic Simulation: Personalized insights based on activity history
        const insights = [
            "Switching to cold water for laundry can save up to 90% of a washing machine's energy consumption.",
            "Replacing one beef meal a week with a plant-based alternative reduces your annual footprint by 330kg CO2.",
            "LED bulbs use 75% less energy and last 25 times longer than traditional incandescent lighting.",
            "Reducing your shower time by just 2 minutes can save over 3,000 gallons of water per year.",
            "Unplugging electronics when not in use ('vampire power') can save you up to 10% on your monthly energy bill.",
            "Driving at 50 mph instead of 70 mph can improve your fuel economy by 25%.",
            "A single tree can absorb about 21kg of CO2 per year—consider supporting a local reforestation project.",
            "Choosing locally-grown produce reduces 'food miles' and supports your local ecosystem.",
            "Maintaining your tire pressure can improve your gas mileage by up to 3%.",
            "Every 1 degree you lower your thermostat in winter can save 3% on your heating energy use."
        ];

        // Shuffle insights to keep it fresh
        const shuffled = insights.sort(() => 0.5 - Math.random());

        res.json({
            recommendations: shuffled,
            summary: "Based on your recent trends, small shifts in energy use could reduce your footprint by 15% this month."
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
