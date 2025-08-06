const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage for testing
const users = [];
const JWT_SECRET = 'test-secret-key';

// Health check
app.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'Test server is running',
        timestamp: new Date().toISOString(),
        environment: 'test'
    });
});

// Register endpoint
app.post('/api/auth/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Validation
        if (!name || name.length < 2) {
            return res.status(400).json({
                success: false,
                message: 'Name must be at least 2 characters long'
            });
        }

        if (!email || !email.includes('@')) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a valid email'
            });
        }

        if (!password || password.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 6 characters long'
            });
        }

        // Check if user exists
        const existingUser = users.find(u => u.email === email);
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User with this email already exists'
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = {
            id: Date.now().toString(),
            name,
            email,
            password: hashedPassword,
            createdAt: new Date().toISOString(),
            profile: {
                avatar: null,
                bio: '',
                location: '',
                preferences: {
                    favoriteDrinks: [],
                    dietaryRestrictions: [],
                    notifications: true
                }
            },
            stats: {
                searches: 0,
                favorites: 0,
                lastActive: new Date().toISOString()
            }
        };

        users.push(user);

        // Generate token
        const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '7d' });

        // Return user without password
        const { password: _, ...userWithoutPassword } = user;

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: {
                user: userWithoutPassword,
                token
            }
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during registration'
        });
    }
});

// Login endpoint
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = users.find(u => u.email === email);
        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Check password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Generate token
        const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '7d' });

        // Return user without password
        const { password: _, ...userWithoutPassword } = user;

        res.json({
            success: true,
            message: 'Login successful',
            data: {
                user: userWithoutPassword,
                token
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during login'
        });
    }
});

// Get current user
app.get('/api/auth/me', (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'No token provided'
            });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        const user = users.find(u => u.id === decoded.id);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid token'
            });
        }

        const { password: _, ...userWithoutPassword } = user;

        res.json({
            success: true,
            data: {
                user: userWithoutPassword
            }
        });

    } catch (error) {
        console.error('Get user error:', error);
        res.status(401).json({
            success: false,
            message: 'Invalid token'
        });
    }
});

// Logout endpoint
app.post('/api/auth/logout', (req, res) => {
    res.json({
        success: true,
        message: 'Logout successful'
    });
});

const PORT = 3001;

app.listen(PORT, () => {
    console.log(`🧪 Test server running on port ${PORT}`);
    console.log(`🔗 Health check: http://localhost:${PORT}/health`);
    console.log(`📝 This is a test server without MongoDB - for testing sign-up functionality`);
}); 