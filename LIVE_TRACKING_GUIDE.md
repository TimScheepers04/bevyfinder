# 🚀 Live Tracking System Guide

## Overview

The BevyFinder app now includes a comprehensive live tracking system that monitors user activity in real-time, providing personalized insights in the dashboard. This system tracks searches, favorites, history, and session data specific to each user's account.

## ✨ Features

### 🔍 Search Tracking
- **Real-time tracking** of all search queries
- **Results count** tracking for each search
- **Search history** with timestamps
- **Today's search count** display

### ❤️ Favorite Tracking
- **Add/Remove tracking** for all favorite actions
- **Beverage key tracking** for each favorite
- **Favorite history** with timestamps
- **Today's favorite count** display

### ⏱️ Session Tracking
- **Session start/end** tracking
- **Duration calculation** for completed sessions
- **Active session monitoring** with real-time duration
- **Longest session** tracking
- **Drink consumption** within sessions

### 📊 Live Dashboard
- **Real-time stats** updates every 30 seconds
- **Animated updates** with pulse effects
- **Recent activity** sections
- **Active session indicator**
- **Today's activity** summaries

## 🏗️ Architecture

### Backend Components

#### 1. Tracking Routes (`server/routes/tracking.js`)
```javascript
// Search tracking
POST /api/tracking/search
{
  "query": "beer",
  "results": 8
}

// Favorite tracking
POST /api/tracking/favorite
{
  "beverageKey": "heineken",
  "action": "add" // or "remove"
}

// Session tracking
POST /api/tracking/session
{
  "action": "start", // or "end"
  "duration": 45, // minutes (for end action)
  "drinks": [...] // drink consumption data
}

// Dashboard stats
GET /api/tracking/dashboard

// History retrieval
GET /api/tracking/history?type=searches&limit=20
```

#### 2. User Model Updates (`server/models/User.js`)
```javascript
// New tracking fields added to User schema
searchHistory: [{
  query: String,
  results: Number,
  timestamp: Date
}],
favoriteHistory: [{
  beverageKey: String,
  action: String, // 'add' or 'remove'
  timestamp: Date
}],
sessionHistory: [{
  startTime: Date,
  endTime: Date,
  duration: Number, // minutes
  drinks: [{
    beverageKey: String,
    quantity: Number,
    timestamp: Date
  }],
  status: String // 'active' or 'completed'
}]
```

### Frontend Components

#### 1. Tracking Functions (`index.html`)
```javascript
// Track search activity
async function trackSearch(query, results)

// Track favorite actions
async function trackFavorite(beverageKey, action)

// Track session activity
async function trackSession(action, duration, drinks)

// Update dashboard stats
async function updateDashboardStats()

// Live dashboard updates
function startDashboardUpdates()
function stopDashboardUpdates()
```

#### 2. Dashboard UI Updates
- **Dynamic stat cards** with live data
- **Recent activity sections** for searches, favorites, and sessions
- **Active session indicator** with real-time duration
- **Today's activity** summaries
- **Animated updates** with pulse effects

## 🚀 Getting Started

### 1. Start the Server
```bash
cd server
npm install
npm start
```

### 2. Test the Tracking System
Open `test-tracking.html` in your browser to test all tracking functionality:

1. **Enter your JWT token** in the authentication section
2. **Test authentication** to verify your token works
3. **Get dashboard stats** to see current tracking data
4. **Test search tracking** by entering search queries
5. **Test favorite tracking** by adding/removing favorites
6. **Test session tracking** by starting/ending sessions
7. **Start live updates** to see real-time dashboard updates

### 3. Use the Main App
1. **Log in** to your account
2. **Navigate to the Dashboard** using the sidebar
3. **Perform searches** to see live tracking
4. **Add/remove favorites** to see favorite tracking
5. **Start/end sessions** in the Night Tracker
6. **Watch the dashboard** update in real-time

## 📊 Dashboard Features

### Stat Cards
- **Searches**: Total searches + today's count
- **Favorites**: Total favorites + today's count  
- **Sessions**: Total sessions + longest session duration
- **Active Session**: Current session status + duration

### Recent Activity Sections
- **Recent Searches**: Last 5 searches with timestamps
- **Recent Favorites**: Last 5 favorite actions with timestamps
- **Recent Sessions**: Last 5 sessions with status and duration

### Live Updates
- **Automatic updates** every 30 seconds when dashboard is active
- **Manual updates** triggered by user actions
- **Page visibility handling** to pause updates when tab is hidden
- **Error handling** with graceful fallbacks

## 🔧 Configuration

### Update Intervals
```javascript
// Dashboard update interval (30 seconds)
dashboardUpdateInterval = setInterval(() => {
  updateDashboardStats();
}, 30000);

// Test page update interval (10 seconds)
liveUpdateInterval = setInterval(() => {
  getDashboardStats();
}, 10000);
```

### History Limits
```javascript
// Search history limit
if (user.searchHistory.length > 50) {
  user.searchHistory = user.searchHistory.slice(0, 50);
}

// Favorite history limit
if (user.favoriteHistory.length > 100) {
  user.favoriteHistory = user.favoriteHistory.slice(0, 100);
}

// Session history limit
if (user.sessionHistory.length > 20) {
  user.sessionHistory = user.sessionHistory.slice(0, 20);
}
```

## 🎯 Usage Examples

### Tracking a Search
```javascript
// When user performs a search
performSearch("beer");
// Automatically calls trackSearch("beer", 8)
```

### Tracking a Favorite
```javascript
// When user adds a favorite
await addToFavorites("heineken");
// Automatically calls trackFavorite("heineken", "add")
```

### Tracking a Session
```javascript
// When user starts a session
await startSession();
// Automatically calls trackSession("start")

// When user ends a session
await endSession();
// Automatically calls trackSession("end", duration, drinks)
```

### Updating Dashboard
```javascript
// Manual dashboard update
updateDashboardStats();

// Start automatic updates
startDashboardUpdates();

// Stop automatic updates
stopDashboardUpdates();
```

## 🔍 API Endpoints

### Search Tracking
```http
POST /api/tracking/search
Authorization: Bearer <token>
Content-Type: application/json

{
  "query": "beer",
  "results": 8
}
```

### Favorite Tracking
```http
POST /api/tracking/favorite
Authorization: Bearer <token>
Content-Type: application/json

{
  "beverageKey": "heineken",
  "action": "add"
}
```

### Session Tracking
```http
POST /api/tracking/session
Authorization: Bearer <token>
Content-Type: application/json

{
  "action": "start"
}
```

### Dashboard Stats
```http
GET /api/tracking/dashboard
Authorization: Bearer <token>
```

### History Retrieval
```http
GET /api/tracking/history?type=searches&limit=20
Authorization: Bearer <token>
```

## 🎨 UI Components

### Stat Cards
```html
<div class="stat-card" id="searches-stat">
  <div class="stat-icon">
    <i class="fas fa-search"></i>
  </div>
  <div class="stat-info">
    <div class="stat-value" id="searches-value">0</div>
    <div class="stat-label">Searches</div>
    <div class="stat-subtitle" id="searches-today">Today: 0</div>
  </div>
</div>
```

### Recent Activity
```html
<div class="recent-section">
  <h4><i class="fas fa-search"></i> Recent Searches</h4>
  <div class="recent-list" id="recent-searches">
    <div class="recent-item empty">No recent searches</div>
  </div>
</div>
```

### Active Session Indicator
```html
<div class="stat-card active-session" id="active-session-stat">
  <div class="stat-icon">
    <i class="fas fa-clock"></i>
  </div>
  <div class="stat-info">
    <div class="stat-value" id="active-session-value">Active</div>
    <div class="stat-label">Active Session</div>
    <div class="stat-subtitle" id="active-session-time">45m</div>
  </div>
</div>
```

## 🚨 Error Handling

### Network Errors
- **Graceful fallbacks** when API calls fail
- **Console logging** for debugging
- **User notifications** for important errors
- **Retry mechanisms** for failed requests

### Authentication Errors
- **Token validation** before tracking
- **Automatic logout** on invalid tokens
- **User prompts** to re-authenticate

### Data Validation
- **Input sanitization** for all tracking data
- **Schema validation** on the backend
- **Default values** for missing data

## 🔒 Security Considerations

### Data Privacy
- **User-specific tracking** - all data is tied to user accounts
- **No cross-user data sharing** - data is isolated per user
- **Secure API endpoints** - all tracking endpoints require authentication

### Rate Limiting
- **API rate limiting** to prevent abuse
- **Request throttling** for tracking endpoints
- **User-friendly error messages** for rate limit violations

### Data Retention
- **Configurable limits** for history data
- **Automatic cleanup** of old tracking data
- **User control** over data retention

## 🎯 Future Enhancements

### Planned Features
- **Analytics dashboard** with charts and graphs
- **Export functionality** for tracking data
- **Privacy controls** for tracking preferences
- **Social sharing** of tracking achievements
- **Gamification** with badges and rewards

### Performance Optimizations
- **Caching strategies** for dashboard data
- **Lazy loading** for history data
- **WebSocket integration** for real-time updates
- **Offline tracking** with sync when online

## 📝 Troubleshooting

### Common Issues

#### Dashboard Not Updating
1. Check if user is logged in (`isLoggedIn()`)
2. Verify API_BASE_URL is correct
3. Check browser console for errors
4. Ensure tracking routes are properly configured

#### Tracking Not Working
1. Verify JWT token is valid
2. Check network connectivity
3. Ensure backend server is running
4. Check API endpoint URLs

#### Performance Issues
1. Reduce update frequency if needed
2. Implement data pagination for large histories
3. Add caching for frequently accessed data
4. Optimize database queries

### Debug Tools
- **Browser console** for frontend debugging
- **Server logs** for backend debugging
- **test-tracking.html** for API testing
- **Network tab** for request/response inspection

## 📞 Support

For issues or questions about the live tracking system:

1. **Check the console** for error messages
2. **Use test-tracking.html** to isolate issues
3. **Review the API documentation** above
4. **Check server logs** for backend issues

The live tracking system provides a comprehensive solution for monitoring user activity in real-time, offering valuable insights while maintaining user privacy and data security.
