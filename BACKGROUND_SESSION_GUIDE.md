# Background Session Tracking Guide for BevyFinder

## 🚀 Overview

BevyFinder now features **persistent background session tracking**! Your night tracker sessions will continue running even when you swipe out of the app, close the browser tab, or navigate away. This ensures your BAC calculations remain accurate and you receive important safety alerts.

## ✨ Key Features

### 1. **Persistent Sessions**
- ✅ Sessions continue running in background
- ✅ BAC calculations update automatically
- ✅ Safety alerts sent even when app is closed
- ✅ Session data persists across app restarts

### 2. **Background Processing**
- 🔄 Service Worker handles background tasks
- ⏰ Automatic session updates every 5 minutes
- 📊 Real-time BAC calculations
- 🔔 Background safety notifications

### 3. **Data Persistence**
- 💾 IndexedDB for reliable storage
- 🔄 localStorage fallback
- 📱 Cross-device session sync
- 🗂️ Session history management

## 🔧 Technical Implementation

### Frontend Components

#### 1. **BackgroundSessionManager Class**
```javascript
const backgroundSessionManager = new BackgroundSessionManager();
```

**Key Methods:**
- `startSession(userData)` - Start a new persistent session
- `endSession()` - End the current session
- `addDrink(drinkData)` - Add drink to active session
- `updateSessionStats()` - Update BAC and stats
- `getCurrentSession()` - Get current session data

#### 2. **Service Worker Integration**
- Background sync every 5 minutes
- Session data persistence
- Safety alert notifications
- BAC calculations in background

#### 3. **Page Visibility Handling**
- `visibilitychange` event handling
- `beforeunload` event handling
- `pagehide` event handling
- Automatic UI updates when returning to app

### Backend Components

#### 1. **Session Data Storage**
- IndexedDB for primary storage
- localStorage as fallback
- Session history management
- Cross-tab synchronization

#### 2. **Background Sync**
- Service Worker background sync
- Periodic session updates
- Safety alert processing
- Data synchronization

## 📱 User Experience

### 1. **Starting a Session**
1. User clicks "Start Session" button
2. Session begins and persists in background
3. Green indicator shows session is active
4. Session continues even when app is closed

### 2. **Adding Drinks**
1. User adds drinks during session
2. BAC updates automatically
3. Session data saved to persistent storage
4. Notifications sent if BAC is high

### 3. **Background Operation**
- Session runs continuously in background
- BAC calculations update every 5 minutes
- Safety alerts sent automatically
- Data persists across app restarts

### 4. **Returning to App**
1. User reopens app
2. Session automatically resumes
3. UI updates with current stats
4. Notification about resumed session

## 🔒 Data Security & Privacy

### 1. **Local Storage**
- All session data stored locally
- No data sent to server without permission
- User controls data retention
- Secure data encryption

### 2. **Privacy Controls**
- Session data stays on device
- Optional cloud sync (user choice)
- Clear data deletion options
- Transparent data usage

### 3. **Data Retention**
- Active sessions: Until manually ended
- Session history: Last 50 sessions
- Automatic cleanup of old data
- User can clear all data

## 🧪 Testing Scenarios

### 1. **Basic Session Persistence**
```javascript
// Start session
await startNightTrackerSession();

// Close app/tab
// Wait 10 minutes
// Reopen app
// Session should still be active
```

### 2. **Background BAC Calculation**
```javascript
// Add drinks
await addDrinkToSession({ name: 'Beer', alcoholContent: 0.05 });

// Close app
// Wait 30 minutes
// Reopen app
// BAC should be lower due to metabolism
```

### 3. **Safety Alerts**
```javascript
// Add multiple drinks quickly
// BAC should exceed 0.08%
// Safety alert should be sent
// Even if app is closed
```

### 4. **Cross-Tab Synchronization**
```javascript
// Start session in tab 1
// Open app in tab 2
// Session should be active in both tabs
// Changes sync between tabs
```

## 🚨 Troubleshooting

### Common Issues

#### 1. **"Session not persisting"**
- Check if Service Worker is registered
- Verify IndexedDB is available
- Check browser permissions
- Ensure HTTPS is enabled

#### 2. **"BAC not updating"**
- Check background sync registration
- Verify session is active
- Check console for errors
- Restart the app

#### 3. **"Notifications not working"**
- Check notification permissions
- Verify push subscription
- Check service worker status
- Test notification manually

#### 4. **"Data not syncing"**
- Check IndexedDB status
- Verify localStorage fallback
- Check for storage errors
- Clear and restart session

### Debug Steps

1. **Check Service Worker**
   ```javascript
   // In browser console
   navigator.serviceWorker.getRegistrations().then(registrations => {
     console.log('Service Workers:', registrations);
   });
   ```

2. **Check Session Data**
   ```javascript
   // In browser console
   backgroundSessionManager.getCurrentSession().then(session => {
     console.log('Current Session:', session);
   });
   ```

3. **Check IndexedDB**
   ```javascript
   // In browser console
   const db = await backgroundSessionManager.openDB();
   const session = await db.get('sessions', 'current');
   console.log('IndexedDB Session:', session);
   ```

4. **Test Background Sync**
   ```javascript
   // In browser console
   navigator.serviceWorker.ready.then(registration => {
     registration.sync.register('session-sync');
   });
   ```

## 📈 Performance Considerations

### 1. **Optimization**
- Background sync every 5 minutes (not too frequent)
- Efficient BAC calculations
- Minimal data storage
- Smart notification timing

### 2. **Battery Usage**
- Minimal background processing
- Efficient data storage
- Smart sync intervals
- Battery-friendly operations

### 3. **Memory Usage**
- Clean up old session data
- Efficient data structures
- Minimal memory footprint
- Regular garbage collection

## 🔮 Future Enhancements

### Potential Features
- **Cloud Sync**: Sync sessions across devices
- **Offline Mode**: Work without internet
- **Smart Alerts**: AI-powered safety recommendations
- **Session Sharing**: Share sessions with friends
- **Advanced Analytics**: Detailed session insights

### Technical Improvements
- **WebAssembly**: Faster BAC calculations
- **Web Workers**: Better background processing
- **Progressive Web App**: Native app experience
- **Real-time Sync**: Live session updates

## 📞 Support

If you encounter issues:
1. Check browser console for errors
2. Verify service worker registration
3. Test session persistence manually
4. Check IndexedDB status
5. Review background sync logs

## 🎉 Benefits

### For Users
- **Peace of Mind**: Sessions never get lost
- **Accurate Tracking**: Real-time BAC updates
- **Safety First**: Automatic safety alerts
- **Convenience**: No need to keep app open

### For Developers
- **Reliable Data**: Persistent session storage
- **Background Processing**: Efficient resource usage
- **User Experience**: Seamless app usage
- **Safety Features**: Automated monitoring

## 🚀 Getting Started

### For Users
1. **Start a session** using the "Start Session" button
2. **Add drinks** as you consume them
3. **Close the app** - session continues running
4. **Reopen the app** - session automatically resumes
5. **End session** when finished

### For Developers
1. **Install dependencies**: All required packages included
2. **Test locally**: Use HTTPS for full functionality
3. **Deploy**: Background features work in production
4. **Monitor**: Check console for any issues

---

**Your night tracker sessions now run continuously, ensuring accurate BAC tracking and safety monitoring even when the app is closed! 🍺⏰**
