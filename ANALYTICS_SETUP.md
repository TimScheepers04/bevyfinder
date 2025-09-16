# BevyFinder Analytics Setup Guide

This guide will help you set up data collection and management for your BevyFinder beverage app.

## 📊 What Data You Can Collect

### **User Behavior Data:**
- **Searches**: What beverages users search for (text vs image)
- **Favorites**: Which beverages users save/remove
- **Page Views**: Which pages users visit
- **Feature Usage**: Which app features are most used
- **Session Data**: How long users stay, repeat visits

### **Business Intelligence:**
- **Popular Beverages**: Most searched/favorited drinks
- **Search Patterns**: Text vs image search preferences
- **User Engagement**: Time spent, features used
- **Geographic Data**: Where your users are located
- **Device Analytics**: Mobile vs desktop usage

## 🚀 Implementation Options

### **Option 1: Quick Start (Recommended)**

**Use Google Analytics 4 (GA4) - FREE**

1. **Set up GA4:**
   - Go to [Google Analytics](https://analytics.google.com/)
   - Create a new property for BevyFinder
   - Get your Measurement ID (G-XXXXXXXXXX)

2. **Add GA4 to your app:**
   ```html
   <!-- Add this to your index.html head section -->
   <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
   <script>
     window.dataLayer = window.dataLayer || [];
     function gtag(){dataLayer.push(arguments);}
     gtag('js', new Date());
     gtag('config', 'G-XXXXXXXXXX');
   </script>
   ```

3. **Update analytics.js:**
   ```javascript
   // In analytics.js, uncomment the Google Analytics section
   sendToGoogleAnalytics(event) {
       if (typeof gtag !== 'undefined') {
           gtag('event', event.type, {
               'event_category': 'bevyfinder',
               'event_label': event.beverageName || event.pageName || event.featureName,
               'value': 1
           });
       }
   }
   ```

**Benefits:**
- ✅ Free forever
- ✅ Professional dashboard
- ✅ Real-time data
- ✅ Easy setup
- ✅ Privacy compliant

### **Option 2: Custom Backend (Advanced)**

**Deploy your own analytics server:**

1. **Set up MongoDB:**
   - Use [MongoDB Atlas](https://www.mongodb.com/atlas) (free tier available)
   - Get your connection string

2. **Deploy backend:**
   ```bash
   # Create backend directory
   mkdir bevyfinder-backend
   cd bevyfinder-backend
   
   # Copy backend files
   cp ../backend-example.js server.js
   cp ../backend/package.json .
   
   # Install dependencies
   npm install
   
   # Set environment variables
   export MONGODB_URI="your-mongodb-connection-string"
   export PORT=3000
   
   # Start server
   npm start
   ```

3. **Deploy to hosting:**
   - **Heroku**: `heroku create bevyfinder-analytics`
   - **Railway**: Connect GitHub repo
   - **Vercel**: `vercel --prod`

4. **Update analytics endpoint:**
   ```javascript
   // In analytics.js, update the endpoint
   this.endpoint = 'https://your-backend-url.com/api';
   ```

## 📈 Dashboard & Analytics

### **Google Analytics Dashboard:**
- **Real-time**: See live user activity
- **Audience**: User demographics, locations
- **Acquisition**: How users find your site
- **Behavior**: Most popular pages, features
- **Conversions**: Track specific goals

### **Custom Dashboard (if using backend):**
Access your data at: `https://your-backend-url.com/api/analytics/dashboard`

**Sample API endpoints:**
```bash
# Get dashboard data (last 30 days)
GET /api/analytics/dashboard?days=30

# Get all events
GET /api/analytics/events?page=1&limit=100

# Get specific event types
GET /api/analytics/events?type=search
```

## 🔒 Privacy & Compliance

### **GDPR Compliance:**
1. **Add Privacy Policy:**
   ```html
   <!-- Add to your footer -->
   <a href="/privacy.html">Privacy Policy</a>
   ```

2. **Cookie Consent:**
   ```javascript
   // Add cookie consent banner
   function showCookieConsent() {
       // Show banner asking for analytics permission
       // Only enable analytics if user consents
   }
   ```

3. **Data Retention:**
   - Set up automatic cleanup of old data
   - Respect user deletion requests

### **Data Security:**
- Use HTTPS for all data transmission
- Encrypt sensitive data
- Regular security audits
- Access controls for admin data

## 📊 Data Analysis Examples

### **Popular Beverages Report:**
```javascript
// Query your analytics data
const topBeverages = await AnalyticsEvent.aggregate([
    { $match: { type: 'search' } },
    { $group: { _id: '$beverageName', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 10 }
]);
```

### **User Engagement Metrics:**
- **Session Duration**: How long users stay
- **Pages per Session**: How many pages they visit
- **Bounce Rate**: Single-page sessions
- **Return Users**: Repeat visitors

### **Feature Usage Analysis:**
- **Search Method**: Text vs image search popularity
- **Favorites**: Most saved beverages
- **Navigation**: Most used sidebar features

## 🛠️ Advanced Features

### **A/B Testing:**
```javascript
// Track different versions of features
analytics.trackFeature('search_interface', 'version_a');
analytics.trackFeature('search_interface', 'version_b');
```

### **User Segmentation:**
```javascript
// Track user types
analytics.trackFeature('user_type', 'beer_enthusiast');
analytics.trackFeature('user_type', 'cocktail_lover');
```

### **Conversion Tracking:**
```javascript
// Track business goals
analytics.trackFeature('conversion', 'favorite_added');
analytics.trackFeature('conversion', 'search_completed');
```

## 📱 Mobile Analytics

### **Mobile-Specific Tracking:**
```javascript
// Track mobile vs desktop usage
const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
analytics.trackFeature('device_type', isMobile ? 'mobile' : 'desktop');
```

### **App Performance:**
- Track image upload success rates
- Monitor search response times
- Analyze mobile-specific features

## 🔄 Data Export & Backup

### **Regular Backups:**
```bash
# Export MongoDB data
mongodump --uri="your-mongodb-uri" --out=./backups/$(date +%Y%m%d)

# Import data
mongorestore --uri="your-mongodb-uri" ./backups/20240115/
```

### **Data Export Formats:**
- **CSV**: For spreadsheet analysis
- **JSON**: For custom dashboards
- **API**: For real-time integrations

## 📈 Growth Metrics

### **Key Performance Indicators (KPIs):**
1. **User Growth**: New users per month
2. **Engagement**: Searches per user
3. **Retention**: Returning users
4. **Feature Adoption**: Favorites usage
5. **Search Success**: Successful vs failed searches

### **Business Intelligence:**
- **Market Trends**: Popular beverage types
- **User Preferences**: Regional differences
- **Feature Performance**: Most/least used features
- **Conversion Funnel**: Search → View → Favorite

## 🚀 Next Steps

1. **Start with GA4** (easiest, free)
2. **Set up basic tracking** (searches, favorites, page views)
3. **Monitor for 1-2 weeks** to establish baseline
4. **Add advanced features** (A/B testing, user segmentation)
5. **Build custom dashboards** for specific insights

## 📞 Support

For questions about analytics setup:
- Check Google Analytics documentation
- Review MongoDB Atlas guides
- Test with small data sets first
- Monitor data quality regularly

---

**Remember**: Start simple, collect meaningful data, and iterate based on insights! 