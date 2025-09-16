const express = require('express');
const { protect } = require('../middleware/auth');
const User = require('../models/User');

const router = express.Router();

// @route   POST /api/favorites/add
// @desc    Add drink to favorites
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

        // Add to favorites if not already there
        if (!user.profile.preferences.favoriteDrinks.includes(beverageKey)) {
            user.profile.preferences.favoriteDrinks.push(beverageKey);
            user.stats.favorites++;
            await user.save();
        }

        res.json({
            success: true,
            message: 'Drink added to favorites',
            data: {
                favorites: user.profile.preferences.favoriteDrinks
            }
        });
    } catch (error) {
        console.error('Add to favorites error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @route   DELETE /api/favorites/remove
// @desc    Remove drink from favorites
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

        // Remove from favorites
        const index = user.profile.preferences.favoriteDrinks.indexOf(beverageKey);
        if (index > -1) {
            user.profile.preferences.favoriteDrinks.splice(index, 1);
            user.stats.favorites = Math.max(0, user.stats.favorites - 1);
            await user.save();
        }

        res.json({
            success: true,
            message: 'Drink removed from favorites',
            data: {
                favorites: user.profile.preferences.favoriteDrinks
            }
        });
    } catch (error) {
        console.error('Remove from favorites error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

module.exports = router; 