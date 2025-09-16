const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Post = require('../models/Post');
const { protect } = require('../middleware/auth');

// Test route
router.get('/test', (req, res) => {
    console.log('Social test route hit!');
    res.json({
        success: true,
        message: 'Social routes are working!'
    });
});

// Test route without auth
router.get('/ping', (req, res) => {
    console.log('Social ping route hit!');
    res.json({
        success: true,
        message: 'Social ping successful!'
    });
});

// Get user's friends list
router.get('/friends', protect, async (req, res) => {
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
router.get('/friend-requests', protect, async (req, res) => {
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
router.post('/friend-request/send', protect, async (req, res) => {
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
router.post('/friend-request/accept', protect, async (req, res) => {
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
router.post('/friend-request/decline', protect, async (req, res) => {
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
router.delete('/friends/:friendId', protect, async (req, res) => {
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
router.get('/search-users', protect, async (req, res) => {
    try {
        const { query } = req.query;
        
        if (!query || query.length < 2) {
            return res.status(400).json({
                success: false,
                message: 'Search query must be at least 2 characters'
            });
        }

        const currentUser = await User.findById(req.user.id);
        
        const users = await User.find({
            $or: [
                { name: { $regex: query, $options: 'i' } },
                { email: { $regex: query, $options: 'i' } }
            ],
            _id: { $ne: req.user.id } // Exclude current user
        })
        .select('name email profile.avatar stats.lastActive')
        .limit(10);

        // Transform users to include friend status information
        const transformedUsers = users.map(user => {
            const isFriend = currentUser.friends.includes(user._id);
            const hasSentRequest = currentUser.sentFriendRequests.some(req => req.to.toString() === user._id.toString());
            const hasReceivedRequest = currentUser.friendRequests.some(req => req.from.toString() === user._id.toString());
            
            return {
                id: user._id.toString(),
                name: user.name,
                email: user.email,
                profile: user.profile,
                stats: user.stats,
                isFriend,
                hasSentRequest,
                hasReceivedRequest
            };
        });

        res.json({
            success: true,
            users: transformedUsers
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
router.post('/posts', protect, async (req, res) => {
    try {
        const { content, drinks, location, privacy, sessionStats, type } = req.body;
        
        console.log('📝 === CREATING POST ===');
        console.log('📝 Received type:', type);
        console.log('📝 Received content:', content);
        console.log('📝 Received sessionStats:', sessionStats);
        
        if (!content) {
            return res.status(400).json({
                success: false,
                message: 'Post content is required'
            });
        }

        const postData = {
            user: req.user.id,
            content,
            type: type || 'regular',
            drinks: drinks || [],
            location,
            privacy: privacy || 'friends',
            sessionStats: sessionStats || {}
        };
        
        console.log('📝 Post data to save:', postData);

        const post = new Post(postData);

        await post.save();
        
        console.log('📝 Saved post type:', post.type);
        console.log('📝 Saved post:', post);
        
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
router.get('/feed', protect, async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        
        console.log('📊 === GETTING SOCIAL FEED ===');
        console.log('📊 User ID:', req.user.id);
        console.log('📊 Page:', page, 'Limit:', limit);
        
        const posts = await Post.getFeed(req.user.id, parseInt(page), parseInt(limit));
        
        console.log('📊 Found posts:', posts.length);
        posts.forEach((post, index) => {
            console.log(`📊 Post ${index}:`, {
                id: post._id,
                type: post.type,
                content: post.content ? post.content.substring(0, 30) + '...' : 'No content',
                hasSessionStats: !!post.sessionStats,
                sessionStatsKeys: post.sessionStats ? Object.keys(post.sessionStats) : 'No sessionStats'
            });
        });
        
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
router.get('/users/:userId/posts', protect, async (req, res) => {
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
router.post('/posts/:postId/like', protect, async (req, res) => {
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
router.post('/posts/:postId/comments', protect, async (req, res) => {
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
router.get('/leaderboards', protect, async (req, res) => {
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
router.get('/users/:userId/profile', protect, async (req, res) => {
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

// Delete a post
router.delete('/posts/:postId', protect, async (req, res) => {
    try {
        const { postId } = req.params;
        
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({
                success: false,
                message: 'Post not found'
            });
        }

        // Check if user owns the post or is admin
        if (post.user.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'You can only delete your own posts'
            });
        }

        await Post.findByIdAndDelete(postId);
        
        res.json({
            success: true,
            message: 'Post deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting post:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting post'
        });
    }
});

module.exports = router;
