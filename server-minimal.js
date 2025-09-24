const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

console.log('🚀 Starting BevyFinder minimal server...');

const app = express();
const PORT = process.env.PORT || 3000;

// CORS configuration
app.use(cors({
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Connect to MongoDB (non-blocking)
const connectDB = async () => {
    try {
        const mongoURI = 'mongodb+srv://TimScheepers:Mapimpi11@bevyfinder.fxww13z.mongodb.net/bevyfinder?retryWrites=true&w=majority&appName=BevyFinder';
        console.log('🔌 Connecting to MongoDB...');
        await mongoose.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('✅ MongoDB connected successfully');
    } catch (error) {
        console.error('❌ MongoDB connection error:', error);
        // Don't exit the process - continue without MongoDB
    }
};

// Initialize database connection (async)
connectDB();

// Simple User Schema
const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    name: { type: String, required: true }
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

let User;
try {
    User = mongoose.model('User', userSchema);
} catch (error) {
    // Model already exists
    User = mongoose.model('User');
}

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, 'bevyfinder-super-secret-jwt-key-2024', {
        expiresIn: '7d'
    });
};

// Health check route
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'BevyFinder API is running',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'production',
        database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
        mongoURI_set: false, // We're using hardcoded connection
        connectionState: mongoose.connection.readyState
    });
});

// Test route
app.get('/api/test', (req, res) => {
    res.json({
        success: true,
        message: 'Test endpoint working',
        timestamp: new Date().toISOString()
    });
});

// Register endpoint
app.post('/api/auth/register', async (req, res) => {
    try {
        console.log('📝 Registration attempt:', req.body);
        
        // Check if MongoDB is connected
        if (mongoose.connection.readyState !== 1) {
            return res.status(503).json({
                success: false,
                message: 'Database not available'
            });
        }
        
        const { email, password, name } = req.body;

        if (!email || !password || !name) {
            return res.status(400).json({
                success: false,
                message: 'Email, password, and name are required'
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 6 characters long'
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User with this email already exists'
            });
        }

        // Create new user
        const user = new User({ email, password, name });
        await user.save();

        // Generate token
        const token = generateToken(user._id);

        console.log('✅ User registered successfully:', user.email);

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: {
                user: {
                    id: user._id,
                    email: user.email,
                    name: user.name
                },
                token
            }
        });
    } catch (error) {
        console.error('❌ Registration error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during registration',
            error: error.message
        });
    }
});

// Login endpoint
app.post('/api/auth/login', async (req, res) => {
    try {
        console.log('🔐 Login attempt:', req.body.email);
        
        // Check if MongoDB is connected
        if (mongoose.connection.readyState !== 1) {
            return res.status(503).json({
                success: false,
                message: 'Database not available'
            });
        }
        
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required'
            });
        }

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Generate token
        const token = generateToken(user._id);

        console.log('✅ User logged in successfully:', user.email);

        res.json({
            success: true,
            message: 'Login successful',
            data: {
                user: {
                    id: user._id,
                    email: user.email,
                    name: user.name
                },
                token
            }
        });
    } catch (error) {
        console.error('❌ Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during login',
            error: error.message
        });
    }
});

// Serve static files
app.use(express.static(path.join(__dirname)));

// Catch all handler - serve index.html for client-side routing
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
    console.log(`🌐 Environment: ${process.env.NODE_ENV || 'production'}`);
});

module.exports = app;