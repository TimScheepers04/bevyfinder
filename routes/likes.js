const express = require('express');
const { protect } = require('../middleware/auth');
const User = require('../models/User');

const router = express.Router();

// @route   POST /api/likes/add
// @desc    Like a drink
// @access  Private
router.post('/add', protect, async (req, res) => {
    try {
        const { beverageKey } = req.body;
        
        if (!beverageKey) {
            return res.status(400).json({
                success: false,
                message: 'Beverage key is required'
            });
        }

        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Add to liked drinks if not already there
        if (!user.profile.preferences.likedDrinks) {
            user.profile.preferences.likedDrinks = [];
        }
        
        if (!user.profile.preferences.likedDrinks.includes(beverageKey)) {
            user.profile.preferences.likedDrinks.push(beverageKey);
            await user.save();
        }

        res.json({
            success: true,
            message: 'Drink liked successfully',
            data: {
                liked: true,
                likedDrinks: user.profile.preferences.likedDrinks
            }
        });
    } catch (error) {
        console.error('Like drink error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @route   DELETE /api/likes/remove
// @desc    Unlike a drink
// @access  Private
router.delete('/remove', protect, async (req, res) => {
    try {
        const { beverageKey } = req.body;
        
        if (!beverageKey) {
            return res.status(400).json({
                success: false,
                message: 'Beverage key is required'
            });
        }

        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Remove from liked drinks
        if (user.profile.preferences.likedDrinks) {
            const index = user.profile.preferences.likedDrinks.indexOf(beverageKey);
            if (index > -1) {
                user.profile.preferences.likedDrinks.splice(index, 1);
                await user.save();
            }
        }

        res.json({
            success: true,
            message: 'Drink unliked successfully',
            data: {
                liked: false,
                likedDrinks: user.profile.preferences.likedDrinks || []
            }
        });
    } catch (error) {
        console.error('Unlike drink error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @route   GET /api/likes/top
// @desc    Get top liked drinks
// @access  Public
router.get('/top', async (req, res) => {
    try {
        // Get all users and count likes for each drink
        const users = await User.find({ 'profile.preferences.likedDrinks': { $exists: true, $ne: [] } });
        
        const drinkLikes = {};
        
        users.forEach(user => {
            if (user.profile.preferences.likedDrinks) {
                user.profile.preferences.likedDrinks.forEach(drink => {
                    drinkLikes[drink] = (drinkLikes[drink] || 0) + 1;
                });
            }
        });
        
        // Sort by like count and get top 10
        const topDrinks = Object.entries(drinkLikes)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 10)
            .map(([drink, count]) => ({
                beverageKey: drink,
                likeCount: count
            }));

        res.json({
            success: true,
            data: {
                topDrinks
            }
        });
    } catch (error) {
        console.error('Get top likes error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

module.exports = router; 