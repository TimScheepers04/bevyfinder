// BevyFinder API Client for Frontend
class BevyFinderAPI {
    constructor(baseURL = null) {
        this.baseURL = null;
        this.connectionTested = false;
        this.workingURLs = [];
        
        // Initialize with provided URL or auto-detect
        if (baseURL) {
            this.baseURL = baseURL;
        } else {
            this.initializeURL();
        }
        
        this.token = localStorage.getItem('bevyfinder_token');
        console.log('API: Initialized with base URL:', this.baseURL);
        
        // Test connection in background
        this.testConnection();
    }
    
    async initializeURL() {
        // Get current location info
        const currentHost = window.location.hostname;
        const currentPort = window.location.port;
        const currentProtocol = window.location.protocol;
        
        console.log('API: Current location:', {
            hostname: currentHost,
            port: currentPort,
            protocol: currentProtocol
        });
        
        // HARDCODED FALLBACK: Always use the known working local server
        // This ensures the app works regardless of hostname resolution issues
        this.baseURL = 'http://192.168.4.36:3000/api';
        console.log('API: Using hardcoded local server URL:', this.baseURL);
        
        // Test the connection to make sure it works
        try {
            const response = await fetch('http://192.168.4.36:3000/health', {
                method: 'GET',
                mode: 'cors',
                headers: {
                    'Accept': 'application/json'
                },
                signal: AbortSignal.timeout(5000)
            });
            
            if (response.ok) {
                console.log('✅ Hardcoded API URL is working');
                this.workingURLs.push(this.baseURL);
                return;
            } else {
                console.warn('⚠️ Hardcoded API URL failed, trying alternatives...');
            }
        } catch (error) {
            console.warn('⚠️ Hardcoded API URL failed:', error.message);
        }
        
        // If hardcoded URL fails, try the original detection logic
        const possibleURLs = this.generatePossibleURLs(currentHost, currentPort, currentProtocol);
        
        // Try each URL until we find one that works
        for (const url of possibleURLs) {
            try {
                console.log('API: Testing URL:', url);
                const response = await fetch(url.replace('/api', '') + '/health', {
                    method: 'GET',
                    mode: 'cors',
                    headers: {
                        'Accept': 'application/json'
                    },
                    // Add timeout
                    signal: AbortSignal.timeout(5000)
                });
                
                if (response.ok) {
                    console.log('✅ Found working API URL:', url);
                    this.baseURL = url;
                    this.workingURLs.push(url);
                    return;
                }
            } catch (error) {
                console.log(`❌ Failed to connect to ${url}:`, error.message);
            }
        }
        
        // If no URL works, use the hardcoded one as final fallback
        this.baseURL = 'http://192.168.4.36:3000/api';
        console.warn('⚠️ No working API URL found, using hardcoded fallback:', this.baseURL);
    }
    
    generatePossibleURLs(hostname, port, protocol) {
        const urls = [];
        
        // ALWAYS prioritize local development URLs first
        // This prevents the app from trying production URLs when running locally
        
        // 1. Always try the known working local network IP first
        urls.push('http://192.168.4.36:3000/api');
        
        // 2. If we're on a local network (192.168.x.x, 10.x.x.x, etc.)
        if (hostname.match(/^(192\.168\.|10\.|172\.(1[6-9]|2[0-9]|3[0-1])\.)/)) {
            // Try the same hostname with port 3000
            urls.push(`${protocol}//${hostname}:3000/api`);
            
            // Try common local network IPs
            const networkPrefix = hostname.split('.').slice(0, 3).join('.');
            for (let i = 1; i <= 10; i++) {
                urls.push(`${protocol}//${networkPrefix}.${i}:3000/api`);
            }
        }
        
        // 3. If we're on localhost
        if (hostname === 'localhost' || hostname === '127.0.0.1') {
            urls.push('http://localhost:3000/api');
            urls.push('http://127.0.0.1:3000/api');
        }
        
        // 4. Common local development IPs
        urls.push('http://192.168.1.1:3000/api');
        urls.push('http://192.168.0.1:3000/api');
        urls.push('http://10.0.0.1:3000/api');
        
        // 5. Only try production URLs as a last resort, and only if we're actually on the production domain
        if (hostname === 'bevyfinder.com' || hostname === 'www.bevyfinder.com') {
            urls.push(`https://${hostname}/api`);
            urls.push(`https://api.${hostname}/api`);
        }
        
        // Remove duplicates and return
        return [...new Set(urls)];
    }
    
    async testConnection() {
        if (this.connectionTested) return;
        
        try {
            const response = await fetch(`${this.baseURL.replace('/api', '')}/health`, {
                method: 'GET',
                mode: 'cors',
                headers: {
                    'Accept': 'application/json'
                },
                signal: AbortSignal.timeout(3000)
            });
            
            if (response.ok) {
                console.log('✅ API connection successful');
                this.connectionTested = true;
            } else {
                console.error('❌ API connection failed:', response.status);
                await this.tryAlternativeURLs();
            }
        } catch (error) {
            console.error('❌ API connection error:', error.message);
            await this.tryAlternativeURLs();
        }
    }
    
    async tryAlternativeURLs() {
        if (this.workingURLs.length > 0) {
            // Try known working URLs first
            for (const url of this.workingURLs) {
                if (url === this.baseURL) continue;
                
                try {
                    const response = await fetch(url.replace('/api', '') + '/health', {
                        method: 'GET',
                        mode: 'cors',
                        headers: {
                            'Accept': 'application/json'
                        },
                        signal: AbortSignal.timeout(3000)
                    });
                    
                    if (response.ok) {
                        console.log(`✅ Switched to working API URL: ${url}`);
                        this.baseURL = url;
                        this.connectionTested = true;
                        return;
                    }
                } catch (error) {
                    console.log(`❌ Failed to connect to ${url}:`, error.message);
                }
            }
        }
        
        // If no known URLs work, try to re-initialize
        console.log('🔄 Re-initializing API URLs...');
        await this.initializeURL();
    }

    // Token management
    setToken(token) {
        this.token = token;
        localStorage.setItem('bevyfinder_token', token);
    }

    clearToken() {
        this.token = null;
        localStorage.removeItem('bevyfinder_token');
    }

    getHeaders() {
        const headers = {
            'Content-Type': 'application/json'
        };

        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }

        return headers;
    }

    // Make API request with retry logic
    async request(endpoint, options = {}, retryCount = 0) {
        const maxRetries = 2;
        const url = `${this.baseURL}${endpoint}`;
        
        const config = {
            headers: this.getHeaders(),
            mode: 'cors',
            credentials: 'include',
            ...options
        };

        try {
            console.log('API: Making request to:', url);
            const response = await fetch(url, config);
            
            // If we get a CORS error or connection error, try alternative URLs
            if (!response.ok && (response.status === 0 || response.status >= 500)) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || `HTTP ${response.status}`);
            }

            return data;
        } catch (error) {
            console.error('API request error:', error);
            console.error('API: Request failed for URL:', url);
            
            // Retry with different URL if we haven't exceeded retry limit
            if (retryCount < maxRetries) {
                console.log(`🔄 Retrying request (${retryCount + 1}/${maxRetries})...`);
                await this.tryAlternativeURLs();
                return this.request(endpoint, options, retryCount + 1);
            }
            
            throw error;
        }
    }

    // Authentication Methods

    // Register new user
    async register(userData) {
        console.log('API: Registering user:', userData);
        const response = await this.request('/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData)
        });

        if (response.data.token) {
            this.setToken(response.data.token);
        }

        console.log('API: Register response:', response);
        return response;
    }

    // Login user
    async login(credentials) {
        console.log('API: Logging in user:', credentials.email, 'Remember me:', credentials.rememberMe);
        const response = await this.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify(credentials)
        });

        if (response.data.token) {
            this.setToken(response.data.token);
            
            // If remember me is checked, store additional info
            if (credentials.rememberMe) {
                localStorage.setItem('bevyfinder_remember_me', 'true');
                localStorage.setItem('bevyfinder_user_email', credentials.email);
            } else {
                localStorage.removeItem('bevyfinder_remember_me');
                localStorage.removeItem('bevyfinder_user_email');
            }
        }

        console.log('API: Login response:', response);
        return response;
    }

    // Get current user
    async getCurrentUser() {
        return await this.request('/auth/me');
    }

    // Update user profile
    async updateProfile(updates) {
        const response = await this.request('/auth/profile', {
            method: 'PUT',
            body: JSON.stringify(updates)
        });

        return response;
    }

    // Logout user
    async logout() {
        try {
            await this.request('/auth/logout', {
                method: 'POST'
            });
        } catch (error) {
            console.log('Logout error (non-critical):', error);
        } finally {
            this.clearToken();
        }
    }

    // Refresh token
    async refreshToken() {
        const response = await this.request('/auth/refresh', {
            method: 'POST'
        });

        if (response.data.token) {
            this.setToken(response.data.token);
        }

        return response;
    }

    // Check if user is authenticated
    isAuthenticated() {
        const hasToken = !!this.token;
        console.log('🔑 Token check:', hasToken ? 'Token exists' : 'No token');
        return hasToken;
    }

    // Get token
    getToken() {
        return this.token;
    }

    // Get current API URL (for debugging)
    getCurrentURL() {
        return this.baseURL;
    }

    // Favorites Methods
    async addToFavorites(beverageKey) {
        console.log('API: Adding to favorites:', beverageKey);
        const response = await this.request('/favorites/add', {
            method: 'POST',
            body: JSON.stringify({ beverageKey })
        });
        console.log('API: Add to favorites response:', response);
        return response;
    }

    async removeFromFavorites(beverageKey) {
        console.log('API: Removing from favorites:', beverageKey);
        const response = await this.request('/favorites/remove', {
            method: 'DELETE',
            body: JSON.stringify({ beverageKey })
        });
        console.log('API: Remove from favorites response:', response);
        return response;
    }

    // Like Methods
    async likeDrink(beverageKey) {
        console.log('API: Liking drink:', beverageKey);
        const response = await this.request('/likes/add', {
            method: 'POST',
            body: JSON.stringify({ beverageKey })
        });
        console.log('API: Like drink response:', response);
        return response;
    }

    async unlikeDrink(beverageKey) {
        console.log('API: Unliking drink:', beverageKey);
        const response = await this.request('/likes/remove', {
            method: 'DELETE',
            body: JSON.stringify({ beverageKey })
        });
        console.log('API: Unlike drink response:', response);
        return response;
    }

    async getTopLikedDrinks() {
        console.log('API: Getting top liked drinks');
        const response = await this.request('/likes/top', {
            method: 'GET'
        });
        console.log('API: Top liked drinks response:', response);
        return response;
    }
}

// Export for use in other scripts
window.BevyFinderAPI = BevyFinderAPI; 