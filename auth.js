// BevyFinder Authentication System
class BevyFinderAuth {
    constructor() {
        this.currentUser = null;
        this.isAuthenticated = false;
        this.users = this.loadUsers();
        this.init();
    }

    // Initialize authentication system
    init() {
        this.checkAuthStatus();
        this.setupEventListeners();
    }

    // Load users from localStorage
    loadUsers() {
        const users = localStorage.getItem('bevyfinder_users');
        return users ? JSON.parse(users) : {};
    }

    // Save users to localStorage
    saveUsers() {
        localStorage.setItem('bevyfinder_users', JSON.stringify(this.users));
    }

    // Check if user is already authenticated
    checkAuthStatus() {
        const currentUser = localStorage.getItem('bevyfinder_current_user');
        if (currentUser) {
            this.currentUser = JSON.parse(currentUser);
            this.isAuthenticated = true;
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
    signUp(email, name, password) {
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

        // Check if user already exists
        if (this.users[email]) {
            throw new Error('An account with this email already exists');
        }

        // Create new user
        const userId = this.generateUserId();
        const newUser = {
            id: userId,
            email: email.toLowerCase(),
            name: name.trim(),
            password: this.hashPassword(password), // In production, use proper hashing
            createdAt: new Date().toISOString(),
            profile: {
                avatar: null,
                bio: '',
                location: '',
                preferences: {
                    favoriteDrinks: [],
                    dietaryRestrictions: [],
                    notifications: true
                }
            },
            stats: {
                searches: 0,
                favorites: 0,
                lastActive: new Date().toISOString()
            }
        };

        // Save user
        this.users[email] = newUser;
        this.saveUsers();

        // Auto sign in
        this.signIn(email, password);

        return newUser;
    }

    // Sign in user
    signIn(email, password) {
        const user = this.users[email.toLowerCase()];
        
        if (!user) {
            throw new Error('No account found with this email');
        }

        if (user.password !== this.hashPassword(password)) {
            throw new Error('Incorrect password');
        }

        // Update last active
        user.stats.lastActive = new Date().toISOString();
        this.saveUsers();

        // Set current user
        this.currentUser = user;
        this.isAuthenticated = true;
        localStorage.setItem('bevyfinder_current_user', JSON.stringify(user));

        this.updateUI();
        return user;
    }

    // Sign out user
    signOut() {
        this.currentUser = null;
        this.isAuthenticated = false;
        localStorage.removeItem('bevyfinder_current_user');
        this.updateUI();
    }

    // Simple password hashing (for demo - use proper hashing in production)
    hashPassword(password) {
        return btoa(password); // Base64 encoding (not secure for production)
    }

    // Update user profile
    updateProfile(updates) {
        if (!this.isAuthenticated) {
            throw new Error('You must be signed in to update your profile');
        }

        // Update profile fields
        if (updates.name) {
            this.currentUser.name = updates.name.trim();
        }

        if (updates.bio !== undefined) {
            this.currentUser.profile.bio = updates.bio;
        }

        if (updates.location !== undefined) {
            this.currentUser.profile.location = updates.location;
        }

        if (updates.preferences) {
            this.currentUser.profile.preferences = {
                ...this.currentUser.profile.preferences,
                ...updates.preferences
            };
        }

        // Save to localStorage
        this.users[this.currentUser.email] = this.currentUser;
        localStorage.setItem('bevyfinder_current_user', JSON.stringify(this.currentUser));
        this.saveUsers();

        this.updateUI();
        return this.currentUser;
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
        if (!this.isAuthenticated) return [];
        return this.currentUser.profile.preferences.favoriteDrinks;
    }

    // Check if drink is favorited by user
    isDrinkFavorited(drinkKey) {
        if (!this.isAuthenticated) return false;
        return this.currentUser.profile.preferences.favoriteDrinks.includes(drinkKey);
    }

    // Update UI based on authentication status
    updateUI() {
        const authPage = document.getElementById('auth-page');
        const mainApp = document.getElementById('main-app');
        const welcomePage = document.getElementById('welcome-page');
        const profileBtn = document.getElementById('sidebar-btn-profile');

        if (this.isAuthenticated) {
            // Hide auth page, show main app
            if (authPage) authPage.style.display = 'none';
            if (mainApp) mainApp.style.display = 'block';
            if (welcomePage) welcomePage.style.display = 'none';

            // Update profile button
            if (profileBtn) {
                profileBtn.innerHTML = `
                    <i class="fas fa-user"></i>
                    ${this.currentUser.name}
                `;
            }

            // Update analytics
            if (typeof analytics !== 'undefined') {
                analytics.trackPageView('authenticated_home');
            }

            console.log('User authenticated:', this.currentUser.name);
        } else {
            // Show auth page, hide main app
            if (authPage) authPage.style.display = 'flex';
            if (mainApp) mainApp.style.display = 'none';
            if (welcomePage) welcomePage.style.display = 'none';

            // Reset profile button
            if (profileBtn) {
                profileBtn.innerHTML = `
                    <i class="fas fa-user"></i>
                    Profile
                `;
            }

            console.log('User not authenticated');
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

        // Toggle between sign up and sign in
        const toggleSignUp = document.getElementById('toggle-signup');
        const toggleSignIn = document.getElementById('toggle-signin');

        if (toggleSignUp) {
            toggleSignUp.addEventListener('click', () => {
                this.showSignUpForm();
            });
        }

        if (toggleSignIn) {
            toggleSignIn.addEventListener('click', () => {
                this.showSignInForm();
            });
        }

        // Sign out button
        const signOutBtn = document.getElementById('signout-btn');
        if (signOutBtn) {
            signOutBtn.addEventListener('click', () => {
                this.signOut();
            });
        }
    }

    // Handle sign up
    handleSignUp() {
        const email = document.getElementById('signup-email').value;
        const name = document.getElementById('signup-name').value;
        const password = document.getElementById('signup-password').value;

        try {
            const user = this.signUp(email, name, password);
            this.showNotification('Account created successfully! Welcome to BevyFinder!', 'success');
            
            // Track analytics
            if (typeof analytics !== 'undefined') {
                analytics.trackFeature('user_signup', 'success');
            }
        } catch (error) {
            this.showNotification(error.message, 'error');
        }
    }

    // Handle sign in
    handleSignIn() {
        const email = document.getElementById('signin-email').value;
        const password = document.getElementById('signin-password').value;

        try {
            const user = this.signIn(email, password);
            this.showNotification(`Welcome back, ${user.name}!`, 'success');
            
            // Track analytics
            if (typeof analytics !== 'undefined') {
                analytics.trackFeature('user_signin', 'success');
            }
        } catch (error) {
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
        authPage.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 5000);
    }

    // Get current user
    getCurrentUser() {
        return this.currentUser;
    }

    // Check if user is authenticated
    isUserAuthenticated() {
        return this.isAuthenticated;
    }
}

// Create global auth instance
const auth = new BevyFinderAuth();

// Export for use in other files
window.BevyFinderAuth = BevyFinderAuth;
window.auth = auth; 