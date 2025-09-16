// BevyFinder API Client for Frontend
class BevyFinderAPI {
    constructor(baseURL = 'http://localhost:3000/api') {
        this.baseURL = baseURL;
        this.token = localStorage.getItem('bevyfinder_token');
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

    // Make API request
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const config = {
            headers: this.getHeaders(),
            ...options
        };

        try {
            const response = await fetch(url, config);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || `HTTP ${response.status}`);
            }

            return data;
        } catch (error) {
            console.error('API request error:', error);
            throw error;
        }
    }

    // Authentication Methods

    // Register new user
    async register(userData) {
        const response = await this.request('/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData)
        });

        if (response.data.token) {
            this.setToken(response.data.token);
        }

        return response;
    }

    // Login user
    async login(credentials) {
        const response = await this.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify(credentials)
        });

        if (response.data.token) {
            this.setToken(response.data.token);
        }

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
        return !!this.token;
    }

    // Get token
    getToken() {
        return this.token;
    }
}

// Export for use in other scripts
window.BevyFinderAPI = BevyFinderAPI; 