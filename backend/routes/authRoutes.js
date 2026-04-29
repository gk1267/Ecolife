const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../middlewares/authMiddleware');
const User = require('../models/User');

// @route   POST api/auth/register
// @desc    Register a user
// @access  Public
router.post('/register', async (req, res) => {
    const { name, email, password, location, phoneNumber, preferences } = req.body;
    
    try {
        let user = await User.findOne({ email });

        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        user = new User({
            name,
            email,
            password,
            location,
            phoneNumber,
            preferences: preferences || {
                notifications: true,
                darkMode: false,
                units: 'kg',
                distanceUnit: 'km',
                volumeUnit: 'liters'
            }
        });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();

        const payload = {
            user: {
                id: user.id
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '5 days' },
            (err, token) => {
                if (err) throw err;
                res.json({ token });
            }
        );
    } catch (err) {
        console.error('Registration Error:', err);
        res.status(500).send('Server error: ' + err.message);
    }
});

// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        const payload = {
            user: {
                id: user.id
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '5 days' },
            (err, token) => {
                if (err) throw err;
                res.json({ token });
            }
        );
    } catch (err) {
        console.error('Login Error:', err);
        res.status(500).send('Server error: ' + err.message);
    }
});

// @route   GET api/auth/user
// @desc    Get logged in user
// @access  Private
router.get('/user', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        console.error('Get User Error:', err);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/auth/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', auth, async (req, res) => {
    const { name, email, phoneNumber, profilePicture } = req.body;
    try {
        let user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ msg: 'User not found' });

        if (name) user.name = name;
        if (email && email !== user.email) {
            const emailExists = await User.findOne({ email });
            if (emailExists) return res.status(400).json({ msg: 'This email is already registered to another account' });
            user.email = email;
        }
        if (phoneNumber !== undefined) user.phoneNumber = phoneNumber;
        if (profilePicture !== undefined) user.profilePicture = profilePicture;

        await user.save();
        res.json(user);
    } catch (err) {
        console.error('Update Profile Error:', err);
        res.status(500).json({ msg: 'Database Save Error: ' + err.message });
    }
});

// @route   PUT api/auth/password
// @desc    Update user password
// @access  Private
router.put('/password', auth, async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    try {
        let user = await User.findById(req.user.id);
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Current password incorrect' });
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        await user.save();
        res.json({ msg: 'Password updated successfully' });
    } catch (err) {
        console.error('Update Password Error:', err);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/auth/preferences
// @desc    Update user preferences
// @access  Private
router.put('/preferences', auth, async (req, res) => {
    const { preferences } = req.body;
    try {
        let user = await User.findById(req.user.id);
        user.preferences = { ...user.preferences, ...preferences };
        await user.save();
        res.json(user);
    } catch (err) {
        console.error('Update Preferences Error:', err);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/auth/delete
// @desc    Delete user account and activities
// @access  Private
router.delete('/delete', auth, async (req, res) => {
    try {
        const Activity = require('../models/Activity');
        await Activity.deleteMany({ user: req.user.id });
        await User.findByIdAndDelete(req.user.id);
        res.json({ msg: 'Account deleted' });
    } catch (err) {
        console.error('Delete Account Error:', err);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
