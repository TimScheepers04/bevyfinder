const express = require('express');
const router = express.Router();

// Simple test endpoint to verify the route is working
router.get('/test', (req, res) => {
    res.json({
        success: true,
        message: 'Tracking route is working!',
        timestamp: new Date().toISOString()
    });
});

// Simple search endpoint
router.post('/search', (req, res) => {
    res.json({
        success: true,
        message: 'Search tracking endpoint is working',
        data: req.body
    });
});

module.exports = router;
