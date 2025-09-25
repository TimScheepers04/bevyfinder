const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

console.log('🚀 Starting BevyFinder minimal server - v3.0...');

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
let Post;
let Friend;
let FriendRequest;
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
            email: {
                type: String,
                required: true,
                unique: true,
                lowercase: true,
                trim: true
            },
            password: {
                type: String,
                required: true,
                minlength: 6
            },
            name: {
                type: String,
                trim: true
            },
            personalDetails: {
                firstName: {
                    type: String,
                    trim: true
                },
                lastName: {
                    type: String,
                    trim: true
                },
                dateOfBirth: {
                    type: Date
                },
                weight: {
                    type: Number,
                    min: 30,
                    max: 300
                },
                gender: {
                    type: String,
                    enum: ['male', 'female', 'other']
                }
            }
        }, {
            timestamps: true
        });

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
        
        // Create Post model for social feed
        const postSchema = new mongoose.Schema({
            userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
            content: { type: String, required: true },
            type: { type: String, enum: ['regular', 'night_share'], default: 'regular' },
            sessionStats: {
                totalDrinks: { type: Number, default: 0 },
                totalCalories: { type: Number, default: 0 },
                totalStandardDrinks: { type: Number, default: 0 },
                totalStandards: { type: Number, default: 0 },
                sessionDuration: { type: Number, default: 0 },
                totalBAC: { type: Number, default: 0 },
                finalBAC: { type: Number, default: 0 },
                totalCarbs: { type: Number, default: 0 },
                totalLiquid: { type: Number, default: 0 },
                sessionStart: { type: Date },
                sessionEnd: { type: Date },
                drinks: [{
                    name: String,
                    count: Number,
                    calories: Number,
                    standardDrinks: Number,
                    time: Date,
                    _id: String
                }]
            },
            likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
            comments: [{
                userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
                content: String,
                createdAt: { type: Date, default: Date.now }
            }]
        }, { timestamps: true });

        Post = mongoose.model('Post', postSchema);
        console.log('✅ Post model created successfully');
        
        // Create Friend model
        const friendSchema = new mongoose.Schema({
            user1: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
            user2: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
            status: { type: String, enum: ['pending', 'accepted'], default: 'pending' }
        }, { timestamps: true });

        Friend = mongoose.model('Friend', friendSchema);
        console.log('✅ Friend model created successfully');
        
        // Create FriendRequest model
        const friendRequestSchema = new mongoose.Schema({
            from: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
            to: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
            status: { type: String, enum: ['pending', 'accepted', 'declined'], default: 'pending' }
        }, { timestamps: true });

        FriendRequest = mongoose.model('FriendRequest', friendRequestSchema);
        console.log('✅ FriendRequest model created successfully');
        
    } catch (error) {
        console.error('❌ MongoDB connection error:', error);
        dbConnected = false;
    }
};

// Initialize database connection (non-blocking)
connectDB();

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, 'bevyfinder-super-secret-jwt-key-2024', {
        expiresIn: '7d'
    });
};

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'BevyFinder API is running',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'production',
        database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
        mongoURI_set: !!process.env.MONGODB_URI,
        connectionState: mongoose.connection.readyState,
        mongooseState: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
    });
});

// Test endpoint
app.get('/api/test', (req, res) => {
    res.json({
        success: true,
        message: 'Test endpoint working',
        timestamp: new Date().toISOString()
    });
});

// Registration Route
app.post('/api/auth/register', async (req, res) => {
    try {
        if (!dbConnected || !User) {
            return res.status(503).json({
                success: false,
                message: 'Database not available'
            });
        }

        const { name, email, password, personalDetails } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User with this email already exists'
            });
        }

        const user = new User({
            email,
            password,
            name: name,
            personalDetails: {
                firstName: name,
                ...personalDetails
            }
        });

        await user.save();

        const token = generateToken(user._id);

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: {
                user: {
                    id: user._id,
                    email: user.email,
                    name: user.name,
                    personalDetails: user.personalDetails
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

// Login Route
app.post('/api/auth/login', async (req, res) => {
    try {
        if (!dbConnected || !User) {
            return res.status(503).json({
                success: false,
                message: 'Database not available'
            });
        }

        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        const token = generateToken(user._id);

        res.status(200).json({
            success: true,
            message: 'Login successful',
            data: {
                user: {
                    id: user._id,
                    email: user.email,
                    name: user.name,
                    personalDetails: user.personalDetails
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

// Authentication middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Access token required'
        });
    }

    jwt.verify(token, 'bevyfinder-super-secret-jwt-key-2024', (err, user) => {
        if (err) {
            return res.status(403).json({
                success: false,
                message: 'Invalid or expired token'
            });
        }
        req.user = user;
        next();
    });
};

// Real-time updates with Server-Sent Events
const connectedClients = new Set();

app.get('/api/social/events', authenticateToken, (req, res) => {
    // Set up Server-Sent Events
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Cache-Control'
    });

    // Add client to connected clients
    const clientId = req.user.id;
    connectedClients.add({ id: clientId, res: res });

    // Send initial connection message
    res.write(`data: ${JSON.stringify({ type: 'connected', message: 'Connected to real-time updates' })}\n\n`);

    // Handle client disconnect
    req.on('close', () => {
        connectedClients.delete({ id: clientId, res: res });
        console.log(`Client ${clientId} disconnected from SSE`);
    });

    console.log(`Client ${clientId} connected to SSE`);
});

// Broadcast function to send updates to all connected clients
function broadcastUpdate(update) {
    const message = `data: ${JSON.stringify(update)}\n\n`;
    connectedClients.forEach(client => {
        try {
            client.res.write(message);
        } catch (error) {
            console.error('Error sending SSE message:', error);
            connectedClients.delete(client);
        }
    });
}

// API endpoint to add a drink to night tracker
app.post('/api/tracking/add-drink', authenticateToken, async (req, res) => {
    try {
        if (!dbConnected || !User) {
            return res.status(503).json({
                success: false,
                message: 'Database not available'
            });
        }

        const { drinkName, drinkData, sessionStats } = req.body;

        if (!drinkName || !drinkData) {
            return res.status(400).json({
                success: false,
                message: 'Drink name and data are required'
            });
        }

        // Get user info for the post
        const user = await User.findById(req.user.id);
        const userName = user?.name || 'Someone';

        // Create a more detailed and professional live update post
        const totalDrinks = sessionStats?.totalDrinks || 1;
        const totalStandards = sessionStats?.totalStandards || drinkData.standardDrinks || 0;
        
        // Create drink list for display
        const drinksList = sessionStats?.drinks || [{
            name: drinkName,
            count: 1,
            calories: drinkData.calories || 0,
            standardDrinks: drinkData.standardDrinks || 0,
            time: new Date(),
            _id: Date.now().toString()
        }];

        const liveUpdatePost = {
            userId: req.user.id,
            content: `🍺 ${userName} just added ${drinkName} to their night!`,
            type: 'live_update', // New type for live updates
            isLiveUpdate: true,
            sessionStats: sessionStats || {
                totalDrinks: 1,
                totalCalories: drinkData.calories || 0,
                totalStandardDrinks: drinkData.standardDrinks || 0,
                totalStandards: drinkData.standardDrinks || 0,
                sessionDuration: 0,
                totalBAC: 0,
                finalBAC: 0,
                totalCarbs: drinkData.carbs || 0,
                totalLiquid: drinkData.servingSize || 0,
                drinks: drinksList
            },
            // Additional data for live updates
            liveUpdateData: {
                userName: userName,
                drinkAdded: drinkName,
                totalDrinks: totalDrinks,
                totalStandards: totalStandards,
                drinksConsumed: drinksList,
                sessionDuration: sessionStats?.sessionDuration || 0,
                sessionStart: sessionStats?.sessionStart,
                timestamp: new Date()
            }
        };

        // Save the post to database
        const post = new Post(liveUpdatePost);
        await post.save();
        await post.populate('userId', 'name email');

        // Broadcast the update to all connected clients
        broadcastUpdate({
            type: 'new_post',
            post: post,
            message: `${userName} just added ${drinkName} to their night!`
        });

        res.json({
            success: true,
            message: 'Drink added successfully',
            post: post
        });

    } catch (error) {
        console.error('❌ Add drink error:', error);
        res.status(500).json({
            success: false,
            message: 'Error adding drink',
            error: error.message
        });
    }
});

// Social Feed Endpoints

// Get social feed
app.get('/api/social/feed', authenticateToken, async (req, res) => {
    try {
        if (!dbConnected || !Post || !User) {
            return res.status(503).json({
                success: false,
                message: 'Database not available'
            });
        }

        // Get posts with user information
        const posts = await Post.find()
            .populate('userId', 'name email')
            .populate('likes', 'name')
            .sort({ createdAt: -1 })
            .limit(50);

        res.json({
            success: true,
            posts: posts
        });
    } catch (error) {
        console.error('❌ Social feed error:', error);
        res.status(500).json({
            success: false,
            message: 'Error loading social feed',
            error: error.message
        });
    }
});

// Create post
app.post('/api/social/posts', authenticateToken, async (req, res) => {
    try {
        if (!dbConnected || !Post || !User) {
            return res.status(503).json({
                success: false,
                message: 'Database not available'
            });
        }

        const { content, type, sessionStats } = req.body;

        if (!content || content.trim().length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Content is required'
            });
        }

        // Ensure sessionStats has proper structure with all fields
        const fullSessionStats = {
            totalDrinks: sessionStats?.totalDrinks || 0,
            totalCalories: sessionStats?.totalCalories || 0,
            totalStandardDrinks: sessionStats?.totalStandardDrinks || 0,
            totalStandards: sessionStats?.totalStandards || 0,
            sessionDuration: sessionStats?.sessionDuration || 0,
            totalBAC: sessionStats?.totalBAC || 0,
            finalBAC: sessionStats?.finalBAC || 0,
            totalCarbs: sessionStats?.totalCarbs || 0,
            totalLiquid: sessionStats?.totalLiquid || 0,
            sessionStart: sessionStats?.sessionStart ? new Date(sessionStats.sessionStart) : undefined,
            sessionEnd: sessionStats?.sessionEnd ? new Date(sessionStats.sessionEnd) : undefined,
            drinks: sessionStats?.drinks || []
        };

        const post = new Post({
            userId: req.user.id,
            content: content.trim(),
            type: type || 'regular',
            sessionStats: fullSessionStats
        });

        await post.save();
        await post.populate('userId', 'name email');

        res.status(201).json({
            success: true,
            message: 'Post created successfully',
            post: post
        });
    } catch (error) {
        console.error('❌ Create post error:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating post',
            error: error.message
        });
    }
});

// Like/Unlike post
app.post('/api/social/posts/:postId/like', authenticateToken, async (req, res) => {
    try {
        if (!dbConnected || !Post) {
            return res.status(503).json({
                success: false,
                message: 'Database not available'
            });
        }

        const post = await Post.findById(req.params.postId);
        if (!post) {
            return res.status(404).json({
                success: false,
                message: 'Post not found'
            });
        }

        const userId = req.user.id;
        const isLiked = post.likes.includes(userId);

        if (isLiked) {
            post.likes = post.likes.filter(id => !id.equals(userId));
        } else {
            post.likes.push(userId);
        }

        await post.save();

        res.json({
            success: true,
            liked: !isLiked,
            likesCount: post.likes.length
        });
    } catch (error) {
        console.error('❌ Like post error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating like',
            error: error.message
        });
    }
});

// Get friends
app.get('/api/social/friends', authenticateToken, async (req, res) => {
    try {
        if (!dbConnected || !Friend || !User) {
            return res.status(503).json({
                success: false,
                message: 'Database not available'
            });
        }

        const userId = req.user.id;
        const friendships = await Friend.find({
            $or: [{ user1: userId }, { user2: userId }],
            status: 'accepted'
        }).populate('user1 user2', 'name email');

        const friends = friendships.map(friendship => {
            const friend = friendship.user1._id.equals(userId) ? friendship.user2 : friendship.user1;
            return {
                id: friend._id,
                name: friend.name,
                email: friend.email
            };
        });

        res.json({
            success: true,
            friends: friends
        });
    } catch (error) {
        console.error('❌ Get friends error:', error);
        res.status(500).json({
            success: false,
            message: 'Error loading friends',
            error: error.message
        });
    }
});

// Get friend requests
app.get('/api/social/friend-requests', authenticateToken, async (req, res) => {
    try {
        if (!dbConnected || !FriendRequest || !User) {
            return res.status(503).json({
                success: false,
                message: 'Database not available'
            });
        }

        const userId = req.user.id;
        const requests = await FriendRequest.find({
            to: userId,
            status: 'pending'
        }).populate('from', 'name email');

        res.json({
            success: true,
            friendRequests: requests
        });
    } catch (error) {
        console.error('❌ Get friend requests error:', error);
        res.status(500).json({
            success: false,
            message: 'Error loading friend requests',
            error: error.message
        });
    }
});

// Search users
app.get('/api/social/search-users', authenticateToken, async (req, res) => {
    try {
        if (!dbConnected || !User) {
            return res.status(503).json({
                success: false,
                message: 'Database not available'
            });
        }

        const query = req.query.query;
        if (!query || query.length < 2) {
            return res.status(400).json({
                success: false,
                message: 'Query must be at least 2 characters'
            });
        }

        const users = await User.find({
            $and: [
                { _id: { $ne: req.user.id } },
                {
                    $or: [
                        { name: { $regex: query, $options: 'i' } },
                        { email: { $regex: query, $options: 'i' } }
                    ]
                }
            ]
        }).select('name email').limit(10);

        res.json({
            success: true,
            users: users
        });
    } catch (error) {
        console.error('❌ Search users error:', error);
        res.status(500).json({
            success: false,
            message: 'Error searching users',
            error: error.message
        });
    }
});

// Send friend request
app.post('/api/social/friend-request/send', authenticateToken, async (req, res) => {
    try {
        if (!dbConnected || !FriendRequest || !User) {
            return res.status(503).json({
                success: false,
                message: 'Database not available'
            });
        }

        const { targetUserId } = req.body;
        const fromUserId = req.user.id;

        if (!targetUserId || targetUserId === fromUserId) {
            return res.status(400).json({
                success: false,
                message: 'Invalid target user'
            });
        }

        // Check if request already exists
        const existingRequest = await FriendRequest.findOne({
            $or: [
                { from: fromUserId, to: targetUserId },
                { from: targetUserId, to: fromUserId }
            ]
        });

        if (existingRequest) {
            return res.status(400).json({
                success: false,
                message: 'Friend request already exists'
            });
        }

        const friendRequest = new FriendRequest({
            from: fromUserId,
            to: targetUserId,
            status: 'pending'
        });

        await friendRequest.save();

        res.json({
            success: true,
            message: 'Friend request sent successfully'
        });
    } catch (error) {
        console.error('❌ Send friend request error:', error);
        res.status(500).json({
            success: false,
            message: 'Error sending friend request',
            error: error.message
        });
    }
});

// Accept friend request
app.post('/api/social/friend-request/accept', authenticateToken, async (req, res) => {
    try {
        if (!dbConnected || !FriendRequest || !Friend) {
            return res.status(503).json({
                success: false,
                message: 'Database not available'
            });
        }

        const { fromUserId } = req.body;
        const toUserId = req.user.id;

        const friendRequest = await FriendRequest.findOne({
            from: fromUserId,
            to: toUserId,
            status: 'pending'
        });

        if (!friendRequest) {
            return res.status(404).json({
                success: false,
                message: 'Friend request not found'
            });
        }

        // Update friend request status
        friendRequest.status = 'accepted';
        await friendRequest.save();

        // Create friendship
        const friendship = new Friend({
            user1: fromUserId,
            user2: toUserId,
            status: 'accepted'
        });
        await friendship.save();

        res.json({
            success: true,
            message: 'Friend request accepted successfully'
        });
    } catch (error) {
        console.error('❌ Accept friend request error:', error);
        res.status(500).json({
            success: false,
            message: 'Error accepting friend request',
            error: error.message
        });
    }
});

// Decline friend request
app.post('/api/social/friend-request/decline', authenticateToken, async (req, res) => {
    try {
        if (!dbConnected || !FriendRequest) {
            return res.status(503).json({
                success: false,
                message: 'Database not available'
            });
        }

        const { fromUserId } = req.body;
        const toUserId = req.user.id;

        const friendRequest = await FriendRequest.findOne({
            from: fromUserId,
            to: toUserId,
            status: 'pending'
        });

        if (!friendRequest) {
            return res.status(404).json({
                success: false,
                message: 'Friend request not found'
            });
        }

        friendRequest.status = 'declined';
        await friendRequest.save();

        res.json({
            success: true,
            message: 'Friend request declined'
        });
    } catch (error) {
        console.error('❌ Decline friend request error:', error);
        res.status(500).json({
            success: false,
            message: 'Error declining friend request',
            error: error.message
        });
    }
});

// Remove friend
app.delete('/api/social/friends/:userId', authenticateToken, async (req, res) => {
    try {
        if (!dbConnected || !Friend) {
            return res.status(503).json({
                success: false,
                message: 'Database not available'
            });
        }

        const friendUserId = req.params.userId;
        const userId = req.user.id;

        await Friend.deleteOne({
            $or: [
                { user1: userId, user2: friendUserId },
                { user1: friendUserId, user2: userId }
            ]
        });

        res.json({
            success: true,
            message: 'Friend removed successfully'
        });
    } catch (error) {
        console.error('❌ Remove friend error:', error);
        res.status(500).json({
            success: false,
            message: 'Error removing friend',
            error: error.message
        });
    }
});

// Get leaderboards
app.get('/api/social/leaderboards', authenticateToken, async (req, res) => {
    try {
        if (!dbConnected || !User || !Post) {
            return res.status(503).json({
                success: false,
                message: 'Database not available'
            });
        }

        const type = req.query.type || 'totalDrinks';
        
        // For now, return mock data since we don't have complex stats
        const users = await User.find().select('name email').limit(10);
        
        const leaderboard = users.map((user, index) => ({
            name: user.name,
            email: user.email,
            stats: {
                totalDrinks: Math.floor(Math.random() * 100),
                totalSessions: Math.floor(Math.random() * 50),
                longestSession: Math.floor(Math.random() * 300),
                searches: Math.floor(Math.random() * 200)
            }
        }));

        res.json({
            success: true,
            leaderboard: {
                type: type,
                users: leaderboard
            }
        });
    } catch (error) {
        console.error('❌ Get leaderboards error:', error);
        res.status(500).json({
            success: false,
            message: 'Error loading leaderboards',
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