const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to protect routes
const protect = async (req, res, next) => {
    try {
        let token;

        // Check if token exists in headers
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        // Check if token exists
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized to access this route'
            });
        }

        try {
            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Get user from token
            const user = await User.findById(decoded.id).select('-password');
            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: 'User not found'
                });
            }

            // Check if account is locked
            if (user.isLocked) {
                return res.status(423).json({
                    success: false,
                    message: 'Account is temporarily locked due to too many failed login attempts'
                });
            }

            req.user = user;
            next();
        } catch (error) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized to access this route'
            });
        }
    } catch (error) {
        console.error('Auth middleware error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// Middleware to check if user is admin (optional)
const admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        return res.status(403).json({
            success: false,
            message: 'Access denied. Admin privileges required.'
        });
    }
};

// Middleware to check if user is verified
const requireVerification = (req, res, next) => {
    if (req.user && req.user.isVerified) {
        next();
    } else {
        return res.status(403).json({
            success: false,
            message: 'Email verification required'
        });
    }
};

// Optional auth middleware (doesn't fail if no token)
const optionalAuth = async (req, res, next) => {
    try {
        let token;

        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (token) {
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                const user = await User.findById(decoded.id).select('-password');
                if (user && !user.isLocked) {
                    req.user = user;
                }
            } catch (error) {
                // Token is invalid, but we don't fail the request
                console.log('Invalid token in optional auth:', error.message);
            }
        }

        next();
    } catch (error) {
        console.error('Optional auth middleware error:', error);
        next();
    }
};

// Rate limiting middleware
const rateLimit = require('express-rate-limit');

// Temporarily disabled rate limiting for testing
const authLimiter = (req, res, next) => {
    next(); // Skip rate limiting
};

// const authLimiter = rateLimit({
//     windowMs: 15 * 60 * 1000, // 15 minutes
//     max: 50, // limit each IP to 50 requests per windowMs (increased for testing)
//     message: {
//         success: false,
//         message: 'Too many authentication attempts, please try again later'
//     },
//     standardHeaders: true,
//     legacyHeaders: false,
// });

const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: {
        success: false,
        message: 'Too many requests, please try again later'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

module.exports = {
    protect,
    admin,
    requireVerification,
    optionalAuth,
    authLimiter,
    apiLimiter
}; 