// Force API URL fix - inject this into the page
(function() {
    console.log('🔧 Injecting API fix...');
    
    // Override the API_BASE_URL before it's used
    const originalFetch = window.fetch;
    window.fetch = function(url, options) {
        // Replace any github.io URLs with onrender.com
        if (typeof url === 'string' && url.includes('github.io')) {
            url = url.replace('github.io/beverage-input-app', 'onrender.com');
            console.log('🔄 Redirected API call to:', url);
        }
        return originalFetch.call(this, url, options);
    };
    
    // Also set the global variable
    window.API_BASE_URL = 'https://bevyfinder.onrender.com/api';
    
    console.log('✅ API fix injected successfully!');
})();

