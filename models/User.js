const mongoose = require('mongoose');

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
    },
    pushSubscription: {
        type: mongoose.Schema.Types.Mixed,
        default: null
    },
    notificationSettings: {
        enabled: {
            type: Boolean,
            default: false
        },
        safetyReminders: {
            type: Boolean,
            default: true
        },
        sessionUpdates: {
            type: Boolean,
            default: true
        },
        generalNotifications: {
            type: Boolean,
            default: true
        },
        friendDrinkUpdates: {
            type: Boolean,
            default: true
        }
    },
    friends: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    friendRequests: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        status: {
            type: String,
            enum: ['pending', 'accepted', 'declined'],
            default: 'pending'
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }]
}, {
    timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    
    try {
        const bcrypt = require('bcryptjs');
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
    const bcrypt = require('bcryptjs');
    return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);