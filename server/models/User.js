const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        minlength: [2, 'Name must be at least 2 characters long'],
        maxlength: [50, 'Name cannot exceed 50 characters']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters long'],
        select: false // Don't include password in queries by default
    },
    profile: {
        avatar: {
            type: String,
            default: null
        },
        bio: {
            type: String,
            maxlength: [500, 'Bio cannot exceed 500 characters'],
            default: ''
        },
        location: {
            type: String,
            maxlength: [100, 'Location cannot exceed 100 characters'],
            default: ''
        },
        preferences: {
            favoriteDrinks: [{
                type: String,
                ref: 'Drink'
            }],
            dietaryRestrictions: [{
                type: String,
                enum: ['vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'nut-free', 'none']
            }],
            notifications: {
                type: Boolean,
                default: true
            }
        }
    },
    stats: {
        searches: {
            type: Number,
            default: 0
        },
        favorites: {
            type: Number,
            default: 0
        },
        lastActive: {
            type: Date,
            default: Date.now
        }
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    verificationToken: String,
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    loginAttempts: {
        type: Number,
        default: 0
    },
    lockUntil: Date
}, {
    timestamps: true // Adds createdAt and updatedAt fields
});

// Index for better query performance
userSchema.index({ email: 1 });
userSchema.index({ 'stats.lastActive': -1 });

// Virtual for checking if account is locked
userSchema.virtual('isLocked').get(function() {
    return !!(this.lockUntil && this.lockUntil > Date.now());
});

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
    // Only hash the password if it has been modified (or is new)
    if (!this.isModified('password')) return next();

    try {
        // Hash password with cost of 12
        this.password = await bcrypt.hash(this.password, 12);
        next();
    } catch (error) {
        next(error);
    }
});

// Instance method to check password
userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// Instance method to increment login attempts
userSchema.methods.incLoginAttempts = function() {
    // If we have a previous lock that has expired, restart at 1
    if (this.lockUntil && this.lockUntil < Date.now()) {
        return this.updateOne({
            $unset: { lockUntil: 1 },
            $set: { loginAttempts: 1 }
        });
    }
    
    const updates = { $inc: { loginAttempts: 1 } };
    
    // Lock account after 5 failed attempts
    if (this.loginAttempts + 1 >= 5 && !this.isLocked) {
        updates.$set = { lockUntil: Date.now() + 2 * 60 * 60 * 1000 }; // 2 hours
    }
    
    return this.updateOne(updates);
};

// Instance method to reset login attempts
userSchema.methods.resetLoginAttempts = function() {
    return this.updateOne({
        $unset: { loginAttempts: 1, lockUntil: 1 }
    });
};

// Static method to find user by email
userSchema.statics.findByEmail = function(email) {
    return this.findOne({ email: email.toLowerCase() });
};

// Method to add favorite drink
userSchema.methods.addFavoriteDrink = function(drinkId) {
    if (!this.profile.preferences.favoriteDrinks.includes(drinkId)) {
        this.profile.preferences.favoriteDrinks.push(drinkId);
        this.stats.favorites = this.profile.preferences.favoriteDrinks.length;
        return this.save();
    }
    return Promise.resolve(this);
};

// Method to remove favorite drink
userSchema.methods.removeFavoriteDrink = function(drinkId) {
    const index = this.profile.preferences.favoriteDrinks.indexOf(drinkId);
    if (index > -1) {
        this.profile.preferences.favoriteDrinks.splice(index, 1);
        this.stats.favorites = this.profile.preferences.favoriteDrinks.length;
        return this.save();
    }
    return Promise.resolve(this);
};

// Method to track search
userSchema.methods.trackSearch = function() {
    this.stats.searches += 1;
    this.stats.lastActive = new Date();
    return this.save();
};

// Method to update profile
userSchema.methods.updateProfile = function(updates) {
    Object.assign(this, updates);
    return this.save();
};

// Method to get public profile (without sensitive data)
userSchema.methods.getPublicProfile = function() {
    return {
        id: this._id,
        name: this.name,
        email: this.email,
        profile: this.profile,
        stats: this.stats,
        createdAt: this.createdAt
    };
};

module.exports = mongoose.model('User', userSchema); 