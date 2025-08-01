const mongoose = require('mongoose');

const drinkSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Drink name is required'],
        trim: true,
        unique: true
    },
    type: {
        type: String,
        required: [true, 'Drink type is required'],
        enum: ['Beer', 'Wine', 'Spirit', 'Cocktail', 'Cider', 'Other']
    },
    alcohol: {
        type: String,
        required: [true, 'Alcohol type is required']
    },
    abv: {
        type: String,
        required: [true, 'ABV is required']
    },
    standardDrinks: {
        type: String,
        required: [true, 'Standard drinks is required']
    },
    ingredients: [{
        type: String,
        trim: true
    }],
    description: {
        type: String,
        required: [true, 'Description is required'],
        maxlength: [1000, 'Description cannot exceed 1000 characters']
    },
    nutrition: {
        calories: {
            type: Number,
            required: [true, 'Calories are required']
        },
        carbs: {
            type: Number,
            required: [true, 'Carbs are required']
        },
        protein: {
            type: Number,
            required: [true, 'Protein is required']
        },
        fat: {
            type: Number,
            required: [true, 'Fat is required']
        },
        sugar: {
            type: Number,
            required: [true, 'Sugar is required']
        },
        servingSize: {
            type: String,
            required: [true, 'Serving size is required']
        }
    },
    image: {
        type: String,
        default: null
    },
    tags: [{
        type: String,
        trim: true
    }],
    servingSizes: {
        schooner: {
            volume: { type: Number, default: 425 },
            multiplier: { type: Number, default: 1.29 }
        },
        pint: {
            volume: { type: Number, default: 570 },
            multiplier: { type: Number, default: 1.73 }
        },
        'can-bottle': {
            volume: { type: Number, default: 330 },
            multiplier: { type: Number, default: 1.0 }
        },
        jug: {
            volume: { type: Number, default: 1140 },
            multiplier: { type: Number, default: 3.45 }
        }
    },
    stats: {
        totalSearches: {
            type: Number,
            default: 0
        },
        totalFavorites: {
            type: Number,
            default: 0
        },
        averageRating: {
            type: Number,
            default: 0
        },
        totalRatings: {
            type: Number,
            default: 0
        }
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    }
}, {
    timestamps: true
});

// Indexes for better query performance
drinkSchema.index({ name: 1 });
drinkSchema.index({ type: 1 });
drinkSchema.index({ tags: 1 });
drinkSchema.index({ 'stats.totalSearches': -1 });
drinkSchema.index({ 'stats.totalFavorites': -1 });

// Virtual for calculating popularity score
drinkSchema.virtual('popularityScore').get(function() {
    return this.stats.totalSearches + (this.stats.totalFavorites * 2);
});

// Method to increment search count
drinkSchema.methods.incrementSearches = function() {
    this.stats.totalSearches += 1;
    return this.save();
};

// Method to increment favorite count
drinkSchema.methods.incrementFavorites = function() {
    this.stats.totalFavorites += 1;
    return this.save();
};

// Method to decrement favorite count
drinkSchema.methods.decrementFavorites = function() {
    if (this.stats.totalFavorites > 0) {
        this.stats.totalFavorites -= 1;
    }
    return this.save();
};

// Method to update rating
drinkSchema.methods.updateRating = function(newRating) {
    const totalRating = this.stats.averageRating * this.stats.totalRatings + newRating;
    this.stats.totalRatings += 1;
    this.stats.averageRating = totalRating / this.stats.totalRatings;
    return this.save();
};

// Static method to find popular drinks
drinkSchema.statics.findPopular = function(limit = 10) {
    return this.find({ isActive: true })
        .sort({ 'stats.totalSearches': -1, 'stats.totalFavorites': -1 })
        .limit(limit);
};

// Static method to search drinks
drinkSchema.statics.search = function(query) {
    const searchRegex = new RegExp(query, 'i');
    return this.find({
        isActive: true,
        $or: [
            { name: searchRegex },
            { type: searchRegex },
            { tags: searchRegex },
            { description: searchRegex }
        ]
    }).sort({ 'stats.totalSearches': -1 });
};

// Static method to find drinks by type
drinkSchema.statics.findByType = function(type) {
    return this.find({ type: type, isActive: true })
        .sort({ 'stats.totalSearches': -1 });
};

// Method to get public drink data
drinkSchema.methods.getPublicData = function() {
    return {
        id: this._id,
        name: this.name,
        type: this.type,
        alcohol: this.alcohol,
        abv: this.abv,
        standardDrinks: this.standardDrinks,
        ingredients: this.ingredients,
        description: this.description,
        nutrition: this.nutrition,
        image: this.image,
        tags: this.tags,
        servingSizes: this.servingSizes,
        stats: this.stats,
        popularityScore: this.popularityScore
    };
};

module.exports = mongoose.model('Drink', drinkSchema); 