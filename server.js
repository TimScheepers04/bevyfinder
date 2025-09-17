const express = require('express');
const cors = require('cors');
const path = require('path');

console.log('🚀 Starting BevyFinder server...');

const app = express();
const PORT = process.env.PORT || 3000;

// CORS configuration
app.use(cors({
    origin: true,
    credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'BevyFinder API is running',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'production'
    });
});

// Simple auth endpoints for testing
app.post('/api/auth/login', (req, res) => {
    console.log('🔐 Login attempt:', req.body);
    res.json({
        success: true,
        message: 'Login successful',
        user: {
            id: 'test-user',
            username: req.body.username || 'testuser',
            email: req.body.email || 'test@example.com'
        },
        token: 'test-token-' + Date.now()
    });
});

app.post('/api/auth/register', (req, res) => {
    console.log('📝 Registration attempt:', req.body);
    res.json({
        success: true,
        message: 'Registration successful',
        user: {
            id: 'test-user-' + Date.now(),
            username: req.body.username || 'testuser',
            email: req.body.email || 'test@example.com'
        },
        token: 'test-token-' + Date.now()
    });
});

app.get('/api/auth/me', (req, res) => {
    res.json({
        success: true,
        user: {
            id: 'test-user',
            username: 'testuser',
            email: 'test@example.com'
        }
    });
});

// Serve static files
app.use(express.static(path.join(__dirname)));

// Catch all handler - serve index.html for client-side routing
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Error handler
app.use((err, req, res, next) => {
    console.error('❌ Server error:', err);
    res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
    });
});

app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
    console.log(`🌐 Environment: ${process.env.NODE_ENV || 'production'}`);
});

module.exports = app;