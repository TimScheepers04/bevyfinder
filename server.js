const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors());

app.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'BevyFinder API is running',
        timestamp: new Date().toISOString()
    });
});

app.get('/api/test', (req, res) => {
    res.json({
        success: true,
        message: 'API is working!',
        timestamp: new Date().toISOString()
    });
});

// Notifications endpoint
app.get('/api/notifications/vapid-public-key', (req, res) => {
    res.json({
        success: true,
        publicKey: 'test-public-key-for-now'
    });
});

// Friend drink update endpoint
app.post('/api/notifications/friend-drink-update', (req, res) => {
    res.json({
        success: true,
        message: 'Friend notification endpoint working',
        data: req.body
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = app;
