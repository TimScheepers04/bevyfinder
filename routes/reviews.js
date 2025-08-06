const express = require('express');
const { body, validationResult } = require('express-validator');
const Review = require('../models/Review');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Get all reviews for a drink
router.get('/drink/:drinkId', async (req, res) => {
    try {
        const { drinkId } = req.params;
        const { page = 1, limit = 10, sort = 'newest' } = req.query;

        const skip = (page - 1) * limit;
        
        let sortOption = {};
        switch (sort) {
            case 'newest':
                sortOption = { createdAt: -1 };
                break;
            case 'oldest':
                sortOption = { createdAt: 1 };
                break;
            case 'rating':
                sortOption = { rating: -1 };
                break;
            case 'helpful':
                sortOption = { helpful: -1 };
                break;
            default:
                sortOption = { createdAt: -1 };
        }

        const reviews = await Review.find({ drinkId })
            .populate('userId', 'name profile.avatar')
            .sort(sortOption)
            .skip(skip)
            .limit(parseInt(limit));

        const total = await Review.countDocuments({ drinkId });
        const averageRating = await Review.getAverageRating(drinkId);

        res.json({
            success: true,
            data: {
                reviews,
                pagination: {
                    current: parseInt(page),
                    total: Math.ceil(total / limit),
                    hasMore: skip + reviews.length < total
                },
                stats: {
                    total,
                    average: averageRating.average,
                    count: averageRating.count
                }
            }
        });
    } catch (error) {
        console.error('Error fetching reviews:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch reviews'
        });
    }
});

// Create a new review
router.post('/', protect, [
    body('drinkId').notEmpty().withMessage('Drink ID is required'),
    body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
    body('review').optional().isLength({ max: 1000 }).withMessage('Review must be less than 1000 characters')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array()
            });
        }

        const { drinkId, rating, review } = req.body;
        const userId = req.user._id;

        // Check if user already reviewed this drink
        const existingReview = await Review.findOne({ userId, drinkId });
        if (existingReview) {
            return res.status(400).json({
                success: false,
                message: 'You have already reviewed this drink'
            });
        }

        const newReview = new Review({
            userId,
            drinkId,
            rating,
            review: review || ''
        });

        await newReview.save();

        // Populate user info for response
        await newReview.populate('userId', 'name profile.avatar');

        res.status(201).json({
            success: true,
            message: 'Review created successfully',
            data: {
                review: newReview
            }
        });
    } catch (error) {
        console.error('Error creating review:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create review'
        });
    }
});

// Update a review
router.put('/:reviewId', protect, [
    body('rating').optional().isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
    body('review').optional().isLength({ max: 1000 }).withMessage('Review must be less than 1000 characters')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array()
            });
        }

        const { reviewId } = req.params;
        const userId = req.user._id;
        const { rating, review } = req.body;

        const reviewDoc = await Review.findOne({ _id: reviewId, userId });
        if (!reviewDoc) {
            return res.status(404).json({
                success: false,
                message: 'Review not found'
            });
        }

        if (rating !== undefined) reviewDoc.rating = rating;
        if (review !== undefined) reviewDoc.review = review;

        await reviewDoc.save();
        await reviewDoc.populate('userId', 'name profile.avatar');

        res.json({
            success: true,
            message: 'Review updated successfully',
            data: {
                review: reviewDoc
            }
        });
    } catch (error) {
        console.error('Error updating review:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update review'
        });
    }
});

// Delete a review
router.delete('/:reviewId', protect, async (req, res) => {
    try {
        const { reviewId } = req.params;
        const userId = req.user._id;

        const review = await Review.findOneAndDelete({ _id: reviewId, userId });
        if (!review) {
            return res.status(404).json({
                success: false,
                message: 'Review not found'
            });
        }

        res.json({
            success: true,
            message: 'Review deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting review:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete review'
        });
    }
});

// Mark review as helpful
router.post('/:reviewId/helpful', protect, async (req, res) => {
    try {
        const { reviewId } = req.params;
        const userId = req.user._id;

        const review = await Review.findById(reviewId);
        if (!review) {
            return res.status(404).json({
                success: false,
                message: 'Review not found'
            });
        }

        const helpfulCount = await review.markHelpful(userId);

        res.json({
            success: true,
            message: 'Review marked as helpful',
            data: {
                helpful: helpfulCount
            }
        });
    } catch (error) {
        console.error('Error marking review helpful:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to mark review as helpful'
        });
    }
});

// Get user's reviews
router.get('/user/me', protect, async (req, res) => {
    try {
        const userId = req.user._id;
        const { page = 1, limit = 10 } = req.query;

        const skip = (page - 1) * limit;

        const reviews = await Review.find({ userId })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        const total = await Review.countDocuments({ userId });

        res.json({
            success: true,
            data: {
                reviews,
                pagination: {
                    current: parseInt(page),
                    total: Math.ceil(total / limit),
                    hasMore: skip + reviews.length < total
                }
            }
        });
    } catch (error) {
        console.error('Error fetching user reviews:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch user reviews'
        });
    }
});

module.exports = router; 