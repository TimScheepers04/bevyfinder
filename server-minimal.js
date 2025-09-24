const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

console.log('🚀 Starting BevyFinder minimal server - v2.0...');

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

// MongoDB connection with better error handling
let User;
let dbConnected = false;

const connectDB = async () => {
    try {
        // Try environment variable first, fallback to hardcoded
        const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://TimScheepers:Mapimpi11@bevyfinder.fxww13z.mongodb.net/bevyfinder?retryWrites=true&w=majority&appName=BevyFinder';
        console.log('🔌 Connecting to MongoDB...');
        console.log('📝 Using connection string:', mongoURI.substring(0, 50) + '...');
        console.log('🌐 MONGODB_URI set:', !!process.env.MONGODB_URI);
        
        await mongoose.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000, // 5 second timeout
            connectTimeoutMS: 10000, // 10 second timeout
        });
        
        console.log('✅ MongoDB connected successfully');
        dbConnected = true;
        
        // Create User model after connection
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

        User = mongoose.model('User', userSchema);
        console.log('✅ User model created successfully');
        
    } catch (error) {
        console.error('❌ MongoDB connection error:', error);
        dbConnected = false;
        
        // Don't exit the process - continue without MongoDB
        console.log('⚠️ Continuing without MongoDB connection');
    }
};

// Initialize database connection
connectDB();

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, 'bevyfinder-super-secret-jwt-key-2024', {
        expiresIn: '7d'
    });
};

// API Routes - MUST be defined before catch-all route
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'BevyFinder API is running',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'production',
        database: dbConnected ? 'connected' : 'disconnected',
        mongoURI_set: !!process.env.MONGODB_URI,
        connectionState: mongoose.connection.readyState,
        mongooseState: {
            0: 'disconnected',
            1: 'connected',
            2: 'connecting',
            3: 'disconnecting'
        }[mongoose.connection.readyState]
    });
});

app.get('/api/test', (req, res) => {
    res.json({
        success: true,
        message: 'Test endpoint working',
        timestamp: new Date().toISOString(),
        dbConnected: dbConnected,
        mongooseState: mongoose.connection.readyState
    });
});

app.get('/api/test-db', async (req, res) => {
    try {
        if (!dbConnected || !User) {
            return res.status(503).json({
                success: false,
                message: 'Database not connected',
                dbConnected: dbConnected,
                hasUserModel: !!User,
                mongooseState: mongoose.connection.readyState
            });
        }
        
        // Try to count users
        const userCount = await User.countDocuments();
        
        res.json({
            success: true,
            message: 'Database connection test successful',
            userCount: userCount,
            dbConnected: dbConnected,
            mongooseState: mongoose.connection.readyState
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Database test failed',
            error: error.message,
            dbConnected: dbConnected,
            mongooseState: mongoose.connection.readyState
        });
    }
});

app.post('/api/auth/register', async (req, res) => {
    try {
        console.log('📝 Registration attempt:', req.body);
        
        // Check if MongoDB is connected
        if (!dbConnected || !User) {
            console.log('❌ Database not available for registration');
            return res.status(503).json({
                success: false,
                message: 'Database not available',
                dbConnected: dbConnected,
                hasUserModel: !!User
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

app.post('/api/auth/login', async (req, res) => {
    try {
        console.log('🔐 Login attempt:', req.body.email);
        
        // Check if MongoDB is connected
        if (!dbConnected || !User) {
            console.log('❌ Database not available for login');
            return res.status(503).json({
                success: false,
                message: 'Database not available',
                dbConnected: dbConnected,
                hasUserModel: !!User
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

// Catch all handler - serve index.html for client-side routing (but not for API routes)
app.get('*', (req, res) => {
    // Skip API routes
    if (req.path.startsWith('/api/')) {
        return res.status(404).json({
            success: false,
            message: 'API endpoint not found'
        });
    }
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
    console.log(`🌐 Environment: ${process.env.NODE_ENV || 'production'}`);
});

module.exports = app;