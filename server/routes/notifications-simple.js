const express = require('express');
const router = express.Router();

// Simple test endpoint to verify the route is working
router.get('/test', (req, res) => {
    res.json({
        success: true,
        message: 'Notifications route is working!',
        timestamp: new Date().toISOString()
    });
});

// VAPID public key endpoint (without web-push dependency for now)
router.get('/vapid-public-key', (req, res) => {
    res.json({
        success: true,
        publicKey: 'test-public-key-until-web-push-is-installed'
    });
});

module.exports = router;
