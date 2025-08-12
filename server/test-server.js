const express = require('express');
const cors = require('cors');
const app = express();

// CORS
app.use(cors({
    origin: true,
    credentials: true
}));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check
app.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'Test server running'
    });
});

// Load social routes
try {
    const socialRoutes = require('./routes/social');
    console.log('✅ Social routes loaded successfully');
    app.use('/api/social', socialRoutes);
    console.log('✅ Social routes mounted');
} catch (error) {
    console.error('❌ Error loading social routes:', error);
}

// Test route
app.get('/test', (req, res) => {
    res.json({
        success: true,
        message: 'Test route working'
    });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'API endpoint not found'
    });
});

// Start server
const PORT = 3005;
app.listen(PORT, () => {
    console.log(`🚀 Test server running on port ${PORT}`);
    console.log(`🔗 Health check: http://localhost:${PORT}/health`);
    console.log(`🔗 Social test: http://localhost:${PORT}/api/social/ping`);
}); 