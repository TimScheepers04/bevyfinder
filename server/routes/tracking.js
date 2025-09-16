const express = require('express');
const { protect } = require('../middleware/auth');
const User = require('../models/User');

const router = express.Router();

// @route   POST /api/tracking/search
// @desc    Track a search
// @access  Private
router.post('/search', protect, async (req, res) => {
    try {
        const { query, results } = req.body;
        
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Add search to history
        const searchEntry = {
            query: query || 'Unknown',
            results: results || 0,
            timestamp: new Date()
        };

        // Add to search history (keep last 50 searches)
        if (!user.searchHistory) {
            user.searchHistory = [];
        }
        user.searchHistory.unshift(searchEntry);
        if (user.searchHistory.length > 50) {
            user.searchHistory = user.searchHistory.slice(0, 50);
        }

        // Update stats
        user.stats.searches++;
        user.stats.lastActive = new Date();
        
        await user.save();

        res.json({
            success: true,
            message: 'Search tracked',
            data: {
                totalSearches: user.stats.searches,
                recentSearches: user.searchHistory.slice(0, 10)
            }
        });
    } catch (error) {
        console.error('Track search error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @route   POST /api/tracking/favorite
// @desc    Track favorite action
// @access  Private
router.post('/favorite', protect, async (req, res) => {
    try {
        const { beverageKey, action } = req.body; // action: 'add' or 'remove'
        
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Track favorite action
        const favoriteEntry = {
            beverageKey,
            action,
            timestamp: new Date()
        };

        if (!user.favoriteHistory) {
            user.favoriteHistory = [];
        }
        user.favoriteHistory.unshift(favoriteEntry);
        if (user.favoriteHistory.length > 100) {
            user.favoriteHistory = user.favoriteHistory.slice(0, 100);
        }

        // Update stats
        if (action === 'add') {
            user.stats.favorites++;
        } else if (action === 'remove') {
            user.stats.favorites = Math.max(0, user.stats.favorites - 1);
        }
        
        user.stats.lastActive = new Date();
        await user.save();

        res.json({
            success: true,
            message: `Favorite ${action}ed`,
            data: {
                totalFavorites: user.stats.favorites,
                recentFavorites: user.favoriteHistory.slice(0, 10)
            }
        });
    } catch (error) {
        console.error('Track favorite error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @route   POST /api/tracking/session
// @desc    Track session start/end
// @access  Private
router.post('/session', protect, async (req, res) => {
    try {
        const { action, duration, drinks } = req.body; // action: 'start' or 'end'
        
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        if (action === 'start') {
            // Start new session
            const sessionEntry = {
                startTime: new Date(),
                drinks: drinks || [],
                status: 'active'
            };

            if (!user.sessionHistory) {
                user.sessionHistory = [];
            }
            user.sessionHistory.unshift(sessionEntry);
            
            // Keep only last 20 sessions
            if (user.sessionHistory.length > 20) {
                user.sessionHistory = user.sessionHistory.slice(0, 20);
            }

            user.stats.totalSessions++;
            user.stats.lastActive = new Date();
            
        } else if (action === 'end') {
            // End current session
            if (user.sessionHistory && user.sessionHistory.length > 0) {
                const currentSession = user.sessionHistory[0];
                if (currentSession.status === 'active') {
                    currentSession.endTime = new Date();
                    currentSession.duration = duration || 
                        (currentSession.endTime - currentSession.startTime) / 1000 / 60; // in minutes
                    currentSession.status = 'completed';
                    
                    // Update longest session if this one is longer
                    if (currentSession.duration > user.stats.longestSession) {
                        user.stats.longestSession = currentSession.duration;
                    }
                }
            }
        }

        await user.save();

        res.json({
            success: true,
            message: `Session ${action}ed`,
            data: {
                totalSessions: user.stats.totalSessions,
                longestSession: user.stats.longestSession,
                recentSessions: user.sessionHistory ? user.sessionHistory.slice(0, 5) : []
            }
        });
    } catch (error) {
        console.error('Track session error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @route   GET /api/tracking/dashboard
// @desc    Get dashboard stats
// @access  Private
router.get('/dashboard', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Calculate additional stats
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const todaySearches = user.searchHistory ? 
            user.searchHistory.filter(search => 
                new Date(search.timestamp) >= today
            ).length : 0;
        
        const todayFavorites = user.favoriteHistory ? 
            user.favoriteHistory.filter(fav => 
                new Date(fav.timestamp) >= today && fav.action === 'add'
            ).length : 0;
        
        const activeSession = user.sessionHistory ? 
            user.sessionHistory.find(session => session.status === 'active') : null;

        res.json({
            success: true,
            data: {
                stats: {
                    totalSearches: user.stats.searches,
                    totalFavorites: user.stats.favorites,
                    totalSessions: user.stats.totalSessions,
                    longestSession: user.stats.longestSession,
                    lastActive: user.stats.lastActive
                },
                today: {
                    searches: todaySearches,
                    favorites: todayFavorites
                },
                recent: {
                    searches: user.searchHistory ? user.searchHistory.slice(0, 5) : [],
                    favorites: user.favoriteHistory ? user.favoriteHistory.slice(0, 5) : [],
                    sessions: user.sessionHistory ? user.sessionHistory.slice(0, 5) : []
                },
                activeSession
            }
        });
    } catch (error) {
        console.error('Get dashboard stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @route   GET /api/tracking/history
// @desc    Get detailed history
// @access  Private
router.get('/history', protect, async (req, res) => {
    try {
        const { type, limit = 20 } = req.query; // type: 'searches', 'favorites', 'sessions'
        
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        let history = [];
        
        switch (type) {
            case 'searches':
                history = user.searchHistory ? user.searchHistory.slice(0, parseInt(limit)) : [];
                break;
            case 'favorites':
                history = user.favoriteHistory ? user.favoriteHistory.slice(0, parseInt(limit)) : [];
                break;
            case 'sessions':
                history = user.sessionHistory ? user.sessionHistory.slice(0, parseInt(limit)) : [];
                break;
            default:
                return res.status(400).json({
                    success: false,
                    message: 'Invalid history type'
                });
        }

        res.json({
            success: true,
            data: {
                type,
                history,
                total: history.length
            }
        });
    } catch (error) {
        console.error('Get history error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

module.exports = router;
