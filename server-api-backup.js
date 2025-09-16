// BevyFinder API Client
// Replace localStorage authentication with server API calls

class BevyFinderAPI {
    constructor(baseURL = 'http://localhost:3000/api') {
        this.baseURL = baseURL;
        this.token = localStorage.getItem('bevyfinder_token');
    }

    // Set authentication token
    setToken(token) {
        this.token = token;
        localStorage.setItem('bevyfinder_token', token);
    }

    // Clear authentication token
    clearToken() {
        this.token = null;
        localStorage.removeItem('bevyfinder_token');
    }

    // Get authorization headers
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
        try {
            const url = `${this.baseURL}${endpoint}`;
            const config = {
                headers: this.getHeaders(),
                ...options
            };

            const response = await fetch(url, config);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'API request failed');
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

// API Client for Frontend - Authentication handled by auth.js
    constructor() {
        this.api = new BevyFinderAPI();
        this.currentUser = null;
        this.isInitialized = false;
    }

    // Initialize authentication
    async init() {
        if (this.isInitialized) return;

        try {
            if (this.api.isAuthenticated()) {
                const response = await this.api.getCurrentUser();
                this.currentUser = response.data.user;
            }
        } catch (error) {
            console.log('Token invalid, clearing...');
            this.api.clearToken();
        }

        this.isInitialized = true;
        this.updateUI();
    }

    // Sign up user
    async signUp(name, email, password) {
        try {
            const response = await this.api.register({ name, email, password });
            this.currentUser = response.data.user;
            this.updateUI();
            this.showNotification('Account created successfully!', 'success');
            return true;
        } catch (error) {
            this.showNotification(error.message, 'error');
            return false;
        }
    }

    // Sign in user
    async signIn(email, password) {
        try {
            const response = await this.api.login({ email, password });
            this.currentUser = response.data.user;
            this.updateUI();
            this.showNotification('Welcome back!', 'success');
            return true;
        } catch (error) {
            this.showNotification(error.message, 'error');
            return false;
        }
    }

    // Sign out user
    async signOut() {
        try {
            await this.api.logout();
        } catch (error) {
            console.log('Logout error:', error);
        } finally {
            this.currentUser = null;
            this.updateUI();
            this.showNotification('Signed out successfully', 'info');
        }
    }

    // Get current user
    getCurrentUser() {
        return this.currentUser;
    }

    // Check if user is authenticated
    isUserAuthenticated() {
        return !!this.currentUser;
    }

    // Add favorite drink
    async addFavoriteDrink(drinkId) {
        if (!this.isUserAuthenticated()) {
            this.showNotification('Please sign in to save favorites', 'warning');
            return false;
        }

        try {
            // Update local state
            if (!this.currentUser.profile.preferences.favoriteDrinks.includes(drinkId)) {
                this.currentUser.profile.preferences.favoriteDrinks.push(drinkId);
                this.currentUser.stats.favorites = this.currentUser.profile.preferences.favoriteDrinks.length;
            }

            // Update server (you'll need to add this endpoint)
            // await this.api.request('/user/favorites', {
            //     method: 'POST',
            //     body: JSON.stringify({ drinkId })
            // });

            this.updateUI();
            return true;
        } catch (error) {
            this.showNotification('Failed to add favorite', 'error');
            return false;
        }
    }

    // Remove favorite drink
    async removeFavoriteDrink(drinkId) {
        if (!this.isUserAuthenticated()) {
            return false;
        }

        try {
            // Update local state
            const index = this.currentUser.profile.preferences.favoriteDrinks.indexOf(drinkId);
            if (index > -1) {
                this.currentUser.profile.preferences.favoriteDrinks.splice(index, 1);
                this.currentUser.stats.favorites = this.currentUser.profile.preferences.favoriteDrinks.length;
            }

            // Update server (you'll need to add this endpoint)
            // await this.api.request(`/user/favorites/${drinkId}`, {
            //     method: 'DELETE'
            // });

            this.updateUI();
            return true;
        } catch (error) {
            this.showNotification('Failed to remove favorite', 'error');
            return false;
        }
    }

    // Track search
    async trackSearch() {
        if (!this.isUserAuthenticated()) {
            return;
        }

        try {
            this.currentUser.stats.searches += 1;
            this.currentUser.stats.lastActive = new Date();

            // Update server (you'll need to add this endpoint)
            // await this.api.request('/user/stats/search', {
            //     method: 'POST'
            // });

            this.updateUI();
        } catch (error) {
            console.log('Failed to track search:', error);
        }
    }

    // Update UI based on authentication state
    updateUI() {
        const authPage = document.getElementById('auth-page');
        const signoutBtn = document.getElementById('signout-btn');
        const profileBtn = document.getElementById('sidebar-btn-profile');

        if (this.isUserAuthenticated()) {
            // User is signed in
            if (authPage) authPage.style.display = 'none';
            if (signoutBtn) signoutBtn.style.display = 'block';
            if (profileBtn) profileBtn.style.display = 'block';

            // Update profile button text
            if (profileBtn && this.currentUser) {
                profileBtn.innerHTML = `<i class="fas fa-user"></i> ${this.currentUser.name}`;
            }
        } else {
            // User is not signed in
            if (signoutBtn) signoutBtn.style.display = 'none';
            if (profileBtn) profileBtn.style.display = 'none';
        }
    }

    // Show notification
    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `auth-notification ${type}`;
        notification.innerHTML = `
            <span>${message}</span>
            <button onclick="this.parentElement.remove()">×</button>
        `;

        // Add to page
        document.body.appendChild(notification);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    }

    // Setup event listeners
    setupEventListeners() {
        // Sign up form
        const signupForm = document.getElementById('signup-form');
        if (signupForm) {
            signupForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const formData = new FormData(signupForm);
                const name = formData.get('name');
                const email = formData.get('email');
                const password = formData.get('password');

                const success = await this.signUp(name, email, password);
                if (success) {
                    // Hide auth page and show main app
                    document.getElementById('auth-page').style.display = 'none';
                    document.querySelector('.main-app').style.display = 'block';
                }
            });
        }

        // Sign in form
        const signinForm = document.getElementById('signin-form');
        if (signinForm) {
            signinForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const formData = new FormData(signinForm);
                const email = formData.get('email');
                const password = formData.get('password');

                const success = await this.signIn(email, password);
                if (success) {
                    // Hide auth page and show main app
                    document.getElementById('auth-page').style.display = 'none';
                    document.querySelector('.main-app').style.display = 'block';
                }
            });
        }

        // Sign out button
        const signoutBtn = document.getElementById('signout-btn');
        if (signoutBtn) {
            signoutBtn.addEventListener('click', () => {
                this.signOut();
            });
        }

        // Auth toggle buttons
        const showSignupBtn = document.getElementById('show-signup');
        const showSigninBtn = document.getElementById('show-signin');
        const signupContainer = document.getElementById('signup-container');
        const signinContainer = document.getElementById('signin-container');

        if (showSignupBtn && showSigninBtn) {
            showSignupBtn.addEventListener('click', () => {
                signinContainer.style.display = 'none';
                signupContainer.style.display = 'block';
            });

            showSigninBtn.addEventListener('click', () => {
                signupContainer.style.display = 'none';
                signinContainer.style.display = 'block';
            });
        }
    }
}

// Initialize authentication when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.auth = new BevyFinderAuth();
    window.auth.init();
    window.auth.setupEventListeners();
});

// Export for use in other scripts
window.BevyFinderAPI = BevyFinderAPI;
window.BevyFinderAuth = BevyFinderAuth; 