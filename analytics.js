// BevyFinder Analytics Module
// This module provides analytics tracking for the beverage app

class BevyFinderAnalytics {
    constructor() {
        this.sessionId = this.generateSessionId();
        this.userId = this.getUserId();
        this.endpoint = 'https://your-analytics-endpoint.com/api'; // Replace with your endpoint
        this.enabled = true;
    }

    // Generate unique session ID
    generateSessionId() {
        return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    // Get or create user ID
    getUserId() {
        let userId = localStorage.getItem('bevyfinder_user_id');
        if (!userId) {
            userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('bevyfinder_user_id', userId);
        }
        return userId;
    }

    // Track search events
    trackSearch(beverageName, searchMethod, success = true) {
        const event = {
            type: 'search',
            beverageName: beverageName,
            searchMethod: searchMethod, // 'text' or 'image'
            success: success,
            timestamp: new Date().toISOString(),
            sessionId: this.sessionId,
            userId: this.userId,
            userAgent: navigator.userAgent,
            pageUrl: window.location.href
        };

        this.sendEvent(event);
        console.log('Analytics: Search tracked', event);
    }

    // Track favorite actions
    trackFavorite(beverageName, action) {
        const event = {
            type: 'favorite',
            beverageName: beverageName,
            action: action, // 'add' or 'remove'
            timestamp: new Date().toISOString(),
            sessionId: this.sessionId,
            userId: this.userId,
            userAgent: navigator.userAgent,
            pageUrl: window.location.href
        };

        this.sendEvent(event);
        console.log('Analytics: Favorite tracked', event);
    }

    // Track page views
    trackPageView(pageName) {
        const event = {
            type: 'pageview',
            pageName: pageName,
            timestamp: new Date().toISOString(),
            sessionId: this.sessionId,
            userId: this.userId,
            userAgent: navigator.userAgent,
            pageUrl: window.location.href
        };

        this.sendEvent(event);
        console.log('Analytics: Page view tracked', event);
    }

    // Track feature usage
    trackFeature(featureName, action = 'used') {
        const event = {
            type: 'feature',
            featureName: featureName,
            action: action,
            timestamp: new Date().toISOString(),
            sessionId: this.sessionId,
            userId: this.userId,
            userAgent: navigator.userAgent,
            pageUrl: window.location.href
        };

        this.sendEvent(event);
        console.log('Analytics: Feature tracked', event);
    }

    // Send event to backend (placeholder for now)
    sendEvent(event) {
        if (!this.enabled) return;

        // Option 1: Send to your own backend
        // this.sendToBackend(event);

        // Option 2: Send to Google Analytics
        this.sendToGoogleAnalytics(event);

        // Option 3: Store locally for later upload (as backup)
        this.storeLocally(event);
    }

    // Store events locally for batch upload
    storeLocally(event) {
        let events = JSON.parse(localStorage.getItem('bevyfinder_analytics_events') || '[]');
        events.push(event);
        
        // Keep only last 100 events to prevent storage bloat
        if (events.length > 100) {
            events = events.slice(-100);
        }
        
        localStorage.setItem('bevyfinder_analytics_events', JSON.stringify(events));
    }

    // Upload stored events to backend
    async uploadStoredEvents() {
        const events = JSON.parse(localStorage.getItem('bevyfinder_analytics_events') || '[]');
        if (events.length === 0) return;

        try {
            // Replace with your actual backend endpoint
            const response = await fetch(this.endpoint + '/analytics/batch', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ events: events })
            });

            if (response.ok) {
                // Clear stored events after successful upload
                localStorage.removeItem('bevyfinder_analytics_events');
                console.log('Analytics: Events uploaded successfully');
            }
        } catch (error) {
            console.error('Analytics: Failed to upload events', error);
        }
    }

    // Send to Google Analytics (if you want to use GA4)
    sendToGoogleAnalytics(event) {
        if (typeof gtag !== 'undefined') {
            gtag('event', event.type, {
                'event_category': 'bevyfinder',
                'event_label': event.beverageName || event.pageName || event.featureName,
                'value': 1
            });
        }
    }

    // Enable/disable analytics
    setEnabled(enabled) {
        this.enabled = enabled;
        localStorage.setItem('bevyfinder_analytics_enabled', enabled);
    }

    // Get analytics status
    isEnabled() {
        return this.enabled && localStorage.getItem('bevyfinder_analytics_enabled') !== 'false';
    }
}

// Create global analytics instance
const analytics = new BevyFinderAnalytics();

// Upload stored events when page loads
document.addEventListener('DOMContentLoaded', () => {
    // Upload any stored events
    analytics.uploadStoredEvents();
    
    // Track initial page view
    analytics.trackPageView('welcome');
});

// Upload events before page unload
window.addEventListener('beforeunload', () => {
    analytics.uploadStoredEvents();
});

// Export for use in other files
window.BevyFinderAnalytics = BevyFinderAnalytics;
window.analytics = analytics; 