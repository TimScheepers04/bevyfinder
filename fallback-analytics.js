// Fallback Analytics System
// This provides basic analytics if Google Analytics fails

class FallbackAnalytics {
    constructor() {
        this.events = [];
        this.sessionId = this.generateSessionId();
        this.userId = this.getUserId();
        this.isGA4Working = false;
        this.checkGA4Status();
    }

    generateSessionId() {
        return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    getUserId() {
        let userId = localStorage.getItem('bevyfinder_user_id');
        if (!userId) {
            userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('bevyfinder_user_id', userId);
        }
        return userId;
    }

    checkGA4Status() {
        // Check if Google Analytics is working
        if (typeof gtag !== 'undefined') {
            this.isGA4Working = true;
            console.log('✅ Google Analytics 4 is working');
        } else {
            console.log('⚠️ Google Analytics 4 not available, using fallback');
        }
    }

    trackEvent(eventName, parameters = {}) {
        const event = {
            event_name: eventName,
            parameters: parameters,
            timestamp: new Date().toISOString(),
            session_id: this.sessionId,
            user_id: this.userId,
            user_agent: navigator.userAgent,
            page_url: window.location.href
        };

        // Try Google Analytics first
        if (this.isGA4Working && typeof gtag !== 'undefined') {
            try {
                gtag('event', eventName, parameters);
                console.log('✅ Event sent to GA4:', eventName);
            } catch (error) {
                console.error('❌ Failed to send to GA4:', error);
                this.isGA4Working = false;
            }
        }

        // Always store locally as backup
        this.events.push(event);
        this.saveEvents();
        
        console.log('📊 Event tracked (fallback):', eventName, parameters);
    }

    trackSearch(beverageName, searchMethod) {
        this.trackEvent('search', {
            'event_category': 'bevyfinder',
            'event_label': beverageName,
            'search_method': searchMethod,
            'beverage_name': beverageName
        });
    }

    trackFavorite(beverageName, action) {
        this.trackEvent('favorite', {
            'event_category': 'bevyfinder',
            'event_label': beverageName,
            'action': action,
            'beverage_name': beverageName
        });
    }

    trackPageView(pageName) {
        this.trackEvent('page_view', {
            'page_title': pageName,
            'page_location': window.location.href
        });
    }

    trackFeature(featureName, action = 'used') {
        this.trackEvent('feature', {
            'event_category': 'bevyfinder',
            'event_label': featureName,
            'action': action,
            'feature_name': featureName
        });
    }

    saveEvents() {
        // Keep only last 100 events to prevent storage bloat
        if (this.events.length > 100) {
            this.events = this.events.slice(-100);
        }
        
        localStorage.setItem('bevyfinder_analytics_events', JSON.stringify(this.events));
    }

    getEvents() {
        return this.events;
    }

    getEventCount() {
        return this.events.length;
    }

    getRecentEvents(limit = 10) {
        return this.events.slice(-limit);
    }

    clearEvents() {
        this.events = [];
        localStorage.removeItem('bevyfinder_analytics_events');
        console.log('🗑️ Analytics events cleared');
    }

    exportEvents() {
        const dataStr = JSON.stringify(this.events, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `bevyfinder-analytics-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        
        URL.revokeObjectURL(url);
    }

    // Send events to a simple backend (if you set one up)
    async sendToBackend(endpoint) {
        if (this.events.length === 0) return;

        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    events: this.events,
                    session_id: this.sessionId,
                    user_id: this.userId
                })
            });

            if (response.ok) {
                console.log('✅ Events sent to backend successfully');
                this.clearEvents(); // Clear after successful send
            } else {
                console.error('❌ Failed to send events to backend');
            }
        } catch (error) {
            console.error('❌ Error sending events to backend:', error);
        }
    }

    // Display analytics dashboard
    showDashboard() {
        const dashboard = document.createElement('div');
        dashboard.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            width: 300px;
            max-height: 400px;
            background: white;
            border: 1px solid #ccc;
            border-radius: 8px;
            padding: 15px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            z-index: 10000;
            font-family: Arial, sans-serif;
            font-size: 12px;
            overflow-y: auto;
        `;

        const recentEvents = this.getRecentEvents(5);
        const eventCount = this.getEventCount();

        dashboard.innerHTML = `
            <h3>📊 Analytics Dashboard</h3>
            <p><strong>Total Events:</strong> ${eventCount}</p>
            <p><strong>GA4 Status:</strong> ${this.isGA4Working ? '✅ Working' : '❌ Not Working'}</p>
            <p><strong>Session ID:</strong> ${this.sessionId}</p>
            
            <h4>Recent Events:</h4>
            <div style="max-height: 200px; overflow-y: auto;">
                ${recentEvents.map(event => `
                    <div style="border-bottom: 1px solid #eee; padding: 5px 0;">
                        <strong>${event.event_name}</strong><br>
                        <small>${new Date(event.timestamp).toLocaleTimeString()}</small>
                    </div>
                `).join('')}
            </div>
            
            <div style="margin-top: 10px;">
                <button onclick="fallbackAnalytics.exportEvents()" style="margin: 2px; padding: 5px 10px; font-size: 10px;">Export</button>
                <button onclick="fallbackAnalytics.clearEvents()" style="margin: 2px; padding: 5px 10px; font-size: 10px;">Clear</button>
                <button onclick="this.parentElement.parentElement.remove()" style="margin: 2px; padding: 5px 10px; font-size: 10px;">Close</button>
            </div>
        `;

        document.body.appendChild(dashboard);
    }
}

// Create global instance
const fallbackAnalytics = new FallbackAnalytics();

// Make it available globally
window.fallbackAnalytics = fallbackAnalytics;

// Auto-track page views
document.addEventListener('DOMContentLoaded', () => {
    fallbackAnalytics.trackPageView(document.title);
});

// Show dashboard with keyboard shortcut (Ctrl+Shift+A)
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        fallbackAnalytics.showDashboard();
    }
});

console.log('📊 Fallback Analytics loaded. Press Ctrl+Shift+A to view dashboard.'); 