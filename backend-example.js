// BevyFinder Backend Example
// This is a simple Node.js/Express server to collect analytics data
// You can deploy this to services like Heroku, Railway, or Vercel

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection (replace with your MongoDB URI)
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/bevyfinder', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Analytics Event Schema
const analyticsSchema = new mongoose.Schema({
    type: { type: String, required: true }, // 'search', 'favorite', 'pageview', 'feature'
    beverageName: String,
    searchMethod: String, // 'text' or 'image'
    action: String, // 'add', 'remove', 'used'
    success: Boolean,
    pageName: String,
    featureName: String,
    timestamp: { type: Date, default: Date.now },
    sessionId: String,
    userId: String,
    userAgent: String,
    pageUrl: String,
    ipAddress: String
});

const AnalyticsEvent = mongoose.model('AnalyticsEvent', analyticsSchema);

// Routes

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Single event endpoint
app.post('/api/analytics/event', async (req, res) => {
    try {
        const event = new AnalyticsEvent({
            ...req.body,
            ipAddress: req.ip
        });
        await event.save();
        res.json({ success: true, id: event._id });
    } catch (error) {
        console.error('Error saving event:', error);
        res.status(500).json({ error: 'Failed to save event' });
    }
});

// Batch events endpoint
app.post('/api/analytics/batch', async (req, res) => {
    try {
        const { events } = req.body;
        if (!Array.isArray(events)) {
            return res.status(400).json({ error: 'Events must be an array' });
        }

        const eventsWithIp = events.map(event => ({
            ...event,
            ipAddress: req.ip
        }));

        await AnalyticsEvent.insertMany(eventsWithIp);
        res.json({ success: true, count: events.length });
    } catch (error) {
        console.error('Error saving batch events:', error);
        res.status(500).json({ error: 'Failed to save events' });
    }
});

// Analytics dashboard data
app.get('/api/analytics/dashboard', async (req, res) => {
    try {
        const { days = 30 } = req.query;
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - parseInt(days));

        // Get basic stats
        const totalEvents = await AnalyticsEvent.countDocuments({
            timestamp: { $gte: startDate }
        });

        const totalSearches = await AnalyticsEvent.countDocuments({
            type: 'search',
            timestamp: { $gte: startDate }
        });

        const totalFavorites = await AnalyticsEvent.countDocuments({
            type: 'favorite',
            action: 'add',
            timestamp: { $gte: startDate }
        });

        const uniqueUsers = await AnalyticsEvent.distinct('userId', {
            timestamp: { $gte: startDate }
        });

        // Get top searched beverages
        const topBeverages = await AnalyticsEvent.aggregate([
            {
                $match: {
                    type: 'search',
                    timestamp: { $gte: startDate }
                }
            },
            {
                $group: {
                    _id: '$beverageName',
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { count: -1 }
            },
            {
                $limit: 10
            }
        ]);

        // Get search method distribution
        const searchMethods = await AnalyticsEvent.aggregate([
            {
                $match: {
                    type: 'search',
                    timestamp: { $gte: startDate }
                }
            },
            {
                $group: {
                    _id: '$searchMethod',
                    count: { $sum: 1 }
                }
            }
        ]);

        // Get daily activity
        const dailyActivity = await AnalyticsEvent.aggregate([
            {
                $match: {
                    timestamp: { $gte: startDate }
                }
            },
            {
                $group: {
                    _id: {
                        $dateToString: { format: "%Y-%m-%d", date: "$timestamp" }
                    },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { _id: 1 }
            }
        ]);

        res.json({
            period: `${days} days`,
            totalEvents,
            totalSearches,
            totalFavorites,
            uniqueUsers: uniqueUsers.length,
            topBeverages,
            searchMethods,
            dailyActivity
        });
    } catch (error) {
        console.error('Error getting dashboard data:', error);
        res.status(500).json({ error: 'Failed to get dashboard data' });
    }
});

// Get all events (for admin purposes)
app.get('/api/analytics/events', async (req, res) => {
    try {
        const { page = 1, limit = 100, type } = req.query;
        const skip = (page - 1) * limit;

        const filter = {};
        if (type) filter.type = type;

        const events = await AnalyticsEvent.find(filter)
            .sort({ timestamp: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        const total = await AnalyticsEvent.countDocuments(filter);

        res.json({
            events,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Error getting events:', error);
        res.status(500).json({ error: 'Failed to get events' });
    }
});

// Delete old events (cleanup)
app.delete('/api/analytics/cleanup', async (req, res) => {
    try {
        const { days = 90 } = req.query;
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - parseInt(days));

        const result = await AnalyticsEvent.deleteMany({
            timestamp: { $lt: cutoffDate }
        });

        res.json({
            success: true,
            deletedCount: result.deletedCount,
            cutoffDate
        });
    } catch (error) {
        console.error('Error cleaning up events:', error);
        res.status(500).json({ error: 'Failed to cleanup events' });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`BevyFinder Analytics Server running on port ${PORT}`);
});

module.exports = app; 