const express = require('express');

console.log('🚀 Starting BevyFinder test server...');

const app = express();
const PORT = process.env.PORT || 3000;

// Simple test endpoint
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'BevyFinder Test Server is running!',
        timestamp: new Date().toISOString(),
        port: PORT,
        env: process.env.NODE_ENV || 'development'
    });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'Test server health check',
        timestamp: new Date().toISOString(),
        status: 'healthy'
    });
});

app.listen(PORT, () => {
    console.log(`✅ Test server running on port ${PORT}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});
