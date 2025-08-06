// BevyFinder Authentication System - Now using API
class BevyFinderAuth {
    constructor() {
        this.currentUser = null;
        this.isAuthenticated = false;
        this.api = null;
        this.init();
    }

    // Initialize authentication system
    async init() {
        try {
            // Initialize API with better error handling
            this.api = new BevyFinderAPI();
            
            // Wait a bit for API to initialize
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            await this.checkAuthStatus();
            this.setupEventListeners();
        } catch (error) {
            console.error('Auth initialization error:', error);
            // Still set up event listeners even if API fails
            this.setupEventListeners();
        }
    }

    // Check if user is already authenticated
    async checkAuthStatus() {
        console.log('🔍 Checking authentication status...');
        
        if (!this.api) {
            console.log('❌ API not initialized yet');
            this.isAuthenticated = false;
            this.currentUser = null;
            this.updateUI();
            return;
        }
        
        try {
            if (this.api.isAuthenticated()) {
                console.log('✅ Token found in localStorage, validating...');
                const response = await this.api.getCurrentUser();
                this.currentUser = response.data.user;
                this.isAuthenticated = true;
                console.log('✅ Token valid, user authenticated:', this.currentUser.name);
                this.updateUI();
            } else {
                console.log('❌ No token found in localStorage');
                this.isAuthenticated = false;
                this.currentUser = null;
                this.updateUI();
            }
        } catch (error) {
            console.log('❌ Token invalid or expired, clearing...', error.message);
            if (this.api) {
                this.api.clearToken();
            }
            this.isAuthenticated = false;
            this.currentUser = null;
            this.updateUI();
        }
    }

    // Generate unique user ID
    generateUserId() {
        return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    // Validate email format
    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Validate password strength
    validatePassword(password) {
        return password.length >= 6;
    }

    // Validate name
    validateName(name) {
        return name.trim().length >= 2;
    }

    // Sign up new user
    async signUp(email, name, password, personalDetails = null) {
        // Validate inputs
        if (!this.validateEmail(email)) {
            throw new Error('Please enter a valid email address');
        }

        if (!this.validateName(name)) {
            throw new Error('Name must be at least 2 characters long');
        }

        if (!this.validatePassword(password)) {
            throw new Error('Password must be at least 6 characters long');
        }

        if (!this.api) {
            throw new Error('API not available. Please check your connection and try again.');
        }

        try {
            const userData = { email, name, password };
            if (personalDetails) {
                userData.personalDetails = personalDetails;
            }
            
            const response = await this.api.register(userData);
            this.currentUser = response.data.user;
            this.isAuthenticated = true;
            this.updateUI();
            return this.currentUser;
        } catch (error) {
            console.error('Sign up error:', error);
            throw new Error(error.message || 'Failed to create account');
        }
    }

    // Sign in user
    async signIn(email, password, rememberMe = false) {
        if (!this.api) {
            throw new Error('API not available. Please check your connection and try again.');
        }

        try {
            console.log('Attempting to sign in...');
            console.log('API base URL:', this.api.getCurrentURL());
            
            const response = await this.api.login({ email, password, rememberMe });
            this.currentUser = response.data.user;
            this.isAuthenticated = true;
            this.updateUI();
            return this.currentUser;
        } catch (error) {
            console.error('Sign in error:', error);
            console.error('Error details:', {
                message: error.message,
                stack: error.stack,
                apiURL: this.api ? this.api.getCurrentURL() : 'No API'
            });
            
            // Provide more helpful error messages
            if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
                throw new Error('Connection failed. Please check your internet connection and try again.');
            } else if (error.message.includes('401') || error.message.includes('Unauthorized')) {
                throw new Error('Invalid email or password. Please try again.');
            } else if (error.message.includes('404') || error.message.includes('Not Found')) {
                throw new Error('Server not found. Please check your connection and try again.');
            } else {
                throw new Error(error.message || 'Failed to sign in. Please try again.');
            }
        }
    }

    // Sign out user
    async signOut() {
        try {
            if (this.api) {
                await this.api.logout();
            }
        } catch (error) {
            console.log('Logout error (non-critical):', error);
        } finally {
            this.currentUser = null;
            this.isAuthenticated = false;
            this.updateUI();
        }
    }

    // Simple password hashing (for demo - use proper hashing in production)
    hashPassword(password) {
        return btoa(password); // Base64 encoding (not secure for production)
    }

    // Update user profile
    async updateProfile(updates) {
        if (!this.isAuthenticated) {
            throw new Error('You must be signed in to update your profile');
        }

        if (!this.api) {
            throw new Error('API not available');
        }

        try {
            // Update via API
            const response = await this.api.updateProfile(updates);
            
            // Update local user data
            this.currentUser = response.data.user;
            
            // Update UI
            this.updateUI();
            
            return this.currentUser;
        } catch (error) {
            console.error('Profile update error:', error);
            throw new Error(error.message || 'Failed to update profile');
        }
    }

    // Add favorite drink
    addFavoriteDrink(drinkKey) {
        if (!this.isAuthenticated) return;

        if (!this.currentUser.profile.preferences.favoriteDrinks.includes(drinkKey)) {
            this.currentUser.profile.preferences.favoriteDrinks.push(drinkKey);
            this.currentUser.stats.favorites++;
            this.updateProfile({});
        }
    }

    // Remove favorite drink
    removeFavoriteDrink(drinkKey) {
        if (!this.isAuthenticated) return;

        const index = this.currentUser.profile.preferences.favoriteDrinks.indexOf(drinkKey);
        if (index > -1) {
            this.currentUser.profile.preferences.favoriteDrinks.splice(index, 1);
            this.currentUser.stats.favorites--;
            this.updateProfile({});
        }
    }

    // Track search activity
    trackSearch() {
        if (!this.isAuthenticated) return;

        this.currentUser.stats.searches++;
        this.currentUser.stats.lastActive = new Date().toISOString();
        this.updateProfile({});
    }

    // Get user favorites
    getUserFavorites() {
        return this.isAuthenticated ? this.currentUser.profile.preferences.favoriteDrinks : [];
    }

    // Check if drink is favorited
    isDrinkFavorited(drinkKey) {
        return this.isAuthenticated && this.currentUser.profile.preferences.favoriteDrinks.includes(drinkKey);
    }

    // Update UI based on authentication status
    updateUI() {
        const authPage = document.getElementById('auth-page');
        const mainContent = document.getElementById('main-content');
        const profileMenu = document.getElementById('profile-menu');
        const profileBtn = document.querySelector('.profile-btn-header');

        if (!authPage || !mainContent) {
            console.log('UI elements not found, skipping update');
            return;
        }

        if (this.isAuthenticated && this.currentUser) {
            // User is authenticated - show main content
            authPage.style.display = 'none';
            mainContent.style.display = 'block';
            
            // Update profile menu
            if (profileMenu) {
                this.updateProfileMenuContent();
            }
            
            // Show profile button
            if (profileBtn) {
                profileBtn.style.display = 'block';
            }
            
            console.log('✅ UI updated: User authenticated');
        } else {
            // User is not authenticated - show auth page
            authPage.style.display = 'flex';
            mainContent.style.display = 'none';
            
            // Hide profile button
            if (profileBtn) {
                profileBtn.style.display = 'none';
            }
            
            console.log('✅ UI updated: User not authenticated');
        }
    }

    // Update profile menu content
    updateProfileMenuContent() {
        const profileMenu = document.getElementById('profile-menu');
        if (!profileMenu || !this.currentUser) return;

        const userName = profileMenu.querySelector('.profile-menu-header span');
        if (userName) {
            userName.textContent = this.currentUser.name;
        }
    }

    // Setup event listeners
    setupEventListeners() {
        // Sign up form
        const signUpForm = document.getElementById('signup-form');
        if (signUpForm) {
            signUpForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleSignUp();
            });
        }

        // Sign in form
        const signInForm = document.getElementById('signin-form');
        if (signInForm) {
            signInForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleSignIn();
            });
        }

        // Auth toggle
        const authToggle = document.getElementById('auth-toggle');
        if (authToggle) {
            authToggle.addEventListener('click', () => {
                if (document.getElementById('signin-container').style.display === 'none') {
                    this.showSignInForm();
                } else {
                    this.showSignUpForm();
                }
            });
        }

        // Pre-fill email if remembered
        this.preFillEmailIfRemembered();
    }

    // Handle sign up
    async handleSignUp() {
        const email = document.getElementById('signup-email').value;
        const name = document.getElementById('signup-name').value;
        const password = document.getElementById('signup-password').value;

        try {
            console.log('Attempting to sign up user...');
            const user = await this.signUp(email, name, password);
            console.log('Sign up successful:', user);
            this.showNotification(`Welcome to BevyFinder, ${user.name}!`, 'success');
            
            // Track analytics
            if (typeof analytics !== 'undefined') {
                analytics.trackFeature('user_signup', 'success');
            }
        } catch (error) {
            console.error('Sign up error:', error);
            this.showNotification(error.message, 'error');
        }
    }

    // Handle sign in
    async handleSignIn() {
        console.log('handleSignIn called');
        
        const email = document.getElementById('signin-email').value;
        const password = document.getElementById('signin-password').value;
        const rememberMe = document.getElementById('remember-me').checked;

        console.log('Login attempt for:', email, 'Remember me:', rememberMe);

        try {
            console.log('Attempting to sign in user...');
            const user = await this.signIn(email, password, rememberMe);
            console.log('Sign in successful:', user);
            this.showNotification(`Welcome back, ${user.name}!`, 'success');
            
            // Track analytics
            if (typeof analytics !== 'undefined') {
                analytics.trackFeature('user_signin', 'success');
            }
        } catch (error) {
            console.error('Sign in error:', error);
            this.showNotification(error.message, 'error');
        }
    }

    // Show sign up form
    showSignUpForm() {
        document.getElementById('signin-container').style.display = 'none';
        document.getElementById('signup-container').style.display = 'block';
        document.getElementById('auth-toggle-text').textContent = 'Already have an account?';
    }

    // Show sign in form
    showSignInForm() {
        document.getElementById('signup-container').style.display = 'none';
        document.getElementById('signin-container').style.display = 'block';
        document.getElementById('auth-toggle-text').textContent = "Don't have an account?";
    }

    // Show notification
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `auth-notification ${type}`;
        notification.textContent = message;

        const authPage = document.getElementById('auth-page');
        if (authPage) {
            authPage.appendChild(notification);

            setTimeout(() => {
                notification.remove();
            }, 5000);
        }
    }

    // Get current user
    getCurrentUser() {
        return this.currentUser;
    }

    // Check if user is authenticated
    isUserAuthenticated() {
        return this.isAuthenticated;
    }

    // Pre-fill email if "Remember Me" was used
    preFillEmailIfRemembered() {
        const rememberMe = localStorage.getItem('bevyfinder_remember_me');
        const savedEmail = localStorage.getItem('bevyfinder_user_email');
        
        if (rememberMe === 'true' && savedEmail) {
            const emailInput = document.getElementById('signin-email');
            const rememberMeCheckbox = document.getElementById('remember-me');
            
            if (emailInput) {
                emailInput.value = savedEmail;
                console.log('✅ Pre-filled email from "Remember Me"');
            }
            
            if (rememberMeCheckbox) {
                rememberMeCheckbox.checked = true;
                console.log('✅ Checked "Remember Me" checkbox');
            }
        }
    }
}

// Create global auth instance
const auth = new BevyFinderAuth();

// Export for use in other files
window.BevyFinderAuth = BevyFinderAuth;
window.auth = auth; 