const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    content: {
        type: String,
        maxlength: [1000, 'Post content cannot exceed 1000 characters'],
        required: true
    },
    type: {
        type: String,
        enum: ['regular', 'night_share', 'drink_session'],
        default: 'regular'
    },
    drinks: [{
        drinkKey: {
            type: String,
            required: true
        },
        drinkName: {
            type: String,
            required: true
        },
        quantity: {
            type: Number,
            default: 1
        }
    }],
    location: {
        type: String,
        maxlength: [100, 'Location cannot exceed 100 characters']
    },
    privacy: {
        type: String,
        enum: ['public', 'friends', 'private'],
        default: 'friends'
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    comments: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        text: {
            type: String,
            maxlength: [500, 'Comment cannot exceed 500 characters'],
            required: true
        },
        date: {
            type: Date,
            default: Date.now
        }
    }],
    sessionStats: {
        totalDrinks: {
            type: Number,
            default: 0
        },
        totalBAC: {
            type: Number,
            default: 0
        },
        sessionDuration: {
            type: Number,
            default: 0
        },
        totalStandards: {
            type: Number,
            default: 0
        },
        finalBAC: {
            type: Number,
            default: 0
        },
        totalCalories: {
            type: Number,
            default: 0
        },
        totalCarbs: {
            type: Number,
            default: 0
        },
        totalLiquid: {
            type: Number,
            default: 0
        },
        sessionStart: {
            type: Date
        },
        sessionEnd: {
            type: Date
        },
        drinks: [{
            name: String,
            time: Date,
            standardDrinks: Number
        }]
    }
}, {
    timestamps: true
});

// Indexes for better query performance
postSchema.index({ user: 1, createdAt: -1 });
postSchema.index({ privacy: 1, createdAt: -1 });
postSchema.index({ 'likes': 1 });

// Method to add like
postSchema.methods.addLike = function(userId) {
    if (!this.likes.includes(userId)) {
        this.likes.push(userId);
        return this.save();
    }
    return Promise.resolve(this);
};

// Method to remove like
postSchema.methods.removeLike = function(userId) {
    this.likes = this.likes.filter(like => like.toString() !== userId.toString());
    return this.save();
};

// Method to add comment
postSchema.methods.addComment = function(userId, text) {
    this.comments.push({
        user: userId,
        text: text
    });
    return this.save();
};

// Method to remove comment
postSchema.methods.removeComment = function(commentId) {
    this.comments = this.comments.filter(comment => comment._id.toString() !== commentId.toString());
    return this.save();
};

// Static method to get feed posts
postSchema.statics.getFeed = async function(userId, page = 1, limit = 10) {
    const user = await mongoose.model('User').findById(userId);
    if (!user) {
        throw new Error('User not found');
    }

    const skip = (page - 1) * limit;
    
    // Get posts based on privacy settings
    const query = {
        $or: [
            { privacy: 'public' },
            { user: { $in: user.friends }, privacy: 'friends' },
            { user: userId } // User's own posts
        ]
    };

    const posts = await this.find(query)
        .populate('user', 'name profile.avatar')
        .populate('likes', 'name')
        .populate('comments.user', 'name profile.avatar')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

    return posts;
};

// Static method to get user posts
postSchema.statics.getUserPosts = async function(userId, targetUserId, page = 1, limit = 10) {
    const user = await mongoose.model('User').findById(userId);
    const targetUser = await mongoose.model('User').findById(targetUserId);
    
    if (!user || !targetUser) {
        throw new Error('User not found');
    }

    const skip = (page - 1) * limit;
    
    // Check if user can see target user's posts
    const canSeePosts = userId === targetUserId.toString() || 
                       targetUser.privacy.showDrinks === 'public' ||
                       (targetUser.privacy.showDrinks === 'friends' && user.friends.includes(targetUserId));

    if (!canSeePosts) {
        return [];
    }

    const query = { user: targetUserId };
    if (userId !== targetUserId.toString()) {
        query.privacy = { $ne: 'private' };
    }

    const posts = await this.find(query)
        .populate('user', 'name profile.avatar')
        .populate('likes', 'name')
        .populate('comments.user', 'name profile.avatar')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

    return posts;
};

module.exports = mongoose.model('Post', postSchema);
