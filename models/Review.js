const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    drinkId: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    review: {
        type: String,
        maxlength: 1000,
        trim: true
    },
    helpful: {
        type: Number,
        default: 0
    },
    helpfulUsers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    isVerified: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Compound index to ensure one review per user per drink
reviewSchema.index({ userId: 1, drinkId: 1 }, { unique: true });

// Virtual for formatted date
reviewSchema.virtual('formattedDate').get(function() {
    return this.createdAt.toLocaleDateString('en-AU', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
});

// Static method to get average rating for a drink
reviewSchema.statics.getAverageRating = async function(drinkId) {
    const result = await this.aggregate([
        { $match: { drinkId: drinkId } },
        { $group: { _id: null, avgRating: { $avg: '$rating' }, count: { $sum: 1 } } }
    ]);
    
    return result.length > 0 ? {
        average: Math.round(result[0].avgRating * 10) / 10,
        count: result[0].count
    } : { average: 0, count: 0 };
};

// Instance method to mark review as helpful
reviewSchema.methods.markHelpful = async function(userId) {
    if (!this.helpfulUsers.includes(userId)) {
        this.helpfulUsers.push(userId);
        this.helpful += 1;
        await this.save();
    }
    return this.helpful;
};

module.exports = mongoose.model('Review', reviewSchema); 