const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Post = require('../models/Post');
const { authenticateToken } = require('../middleware/auth');

// Get user's friends list
router.get('/friends', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate('friends', 'name email profile.avatar stats.lastActive');
        
        res.json({
            success: true,
            friends: user.friends
        });
    } catch (error) {
        console.error('Error getting friends:', error);
        res.status(500).json({
            success: false,
            message: 'Error retrieving friends list'
        });
    }
});

// Get friend requests
router.get('/friend-requests', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
            .populate('friendRequests.from', 'name email profile.avatar');
        
        res.json({
            success: true,
            friendRequests: user.friendRequests
        });
    } catch (error) {
        console.error('Error getting friend requests:', error);
        res.status(500).json({
            success: false,
            message: 'Error retrieving friend requests'
        });
    }
});

// Send friend request
router.post('/friend-request/send', authenticateToken, async (req, res) => {
    try {
        const { targetUserId } = req.body;
        
        if (!targetUserId) {
            return res.status(400).json({
                success: false,
                message: 'Target user ID is required'
            });
        }

        const user = await User.findById(req.user.id);
        await user.sendFriendRequest(targetUserId);
        
        res.json({
            success: true,
            message: 'Friend request sent successfully'
        });
    } catch (error) {
        console.error('Error sending friend request:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Error sending friend request'
        });
    }
});

// Accept friend request
router.post('/friend-request/accept', authenticateToken, async (req, res) => {
    try {
        const { fromUserId } = req.body;
        
        if (!fromUserId) {
            return res.status(400).json({
                success: false,
                message: 'From user ID is required'
            });
        }

        const user = await User.findById(req.user.id);
        await user.acceptFriendRequest(fromUserId);
        
        res.json({
            success: true,
            message: 'Friend request accepted successfully'
        });
    } catch (error) {
        console.error('Error accepting friend request:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Error accepting friend request'
        });
    }
});

// Decline friend request
router.post('/friend-request/decline', authenticateToken, async (req, res) => {
    try {
        const { fromUserId } = req.body;
        
        if (!fromUserId) {
            return res.status(400).json({
                success: false,
                message: 'From user ID is required'
            });
        }

        const user = await User.findById(req.user.id);
        await user.declineFriendRequest(fromUserId);
        
        res.json({
            success: true,
            message: 'Friend request declined successfully'
        });
    } catch (error) {
        console.error('Error declining friend request:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Error declining friend request'
        });
    }
});

// Remove friend
router.delete('/friends/:friendId', authenticateToken, async (req, res) => {
    try {
        const { friendId } = req.params;
        
        const user = await User.findById(req.user.id);
        await user.removeFriend(friendId);
        
        res.json({
            success: true,
            message: 'Friend removed successfully'
        });
    } catch (error) {
        console.error('Error removing friend:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Error removing friend'
        });
    }
});

// Search users
router.get('/search-users', authenticateToken, async (req, res) => {
    try {
        const { query } = req.query;
        
        if (!query || query.length < 2) {
            return res.status(400).json({
                success: false,
                message: 'Search query must be at least 2 characters'
            });
        }

        const users = await User.find({
            $or: [
                { name: { $regex: query, $options: 'i' } },
                { email: { $regex: query, $options: 'i' } }
            ],
            _id: { $ne: req.user.id } // Exclude current user
        })
        .select('name email profile.avatar stats.lastActive')
        .limit(10);

        res.json({
            success: true,
            users: users
        });
    } catch (error) {
        console.error('Error searching users:', error);
        res.status(500).json({
            success: false,
            message: 'Error searching users'
        });
    }
});

// Create post
router.post('/posts', authenticateToken, async (req, res) => {
    try {
        const { content, drinks, location, privacy, sessionStats } = req.body;
        
        if (!content) {
            return res.status(400).json({
                success: false,
                message: 'Post content is required'
            });
        }

        const post = new Post({
            user: req.user.id,
            content,
            drinks: drinks || [],
            location,
            privacy: privacy || 'friends',
            sessionStats: sessionStats || {}
        });

        await post.save();
        
        // Update user stats
        const user = await User.findById(req.user.id);
        if (sessionStats) {
            await user.updateStats(sessionStats.totalDrinks || 0, sessionStats.sessionDuration || 0);
        }

        // Populate user info for response
        await post.populate('user', 'name profile.avatar');
        
        res.json({
            success: true,
            post: post
        });
    } catch (error) {
        console.error('Error creating post:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating post'
        });
    }
});

// Get social feed
router.get('/feed', authenticateToken, async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        
        const posts = await Post.getFeed(req.user.id, parseInt(page), parseInt(limit));
        
        res.json({
            success: true,
            posts: posts
        });
    } catch (error) {
        console.error('Error getting feed:', error);
        res.status(500).json({
            success: false,
            message: 'Error retrieving feed'
        });
    }
});

// Get user posts
router.get('/users/:userId/posts', authenticateToken, async (req, res) => {
    try {
        const { userId } = req.params;
        const { page = 1, limit = 10 } = req.query;
        
        const posts = await Post.getUserPosts(req.user.id, userId, parseInt(page), parseInt(limit));
        
        res.json({
            success: true,
            posts: posts
        });
    } catch (error) {
        console.error('Error getting user posts:', error);
        res.status(500).json({
            success: false,
            message: 'Error retrieving user posts'
        });
    }
});

// Like/unlike post
router.post('/posts/:postId/like', authenticateToken, async (req, res) => {
    try {
        const { postId } = req.params;
        
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({
                success: false,
                message: 'Post not found'
            });
        }

        const isLiked = post.likes.includes(req.user.id);
        
        if (isLiked) {
            await post.removeLike(req.user.id);
        } else {
            await post.addLike(req.user.id);
        }
        
        res.json({
            success: true,
            liked: !isLiked,
            likesCount: post.likes.length
        });
    } catch (error) {
        console.error('Error liking post:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating like'
        });
    }
});

// Add comment to post
router.post('/posts/:postId/comments', authenticateToken, async (req, res) => {
    try {
        const { postId } = req.params;
        const { text } = req.body;
        
        if (!text) {
            return res.status(400).json({
                success: false,
                message: 'Comment text is required'
            });
        }

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({
                success: false,
                message: 'Post not found'
            });
        }

        await post.addComment(req.user.id, text);
        await post.populate('comments.user', 'name profile.avatar');
        
        res.json({
            success: true,
            comment: post.comments[post.comments.length - 1]
        });
    } catch (error) {
        console.error('Error adding comment:', error);
        res.status(500).json({
            success: false,
            message: 'Error adding comment'
        });
    }
});

// Get leaderboards
router.get('/leaderboards', authenticateToken, async (req, res) => {
    try {
        const { type = 'totalDrinks', limit = 10 } = req.query;
        
        const validTypes = ['totalDrinks', 'totalSessions', 'longestSession', 'searches'];
        if (!validTypes.includes(type)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid leaderboard type'
            });
        }

        const users = await User.find({
            privacy: { $ne: 'private' }
        })
        .select(`name profile.avatar stats.${type} stats.lastActive`)
        .sort({ [`stats.${type}`]: -1 })
        .limit(parseInt(limit));

        res.json({
            success: true,
            leaderboard: {
                type: type,
                users: users
            }
        });
    } catch (error) {
        console.error('Error getting leaderboards:', error);
        res.status(500).json({
            success: false,
            message: 'Error retrieving leaderboards'
        });
    }
});

// Get user profile (public)
router.get('/users/:userId/profile', authenticateToken, async (req, res) => {
    try {
        const { userId } = req.params;
        
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        const currentUser = await User.findById(req.user.id);
        
        // Check privacy settings
        const canSeeProfile = userId === req.user.id || 
                             user.privacy.profileVisibility === 'public' ||
                             (user.privacy.profileVisibility === 'friends' && currentUser.friends.includes(userId));

        if (!canSeeProfile) {
            return res.status(403).json({
                success: false,
                message: 'Profile is private'
            });
        }

        const profile = {
            id: user._id,
            name: user.name,
            profile: user.profile,
            stats: user.stats,
            createdAt: user.createdAt
        };

        // Add friendship status
        if (userId !== req.user.id) {
            profile.isFriend = currentUser.friends.includes(userId);
            profile.hasSentRequest = currentUser.sentFriendRequests.some(req => req.to.toString() === userId);
            profile.hasReceivedRequest = currentUser.friendRequests.some(req => req.from.toString() === userId);
        }

        res.json({
            success: true,
            profile: profile
        });
    } catch (error) {
        console.error('Error getting user profile:', error);
        res.status(500).json({
            success: false,
            message: 'Error retrieving user profile'
        });
    }
});

module.exports = router;
