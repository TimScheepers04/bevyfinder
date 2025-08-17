const express = require('express');
const webpush = require('web-push');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const router = express.Router();

// VAPID keys (you should generate these and store them securely)
const vapidKeys = webpush.generateVAPIDKeys();

// Configure web-push
webpush.setVapidDetails(
    'mailto:your-email@example.com', // Replace with your email
    vapidKeys.publicKey,
    vapidKeys.privateKey
);

// @route   GET /api/notifications/vapid-public-key
// @desc    Get VAPID public key for client subscription
// @access  Public
router.get('/vapid-public-key', (req, res) => {
    res.json({
        success: true,
        publicKey: vapidKeys.publicKey
    });
});

// @route   POST /api/notifications/subscribe
// @desc    Subscribe user to push notifications
// @access  Private
router.post('/subscribe', [
    protect,
    body('subscription').isObject().withMessage('Subscription object is required'),
    body('subscription.endpoint').isURL().withMessage('Valid endpoint is required'),
    body('subscription.keys').isObject().withMessage('Subscription keys are required')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                errors: errors.array()
            });
        }

        const { subscription } = req.body;
        const userId = req.user.id;

        // Update user's push subscription
        await User.findByIdAndUpdate(userId, {
            pushSubscription: subscription,
            notificationSettings: {
                enabled: true,
                safetyReminders: true,
                sessionUpdates: true
            }
        });

        res.json({
            success: true,
            message: 'Successfully subscribed to push notifications'
        });
    } catch (error) {
        console.error('Subscription error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to subscribe to notifications'
        });
    }
});

// @route   POST /api/notifications/unsubscribe
// @desc    Unsubscribe user from push notifications
// @access  Private
router.post('/unsubscribe', protect, async (req, res) => {
    try {
        const userId = req.user.id;

        // Remove user's push subscription
        await User.findByIdAndUpdate(userId, {
            pushSubscription: null,
            'notificationSettings.enabled': false
        });

        res.json({
            success: true,
            message: 'Successfully unsubscribed from push notifications'
        });
    } catch (error) {
        console.error('Unsubscription error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to unsubscribe from notifications'
        });
    }
});

// @route   POST /api/notifications/test
// @desc    Send test notification to user
// @access  Private
router.post('/test', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        
        if (!user.pushSubscription) {
            return res.status(400).json({
                success: false,
                message: 'No push subscription found'
            });
        }

        const payload = JSON.stringify({
            title: 'BevyFinder Test Notification',
            body: 'This is a test notification from BevyFinder!',
            icon: '/icon-192x192.png',
            badge: '/icon-72x72.png',
            data: {
                url: '/',
                type: 'test'
            }
        });

        await webpush.sendNotification(user.pushSubscription, payload);

        res.json({
            success: true,
            message: 'Test notification sent successfully'
        });
    } catch (error) {
        console.error('Test notification error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to send test notification'
        });
    }
});

// @route   POST /api/notifications/send
// @desc    Send notification to specific user (admin function)
// @access  Private
router.post('/send', [
    protect,
    body('userId').isMongoId().withMessage('Valid user ID is required'),
    body('title').notEmpty().withMessage('Notification title is required'),
    body('body').notEmpty().withMessage('Notification body is required'),
    body('type').optional().isIn(['safety', 'session', 'general']).withMessage('Invalid notification type')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                errors: errors.array()
            });
        }

        const { userId, title, body, type = 'general', data = {} } = req.body;

        const user = await User.findById(userId);
        if (!user || !user.pushSubscription) {
            return res.status(404).json({
                success: false,
                message: 'User not found or no push subscription'
            });
        }

        const payload = JSON.stringify({
            title,
            body,
            icon: '/icon-192x192.png',
            badge: '/icon-72x72.png',
            data: {
                url: '/',
                type,
                ...data
            }
        });

        await webpush.sendNotification(user.pushSubscription, payload);

        res.json({
            success: true,
            message: 'Notification sent successfully'
        });
    } catch (error) {
        console.error('Send notification error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to send notification'
        });
    }
});

// @route   POST /api/notifications/safety-alert
// @desc    Send safety alert notification
// @access  Private
router.post('/safety-alert', [
    protect,
    body('bacLevel').isFloat({ min: 0, max: 1 }).withMessage('Valid BAC level is required'),
    body('message').notEmpty().withMessage('Safety message is required')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                errors: errors.array()
            });
        }

        const { bacLevel, message } = req.body;
        const userId = req.user.id;

        const user = await User.findById(userId);
        if (!user.pushSubscription || !user.notificationSettings?.safetyReminders) {
            return res.json({
                success: true,
                message: 'Safety notifications disabled or no subscription'
            });
        }

        const title = `Safety Alert - BAC: ${(bacLevel * 100).toFixed(3)}%`;
        const payload = JSON.stringify({
            title,
            body: message,
            icon: '/icon-192x192.png',
            badge: '/icon-72x72.png',
            data: {
                url: '/tracking-page',
                type: 'safety',
                bacLevel
            }
        });

        await webpush.sendNotification(user.pushSubscription, payload);

        res.json({
            success: true,
            message: 'Safety alert sent successfully'
        });
    } catch (error) {
        console.error('Safety alert error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to send safety alert'
        });
    }
});

// @route   POST /api/notifications/session-update
// @desc    Send session update notification
// @access  Private
router.post('/session-update', [
    protect,
    body('drinkName').notEmpty().withMessage('Drink name is required'),
    body('sessionStats').isObject().withMessage('Session stats are required')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                errors: errors.array()
            });
        }

        const { drinkName, sessionStats } = req.body;
        const userId = req.user.id;

        const user = await User.findById(userId);
        if (!user.pushSubscription || !user.notificationSettings?.sessionUpdates) {
            return res.json({
                success: true,
                message: 'Session notifications disabled or no subscription'
            });
        }

        const title = `Session Update - ${drinkName}`;
        const body = `Added ${drinkName} to your session. Current BAC: ${(sessionStats.bac * 100).toFixed(3)}%`;
        
        const payload = JSON.stringify({
            title,
            body,
            icon: '/icon-192x192.png',
            badge: '/icon-72x72.png',
            data: {
                url: '/tracking-page',
                type: 'session',
                sessionStats
            }
        });

        await webpush.sendNotification(user.pushSubscription, payload);

        res.json({
            success: true,
            message: 'Session update sent successfully'
        });
    } catch (error) {
        console.error('Session update error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to send session update'
        });
    }
});

module.exports = router;
