const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

console.log('🚀 Starting BevyFinder API server...');
console.log('📊 Environment:', process.env.NODE_ENV || 'development');
console.log('🔗 Port:', process.env.PORT || 3000);

// Import routes
const authRoutes = require('./routes/auth');
const reviewRoutes = require('./routes/reviews');
const favoritesRoutes = require('./routes/favorites');
const likesRoutes = require('./routes/likes');

// Initialize express app
const app = express();

// CORS configuration - allow all origins for now
app.use(cors({
    origin: true,
    credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'BevyFinder API is running',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
        mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
    });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/favorites', favoritesRoutes);
app.use('/api/likes', likesRoutes);

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'API endpoint not found'
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error('❌ Error:', err);
    res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Connect to MongoDB with retry logic
const connectDB = async (retries = 5) => {
    for (let i = 0; i < retries; i++) {
        try {
            const mongoUri = process.env.MONGODB_URI;
            if (!mongoUri) {
                throw new Error('MONGODB_URI not found in environment variables');
            }
            
            console.log(`🔗 Attempting to connect to MongoDB (attempt ${i + 1}/${retries})...`);
            await mongoose.connect(mongoUri);
            console.log('✅ MongoDB Connected successfully');
            return true;
        } catch (error) {
            console.error(`❌ MongoDB connection attempt ${i + 1} failed:`, error.message);
            if (i === retries - 1) {
                console.error('❌ All MongoDB connection attempts failed');
                return false;
            }
            // Wait 2 seconds before retrying
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
    }
};

// Start server
const PORT = process.env.PORT || 3000;

const startServer = async () => {
    try {
        console.log('🔧 Starting server...');
        
        // Try to connect to database (but don't fail if it doesn't work)
        const dbConnected = await connectDB();
        if (!dbConnected) {
            console.warn('⚠️  Warning: Could not connect to MongoDB. Some features may not work.');
        }

        // Start server
        app.listen(PORT, '0.0.0.0', () => {
            console.log(`🚀 BevyFinder API server running on port ${PORT}`);
            console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
            console.log(`🔗 Health check: http://localhost:${PORT}/health`);
            console.log(`🌐 MongoDB: ${dbConnected ? 'Connected' : 'Disconnected'}`);
        });
    } catch (error) {
        console.error('❌ Server startup error:', error);
        process.exit(1);
    }
};

// Handle graceful shutdown
process.on('SIGTERM', () => {
    console.log('🛑 SIGTERM received, shutting down gracefully');
    mongoose.connection.close()
        .then(() => {
            console.log('✅ MongoDB connection closed');
            process.exit(0);
        })
        .catch((err) => {
            console.error('❌ Error closing MongoDB connection:', err);
            process.exit(1);
        });
});

process.on('SIGINT', () => {
    console.log('🛑 SIGINT received, shutting down gracefully');
    mongoose.connection.close()
        .then(() => {
            console.log('✅ MongoDB connection closed');
            process.exit(0);
        })
        .catch((err) => {
            console.error('❌ Error closing MongoDB connection:', err);
            process.exit(1);
        });
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.error('❌ Unhandled Rejection at:', promise, 'reason:', err);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    console.error('❌ Uncaught Exception:', err);
    process.exit(1);
});

// Start the server
startServer(); 