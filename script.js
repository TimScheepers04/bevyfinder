// Test if JavaScript is running
console.log('Script.js loaded successfully!');

// DOM Elements - will be initialized when DOM is loaded
let welcomePage, mainApp, startBtn, tabBtns, tabContents, beverageNameInput, searchBtn, suggestions;
let uploadArea, previewArea, previewImage, removeBtn, resultsSection, beverageCard, uploadBtn;
let menuBtn, sidebar, closeMenuBtn, sidebarOverlay, sidebarBtns;
let favoritesPage, favoritesContainer, emptyFavorites;
let historyPage, historyContainer, emptyHistory, historyActions;
let trackingPage, startSessionBtn, endSessionBtn, resetSessionBtn, sessionTime;
let totalAlcohol, totalCalories, totalCarbs, totalProtein, totalSugar, totalFat;
let sobrietyStatus, sobrietyDetails, bacLevel, trackingDrinkSearch, addDrinkBtn;
let trackingDrinkSuggestions, drinkList, emptyDrinks, safetyTips;

// Tracking State
let currentSession = {
    isActive: false,
    startTime: null,
    drinks: [],
    totalAlcohol: 0,
    totalCalories: 0,
    totalCarbs: 0,
    totalSugar: 0,
    totalFat: 0
};

// Search timeout for debouncing
let searchTimeout;

// API Client
const api = new BevyFinderAPI();

// Auth system - already declared in auth.js
// const auth = new BevyFinderAuth();

// Search Filters
let currentFilters = {
    type: 'all',
    abvMin: 0,
    abvMax: 15,
    country: 'all',
    rating: 0,
    price: 'all'
};

// Filter Functions
function toggleAdvancedFilters() {
    const filters = document.getElementById('advanced-filters');
    const filterBtn = document.getElementById('filter-btn');
    
    if (filters.style.display === 'none') {
        filters.style.display = 'block';
        filterBtn.style.background = '#1976D2';
        filterBtn.innerHTML = '<i class="fas fa-filter"></i>';
    } else {
        filters.style.display = 'none';
        filterBtn.style.background = '#2196F3';
        filterBtn.innerHTML = '<i class="fas fa-filter"></i>';
    }
}

function updateABVDisplay() {
    const abvMin = document.getElementById('abv-min').value;
    const abvMax = document.getElementById('abv-max').value;
    const display = document.getElementById('abv-range-display');
    
    display.textContent = `${abvMin}% - ${abvMax}%`;
    
    // Update current filters
    currentFilters.abvMin = parseFloat(abvMin);
    currentFilters.abvMax = parseFloat(abvMax);
}

function applyFilters() {
    const typeFilter = document.getElementById('type-filter').value;
    const countryFilter = document.getElementById('country-filter').value;
    const ratingFilter = parseFloat(document.getElementById('rating-filter').value);
    
    currentFilters.type = typeFilter;
    currentFilters.country = countryFilter;
    currentFilters.rating = ratingFilter;
    
    // Apply filters to current search results
    filterSearchResults();
    
    showNotification('Filters applied!', 'success');
}

function clearFilters() {
    // Reset filter inputs
    document.getElementById('type-filter').value = 'all';
    document.getElementById('country-filter').value = 'all';
    document.getElementById('rating-filter').value = '0';
    document.getElementById('abv-min').value = '0';
    document.getElementById('abv-max').value = '15';
    
    // Reset current filters
    currentFilters = {
        type: 'all',
        abvMin: 0,
        abvMax: 15,
        country: 'all',
        rating: 0,
        price: 'all'
    };
    
    updateABVDisplay();
    filterSearchResults();
    
    showNotification('Filters cleared!', 'info');
}

function filterSearchResults() {
    const resultsSection = document.getElementById('results-section');
    if (resultsSection.style.display === 'none') return;
    
    const beverageCard = document.getElementById('beverage-card');
    const currentBeverage = beverageCard.dataset.beverageKey;
    
    if (currentBeverage && beverageDatabase[currentBeverage]) {
        const beverage = beverageDatabase[currentBeverage];
        
        // Check if beverage matches filters
        const matchesType = currentFilters.type === 'all' || beverage.type === currentFilters.type;
        const matchesCountry = currentFilters.country === 'all' || beverage.country === currentFilters.country;
        const matchesABV = parseFloat(beverage.abv) >= currentFilters.abvMin && parseFloat(beverage.abv) <= currentFilters.abvMax;
        
        if (matchesType && matchesCountry && matchesABV) {
            beverageCard.style.display = 'block';
        } else {
            beverageCard.style.display = 'none';
            showNotification('No beverages match your current filters', 'warning');
        }
    }
}

// Welcome Page Functionality
function showMainApp() {
    console.log('showMainApp function called!');
    welcomePage.style.display = 'none';
    mainApp.style.display = 'block';
    
    // Focus on the search input for better UX
    setTimeout(() => {
        if (beverageNameInput) {
            beverageNameInput.focus();
        }
    }, 100);
}

// Ensure menu button is always accessible
function ensureMenuAccessibility() {
    if (menuBtn) {
        menuBtn.style.display = 'flex';
        menuBtn.style.visibility = 'visible';
        menuBtn.style.opacity = '1';
    }
}

// Menu and Sidebar Functionality
function openMenu() {
    console.log('openMenu function called!');
    sidebar.classList.add('open');
    sidebarOverlay.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
}

function closeMenu() {
    sidebar.classList.remove('open');
    sidebarOverlay.classList.remove('active');
    document.body.style.overflow = ''; // Restore scrolling
}

function handleSidebarButtonClick(buttonId) {
    console.log(`Sidebar button clicked: ${buttonId}`);
    console.log('Button ID type:', typeof buttonId);
    console.log('Button ID value:', buttonId);
    // Close menu after button click
    closeMenu();
    
    // Track analytics
    if (typeof analytics !== 'undefined') {
        analytics.trackFeature('sidebar_navigation', buttonId);
    }
    
    // Handle different button actions
    switch(buttonId) {
        case 'sidebar-btn-1': // Home
            console.log('Home button clicked');
            // Always go to search page, regardless of auth status
            hideAllPages();
            mainApp.style.display = 'block';
            clearResults();
            break;
        case 'sidebar-btn-dashboard': // Dashboard
            console.log('Dashboard button clicked');
            if (auth.isUserAuthenticated()) {
                showDashboard();
            } else {
                // Show auth page for sign up
                hideAllPages();
                document.getElementById('auth-page').style.display = 'flex';
            }
            break;
        case 'sidebar-btn-profile': // Profile
            console.log('Profile button clicked');
            if (auth.isUserAuthenticated()) {
                showUserProfile();
            } else {
                // Show auth page for sign up
                hideAllPages();
                document.getElementById('auth-page').style.display = 'flex';
            }
            break;
        case 'sidebar-btn-2': // Favorites
            console.log('Favorites button clicked');
            if (auth.isUserAuthenticated()) {
                hideAllPages();
                favoritesPage.style.display = 'block';
                displayFavorites();
                if (typeof analytics !== 'undefined') {
                    analytics.trackPageView('favorites');
                }
            } else {
                // Show auth page for sign up
                hideAllPages();
                document.getElementById('auth-page').style.display = 'flex';
                showAuthNotification('Sign up to save your favorite drinks!', 'info');
            }
            break;
        case 'sidebar-btn-3': // History
            console.log('History button clicked');
            if (auth.isUserAuthenticated()) {
                hideAllPages();
                historyPage.style.display = 'block';
                displayHistory();
                if (typeof analytics !== 'undefined') {
                    analytics.trackPageView('history');
                }
            } else {
                // Show auth page for sign up
                hideAllPages();
                document.getElementById('auth-page').style.display = 'flex';
                showAuthNotification('Sign up to track your search history!', 'info');
            }
            break;
        case 'sidebar-btn-4': // Settings
            console.log('Settings button clicked');
            // Could show settings panel
            break;
        case 'sidebar-btn-5': // About
            console.log('About button clicked');
            // Could show about information
            break;
        case 'sidebar-btn-tracking': // Tracking
            console.log('Tracking button clicked');
            if (!auth.isUserAuthenticated()) {
                showNotification('Night Tracker is exclusive to BevyFinder members. Please sign in to access this feature.', 'info');
                showAuthPage();
            } else {
                showTrackingPage();
            }
            break;

        default:
            console.log('Unknown sidebar button clicked');
    }
}

// Event Listeners
if (startBtn) {
    startBtn.addEventListener('click', showMainApp);
}

// Menu Event Listeners will be set up in DOMContentLoaded

// Sidebar button event listeners will be set up in DOMContentLoaded

// Close menu on escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && sidebar.classList.contains('open')) {
        closeMenu();
    }
});

// Favorites System - Now using API
let favorites = [];

// Load favorites from API on initialization
async function loadFavorites() {
    if (auth.isUserAuthenticated()) {
        try {
            const user = auth.getCurrentUser();
            favorites = user.profile.preferences.favoriteDrinks || [];
        } catch (error) {
            console.error('Failed to load favorites:', error);
            favorites = [];
        }
    }
}

async function addToFavorites(beverageKey) {
    if (!auth.isUserAuthenticated()) {
        showAuthNotification('Sign up to save your favorite drinks!', 'info');
        return;
    }
    
    if (!favorites.includes(beverageKey)) {
        try {
            // Add to API
            await auth.addFavoriteDrink(beverageKey);
            
            // Update local state
            favorites.push(beverageKey);
            updateFavoriteButton(beverageKey, true);
            showFavoriteNotification('Added to favorites!', 'success');
            
            // Track analytics
            if (typeof analytics !== 'undefined') {
                analytics.trackFavorite(beverageDatabase[beverageKey].name, 'add');
            }
        } catch (error) {
            console.error('Failed to add favorite:', error);
            showFavoriteNotification('Failed to add favorite', 'error');
        }
    }
}

async function removeFromFavorites(beverageKey) {
    if (!auth.isUserAuthenticated()) {
        showAuthNotification('Sign up to manage your favorite drinks!', 'info');
        return;
    }
    
    const index = favorites.indexOf(beverageKey);
    if (index > -1) {
        try {
            // Remove from API
            await auth.removeFavoriteDrink(beverageKey);
            
            // Update local state
            favorites.splice(index, 1);
            updateFavoriteButton(beverageKey, false);
            showFavoriteNotification('Removed from favorites!', 'info');
            
            // Track analytics
            if (typeof analytics !== 'undefined') {
                analytics.trackFavorite(beverageDatabase[beverageKey].name, 'remove');
            }
            
            // If we're on the favorites page, refresh it
            if (favoritesPage.style.display !== 'none') {
                displayFavorites();
            }
        } catch (error) {
            console.error('Failed to remove favorite:', error);
            showFavoriteNotification('Failed to remove favorite', 'error');
        }
    }
}

function isFavorite(beverageKey) {
    return favorites.includes(beverageKey);
}

function updateFavoriteButton(beverageKey, isFavorited) {
    const favoriteBtn = document.querySelector(`[data-beverage="${beverageKey}"]`);
    if (favoriteBtn) {
        if (isFavorited) {
            favoriteBtn.classList.add('favorited');
            favoriteBtn.innerHTML = '<i class="fas fa-heart"></i>';
        } else {
            favoriteBtn.classList.remove('favorited');
            favoriteBtn.innerHTML = '<i class="far fa-heart"></i>';
        }
    }
}

// Like functionality
function isLiked(beverageKey) {
    if (!auth.isUserAuthenticated()) return false;
    const likedDrinks = JSON.parse(localStorage.getItem('bevyfinder_liked_drinks') || '[]');
    return likedDrinks.includes(beverageKey);
}

function getLikeCount(beverageKey) {
    const likeCounts = JSON.parse(localStorage.getItem('bevyfinder_like_counts') || '{}');
    return likeCounts[beverageKey] || 0;
}

async function likeBeverage(beverageKey) {
    if (!auth.isUserAuthenticated()) {
        showAuthNotification('Please sign in to like drinks!', 'info');
        return;
    }

    try {
        // Update local storage
        const likedDrinks = JSON.parse(localStorage.getItem('bevyfinder_liked_drinks') || '[]');
        if (!likedDrinks.includes(beverageKey)) {
            likedDrinks.push(beverageKey);
            localStorage.setItem('bevyfinder_liked_drinks', JSON.stringify(likedDrinks));
        }

        // Update like count
        const likeCounts = JSON.parse(localStorage.getItem('bevyfinder_like_counts') || '{}');
        likeCounts[beverageKey] = (likeCounts[beverageKey] || 0) + 1;
        localStorage.setItem('bevyfinder_like_counts', JSON.stringify(likeCounts));

        // Update UI
        updateLikeButton(beverageKey, true);
        showNotification('Drink liked!', 'success');

        // Send to backend if available
        try {
            await api.likeDrink(beverageKey);
        } catch (error) {
            console.log('Backend like failed, using local storage:', error);
        }
    } catch (error) {
        console.error('Error liking beverage:', error);
        showNotification('Failed to like drink', 'error');
    }
}

async function unlikeBeverage(beverageKey) {
    if (!auth.isUserAuthenticated()) {
        showAuthNotification('Please sign in to unlike drinks!', 'info');
        return;
    }

    try {
        // Update local storage
        const likedDrinks = JSON.parse(localStorage.getItem('bevyfinder_liked_drinks') || '[]');
        const index = likedDrinks.indexOf(beverageKey);
        if (index > -1) {
            likedDrinks.splice(index, 1);
            localStorage.setItem('bevyfinder_liked_drinks', JSON.stringify(likedDrinks));
        }

        // Update like count
        const likeCounts = JSON.parse(localStorage.getItem('bevyfinder_like_counts') || '{}');
        likeCounts[beverageKey] = Math.max(0, (likeCounts[beverageKey] || 0) - 1);
        localStorage.setItem('bevyfinder_like_counts', JSON.stringify(likeCounts));

        // Update UI
        updateLikeButton(beverageKey, false);
        showNotification('Drink unliked!', 'info');

        // Send to backend if available
        try {
            await api.unlikeDrink(beverageKey);
        } catch (error) {
            console.log('Backend unlike failed, using local storage:', error);
        }
    } catch (error) {
        console.error('Error unliking beverage:', error);
        showNotification('Failed to unlike drink', 'error');
    }
}

function updateLikeButton(beverageKey, isLiked) {
    const likeBtn = document.querySelector(`.like-btn[data-beverage="${beverageKey}"]`);
    if (likeBtn) {
        likeBtn.className = `like-btn ${isLiked ? 'liked' : ''}`;
        likeBtn.innerHTML = `<i class="${isLiked ? 'fas' : 'far'} fa-thumbs-up"></i> <span class="like-count">${getLikeCount(beverageKey)}</span>`;
        likeBtn.title = isLiked ? 'Unlike this drink' : 'Like this drink';
    }
}

function showFavoriteNotification(message, type) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)' : 'linear-gradient(135deg, #2196F3 0%, #1976D2 100%)'};
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        z-index: 10000;
        font-family: 'Inter', sans-serif;
        font-weight: 500;
        animation: slideIn 0.3s ease;
        max-width: 250px;
    `;
    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px;">
            <i class="fas ${type === 'success' ? 'fa-heart' : 'fa-info-circle'}" style="font-size: 1rem;"></i>
        <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 2000);
}

function showAuthNotification(message, type) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
        z-index: 10000;
        font-family: 'Inter', sans-serif;
        font-weight: 600;
        animation: slideIn 0.3s ease;
        max-width: 300px;
        cursor: pointer;
    `;
    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 12px;">
            <i class="fas fa-user-plus" style="font-size: 1.1rem;"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add click to sign up
    notification.addEventListener('click', () => {
        hideAllPages();
        document.getElementById('auth-page').style.display = 'flex';
    });
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 4000);
}

function displayFavorites() {
    if (favorites.length === 0) {
        favoritesContainer.style.display = 'none';
        emptyFavorites.style.display = 'flex';
    } else {
        favoritesContainer.style.display = 'grid';
        emptyFavorites.style.display = 'none';
        
        favoritesContainer.innerHTML = '';
        
        favorites.forEach(beverageKey => {
            const beverage = beverageDatabase[beverageKey];
            if (beverage) {
                const favoriteCard = document.createElement('div');
                favoriteCard.className = 'favorite-card';
                favoriteCard.innerHTML = `
                    <div class="favorite-card-header">
                        <h3 class="favorite-card-title">${beverage.name}</h3>
                        <span class="favorite-card-type">${beverage.type}</span>
                    </div>
                    <div class="favorite-card-details">
                        <div><strong>ABV:</strong> ${beverage.abv}</div>
                        <div><strong>Standard Drinks:</strong> ${beverage.standardDrinks}</div>
                    </div>
                    <div class="favorite-card-actions">
                        <button class="favorite-card-btn view-favorite-btn" onclick="viewFavorite('${beverageKey}')">
                            <i class="fas fa-eye"></i>
                            View Details
                        </button>
                        <button class="favorite-card-btn remove-favorite-btn" onclick="removeFromFavorites('${beverageKey}')">
                            <i class="fas fa-trash"></i>
                            Remove
                        </button>
                    </div>
                `;
                favoritesContainer.appendChild(favoriteCard);
            }
        });
    }
}

function viewFavorite(beverageKey) {
    const beverage = beverageDatabase[beverageKey];
    if (beverage) {
        // Hide favorites page and show main app
        hideAllPages();
        mainApp.style.display = 'block';
        
        // Display the beverage info
        displayBeverageInfo(beverage);
        
        // Scroll to results
        setTimeout(() => {
            resultsSection.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    }
}

function goToHome() {
    // Go to search page (main app)
    hideAllPages();
    mainApp.style.display = 'block';
    clearResults();
    
    // Track analytics
    if (typeof analytics !== 'undefined') {
        analytics.trackPageView('search');
    }
}

function goToWelcomePage() {
    hideAllPages();
    welcomePage.style.display = 'block';
    
    // Track analytics
    if (typeof analytics !== 'undefined') {
        analytics.trackPageView('welcome');
    }
}

function hideAllPages() {
    welcomePage.style.display = 'none';
    mainApp.style.display = 'none';
    favoritesPage.style.display = 'none';
    historyPage.style.display = 'none';
    
    // Hide dashboard page
    const dashboardPage = document.getElementById('dashboard-page');
    if (dashboardPage) {
        dashboardPage.style.display = 'none';
    }
    
    // Hide dynamically created profile page
    const profilePage = document.getElementById('profile-page');
    if (profilePage) {
        profilePage.style.display = 'none';
    }
    
    // Hide auth page
    const authPage = document.getElementById('auth-page');
    if (authPage) {
        authPage.style.display = 'none';
    }
    
    // Hide tracking page
    const trackingPage = document.getElementById('tracking-page');
    if (trackingPage) {
        trackingPage.style.display = 'none';
    }
}

// History System - Now using API
let searchHistory = [];

// Load history from API on initialization
async function loadHistory() {
    if (auth.isUserAuthenticated()) {
        try {
            const user = auth.getCurrentUser();
            searchHistory = user.profile.preferences.searchHistory || [];
        } catch (error) {
            console.error('Failed to load history:', error);
            searchHistory = [];
        }
    }
}

async function addToHistory(beverageKey, searchMethod = 'text') {
    // Only track history for authenticated users
    if (!auth.isUserAuthenticated()) {
        // Track analytics for non-authenticated users
        if (typeof analytics !== 'undefined') {
            analytics.trackSearch(beverageDatabase[beverageKey].name, searchMethod, true);
        }
        return;
    }
    
    const existingIndex = searchHistory.findIndex(item => item.beverageKey === beverageKey);
    
    // Remove existing entry if it exists
    if (existingIndex > -1) {
        searchHistory.splice(existingIndex, 1);
    }
    
    // Add to beginning of history (most recent first)
    const historyItem = {
        beverageKey: beverageKey,
        searchMethod: searchMethod,
        timestamp: new Date().toISOString(),
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    searchHistory.unshift(historyItem);
    
    // Keep only last 50 searches
    if (searchHistory.length > 50) {
        searchHistory = searchHistory.slice(0, 50);
    }
    
    // Track analytics
    if (typeof analytics !== 'undefined') {
        analytics.trackSearch(beverageDatabase[beverageKey].name, searchMethod, true);
    }
    
    // Track in user profile
    try {
        await auth.trackSearch();
    } catch (error) {
        console.error('Failed to track search:', error);
    }
}

async function removeFromHistory(beverageKey) {
    const index = searchHistory.findIndex(item => item.beverageKey === beverageKey);
    if (index > -1) {
        searchHistory.splice(index, 1);
        displayHistory();
        
        // Update server (you'll need to add this endpoint)
        try {
            // await api.request(`/user/history/${beverageKey}`, { method: 'DELETE' });
        } catch (error) {
            console.error('Failed to remove from history:', error);
        }
    }
}

async function clearHistory() {
    if (confirm('Are you sure you want to clear all search history? This action cannot be undone.')) {
        searchHistory = [];
        displayHistory();
        showHistoryNotification('Search history cleared!', 'info');
        
        // Update server (you'll need to add this endpoint)
        try {
            // await api.request('/user/history', { method: 'DELETE' });
        } catch (error) {
            console.error('Failed to clear history:', error);
        }
    }
}

function displayHistory() {
    if (searchHistory.length === 0) {
        historyContainer.style.display = 'none';
        emptyHistory.style.display = 'flex';
        historyActions.style.display = 'none';
    } else {
        historyContainer.style.display = 'flex';
        emptyHistory.style.display = 'none';
        historyActions.style.display = 'flex';
        
        historyContainer.innerHTML = '';
        
        searchHistory.forEach((historyItem, index) => {
            const beverage = beverageDatabase[historyItem.beverageKey];
            if (beverage) {
                const historyCard = document.createElement('div');
                historyCard.className = 'history-item';
                historyCard.innerHTML = `
                    <div class="history-item-header">
                        <h3 class="history-item-title">${beverage.name}</h3>
                        <span class="history-item-time">${historyItem.time}</span>
                    </div>
                    <div class="history-item-details">
                        <div><strong>Type:</strong> ${beverage.type}</div>
                        <div><strong>ABV:</strong> ${beverage.abv}</div>
                        <div class="search-method">
                            <i class="fas ${historyItem.searchMethod === 'image' ? 'fa-camera' : 'fa-search'}"></i>
                            ${historyItem.searchMethod === 'image' ? 'Image Search' : 'Text Search'}
                        </div>
                    </div>
                    <div class="history-item-actions">
                        <button class="history-item-btn view-history-btn" onclick="viewHistoryItem('${historyItem.beverageKey}')">
                            <i class="fas fa-eye"></i>
                            View
                        </button>
                        <button class="history-item-btn remove-history-btn" onclick="removeFromHistory('${historyItem.beverageKey}')">
                            <i class="fas fa-times"></i>
                            Remove
                        </button>
                    </div>
                `;
                historyContainer.appendChild(historyCard);
            }
        });
    }
}

function viewHistoryItem(beverageKey) {
    const beverage = beverageDatabase[beverageKey];
    if (beverage) {
        // Hide history page and show main app
        hideAllPages();
        mainApp.style.display = 'block';
        
        // Display the beverage info
        displayBeverageInfo(beverage);
        
        // Scroll to results
        setTimeout(() => {
            resultsSection.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    }
}

function showHistoryNotification(message, type) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)' : 'linear-gradient(135deg, #2196F3 0%, #1976D2 100%)'};
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        z-index: 10000;
        font-family: 'Inter', sans-serif;
        font-weight: 500;
        animation: slideIn 0.3s ease;
        max-width: 250px;
    `;
    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px;">
            <i class="fas ${type === 'success' ? 'fa-check' : 'fa-info-circle'}" style="font-size: 1rem;"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 2000);
}

// Ensure menu is accessible when page loads
document.addEventListener('DOMContentLoaded', async () => {
    ensureMenuAccessibility();
    
    // Initialize data from API
    try {
        await loadFavorites();
        await loadHistory();
        console.log('✅ Data loaded from API successfully');
    } catch (error) {
        console.error('❌ Failed to load data from API:', error);
    }
});

// Function to switch to search tab
function switchToSearch() {
    // Switch to the name input tab
    const nameTab = document.querySelector('[data-tab="name"]');
    if (nameTab) {
        nameTab.click();
    }
    // Focus on the search input
    if (beverageNameInput) {
        beverageNameInput.focus();
    }
    // Clear the photo upload
    clearPhotoUpload();
}

// Debug function to check tab state
function debugTabState() {
    console.log('=== Tab State Debug ===');
    console.log('Tab buttons:', tabBtns.length);
    tabBtns.forEach(btn => {
        console.log(`Tab: ${btn.getAttribute('data-tab')}, Active: ${btn.classList.contains('active')}`);
    });
    console.log('Tab contents:', tabContents.length);
    tabContents.forEach(content => {
        console.log(`Content: ${content.id}, Active: ${content.classList.contains('active')}, Display: ${content.style.display}`);
    });
}

// Debug function to check page visibility
function debugPageVisibility() {
    console.log('=== Page Visibility Debug ===');
    console.log('Welcome page:', welcomePage.style.display);
    console.log('Main app:', mainApp.style.display);
    console.log('Favorites page:', favoritesPage.style.display);
    console.log('History page:', historyPage.style.display);
    
    const profilePage = document.getElementById('profile-page');
    console.log('Profile page:', profilePage ? profilePage.style.display : 'Not found');
    
    const authPage = document.getElementById('auth-page');
    console.log('Auth page:', authPage ? authPage.style.display : 'Not found');
}

    // Enhanced drink database with top 100 beers, Australian beers, and alcohol percentages
const beverageDatabase = {
    // Top Rated Beers (1-25)
    'westvleteren12': {
        name: 'Westvleteren 12',
        type: 'Beer',
        alcohol: 'Quadrupel',
        abv: '10.2%',
        standardDrinks: '2.4',
        ingredients: ['Pilsner malt', 'Candy sugar', 'Styrian Golding hops', 'Westmalle yeast'],
        description: 'Considered the world\'s best beer, this Trappist quadrupel from Belgium offers complex flavors of dark fruit, caramel, and spice. One 330ml bottle contains 2.4 standard drinks.',
        nutrition: {
            calories: 285,
            carbs: 28.5,
            protein: 2.8,
            fat: 0,
            sugar: 3.2,
            servingSize: '330ml'
        },
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Quadrupel', 'Belgian', 'Trappist', 'Premium']
    },
    'plinytheyounger': {
        name: 'Pliny the Younger',
        type: 'Beer',
        alcohol: 'Triple IPA',
        abv: '10.25%',
        standardDrinks: '2.4',
        ingredients: ['Pale malt', 'Crystal malt', 'Amarillo hops', 'Simcoe hops', 'Centennial hops'],
        description: 'A highly sought-after triple IPA from Russian River Brewing. Intensely hoppy with citrus and pine notes. One 500ml serving contains 2.4 standard drinks.',
        nutrition: {
            calories: 290,
            carbs: 29.2,
            protein: 2.9,
            fat: 0,
            sugar: 2.8,
            servingSize: '500ml'
        },
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'IPA', 'American', 'Hoppy', 'Limited']
    },
    'headytopper': {
        name: 'Heady Topper',
        type: 'Beer',
        alcohol: 'Double IPA',
        abv: '8.0%',
        standardDrinks: '1.9',
        ingredients: ['Pale malt', 'Wheat malt', 'Amarillo hops', 'Simcoe hops', 'Centennial hops'],
        description: 'A legendary double IPA from The Alchemist. Hazy, juicy, and intensely aromatic. One 473ml can contains 1.9 standard drinks.',
        nutrition: {
            calories: 225,
            carbs: 22.8,
            protein: 2.2,
            fat: 0,
            sugar: 2.1,
            servingSize: '473ml'
        },
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'IPA', 'American', 'Hazy', 'Cult']
    },
    'kbs': {
        name: 'Kentucky Breakfast Stout (KBS)',
        type: 'Beer',
        alcohol: 'Imperial Stout',
        abv: '12.0%',
        standardDrinks: '2.8',
        ingredients: ['Chocolate malt', 'Coffee', 'Chocolate', 'Bourbon barrel aged'],
        description: 'A bourbon barrel-aged imperial stout with coffee and chocolate notes. Rich and complex. One 355ml bottle contains 2.8 standard drinks.',
        nutrition: {
            calories: 335,
            carbs: 33.8,
            protein: 3.2,
            fat: 0,
            sugar: 4.2,
            servingSize: '355ml'
        },
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Stout', 'American', 'Barrel-aged', 'Coffee']
    },
    'cbs': {
        name: 'Canadian Breakfast Stout (CBS)',
        type: 'Beer',
        alcohol: 'Imperial Stout',
        abv: '11.7%',
        standardDrinks: '2.7',
        ingredients: ['Chocolate malt', 'Coffee', 'Maple syrup', 'Bourbon barrel aged'],
        description: 'A maple syrup-infused bourbon barrel-aged imperial stout. Sweet and decadent. One 355ml bottle contains 2.7 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Stout', 'American', 'Barrel-aged', 'Maple']
    },
    'darklord': {
        name: 'Dark Lord',
        type: 'Beer',
        alcohol: 'Imperial Stout',
        abv: '15.0%',
        standardDrinks: '3.5',
        ingredients: ['Chocolate malt', 'Coffee', 'Vanilla', 'Molasses'],
        description: 'A massive imperial stout from 3 Floyds. Thick, rich, and intensely flavorful. One 500ml bottle contains 3.5 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Stout', 'American', 'High ABV', 'Limited']
    },
    'hunahpu': {
        name: 'Hunahpu\'s Imperial Stout',
        type: 'Beer',
        alcohol: 'Imperial Stout',
        abv: '11.0%',
        standardDrinks: '2.6',
        ingredients: ['Chocolate malt', 'Cinnamon', 'Vanilla', 'Chili peppers', 'Cacao'],
        description: 'A complex imperial stout with cinnamon, vanilla, chili peppers, and cacao. Spicy and rich. One 500ml bottle contains 2.6 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Stout', 'American', 'Spicy', 'Complex']
    },
    'parabola': {
        name: 'Parabola',
        type: 'Beer',
        alcohol: 'Imperial Stout',
        abv: '14.0%',
        standardDrinks: '3.3',
        ingredients: ['Chocolate malt', 'Bourbon barrel aged', 'Vanilla', 'Oak'],
        description: 'A bourbon barrel-aged imperial stout from Firestone Walker. Smooth and complex with vanilla and oak notes. One 355ml bottle contains 3.3 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Stout', 'American', 'Barrel-aged', 'Smooth']
    },
    'abyss': {
        name: 'The Abyss',
        type: 'Beer',
        alcohol: 'Imperial Stout',
        abv: '11.1%',
        standardDrinks: '2.6',
        ingredients: ['Chocolate malt', 'Licorice', 'Vanilla', 'Oak barrel aged'],
        description: 'An oak barrel-aged imperial stout with licorice and vanilla notes. Deep and mysterious. One 500ml bottle contains 2.6 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Stout', 'American', 'Barrel-aged', 'Licorice']
    },
    'speedway': {
        name: 'Speedway Stout',
        type: 'Beer',
        alcohol: 'Imperial Stout',
        abv: '12.0%',
        standardDrinks: '2.8',
        ingredients: ['Chocolate malt', 'Coffee', 'Oats', 'Wheat'],
        description: 'A coffee-infused imperial stout from AleSmith. Rich and smooth with prominent coffee notes. One 355ml bottle contains 2.8 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Stout', 'American', 'Coffee', 'Rich']
    },
    'guinness': {
        name: 'Guinness Draught',
        type: 'Beer',
        alcohol: 'Dry Stout',
        abv: '4.2%',
        standardDrinks: '1.0',
        ingredients: ['Malted barley', 'Hops', 'Water', 'Yeast', 'Nitrogen'],
        description: 'A classic Irish dry stout with a distinctive creamy head and smooth, velvety finish. Features notes of coffee, dark chocolate, and roasted barley with a subtle sweetness. Medium-bodied with nitrogen carbonation creating a smooth, creamy mouthfeel. The finish is dry and slightly bitter with lingering coffee notes. The iconic two-part pour creates the perfect creamy head. One 440ml can contains 1.0 standard drink.',
        nutrition: {
            calories: 125,
            carbs: 10.5,
            protein: 1.5,
            fat: 0,
            sugar: 0.8,
            servingSize: '440ml'
        },
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop&crop=center',
        tags: ['Beer', 'Stout', 'Irish', 'Classic', 'Creamy']
    },
    'duvel': {
        name: 'Duvel',
        type: 'Beer',
        alcohol: 'Belgian Strong Golden Ale',
        abv: '8.5%',
        standardDrinks: '2.0',
        ingredients: ['Pilsner malt', 'Candy sugar', 'Saaz hops', 'Duvel yeast'],
        description: 'A classic Belgian strong golden ale with complex fruity esters and spicy hop character. Features notes of banana, clove, and citrus with a distinctive Belgian yeast character. Medium-bodied with high carbonation and a smooth, warming mouthfeel. The finish is dry with lingering spice and fruit notes. The high alcohol content is well-hidden behind the complex flavor profile. One 330ml bottle contains 2.0 standard drinks.',
        nutrition: {
            calories: 240,
            carbs: 24.2,
            protein: 2.4,
            fat: 0,
            sugar: 2.8,
            servingSize: '330ml'
        },
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Golden Ale', 'Belgian', 'Strong', 'Classic']
    },
    'chimay': {
        name: 'Chimay Blue',
        type: 'Beer',
        alcohol: 'Belgian Strong Dark Ale',
        abv: '9.0%',
        standardDrinks: '2.1',
        ingredients: ['Pilsner malt', 'Candy sugar', 'Styrian Golding hops', 'Chimay yeast'],
        description: 'A Trappist strong dark ale with complex dark fruit and spice notes. Features rich notes of plum, raisin, and dark chocolate with warming spice character. Full-bodied with smooth carbonation and a rich, velvety mouthfeel. The finish is warming with lingering dark fruit and spice notes. The high alcohol content adds complexity and warmth. One 330ml bottle contains 2.1 standard drinks.',
        nutrition: {
            calories: 255,
            carbs: 25.8,
            protein: 2.5,
            fat: 0,
            sugar: 3.1,
            servingSize: '330ml'
        },
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Dark Ale', 'Belgian', 'Trappist', 'Complex']
    },
    'rochefort10': {
        name: 'Rochefort 10',
        type: 'Beer',
        alcohol: 'Quadrupel',
        abv: '11.3%',
        standardDrinks: '2.7',
        ingredients: ['Pilsner malt', 'Candy sugar', 'Styrian Golding hops', 'Rochefort yeast'],
        description: 'A Trappist quadrupel with rich dark fruit, caramel, and spice flavors. Features intense notes of fig, date, and dark cherry with caramel sweetness and warming spice. Full-bodied with smooth carbonation and a rich, complex mouthfeel. The finish is warming and sweet with lingering dark fruit and spice notes. The high alcohol content creates a luxurious, dessert-like experience. One 330ml bottle contains 2.7 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Quadrupel', 'Belgian', 'Trappist', 'Rich']
    },
    'orval': {
        name: 'Orval',
        type: 'Beer',
        alcohol: 'Belgian Pale Ale',
        abv: '6.2%',
        standardDrinks: '1.5',
        ingredients: ['Pilsner malt', 'Hallertau hops', 'Orval yeast', 'Brettanomyces'],
        description: 'A unique Trappist ale with Brettanomyces for complex, funky flavors. Features notes of barnyard, leather, and citrus with a distinctive sour character. Medium-bodied with bright carbonation and a complex, layered mouthfeel. The Brettanomyces adds depth and complexity with earthy, funky notes. The finish is dry and complex with lingering sour and funky character. One 330ml bottle contains 1.5 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Pale Ale', 'Belgian', 'Trappist', 'Funky']
    },
    'laTrappe': {
        name: 'La Trappe Quadrupel',
        type: 'Beer',
        alcohol: 'Quadrupel',
        abv: '10.0%',
        standardDrinks: '2.4',
        ingredients: ['Pilsner malt', 'Candy sugar', 'Styrian Golding hops', 'La Trappe yeast'],
        description: 'A Dutch Trappist quadrupel with rich malt and dark fruit character. Features notes of raisin, plum, and caramel with warming spice and alcohol notes. Full-bodied with smooth carbonation and a rich, velvety mouthfeel. The finish is warming and complex with lingering dark fruit and malt notes. The high alcohol content adds warmth and complexity. One 330ml bottle contains 2.4 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Quadrupel', 'Dutch', 'Trappist', 'Rich']
    },
    'saisonDupont': {
        name: 'Saison Dupont',
        type: 'Beer',
        alcohol: 'Saison',
        abv: '6.5%',
        standardDrinks: '1.5',
        ingredients: ['Pilsner malt', 'Wheat malt', 'Styrian Golding hops', 'Saison yeast'],
        description: 'A classic Belgian saison with spicy, fruity, and earthy notes. Features notes of pepper, citrus, and hay with a distinctive Belgian yeast character. Medium-bodied with bright carbonation and a dry, crisp mouthfeel. The finish is dry and refreshing with lingering spice and fruit notes. Perfect for warm weather and food pairing. One 330ml bottle contains 1.5 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Saison', 'Belgian', 'Classic', 'Spicy']
    },
    'pilsnerUrquell': {
        name: 'Pilsner Urquell',
        type: 'Beer',
        alcohol: 'Czech Pilsner',
        abv: '4.4%',
        standardDrinks: '1.0',
        ingredients: ['Pilsner malt', 'Saaz hops', 'Czech water', 'Lager yeast'],
        description: 'The original Czech pilsner with noble hop character and crisp finish. One 330ml bottle contains 1.0 standard drink.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Pilsner', 'Czech', 'Classic', 'Crisp']
    },
    'weihenstephaner': {
        name: 'Weihenstephaner Hefeweissbier',
        type: 'Beer',
        alcohol: 'German Hefeweizen',
        abv: '5.4%',
        standardDrinks: '1.3',
        ingredients: ['Wheat malt', 'Barley malt', 'Hallertau hops', 'Hefeweizen yeast'],
        description: 'A classic German hefeweizen with banana and clove notes. One 500ml bottle contains 1.3 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Hefeweizen', 'German', 'Classic', 'Banana']
    },
    'averyMaharaja': {
        name: 'The Maharaja',
        type: 'Beer',
        alcohol: 'Imperial IPA',
        abv: '10.2%',
        standardDrinks: '2.4',
        ingredients: ['Pale malt', 'Crystal malt', 'Columbus hops', 'Simcoe hops', 'Centennial hops'],
        description: 'A bold imperial IPA with intense hop character and malt backbone. One 650ml bottle contains 2.4 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'IPA', 'American', 'Imperial', 'Hoppy']
    },
    'dogfish120': {
        name: '120 Minute IPA',
        type: 'Beer',
        alcohol: 'Imperial IPA',
        abv: '18.0%',
        standardDrinks: '4.2',
        ingredients: ['Pale malt', 'Crystal malt', 'Warrior hops', 'Amarillo hops', 'Simcoe hops'],
        description: 'An extreme imperial IPA with massive hop character and high alcohol content. One 355ml bottle contains 4.2 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'IPA', 'American', 'Extreme', 'High ABV']
    },
    'foundersKBS': {
        name: 'Founders KBS',
        type: 'Beer',
        alcohol: 'Imperial Stout',
        abv: '12.0%',
        standardDrinks: '2.8',
        ingredients: ['Chocolate malt', 'Coffee', 'Chocolate', 'Bourbon barrel aged'],
        description: 'A bourbon barrel-aged imperial stout with coffee and chocolate notes. Rich and complex. One 355ml bottle contains 2.8 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Stout', 'American', 'Barrel-aged', 'Coffee']
    },
    'bellstwohearted': {
        name: 'Two Hearted Ale',
        type: 'Beer',
        alcohol: 'American IPA',
        abv: '7.0%',
        standardDrinks: '1.7',
        ingredients: ['Pale malt', 'Crystal malt', 'Centennial hops'],
        description: 'A balanced American IPA with citrus and pine hop character. One 355ml bottle contains 1.7 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'IPA', 'American', 'Balanced', 'Classic']
    },
    'sierraNevadaPale': {
        name: 'Sierra Nevada Pale Ale',
        type: 'Beer',
        alcohol: 'American Pale Ale',
        abv: '5.6%',
        standardDrinks: '1.3',
        ingredients: ['Pale malt', 'Crystal malt', 'Cascade hops'],
        description: 'The classic American pale ale that started the craft beer revolution. One 355ml bottle contains 1.3 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Pale Ale', 'American', 'Classic', 'Cascade']
    },
    'samuelAdamsBoston': {
        name: 'Samuel Adams Boston Lager',
        type: 'Beer',
        alcohol: 'Vienna Lager',
        abv: '5.0%',
        standardDrinks: '1.2',
        ingredients: ['Vienna malt', 'Caramel malt', 'Hallertau hops', 'Tettnang hops'],
        description: 'A classic Vienna lager with balanced malt and hop character. One 355ml bottle contains 1.2 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Lager', 'American', 'Classic', 'Balanced']
    },
    'blueMoon': {
        name: 'Blue Moon Belgian White',
        type: 'Beer',
        alcohol: 'Belgian Witbier',
        abv: '5.4%',
        standardDrinks: '1.3',
        ingredients: ['Wheat malt', 'Barley malt', 'Orange peel', 'Coriander', 'Hallertau hops'],
        description: 'A Belgian-style witbier with orange peel and coriander notes. One 355ml bottle contains 1.3 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Witbier', 'American', 'Belgian-style', 'Orange']
    },

    // Australian & New Zealand Beers (Available at Dan Murphy's)
    'carlton-draught': {
        name: 'Carlton Draught',
        type: 'Beer',
        alcohol: 'Australian Lager',
        abv: '4.6%',
        standardDrinks: '1.0',
        ingredients: ['Malted barley', 'Hops', 'Water', 'Yeast'],
        description: 'A classic Australian lager with a crisp, clean taste. One 330ml bottle contains 1.0 standard drinks.',
        nutrition: {
            calories: 120,
            carbs: 11.2,
            protein: 1.1,
            fat: 0,
            sugar: 0.4,
            servingSize: '330ml'
        },
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Lager', 'Australian', 'Classic', 'Crisp']
    },
    'victoria-bitter': {
        name: 'Victoria Bitter (VB)',
        type: 'Beer',
        alcohol: 'Australian Bitter',
        abv: '4.9%',
        standardDrinks: '1.1',
        ingredients: ['Malted barley', 'Hops', 'Water', 'Yeast'],
        description: 'Australia\'s most popular beer, known for its distinctive bitter taste and iconic status. Features a balanced profile with caramel malt sweetness, moderate hop bitterness, and notes of grain and light citrus. Medium-bodied with smooth carbonation and a clean, slightly dry finish. The bitterness is assertive but not overwhelming, making it a classic session beer. One 330ml bottle contains 1.1 standard drinks.',
        nutrition: {
            calories: 125,
            carbs: 11.5,
            protein: 1.2,
            fat: 0,
            sugar: 0.5,
            servingSize: '330ml'
        },
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop&crop=center',
        tags: ['Beer', 'Bitter', 'Australian', 'Popular', 'Classic']
    },
    'x-gold': {
        name: 'XXXX Gold',
        type: 'Beer',
        alcohol: 'Australian Lager',
        abv: '3.5%',
        standardDrinks: '0.7',
        ingredients: ['Malted barley', 'Hops', 'Water', 'Yeast'],
        description: 'A mid-strength lager from Queensland, perfect for extended drinking sessions. Features a light, crisp profile with subtle malt sweetness, gentle hop bitterness, and notes of grain and light citrus. Light-bodied with bright carbonation and a clean, refreshing mouthfeel. The lower alcohol content makes it ideal for longer drinking sessions while maintaining good flavor. One 330ml bottle contains 0.7 standard drinks.',
        nutrition: {
            calories: 90,
            carbs: 8.5,
            protein: 0.8,
            fat: 0,
            sugar: 0.3,
            servingSize: '330ml'
        },
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop&crop=center',
        tags: ['Beer', 'Lager', 'Australian', 'Mid-strength', 'Queensland']
    },
    'crown-lager': {
        name: 'Crown Lager',
        type: 'Beer',
        alcohol: 'Premium Lager',
        abv: '4.9%',
        standardDrinks: '1.1',
        ingredients: ['Malted barley', 'Hops', 'Water', 'Yeast'],
        description: 'Australia\'s premium lager with a smooth, full-bodied taste and sophisticated profile. Features rich malt sweetness, balanced hop bitterness, and notes of caramel, honey, and light floral hops. Medium to full-bodied with smooth carbonation and a creamy, velvety mouthfeel. The finish is long and satisfying with a subtle sweetness that lingers. Perfect for special occasions and premium dining experiences. One 330ml bottle contains 1.1 standard drinks.',
        nutrition: {
            calories: 125,
            carbs: 11.5,
            protein: 1.2,
            fat: 0,
            sugar: 0.6,
            servingSize: '330ml'
        },
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop&crop=center',
        tags: ['Beer', 'Lager', 'Australian', 'Premium', 'Smooth']
    },
    'coopers-pale-ale': {
        name: 'Coopers Pale Ale',
        type: 'Beer',
        alcohol: 'Australian Pale Ale',
        abv: '4.5%',
        standardDrinks: '1.0',
        ingredients: ['Malted barley', 'Hops', 'Water', 'Yeast'],
        description: 'A naturally cloudy pale ale with distinctive fruity characters and traditional bottle conditioning. Features bright citrus and tropical fruit notes, balanced by moderate hop bitterness and a distinctive yeast character. Medium-bodied with natural carbonation and a complex, layered mouthfeel. The cloudiness comes from live yeast, adding depth and character. The finish is crisp with lingering fruit notes and a touch of spice. One 330ml bottle contains 1.0 standard drinks.',
        nutrition: {
            calories: 120,
            carbs: 11.0,
            protein: 1.1,
            fat: 0,
            sugar: 0.5,
            servingSize: '330ml'
        },
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop&crop=center',
        tags: ['Beer', 'Pale Ale', 'Australian', 'Cloudy', 'Fruity']
    },
    'coopers-sparkling-ale': {
        name: 'Coopers Sparkling Ale',
        type: 'Beer',
        alcohol: 'Australian Sparkling Ale',
        abv: '5.8%',
        standardDrinks: '1.2',
        ingredients: ['Malted barley', 'Hops', 'Water', 'Yeast'],
        description: 'A traditional Australian sparkling ale with natural sediment and bottle conditioning. Features rich malt complexity, moderate hop bitterness, and distinctive yeast character with notes of stone fruit and spice. Medium to full-bodied with natural carbonation and a complex, layered mouthfeel. The natural sediment adds depth and traditional character. The finish is warming with lingering malt sweetness and a touch of alcohol warmth. One 330ml bottle contains 1.2 standard drinks.',
        nutrition: {
            calories: 150,
            carbs: 14.5,
            protein: 1.4,
            fat: 0,
            sugar: 0.7,
            servingSize: '330ml'
        },
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Sparkling Ale', 'Australian', 'Traditional', 'Sediment']
    },
    'little-creatures-pale-ale': {
        name: 'Little Creatures Pale Ale',
        type: 'Beer',
        alcohol: 'American Pale Ale',
        abv: '5.2%',
        standardDrinks: '1.2',
        ingredients: ['Malted barley', 'Cascade hops', 'Water', 'Yeast'],
        description: 'A hoppy American-style pale ale with vibrant citrus and floral notes. Features prominent grapefruit, orange, and pine aromas from Cascade hops, balanced by caramel malt sweetness. Medium-bodied with bright carbonation and a crisp, refreshing mouthfeel. The hop bitterness is assertive but well-balanced, creating a complex and satisfying drinking experience. Perfect for hop lovers and craft beer enthusiasts. One 330ml bottle contains 1.2 standard drinks.',
        nutrition: {
            calories: 155,
            carbs: 15.2,
            protein: 1.5,
            fat: 0,
            sugar: 0.7,
            servingSize: '330ml'
        },
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop&crop=center',
        tags: ['Beer', 'Pale Ale', 'Australian', 'Hoppy', 'Citrus']
    },
    'stone-wood-pacific-ale': {
        name: 'Stone & Wood Pacific Ale',
        type: 'Beer',
        alcohol: 'Australian Pale Ale',
        abv: '4.4%',
        standardDrinks: '1.0',
        ingredients: ['Malted barley', 'Galaxy hops', 'Water', 'Yeast'],
        description: 'A tropical fruit-forward pale ale showcasing the distinctive character of Galaxy hops. Features intense notes of passionfruit, mango, and citrus with a subtle pine undertone. Light to medium-bodied with bright carbonation and a smooth, juicy mouthfeel. The hop profile is bold yet approachable, creating a refreshing and aromatic drinking experience. Perfect for showcasing Australian hop varieties and tropical fruit lovers. One 330ml bottle contains 1.0 standard drink.',
        nutrition: {
            calories: 132,
            carbs: 12.8,
            protein: 1.2,
            fat: 0,
            sugar: 0.4,
            servingSize: '330ml'
        },
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Pale Ale', 'Australian', 'Tropical', 'Galaxy Hops']
    },
    'balter-xpa': {
        name: 'Balter XPA',
        type: 'Beer',
        alcohol: 'Extra Pale Ale',
        abv: '4.5%',
        standardDrinks: '1.1',
        ingredients: ['Malted barley', 'Citra hops', 'Mosaic hops', 'Water', 'Yeast'],
        description: 'A sessionable extra pale ale with vibrant tropical and citrus hop character. Features bright notes of orange, grapefruit, and tropical fruits from Citra and Mosaic hops, balanced by light malt sweetness. Light-bodied with crisp carbonation and a smooth, refreshing mouthfeel. The hop profile is bold but the lower alcohol content makes it perfect for extended drinking sessions. Ideal for craft beer enthusiasts who want flavor without high alcohol. One 330ml can contains 1.1 standard drinks.',
        nutrition: {
            calories: 138,
            carbs: 13.2,
            protein: 1.3,
            fat: 0,
            sugar: 0.5,
            servingSize: '330ml'
        },
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'XPA', 'Australian', 'Sessionable', 'Tropical']
    },
    'balter-ipa': {
        name: 'Balter IPA',
        type: 'Beer',
        alcohol: 'India Pale Ale',
        abv: '6.2%',
        standardDrinks: '1.5',
        ingredients: ['Malted barley', 'Citra hops', 'Mosaic hops', 'Simcoe hops', 'Water', 'Yeast'],
        description: 'A bold IPA with intense tropical fruit and pine hop character. Features explosive notes of mango, passionfruit, and grapefruit from Citra and Mosaic hops, balanced by a solid malt backbone. Medium-bodied with bright carbonation and a smooth, juicy mouthfeel. The finish is bitter and complex with lingering tropical fruit and pine notes. Perfect for hop enthusiasts and craft beer lovers. One 330ml can contains 1.5 standard drinks.',
        nutrition: {
            calories: 185,
            carbs: 18.2,
            protein: 1.8,
            fat: 0,
            sugar: 0.9,
            servingSize: '330ml'
        },
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'IPA', 'Australian', 'Bold', 'Tropical']
    },
    'young-henrys-newtowner': {
        name: 'Young Henrys Newtowner',
        type: 'Beer',
        alcohol: 'Australian Pale Ale',
        abv: '4.8%',
        standardDrinks: '1.1',
        ingredients: ['Malted barley', 'Hops', 'Water', 'Yeast'],
        description: 'A sessionable pale ale with balanced malt and hop character. Features notes of caramel malt, citrus hops, and a touch of tropical fruit. Medium-bodied with smooth carbonation and a well-rounded mouthfeel. The hop bitterness is moderate and well-balanced with the malt sweetness. The finish is clean and refreshing, making it perfect for extended drinking sessions. One 330ml bottle contains 1.1 standard drinks.',
        nutrition: {
            calories: 145,
            carbs: 14.2,
            protein: 1.4,
            fat: 0,
            sugar: 0.6,
            servingSize: '330ml'
        },
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Pale Ale', 'Australian', 'Sessionable', 'Balanced']
    },
    'modus-operandi-former-tenant': {
        name: 'Modus Operandi Former Tenant',
        type: 'Beer',
        alcohol: 'India Pale Ale',
        abv: '6.5%',
        standardDrinks: '1.6',
        ingredients: ['Malted barley', 'Citra hops', 'Mosaic hops', 'Water', 'Yeast'],
        description: 'A hazy IPA with intense tropical fruit and citrus hop character. Features juicy notes of mango, passionfruit, and orange from Citra and Mosaic hops. Medium-bodied with a smooth, creamy mouthfeel from the hazy appearance. The finish is juicy and smooth with minimal bitterness, characteristic of the New England IPA style. Perfect for those who enjoy hop flavor without harsh bitterness. One 330ml can contains 1.6 standard drinks.',
        nutrition: {
            calories: 195,
            carbs: 19.2,
            protein: 1.9,
            fat: 0,
            sugar: 1.0,
            servingSize: '330ml'
        },
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'IPA', 'Australian', 'Hazy', 'Tropical']
    },
    'hop-nation-rattenhund': {
        name: 'Hop Nation Rattenhund',
        type: 'Beer',
        alcohol: 'India Pale Ale',
        abv: '6.0%',
        standardDrinks: '1.4',
        ingredients: ['Malted barley', 'Citra hops', 'Mosaic hops', 'Water', 'Yeast'],
        description: 'A juicy IPA with tropical fruit and citrus hop character. Features vibrant notes of mango, passionfruit, and orange from Citra and Mosaic hops. Medium-bodied with a smooth, juicy mouthfeel and bright carbonation. The finish is juicy and smooth with moderate bitterness, creating a well-balanced hop experience. Perfect for those who enjoy bold hop flavors with a smooth drinking experience. One 330ml can contains 1.4 standard drinks.',
        nutrition: {
            calories: 175,
            carbs: 17.2,
            protein: 1.7,
            fat: 0,
            sugar: 0.8,
            servingSize: '330ml'
        },
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'IPA', 'Australian', 'Juicy', 'Tropical']
    },
    'garage-project-hazy-daze': {
        name: 'Garage Project Hazy Daze',
        type: 'Beer',
        alcohol: 'New England IPA',
        abv: '6.5%',
        standardDrinks: '1.6',
        ingredients: ['Malted barley', 'Oats', 'Citra hops', 'Mosaic hops', 'Water', 'Yeast'],
        description: 'A hazy New England-style IPA with tropical fruit notes. Features juicy notes of passionfruit, mango, and citrus with a smooth, creamy mouthfeel from the hazy appearance and oat addition. Medium-bodied with bright carbonation and a smooth, pillowy texture. The finish is juicy and smooth with minimal bitterness, characteristic of the New England IPA style. Perfect for showcasing hop flavor without harsh bitterness. One 330ml can contains 1.6 standard drinks.',
        nutrition: {
            calories: 195,
            carbs: 19.5,
            protein: 1.9,
            fat: 0,
            sugar: 1.0,
            servingSize: '330ml'
        },
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'IPA', 'New Zealand', 'Hazy', 'Tropical']
    },
    'epic-armageddon': {
        name: 'Epic Armageddon',
        type: 'Beer',
        alcohol: 'India Pale Ale',
        abv: '6.66%',
        standardDrinks: '1.6',
        ingredients: ['Malted barley', 'Columbus hops', 'Cascade hops', 'Water', 'Yeast'],
        description: 'A bold IPA with intense hop character and high alcohol content. Features aggressive notes of pine, grapefruit, and resin from Columbus and Cascade hops. Full-bodied with a strong malt backbone to support the high alcohol content. The finish is intensely bitter with lingering hop oils and warming alcohol notes. Perfect for hop enthusiasts who enjoy bold, aggressive flavors. One 330ml bottle contains 1.6 standard drinks.',
        nutrition: {
            calories: 200,
            carbs: 20.2,
            protein: 2.0,
            fat: 0,
            sugar: 1.1,
            servingSize: '330ml'
        },
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'IPA', 'New Zealand', 'Bold', 'High ABV']
    },
    'yeastie-boys-gunnamatta': {
        name: 'Yeastie Boys Gunnamatta',
        type: 'Beer',
        alcohol: 'Earl Grey IPA',
        abv: '6.5%',
        standardDrinks: '1.6',
        ingredients: ['Malted barley', 'Earl Grey tea', 'Citra hops', 'Water', 'Yeast'],
        description: 'An Earl Grey tea-infused IPA with citrus and bergamot notes. Features distinctive bergamot orange and black tea aromas from Earl Grey tea, balanced by citrus hop character. Medium-bodied with bright carbonation and a smooth, complex mouthfeel. The finish is unique with lingering tea tannins and citrus notes. Perfect for those who enjoy experimental beers and tea lovers. One 330ml bottle contains 1.6 standard drinks.',
        nutrition: {
            calories: 195,
            carbs: 19.5,
            protein: 1.9,
            fat: 0,
            sugar: 1.0,
            servingSize: '330ml'
        },
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'IPA', 'New Zealand', 'Tea-infused', 'Bergamot']
    },

    // Top 50 Australian Beers (1-25)
    'carlton-draught': {
        name: 'Carlton Draught',
        type: 'Beer',
        alcohol: 'Lager',
        abv: '4.6%',
        standardDrinks: '1.1',
        ingredients: ['Malted barley', 'Hops', 'Water', 'Yeast'],
        description: 'A classic Australian lager with a rich history. Features notes of pale malt, subtle hop bitterness, and a touch of grain character. Light to medium-bodied with smooth carbonation and a clean, easy-drinking finish. The finish is crisp and refreshing, making it a great choice for any occasion. One 375ml can contains 1.1 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Lager', 'Australian', 'Classic', 'Crisp']
    },
    'victoria-bitter': {
        name: 'Victoria Bitter (VB)',
        type: 'Beer',
        alcohol: 'Lager',
        abv: '4.9%',
        standardDrinks: '1.2',
        ingredients: ['Malted barley', 'Hops', 'Water', 'Yeast'],
        description: 'Australia\'s most popular beer, a full-bodied lager with a distinctive taste and iconic status. Features balanced notes of caramel malt, moderate hop bitterness, and distinctive grain character. Medium-bodied with smooth carbonation and a satisfying mouthfeel. The finish is clean with a touch of bitterness that lingers pleasantly. Perfect for any occasion and a true Australian classic. One 375ml can contains 1.2 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Lager', 'Australian', 'Popular', 'Full-bodied']
    },
    'coopers-pale-ale': {
        name: 'Coopers Pale Ale',
        type: 'Beer',
        alcohol: 'Pale Ale',
        abv: '4.5%',
        standardDrinks: '1.1',
        ingredients: ['Malted barley', 'Hops', 'Water', 'Yeast'],
        description: 'A naturally cloudy pale ale with a distinctive fruity character and traditional bottle conditioning. Features bright citrus and tropical fruit notes from the distinctive yeast strain, balanced by moderate hop bitterness. Medium-bodied with natural carbonation and a complex, layered mouthfeel. The cloudiness comes from live yeast, adding depth and traditional character. The finish is crisp with lingering fruit notes. One 375ml bottle contains 1.1 standard drinks.',
        nutrition: {
            calories: 135,
            carbs: 12.5,
            protein: 1.2,
            fat: 0,
            sugar: 0.5,
            servingSize: '375ml'
        },
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Pale Ale', 'Australian', 'Cloudy', 'Fruity']
    },
    'coopers-sparkling-ale': {
        name: 'Coopers Sparkling Ale',
        type: 'Beer',
        alcohol: 'Pale Ale',
        abv: '5.8%',
        standardDrinks: '1.4',
        ingredients: ['Malted barley', 'Hops', 'Water', 'Yeast'],
        description: 'A bottle-conditioned pale ale with natural carbonation and complex flavors. Features rich malt complexity, moderate hop bitterness, and distinctive yeast character with notes of stone fruit and spice. Medium to full-bodied with natural carbonation and a complex, layered mouthfeel. The bottle conditioning adds depth and traditional character. The finish is warming with lingering malt sweetness. One 375ml bottle contains 1.4 standard drinks.',
        nutrition: {
            calories: 175,
            carbs: 16.8,
            protein: 1.6,
            fat: 0,
            sugar: 0.8,
            servingSize: '375ml'
        },
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Pale Ale', 'Australian', 'Bottle-conditioned', 'Complex']
    },
    'coopers-best-extra-stout': {
        name: 'Coopers Best Extra Stout',
        type: 'Beer',
        alcohol: 'Stout',
        abv: '6.3%',
        standardDrinks: '1.5',
        ingredients: ['Malted barley', 'Roasted barley', 'Hops', 'Water', 'Yeast'],
        description: 'A rich, dark stout with coffee and chocolate notes. Features intense notes of roasted coffee, dark chocolate, and roasted barley with a subtle sweetness. Full-bodied with smooth carbonation and a creamy, velvety mouthfeel. The finish is rich and warming with lingering coffee and chocolate notes. Perfect for cold weather and dessert pairing. One 375ml bottle contains 1.5 standard drinks.',
        nutrition: {
            calories: 185,
            carbs: 18.2,
            protein: 1.8,
            fat: 0,
            sugar: 0.9,
            servingSize: '375ml'
        },
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Stout', 'Australian', 'Dark', 'Rich']
    },
    'stone-wood-pacific-ale': {
        name: 'Stone & Wood Pacific Ale',
        type: 'Beer',
        alcohol: 'Australian Pale Ale',
        abv: '4.4%',
        standardDrinks: '1.0',
        ingredients: ['Malted barley', 'Galaxy hops', 'Water', 'Yeast'],
        description: 'A refreshing pale ale with tropical fruit notes from Galaxy hops. Features intense notes of passionfruit, mango, and citrus with a subtle pine undertone. Light to medium-bodied with bright carbonation and a smooth, juicy mouthfeel. The hop profile is bold yet approachable, creating a refreshing and aromatic drinking experience. Perfect for showcasing Australian hop varieties. One 330ml bottle contains 1.0 standard drinks.',
        nutrition: {
            calories: 132,
            carbs: 12.8,
            protein: 1.2,
            fat: 0,
            sugar: 0.4,
            servingSize: '330ml'
        },
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Pale Ale', 'Australian', 'Tropical', 'Refreshing']
    },
    'stone-wood-green-coast-lager': {
        name: 'Stone & Wood Green Coast Lager',
        type: 'Beer',
        alcohol: 'Lager',
        abv: '4.4%',
        standardDrinks: '1.0',
        ingredients: ['Malted barley', 'Hops', 'Water', 'Yeast'],
        description: 'A clean, crisp lager with subtle hop character and refreshing profile. Features delicate notes of pale malt, gentle hop bitterness, and a clean, dry finish. Light-bodied with bright carbonation and a smooth, thirst-quenching mouthfeel. The finish is clean and refreshing with minimal bitterness, making it perfect for hot weather and casual drinking. One 330ml bottle contains 1.0 standard drinks.',
        nutrition: {
            calories: 125,
            carbs: 12.2,
            protein: 1.2,
            fat: 0,
            sugar: 0.4,
            servingSize: '330ml'
        },
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Lager', 'Australian', 'Clean', 'Crisp']
    },
    'balter-xpa': {
        name: 'Balter XPA',
        type: 'Beer',
        alcohol: 'Extra Pale Ale',
        abv: '4.2%',
        standardDrinks: '1.0',
        ingredients: ['Malted barley', 'Citra hops', 'Mosaic hops', 'Water', 'Yeast'],
        description: 'A sessionable extra pale ale with tropical and citrus hop character. Features bright notes of passionfruit, mango, and orange from Citra and Mosaic hops. Light-bodied with crisp carbonation and a smooth, refreshing mouthfeel. The finish is clean and dry with moderate bitterness, making it perfect for extended drinking sessions. Ideal for those who enjoy hop flavor without high alcohol content. One 330ml can contains 1.0 standard drinks.',
        nutrition: {
            calories: 125,
            carbs: 12.2,
            protein: 1.2,
            fat: 0,
            sugar: 0.4,
            servingSize: '330ml'
        },
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'XPA', 'Australian', 'Sessionable', 'Tropical']
    },
    'balter-ipa': {
        name: 'Balter IPA',
        type: 'Beer',
        alcohol: 'India Pale Ale',
        abv: '6.2%',
        standardDrinks: '1.5',
        ingredients: ['Malted barley', 'Citra hops', 'Mosaic hops', 'Simcoe hops', 'Water', 'Yeast'],
        description: 'A bold IPA with intense tropical fruit and pine hop character. Features aggressive notes of passionfruit, mango, and pine resin from Citra, Mosaic, and Simcoe hops. Medium to full-bodied with strong carbonation and a complex, layered mouthfeel. The finish is intensely bitter with lingering hop oils and tropical fruit notes. Perfect for hop enthusiasts who enjoy bold, flavorful IPAs. One 330ml can contains 1.5 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'IPA', 'Australian', 'Bold', 'Tropical']
    },
    'young-henrys-newtowner': {
        name: 'Young Henrys Newtowner',
        type: 'Beer',
        alcohol: 'Australian Pale Ale',
        abv: '4.8%',
        standardDrinks: '1.1',
        ingredients: ['Malted barley', 'Hops', 'Water', 'Yeast'],
        description: 'A sessionable pale ale with balanced malt and hop character. Features notes of caramel malt, citrus hops, and a touch of sweetness balanced by moderate bitterness. Medium-bodied with smooth carbonation and a well-rounded mouthfeel. The finish is clean and balanced with lingering malt sweetness and hop character. Perfect for those who enjoy traditional pale ale flavors with modern drinkability. One 330ml bottle contains 1.1 standard drinks.',
        nutrition: {
            calories: 145,
            carbs: 14.2,
            protein: 1.4,
            fat: 0,
            sugar: 0.6,
            servingSize: '330ml'
        },
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Pale Ale', 'Australian', 'Sessionable', 'Balanced']
    },
    'young-henrys-natural-lager': {
        name: 'Young Henrys Natural Lager',
        type: 'Beer',
        alcohol: 'Lager',
        abv: '4.2%',
        standardDrinks: '1.0',
        ingredients: ['Malted barley', 'Hops', 'Water', 'Yeast'],
        description: 'A clean, natural lager with subtle hop character and traditional brewing methods. Features delicate notes of pale malt, gentle hop bitterness, and a touch of grain character. Light-bodied with bright carbonation and a smooth, thirst-quenching mouthfeel. The finish is clean and refreshing with minimal bitterness, making it perfect for hot weather and casual drinking. Brewed with natural ingredients for authentic flavor. One 330ml bottle contains 1.0 standard drinks.',
        nutrition: {
            calories: 128,
            carbs: 12.5,
            protein: 1.2,
            fat: 0,
            sugar: 0.5,
            servingSize: '330ml'
        },
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Lager', 'Australian', 'Clean', 'Natural']
    },
    'modus-operandi-former-tenant': {
        name: 'Modus Operandi Former Tenant',
        type: 'Beer',
        alcohol: 'India Pale Ale',
        abv: '6.5%',
        standardDrinks: '1.6',
        ingredients: ['Malted barley', 'Citra hops', 'Mosaic hops', 'Water', 'Yeast'],
        description: 'A hazy IPA with intense tropical fruit and citrus hop character. Features juicy notes of passionfruit, mango, and orange from Citra and Mosaic hops with a smooth, creamy mouthfeel from the hazy appearance. Medium-bodied with bright carbonation and a pillowy texture. The finish is juicy and smooth with minimal bitterness, characteristic of the New England IPA style. Perfect for showcasing hop flavor without harsh bitterness. One 330ml can contains 1.6 standard drinks.',
        nutrition: {
            calories: 195,
            carbs: 19.2,
            protein: 1.9,
            fat: 0,
            sugar: 0.9,
            servingSize: '330ml'
        },
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'IPA', 'Australian', 'Hazy', 'Tropical']
    },
    'modus-operandi-silent-knight': {
        name: 'Modus Operandi Silent Knight',
        type: 'Beer',
        alcohol: 'Stout',
        abv: '5.0%',
        standardDrinks: '1.2',
        ingredients: ['Malted barley', 'Roasted barley', 'Hops', 'Water', 'Yeast'],
        description: 'A smooth, dark stout with coffee and chocolate notes. Features rich notes of roasted coffee, dark chocolate, and roasted barley with a subtle sweetness. Medium-bodied with smooth carbonation and a creamy, velvety mouthfeel. The finish is rich and warming with lingering coffee and chocolate notes. Perfect for cold weather and dessert pairing. One 330ml can contains 1.2 standard drinks.',
        nutrition: {
            calories: 155,
            carbs: 15.2,
            protein: 1.5,
            fat: 0,
            sugar: 0.7,
            servingSize: '330ml'
        },
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Stout', 'Australian', 'Dark', 'Smooth']
    },
    'hop-nation-rattenhund': {
        name: 'Hop Nation Rattenhund',
        type: 'Beer',
        alcohol: 'India Pale Ale',
        abv: '6.0%',
        standardDrinks: '1.4',
        ingredients: ['Malted barley', 'Citra hops', 'Mosaic hops', 'Water', 'Yeast'],
        description: 'A juicy IPA with tropical fruit and citrus hop character. One 330ml can contains 1.4 standard drinks.',
        nutrition: {
            calories: 175,
            carbs: 17.2,
            protein: 1.7,
            fat: 0,
            sugar: 0.8,
            servingSize: '330ml'
        },
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'IPA', 'Australian', 'Juicy', 'Tropical']
    },
    'hop-nation-the-wolf': {
        name: 'Hop Nation The Wolf',
        type: 'Beer',
        alcohol: 'Double IPA',
        abv: '8.0%',
        standardDrinks: '1.9',
        ingredients: ['Malted barley', 'Citra hops', 'Mosaic hops', 'Simcoe hops', 'Water', 'Yeast'],
        description: 'A bold double IPA with intense hop character and high alcohol content. Features aggressive notes of tropical fruit, pine resin, and citrus from Citra, Mosaic, and Simcoe hops. Full-bodied with strong carbonation and a complex, layered mouthfeel. The finish is intensely bitter with lingering hop oils and warming alcohol notes. Perfect for hop enthusiasts who enjoy bold, high-alcohol IPAs. One 330ml can contains 1.9 standard drinks.',
        nutrition: {
            calories: 225,
            carbs: 22.8,
            protein: 2.2,
            fat: 0,
            sugar: 1.1,
            servingSize: '330ml'
        },
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Double IPA', 'Australian', 'Bold', 'High ABV']
    },
    'garage-project-hazy-daze': {
        name: 'Garage Project Hazy Daze',
        type: 'Beer',
        alcohol: 'New England IPA',
        abv: '6.5%',
        standardDrinks: '1.6',
        ingredients: ['Malted barley', 'Oats', 'Citra hops', 'Mosaic hops', 'Water', 'Yeast'],
        description: 'A hazy New England-style IPA with tropical fruit notes. Features juicy notes of passionfruit, mango, and citrus with a smooth, creamy mouthfeel from the hazy appearance and oat addition. Medium-bodied with bright carbonation and a smooth, pillowy texture. The finish is juicy and smooth with minimal bitterness, characteristic of the New England IPA style. Perfect for showcasing hop flavor without harsh bitterness. One 330ml can contains 1.6 standard drinks.',
        nutrition: {
            calories: 195,
            carbs: 19.5,
            protein: 1.9,
            fat: 0,
            sugar: 1.0,
            servingSize: '330ml'
        },
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'IPA', 'New Zealand', 'Hazy', 'Tropical']
    },
    'garage-project-death-from-above': {
        name: 'Garage Project Death From Above',
        type: 'Beer',
        alcohol: 'Mango IPA',
        abv: '7.0%',
        standardDrinks: '1.7',
        ingredients: ['Malted barley', 'Mango', 'Citra hops', 'Water', 'Yeast'],
        description: 'A mango-infused IPA with tropical fruit character. Features intense notes of fresh mango, passionfruit, and citrus from both the fruit addition and Citra hops. Medium to full-bodied with bright carbonation and a juicy, smooth mouthfeel. The finish is fruity and smooth with moderate bitterness balanced by the natural mango sweetness. Perfect for those who enjoy fruit-forward IPAs with authentic fruit flavor. One 330ml can contains 1.7 standard drinks.',
        nutrition: {
            calories: 205,
            carbs: 20.5,
            protein: 2.0,
            fat: 0,
            sugar: 1.1,
            servingSize: '330ml'
        },
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'IPA', 'New Zealand', 'Mango', 'Tropical']
    },
    'epic-armageddon': {
        name: 'Epic Armageddon',
        type: 'Beer',
        alcohol: 'India Pale Ale',
        abv: '6.66%',
        standardDrinks: '1.6',
        ingredients: ['Malted barley', 'Columbus hops', 'Cascade hops', 'Water', 'Yeast'],
        description: 'A bold IPA with intense hop character and high alcohol content. Features aggressive notes of pine, grapefruit, and resin from Columbus and Cascade hops. Full-bodied with a strong malt backbone to support the high alcohol content. The finish is intensely bitter with lingering hop oils and warming alcohol notes. Perfect for hop enthusiasts who enjoy bold, aggressive flavors. One 330ml bottle contains 1.6 standard drinks.',
        nutrition: {
            calories: 200,
            carbs: 20.2,
            protein: 2.0,
            fat: 0,
            sugar: 1.1,
            servingSize: '330ml'
        },
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'IPA', 'New Zealand', 'Bold', 'High ABV']
    },
    'epic-hop-zombie': {
        name: 'Epic Hop Zombie',
        type: 'Beer',
        alcohol: 'Double IPA',
        abv: '8.5%',
        standardDrinks: '2.0',
        ingredients: ['Malted barley', 'Citra hops', 'Mosaic hops', 'Simcoe hops', 'Water', 'Yeast'],
        description: 'A massive double IPA with intense hop character and high alcohol content. Features aggressive notes of tropical fruit, pine resin, and citrus from Citra, Mosaic, and Simcoe hops. Full-bodied with strong carbonation and a complex, layered mouthfeel. The finish is intensely bitter with lingering hop oils and warming alcohol notes. Perfect for hop enthusiasts who enjoy bold, high-alcohol IPAs. One 330ml bottle contains 2.0 standard drinks.',
        nutrition: {
            calories: 240,
            carbs: 24.2,
            protein: 2.4,
            fat: 0,
            sugar: 1.2,
            servingSize: '330ml'
        },
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Double IPA', 'New Zealand', 'Massive', 'High ABV']
    },
    'yeastie-boys-gunnamatta': {
        name: 'Yeastie Boys Gunnamatta',
        type: 'Beer',
        alcohol: 'Earl Grey IPA',
        abv: '6.5%',
        standardDrinks: '1.6',
        ingredients: ['Malted barley', 'Earl Grey tea', 'Citra hops', 'Water', 'Yeast'],
        description: 'An Earl Grey tea-infused IPA with citrus and bergamot notes. Features distinctive bergamot orange and black tea aromas from Earl Grey tea, balanced by citrus hop character. Medium-bodied with bright carbonation and a smooth, complex mouthfeel. The finish is unique with lingering tea tannins and citrus notes. Perfect for those who enjoy experimental beers and tea lovers. One 330ml bottle contains 1.6 standard drinks.',
        nutrition: {
            calories: 195,
            carbs: 19.5,
            protein: 1.9,
            fat: 0,
            sugar: 1.0,
            servingSize: '330ml'
        },
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'IPA', 'New Zealand', 'Tea-infused', 'Bergamot']
    },
    'yeastie-boys-pot-kettle-black': {
        name: 'Yeastie Boys Pot Kettle Black',
        type: 'Beer',
        alcohol: 'Porter',
        abv: '6.0%',
        standardDrinks: '1.4',
        ingredients: ['Malted barley', 'Roasted barley', 'Chocolate malt', 'Water', 'Yeast'],
        description: 'A rich porter with coffee and chocolate notes. Features deep notes of roasted coffee, dark chocolate, and roasted barley with a subtle sweetness. Medium to full-bodied with smooth carbonation and a creamy, velvety mouthfeel. The finish is rich and warming with lingering coffee and chocolate notes. Perfect for cold weather and dessert pairing. One 330ml bottle contains 1.4 standard drinks.',
        nutrition: {
            calories: 175,
            carbs: 17.8,
            protein: 1.7,
            fat: 0,
            sugar: 0.8,
            servingSize: '330ml'
        },
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Porter', 'New Zealand', 'Rich', 'Dark']
    },
    'little-creatures-pale-ale': {
        name: 'Little Creatures Pale Ale',
        type: 'Beer',
        alcohol: 'American Pale Ale',
        abv: '5.2%',
        standardDrinks: '1.3',
        ingredients: ['Malted barley', 'Cascade hops', 'Water', 'Yeast'],
        description: 'A classic American-style pale ale with citrus hop character. Features bright notes of grapefruit, orange, and pine from Cascade hops balanced by caramel malt sweetness. Medium-bodied with smooth carbonation and a well-rounded mouthfeel. The finish is clean and balanced with lingering citrus notes and moderate bitterness. Perfect for those who enjoy traditional American pale ale flavors. One 330ml bottle contains 1.3 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Pale Ale', 'Australian', 'Classic', 'Citrus']
    },
    'little-creatures-bright-ale': {
        name: 'Little Creatures Bright Ale',
        type: 'Beer',
        alcohol: 'Golden Ale',
        abv: '4.5%',
        standardDrinks: '1.1',
        ingredients: ['Malted barley', 'Hops', 'Water', 'Yeast'],
        description: 'A bright, golden ale with subtle hop character and refreshing profile. Features delicate notes of pale malt, gentle hop bitterness, and a touch of sweetness. Light-bodied with bright carbonation and a smooth, thirst-quenching mouthfeel. The finish is clean and refreshing with minimal bitterness, making it perfect for hot weather and casual drinking. One 330ml bottle contains 1.1 standard drinks.',
        nutrition: {
            calories: 145,
            carbs: 14.2,
            protein: 1.4,
            fat: 0,
            sugar: 0.6,
            servingSize: '330ml'
        },
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Golden Ale', 'Australian', 'Bright', 'Golden']
    },
    'little-creatures-dog-days': {
        name: 'Little Creatures Dog Days',
        type: 'Beer',
        alcohol: 'Session IPA',
        abv: '4.4%',
        standardDrinks: '1.0',
        ingredients: ['Malted barley', 'Citra hops', 'Mosaic hops', 'Water', 'Yeast'],
        description: 'A sessionable IPA with tropical fruit hop character. Features bright notes of passionfruit, mango, and citrus from Citra and Mosaic hops. Light-bodied with crisp carbonation and a smooth, refreshing mouthfeel. The finish is clean and dry with moderate bitterness, making it perfect for extended drinking sessions. Ideal for those who enjoy hop flavor without high alcohol content. One 330ml bottle contains 1.0 standard drinks.',
        nutrition: {
            calories: 135,
            carbs: 13.2,
            protein: 1.3,
            fat: 0,
            sugar: 0.5,
            servingSize: '330ml'
        },
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Session IPA', 'Australian', 'Sessionable', 'Tropical']
    },
    'mountain-goat-steam-ale': {
        name: 'Mountain Goat Steam Ale',
        type: 'Beer',
        alcohol: 'California Common',
        abv: '4.5%',
        standardDrinks: '1.1',
        ingredients: ['Malted barley', 'Northern Brewer hops', 'Water', 'Yeast'],
        description: 'A California common-style beer with caramel malt character and traditional steam brewing methods. Features notes of caramel malt, subtle hop bitterness from Northern Brewer hops, and a touch of toffee sweetness. Medium-bodied with smooth carbonation and a well-rounded mouthfeel. The finish is clean and balanced with lingering malt sweetness. Perfect for those who enjoy traditional American brewing styles. One 330ml bottle contains 1.1 standard drinks.',
        nutrition: {
            calories: 155,
            carbs: 15.2,
            protein: 1.5,
            fat: 0,
            sugar: 0.7,
            servingSize: '330ml'
        },
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'California Common', 'Australian', 'Caramel', 'Smooth']
    },
    'mountain-goat-hightail-ale': {
        name: 'Mountain Goat Hightail Ale',
        type: 'Beer',
        alcohol: 'English Pale Ale',
        abv: '4.5%',
        standardDrinks: '1.1',
        ingredients: ['Malted barley', 'East Kent Golding hops', 'Water', 'Yeast'],
        description: 'An English-style pale ale with balanced malt and hop character. Features notes of biscuit malt, herbal hop character from East Kent Golding hops, and a touch of earthiness. Medium-bodied with smooth carbonation and a traditional mouthfeel. The finish is clean and balanced with lingering malt sweetness and subtle hop notes. Perfect for those who enjoy classic English brewing traditions. One 330ml bottle contains 1.1 standard drinks.',
        nutrition: {
            calories: 155,
            carbs: 15.2,
            protein: 1.5,
            fat: 0,
            sugar: 0.7,
            servingSize: '330ml'
        },
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'English Pale Ale', 'Australian', 'Balanced', 'Traditional']
    },
    'mountain-goat-fancy-pants': {
        name: 'Mountain Goat Fancy Pants',
        type: 'Beer',
        alcohol: 'Golden Ale',
        abv: '4.2%',
        standardDrinks: '1.0',
        ingredients: ['Malted barley', 'Hops', 'Water', 'Yeast'],
        description: 'A bright, golden ale with subtle hop character and refreshing profile. Features delicate notes of pale malt, gentle hop bitterness, and a touch of sweetness. Light-bodied with bright carbonation and a smooth, thirst-quenching mouthfeel. The finish is clean and refreshing with minimal bitterness, making it perfect for hot weather and casual drinking. One 330ml bottle contains 1.0 standard drinks.',
        nutrition: {
            calories: 145,
            carbs: 14.2,
            protein: 1.4,
            fat: 0,
            sugar: 0.6,
            servingSize: '330ml'
        },
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Golden Ale', 'Australian', 'Bright', 'Golden']
    },

    // Top 50 Australian Beers (26-50)
    '4-pines-pale-ale': {
        name: '4 Pines Pale Ale',
        type: 'Beer',
        alcohol: 'American Pale Ale',
        abv: '5.1%',
        standardDrinks: '1.2',
        ingredients: ['Malted barley', 'Cascade hops', 'Water', 'Yeast'],
        description: 'A classic American-style pale ale with citrus hop character. Features bright notes of grapefruit, orange, and pine from Cascade hops balanced by caramel malt sweetness. Medium-bodied with smooth carbonation and a well-rounded mouthfeel. The finish is clean and balanced with lingering citrus notes and moderate bitterness. Perfect for those who enjoy traditional American pale ale flavors. One 330ml bottle contains 1.2 standard drinks.',
        nutrition: {
            calories: 155,
            carbs: 15.2,
            protein: 1.5,
            fat: 0,
            sugar: 0.7,
            servingSize: '330ml'
        },
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Pale Ale', 'Australian', 'Classic', 'Citrus']
    },
    '4-pines-hefeweizen': {
        name: '4 Pines Hefeweizen',
        type: 'Beer',
        alcohol: 'Hefeweizen',
        abv: '5.0%',
        standardDrinks: '1.2',
        ingredients: ['Wheat malt', 'Malted barley', 'Hops', 'Water', 'Yeast'],
        description: 'A German-style wheat beer with banana and clove notes. Features distinctive notes of banana, clove, and bubblegum from the wheat yeast strain, balanced by wheat malt sweetness. Medium-bodied with smooth carbonation and a creamy, velvety mouthfeel. The finish is smooth and refreshing with lingering banana and spice notes. Perfect for those who enjoy traditional German wheat beer flavors. One 330ml bottle contains 1.2 standard drinks.',
        nutrition: {
            calories: 155,
            carbs: 15.2,
            protein: 1.5,
            fat: 0,
            sugar: 0.7,
            servingSize: '330ml'
        },
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Hefeweizen', 'Australian', 'Wheat', 'Banana']
    },
    'bridge-road-brewers-beechworth-pale-ale': {
        name: 'Bridge Road Brewers Beechworth Pale Ale',
        type: 'Beer',
        alcohol: 'American Pale Ale',
        abv: '5.2%',
        standardDrinks: '1.3',
        ingredients: ['Malted barley', 'Cascade hops', 'Water', 'Yeast'],
        description: 'A classic American-style pale ale with citrus hop character. Features bright notes of grapefruit, orange, and pine from Cascade hops balanced by caramel malt sweetness. Medium-bodied with smooth carbonation and a well-rounded mouthfeel. The finish is clean and balanced with lingering citrus notes and moderate bitterness. Perfect for those who enjoy traditional American pale ale flavors. One 330ml bottle contains 1.3 standard drinks.',
        nutrition: {
            calories: 165,
            carbs: 16.2,
            protein: 1.6,
            fat: 0,
            sugar: 0.8,
            servingSize: '330ml'
        },
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Pale Ale', 'Australian', 'Classic', 'Citrus']
    },
    'bridge-road-brewers-robust-porter': {
        name: 'Bridge Road Brewers Robust Porter',
        type: 'Beer',
        alcohol: 'Porter',
        abv: '5.8%',
        standardDrinks: '1.4',
        ingredients: ['Malted barley', 'Roasted barley', 'Chocolate malt', 'Water', 'Yeast'],
        description: 'A rich porter with coffee and chocolate notes. Features deep notes of roasted coffee, dark chocolate, and roasted barley with a subtle sweetness. Medium to full-bodied with smooth carbonation and a creamy, velvety mouthfeel. The finish is rich and warming with lingering coffee and chocolate notes. Perfect for cold weather and dessert pairing. One 330ml bottle contains 1.4 standard drinks.',
        nutrition: {
            calories: 175,
            carbs: 17.2,
            protein: 1.7,
            fat: 0,
            sugar: 0.8,
            servingSize: '330ml'
        },
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Porter', 'Australian', 'Rich', 'Dark']
    },
    'foghorn-breakwater-pale-ale': {
        name: 'Foghorn Breakwater Pale Ale',
        type: 'Beer',
        alcohol: 'American Pale Ale',
        abv: '5.0%',
        standardDrinks: '1.2',
        ingredients: ['Malted barley', 'Cascade hops', 'Water', 'Yeast'],
        description: 'A classic American-style pale ale with citrus hop character. One 330ml bottle contains 1.2 standard drinks.',
        nutrition: {
            calories: 155,
            carbs: 15.2,
            protein: 1.5,
            fat: 0,
            sugar: 0.7,
            servingSize: '330ml'
        },
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Pale Ale', 'Australian', 'Classic', 'Citrus']
    },
    'foghorn-redhead-red-ale': {
        name: 'Foghorn Redhead Red Ale',
        type: 'Beer',
        alcohol: 'Red Ale',
        abv: '5.2%',
        standardDrinks: '1.3',
        ingredients: ['Malted barley', 'Crystal malt', 'Hops', 'Water', 'Yeast'],
        description: 'A rich red ale with caramel malt character. Features notes of caramel, toffee, and crystal malt sweetness balanced by moderate hop bitterness. Medium-bodied with smooth carbonation and a well-rounded mouthfeel. The finish is clean and balanced with lingering malt sweetness and subtle hop notes. Perfect for those who enjoy malt-forward beers with rich character. One 330ml bottle contains 1.3 standard drinks.',
        nutrition: {
            calories: 165,
            carbs: 16.2,
            protein: 1.6,
            fat: 0,
            sugar: 0.8,
            servingSize: '330ml'
        },
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Red Ale', 'Australian', 'Rich', 'Caramel']
    },
    'foghorn-black-sheep-stout': {
        name: 'Foghorn Black Sheep Stout',
        type: 'Beer',
        alcohol: 'Stout',
        abv: '5.5%',
        standardDrinks: '1.3',
        ingredients: ['Malted barley', 'Roasted barley', 'Hops', 'Water', 'Yeast'],
        description: 'A smooth, dark stout with coffee and chocolate notes. Features rich notes of roasted coffee, dark chocolate, and roasted barley with a subtle sweetness. Medium-bodied with smooth carbonation and a creamy, velvety mouthfeel. The finish is rich and warming with lingering coffee and chocolate notes. Perfect for cold weather and dessert pairing. One 330ml bottle contains 1.3 standard drinks.',
        nutrition: {
            calories: 165,
            carbs: 16.2,
            protein: 1.6,
            fat: 0,
            sugar: 0.8,
            servingSize: '330ml'
        },
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Stout', 'Australian', 'Dark', 'Smooth']
    },
    'hawkers-pale-ale': {
        name: 'Hawkers Pale Ale',
        type: 'Beer',
        alcohol: 'American Pale Ale',
        abv: '5.0%',
        standardDrinks: '1.2',
        ingredients: ['Malted barley', 'Cascade hops', 'Water', 'Yeast'],
        description: 'A classic American-style pale ale with citrus hop character. One 330ml bottle contains 1.2 standard drinks.',
        nutrition: {
            calories: 155,
            carbs: 15.2,
            protein: 1.5,
            fat: 0,
            sugar: 0.7,
            servingSize: '330ml'
        },
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Pale Ale', 'Australian', 'Classic', 'Citrus']
    },
    'hawkers-ipa': {
        name: 'Hawkers IPA',
        type: 'Beer',
        alcohol: 'India Pale Ale',
        abv: '6.0%',
        standardDrinks: '1.4',
        ingredients: ['Malted barley', 'Citra hops', 'Mosaic hops', 'Water', 'Yeast'],
        description: 'A bold IPA with tropical fruit and citrus hop character. One 330ml bottle contains 1.4 standard drinks.',
        nutrition: {
            calories: 175,
            carbs: 17.2,
            protein: 1.7,
            fat: 0,
            sugar: 0.8,
            servingSize: '330ml'
        },
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'IPA', 'Australian', 'Bold', 'Tropical']
    },
    'hawkers-lager': {
        name: 'Hawkers Lager',
        type: 'Beer',
        alcohol: 'Lager',
        abv: '4.5%',
        standardDrinks: '1.1',
        ingredients: ['Malted barley', 'Hops', 'Water', 'Yeast'],
        description: 'A clean, crisp lager with subtle hop character and refreshing profile. Features delicate notes of pale malt, gentle hop bitterness, and a touch of grain character. Light-bodied with bright carbonation and a smooth, thirst-quenching mouthfeel. The finish is clean and refreshing with minimal bitterness, making it perfect for hot weather and casual drinking. One 330ml bottle contains 1.1 standard drinks.',
        nutrition: {
            calories: 145,
            carbs: 14.2,
            protein: 1.4,
            fat: 0,
            sugar: 0.6,
            servingSize: '330ml'
        },
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Lager', 'Australian', 'Clean', 'Crisp']
    },
    'akasha-brewing-hopsmith-ipa': {
        name: 'Akasha Brewing Hopsmith IPA',
        type: 'Beer',
        alcohol: 'India Pale Ale',
        abv: '6.2%',
        standardDrinks: '1.5',
        ingredients: ['Malted barley', 'Citra hops', 'Mosaic hops', 'Simcoe hops', 'Water', 'Yeast'],
        description: 'A bold IPA with intense tropical fruit and pine hop character. Features aggressive notes of passionfruit, mango, and pine resin from Citra, Mosaic, and Simcoe hops. Medium to full-bodied with strong carbonation and a complex, layered mouthfeel. The finish is intensely bitter with lingering hop oils and tropical fruit notes. Perfect for hop enthusiasts who enjoy bold, flavorful IPAs. One 330ml can contains 1.5 standard drinks.',
        nutrition: {
            calories: 185,
            carbs: 18.2,
            protein: 1.8,
            fat: 0,
            sugar: 0.9,
            servingSize: '330ml'
        },
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'IPA', 'Australian', 'Bold', 'Tropical']
    },
    'akasha-brewing-freshwater-pale-ale': {
        name: 'Akasha Brewing Freshwater Pale Ale',
        type: 'Beer',
        alcohol: 'American Pale Ale',
        abv: '4.8%',
        standardDrinks: '1.1',
        ingredients: ['Malted barley', 'Cascade hops', 'Water', 'Yeast'],
        description: 'A classic American-style pale ale with citrus hop character. One 330ml can contains 1.1 standard drinks.',
        nutrition: {
            calories: 145,
            carbs: 14.2,
            protein: 1.4,
            fat: 0,
            sugar: 0.6,
            servingSize: '330ml'
        },
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Pale Ale', 'Australian', 'Classic', 'Citrus']
    },
    'akasha-brewing-5oclock-shadow': {
        name: 'Akasha Brewing 5 O\'Clock Shadow',
        type: 'Beer',
        alcohol: 'Stout',
        abv: '5.5%',
        standardDrinks: '1.3',
        ingredients: ['Malted barley', 'Roasted barley', 'Hops', 'Water', 'Yeast'],
        description: 'A smooth, dark stout with coffee and chocolate notes. Features rich notes of roasted coffee, dark chocolate, and roasted barley with a subtle sweetness. Medium-bodied with smooth carbonation and a creamy, velvety mouthfeel. The finish is rich and warming with lingering coffee and chocolate notes. Perfect for cold weather and dessert pairing. One 330ml can contains 1.3 standard drinks.',
        nutrition: {
            calories: 165,
            carbs: 16.2,
            protein: 1.6,
            fat: 0,
            sugar: 0.8,
            servingSize: '330ml'
        },
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Stout', 'Australian', 'Dark', 'Smooth']
    },
    'batch-brewing-west-coast-ipa': {
        name: 'Batch Brewing West Coast IPA',
        type: 'Beer',
        alcohol: 'India Pale Ale',
        abv: '6.5%',
        standardDrinks: '1.6',
        ingredients: ['Malted barley', 'Citra hops', 'Mosaic hops', 'Simcoe hops', 'Water', 'Yeast'],
        description: 'A bold West Coast-style IPA with intense hop character. Features aggressive notes of pine, grapefruit, and resin from Citra, Mosaic, and Simcoe hops. Medium to full-bodied with strong carbonation and a complex, layered mouthfeel. The finish is intensely bitter with lingering hop oils and citrus notes. Perfect for hop enthusiasts who enjoy traditional West Coast IPA styles. One 330ml can contains 1.6 standard drinks.',
        nutrition: {
            calories: 195,
            carbs: 19.2,
            protein: 1.9,
            fat: 0,
            sugar: 0.9,
            servingSize: '330ml'
        },
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'IPA', 'Australian', 'Bold', 'West Coast']
    },
    'batch-brewing-saison': {
        name: 'Batch Brewing Saison',
        type: 'Beer',
        alcohol: 'Saison',
        abv: '6.0%',
        standardDrinks: '1.4',
        ingredients: ['Malted barley', 'Wheat malt', 'Hops', 'Water', 'Yeast'],
        description: 'A Belgian-style saison with spicy and fruity character. One 330ml can contains 1.4 standard drinks.',
        nutrition: {
            calories: 175,
            carbs: 17.2,
            protein: 1.7,
            fat: 0,
            sugar: 0.8,
            servingSize: '330ml'
        },
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Saison', 'Australian', 'Spicy', 'Fruity']
    },
    'batch-brewing-pale-ale': {
        name: 'Batch Brewing Pale Ale',
        type: 'Beer',
        alcohol: 'American Pale Ale',
        abv: '5.0%',
        standardDrinks: '1.2',
        ingredients: ['Malted barley', 'Cascade hops', 'Water', 'Yeast'],
        description: 'A classic American-style pale ale with citrus hop character. One 330ml can contains 1.2 standard drinks.',
        nutrition: {
            calories: 155,
            carbs: 15.2,
            protein: 1.5,
            fat: 0,
            sugar: 0.7,
            servingSize: '330ml'
        },
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Pale Ale', 'Australian', 'Classic', 'Citrus']
    },
    'wayward-brewing-raspberry-berliner-weisse': {
        name: 'Wayward Brewing Raspberry Berliner Weisse',
        type: 'Beer',
        alcohol: 'Berliner Weisse',
        abv: '3.2%',
        standardDrinks: '0.8',
        ingredients: ['Wheat malt', 'Malted barley', 'Raspberries', 'Water', 'Yeast'],
        description: 'A tart Berliner Weisse with raspberry character. One 330ml can contains 0.8 standard drinks.',
        nutrition: {
            calories: 95,
            carbs: 9.2,
            protein: 0.9,
            fat: 0,
            sugar: 1.2,
            servingSize: '330ml'
        },
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Berliner Weisse', 'Australian', 'Tart', 'Raspberry']
    },
    'wayward-brewing-charlie-ipa': {
        name: 'Wayward Brewing Charlie IPA',
        type: 'Beer',
        alcohol: 'India Pale Ale',
        abv: '6.0%',
        standardDrinks: '1.4',
        ingredients: ['Malted barley', 'Citra hops', 'Mosaic hops', 'Water', 'Yeast'],
        description: 'A bold IPA with tropical fruit and citrus hop character. One 330ml can contains 1.4 standard drinks.',
        nutrition: {
            calories: 175,
            carbs: 17.2,
            protein: 1.7,
            fat: 0,
            sugar: 0.8,
            servingSize: '330ml'
        },
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'IPA', 'Australian', 'Bold', 'Tropical']
    },
    'wayward-brewing-sour-puss': {
        name: 'Wayward Brewing Sour Puss',
        type: 'Beer',
        alcohol: 'Sour Ale',
        abv: '4.0%',
        standardDrinks: '1.0',
        ingredients: ['Wheat malt', 'Malted barley', 'Lactobacillus', 'Water', 'Yeast'],
        description: 'A tart sour ale with refreshing acidity. One 330ml can contains 1.0 standard drinks.',
        nutrition: {
            calories: 125,
            carbs: 12.2,
            protein: 1.2,
            fat: 0,
            sugar: 0.5,
            servingSize: '330ml'
        },
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Sour Ale', 'Australian', 'Tart', 'Refreshing']
    },
    'nomad-brewing-long-trip-saison': {
        name: 'Nomad Brewing Long Trip Saison',
        type: 'Beer',
        alcohol: 'Saison',
        abv: '6.0%',
        standardDrinks: '1.4',
        ingredients: ['Malted barley', 'Wheat malt', 'Hops', 'Water', 'Yeast'],
        description: 'A Belgian-style saison with spicy and fruity character. One 330ml bottle contains 1.4 standard drinks.',
        nutrition: {
            calories: 175,
            carbs: 17.2,
            protein: 1.7,
            fat: 0,
            sugar: 0.8,
            servingSize: '330ml'
        },
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Saison', 'Australian', 'Spicy', 'Fruity']
    },
    'nomad-brewing-smooth-criminal': {
        name: 'Nomad Brewing Smooth Criminal',
        type: 'Beer',
        alcohol: 'Porter',
        abv: '5.5%',
        standardDrinks: '1.3',
        ingredients: ['Malted barley', 'Roasted barley', 'Chocolate malt', 'Water', 'Yeast'],
        description: 'A smooth porter with coffee and chocolate notes. One 330ml bottle contains 1.3 standard drinks.',
        nutrition: {
            calories: 165,
            carbs: 16.2,
            protein: 1.6,
            fat: 0,
            sugar: 0.8,
            servingSize: '330ml'
        },
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Porter', 'Australian', 'Smooth', 'Dark']
    },
    'nomad-brewing-freshie-salt-&-pepper-gose': {
        name: 'Nomad Brewing Freshie Salt & Pepper Gose',
        type: 'Beer',
        alcohol: 'Gose',
        abv: '4.0%',
        standardDrinks: '1.0',
        ingredients: ['Wheat malt', 'Malted barley', 'Salt', 'Coriander', 'Water', 'Yeast'],
        description: 'A tart gose with salt and pepper character. One 330ml bottle contains 1.0 standard drinks.',
        nutrition: {
            calories: 125,
            carbs: 12.2,
            protein: 1.2,
            fat: 0,
            sugar: 0.5,
            servingSize: '330ml'
        },
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Gose', 'Australian', 'Tart', 'Salty']
    },
    'bentspoke-crankshaft-ipa': {
        name: 'BentSpoke Crankshaft IPA',
        type: 'Beer',
        alcohol: 'India Pale Ale',
        abv: '6.0%',
        standardDrinks: '1.4',
        ingredients: ['Malted barley', 'Citra hops', 'Mosaic hops', 'Water', 'Yeast'],
        description: 'A bold IPA with tropical fruit and citrus hop character. One 330ml can contains 1.4 standard drinks.',
        nutrition: {
            calories: 175,
            carbs: 17.2,
            protein: 1.7,
            fat: 0,
            sugar: 0.8,
            servingSize: '330ml'
        },
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'IPA', 'Australian', 'Bold', 'Tropical']
    },
    'bentspoke-barley-griffin': {
        name: 'BentSpoke Barley Griffin',
        type: 'Beer',
        alcohol: 'Barley Wine',
        abv: '8.5%',
        standardDrinks: '2.0',
        ingredients: ['Malted barley', 'Crystal malt', 'Hops', 'Water', 'Yeast'],
        description: 'A rich barley wine with complex malt character. One 330ml can contains 2.0 standard drinks.',
        nutrition: {
            calories: 240,
            carbs: 24.2,
            protein: 2.4,
            fat: 0,
            sugar: 1.2,
            servingSize: '330ml'
        },
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Barley Wine', 'Australian', 'Rich', 'Complex']
    },
    'bentspoke-sprocket-red-ipa': {
        name: 'BentSpoke Sprocket Red IPA',
        type: 'Beer',
        alcohol: 'Red IPA',
        abv: '6.0%',
        standardDrinks: '1.4',
        ingredients: ['Malted barley', 'Crystal malt', 'Citra hops', 'Water', 'Yeast'],
        description: 'A red IPA with caramel malt and hop character. One 330ml can contains 1.4 standard drinks.',
        nutrition: {
            calories: 175,
            carbs: 17.2,
            protein: 1.7,
            fat: 0,
            sugar: 0.8,
            servingSize: '330ml'
        },
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Red IPA', 'Australian', 'Caramel', 'Hoppy']
    },
    'capital-brewing-rock-hopper-ipa': {
        name: 'Capital Brewing Rock Hopper IPA',
        type: 'Beer',
        alcohol: 'India Pale Ale',
        abv: '6.0%',
        standardDrinks: '1.4',
        ingredients: ['Malted barley', 'Citra hops', 'Mosaic hops', 'Water', 'Yeast'],
        description: 'A bold IPA with tropical fruit and citrus hop character. One 330ml can contains 1.4 standard drinks.',
        nutrition: {
            calories: 175,
            carbs: 17.2,
            protein: 1.7,
            fat: 0,
            sugar: 0.8,
            servingSize: '330ml'
        },
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'IPA', 'Australian', 'Bold', 'Tropical']
    },
    'capital-brewing-trail-pale-ale': {
        name: 'Capital Brewing Trail Pale Ale',
        type: 'Beer',
        alcohol: 'American Pale Ale',
        abv: '5.0%',
        standardDrinks: '1.2',
        ingredients: ['Malted barley', 'Cascade hops', 'Water', 'Yeast'],
        description: 'A classic American-style pale ale with citrus hop character. One 330ml can contains 1.2 standard drinks.',
        nutrition: {
            calories: 155,
            carbs: 15.2,
            protein: 1.5,
            fat: 0,
            sugar: 0.7,
            servingSize: '330ml'
        },
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Pale Ale', 'Australian', 'Classic', 'Citrus']
    },
    'capital-brewing-cosmic-crush-sour': {
        name: 'Capital Brewing Cosmic Crush Sour',
        type: 'Beer',
        alcohol: 'Sour Ale',
        abv: '4.0%',
        standardDrinks: '1.0',
        ingredients: ['Wheat malt', 'Malted barley', 'Lactobacillus', 'Water', 'Yeast'],
        description: 'A tart sour ale with refreshing acidity. One 330ml can contains 1.0 standard drinks.',
        nutrition: {
            calories: 125,
            carbs: 12.2,
            protein: 1.2,
            fat: 0,
            sugar: 0.5,
            servingSize: '330ml'
        },
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Sour Ale', 'Australian', 'Tart', 'Refreshing']
    },

    // Additional Australian Beer Companies and Variations
    'asahi': {
        name: 'Asahi Super Dry',
        type: 'Beer',
        alcohol: 'Japanese Lager',
        abv: '5.0%',
        standardDrinks: '1.2',
        ingredients: ['Malted barley', 'Rice', 'Hops', 'Water', 'Yeast'],
        description: 'A crisp, dry Japanese lager with a distinctive ultra-dry finish. Features delicate notes of rice, pale malt, and subtle hop bitterness. Light-bodied with high carbonation and a smooth, thirst-quenching mouthfeel. The finish is exceptionally dry and clean, making it perfect for pairing with Japanese cuisine, sushi, or as a refreshing session beer. One 330ml bottle contains 1.2 standard drinks.',
        nutrition: {
            calories: 130,
            carbs: 12.8,
            protein: 1.3,
            fat: 0,
            sugar: 0.6,
            servingSize: '330ml'
        },
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Lager', 'Japanese', 'Crisp', 'Dry']
    },
    'asahi-mid-strength': {
        name: 'Asahi Mid Strength',
        type: 'Beer',
        alcohol: 'Japanese Lager',
        abv: '3.5%',
        standardDrinks: '0.8',
        ingredients: ['Malted barley', 'Rice', 'Hops', 'Water', 'Yeast'],
        description: 'A mid-strength version of Asahi Super Dry with the same crisp, dry character. Features delicate notes of rice, pale malt, and subtle hop bitterness. Light-bodied with high carbonation and a smooth, thirst-quenching mouthfeel. The finish is ultra-dry and refreshing, making it perfect for lighter drinking occasions or pairing with Japanese cuisine. One 330ml bottle contains 0.8 standard drinks.',
        nutrition: {
            calories: 105,
            carbs: 10.2,
            protein: 1.0,
            fat: 0,
            sugar: 0.4,
            servingSize: '330ml'
        },
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Lager', 'Japanese', 'Mid-strength', 'Crisp']
    },
    'asahi-zero': {
        name: 'Asahi Zero',
        type: 'Beer',
        alcohol: 'Non-Alcoholic Lager',
        abv: '0.0%',
        standardDrinks: '0.0',
        ingredients: ['Malted barley', 'Rice', 'Hops', 'Water', 'Yeast'],
        description: 'A non-alcoholic version of Asahi Super Dry with the same crisp taste. Features delicate notes of rice, pale malt, and subtle hop bitterness. Light-bodied with high carbonation and a smooth, thirst-quenching mouthfeel. The finish is ultra-dry and refreshing, making it perfect for those seeking a non-alcoholic option without sacrificing flavor. One 330ml bottle contains 0.0 standard drinks.',
        nutrition: {
            calories: 45,
            carbs: 4.2,
            protein: 0.4,
            fat: 0,
            sugar: 0.2,
            servingSize: '330ml'
        },
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Lager', 'Japanese', 'Non-alcoholic', 'Crisp']
    },
    'asahi-500ml': {
        name: 'Asahi Super Dry 500ml',
        type: 'Beer',
        alcohol: 'Japanese Lager',
        abv: '5.0%',
        standardDrinks: '1.8',
        ingredients: ['Malted barley', 'Rice', 'Hops', 'Water', 'Yeast'],
        description: 'A larger serving of Asahi Super Dry in a 500ml can. Features the same crisp, dry character with delicate notes of rice, pale malt, and subtle hop bitterness. Light-bodied with high carbonation and a smooth, thirst-quenching mouthfeel. The finish is ultra-dry and refreshing, ideal for sharing or longer sessions. One 500ml can contains 1.8 standard drinks.',
        nutrition: {
            calories: 235,
            carbs: 23.2,
            protein: 2.3,
            fat: 0,
            sugar: 1.1,
            servingSize: '500ml'
        },
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Lager', 'Japanese', 'Crisp', 'Large Format']
    },
    'ballarat-bitter': {
        name: 'Ballarat Bitter',
        type: 'Beer',
        alcohol: 'Australian Bitter',
        abv: '4.8%',
        standardDrinks: '1.1',
        ingredients: ['Malted barley', 'Hops', 'Water', 'Yeast'],
        description: 'A traditional Australian bitter from Ballarat. Features notes of caramel malt, earthy hops, and a touch of grain character. Medium-bodied with smooth carbonation and a classic, slightly bitter finish. The finish is clean and balanced, making it a nostalgic choice for fans of classic Victorian beers. One 375ml bottle contains 1.1 standard drinks.',
        nutrition: {
            calories: 145,
            carbs: 14.2,
            protein: 1.4,
            fat: 0,
            sugar: 0.6,
            servingSize: '375ml'
        },
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Bitter', 'Australian', 'Traditional', 'Victorian']
    },
    'balter-brewing': {
        name: 'Balter Brewing Company',
        type: 'Beer',
        alcohol: 'Craft Brewery',
        abv: 'Varies',
        standardDrinks: 'Varies',
        ingredients: ['Malted barley', 'Hops', 'Water', 'Yeast'],
        description: 'A Gold Coast craft brewery known for their XPA and IPA varieties. Various ABV and standard drink counts.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Craft', 'Australian', 'Gold Coast', 'Modern']
    },
    'bentspoke-brewing': {
        name: 'BentSpoke Brewing Co',
        type: 'Beer',
        alcohol: 'Craft Brewery',
        abv: 'Varies',
        standardDrinks: 'Varies',
        ingredients: ['Malted barley', 'Hops', 'Water', 'Yeast'],
        description: 'A Canberra craft brewery known for their innovative beer styles. Various ABV and standard drink counts.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Craft', 'Australian', 'Canberra', 'Innovative']
    },
    'bluetongue-brewery': {
        name: 'Bluetongue Brewery',
        type: 'Beer',
        alcohol: 'Craft Brewery',
        abv: 'Varies',
        standardDrinks: 'Varies',
        ingredients: ['Malted barley', 'Hops', 'Water', 'Yeast'],
        description: 'A Hunter Valley craft brewery with a range of traditional and modern beer styles. Various ABV and standard drink counts.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Craft', 'Australian', 'Hunter Valley', 'Traditional']
    },
    'boags-brewery': {
        name: 'Boag\'s Brewery',
        type: 'Beer',
        alcohol: 'Craft Brewery',
        abv: 'Varies',
        standardDrinks: 'Varies',
        ingredients: ['Malted barley', 'Hops', 'Water', 'Yeast'],
        description: 'A Tasmanian brewery known for their premium lagers and traditional brewing methods. Various ABV and standard drink counts.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Craft', 'Australian', 'Tasmanian', 'Premium']
    },
    'bondi-blonde': {
        name: 'Bondi Blonde',
        type: 'Beer',
        alcohol: 'Australian Lager',
        abv: '4.2%',
        standardDrinks: '1.0',
        ingredients: ['Malted barley', 'Hops', 'Water', 'Yeast'],
        description: 'A light, refreshing lager inspired by the Bondi lifestyle. Features delicate notes of pale malt, gentle hop bitterness, and a crisp, clean finish. Light-bodied with bright carbonation and a thirst-quenching mouthfeel. The finish is clean and refreshing, perfect for hot weather, beach days, and casual drinking. One 330ml bottle contains 1.0 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Lager', 'Australian', 'Light', 'Refreshing']
    },
    'bootleg-brewery': {
        name: 'Bootleg Brewery',
        type: 'Beer',
        alcohol: 'Craft Brewery',
        abv: 'Varies',
        standardDrinks: 'Varies',
        ingredients: ['Malted barley', 'Hops', 'Water', 'Yeast'],
        description: 'A Western Australian craft brewery known for their unique beer styles and barrel-aged offerings. Various ABV and standard drink counts.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Craft', 'Australian', 'Western Australia', 'Barrel-aged']
    },
    'john-boston': {
        name: 'John Boston',
        type: 'Beer',
        alcohol: 'Australian Lager',
        abv: '4.5%',
        standardDrinks: '1.1',
        ingredients: ['Malted barley', 'Hops', 'Water', 'Yeast'],
        description: 'A classic Australian lager with a rich history. Features notes of pale malt, subtle hop bitterness, and a touch of grain character. Light to medium-bodied with smooth carbonation and a clean, easy-drinking finish. The finish is crisp and refreshing, making it a great choice for any occasion. One 375ml bottle contains 1.1 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Lager', 'Australian', 'Classic', 'Historical']
    },
    'brisbane-bitter': {
        name: 'Brisbane Bitter',
        type: 'Beer',
        alcohol: 'Australian Bitter',
        abv: '4.8%',
        standardDrinks: '1.1',
        ingredients: ['Malted barley', 'Hops', 'Water', 'Yeast'],
        description: 'A traditional Queensland bitter with a distinctive taste. Features notes of caramel malt, earthy hops, and a touch of grain character. Medium-bodied with smooth carbonation and a classic, slightly bitter finish. The finish is clean and balanced, making it a nostalgic choice for fans of classic Queensland beers. One 375ml bottle contains 1.1 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Bitter', 'Australian', 'Queensland', 'Traditional']
    },
    'broo-brewery': {
        name: 'Broo Brewery',
        type: 'Beer',
        alcohol: 'Craft Brewery',
        abv: 'Varies',
        standardDrinks: 'Varies',
        ingredients: ['Malted barley', 'Hops', 'Water', 'Yeast'],
        description: 'A craft brewery known for their innovative brewing techniques and sustainable practices. Various ABV and standard drink counts.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Craft', 'Australian', 'Innovative', 'Sustainable']
    },
    'burleigh-brewing': {
        name: 'Burleigh Brewing Company',
        type: 'Beer',
        alcohol: 'Craft Brewery',
        abv: 'Varies',
        standardDrinks: 'Varies',
        ingredients: ['Malted barley', 'Hops', 'Water', 'Yeast'],
        description: 'A Gold Coast craft brewery known for their tropical-inspired beers and quality ingredients. Various ABV and standard drink counts.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Craft', 'Australian', 'Gold Coast', 'Tropical']
    },
    'capital-brewing-company': {
        name: 'Capital Brewing Company',
        type: 'Beer',
        alcohol: 'Craft Brewery',
        abv: 'Varies',
        standardDrinks: 'Varies',
        ingredients: ['Malted barley', 'Hops', 'Water', 'Yeast'],
        description: 'A Canberra craft brewery known for their sessionable beers and community focus. Various ABV and standard drink counts.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Craft', 'Australian', 'Canberra', 'Sessionable']
    },
    'carlton-united-breweries': {
        name: 'Carlton & United Breweries',
        type: 'Beer',
        alcohol: 'Major Brewery',
        abv: 'Varies',
        standardDrinks: 'Varies',
        ingredients: ['Malted barley', 'Hops', 'Water', 'Yeast'],
        description: 'One of Australia\'s largest brewing companies, producing a wide range of popular beer brands. Various ABV and standard drink counts.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Major Brewery', 'Australian', 'Popular', 'Wide Range']
    },
    'carlton-black': {
        name: 'Carlton Black',
        type: 'Beer',
        alcohol: 'Australian Lager',
        abv: '4.2%',
        standardDrinks: '0.9',
        ingredients: ['Malted barley', 'Hops', 'Water', 'Yeast'],
        description: 'A mid-strength lager with a smooth, easy-drinking character. One 330ml bottle contains 0.9 standard drinks.',
        nutrition: {
            calories: 110,
            carbs: 10.5,
            protein: 1.0,
            fat: 0,
            sugar: 0.4,
            servingSize: '330ml'
        },
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Lager', 'Australian', 'Mid-strength', 'Smooth']
    },
    'carlton-cold': {
        name: 'Carlton Cold',
        type: 'Beer',
        alcohol: 'Australian Lager',
        abv: '4.2%',
        standardDrinks: '0.9',
        ingredients: ['Malted barley', 'Hops', 'Water', 'Yeast'],
        description: 'A refreshing mid-strength lager designed to be served cold. One 330ml bottle contains 0.9 standard drinks.',
        nutrition: {
            calories: 110,
            carbs: 10.5,
            protein: 1.0,
            fat: 0,
            sugar: 0.4,
            servingSize: '330ml'
        },
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Lager', 'Australian', 'Mid-strength', 'Refreshing']
    },
    'carlton-draught': {
        name: 'Carlton Draught',
        type: 'Beer',
        alcohol: 'Australian Lager',
        abv: '4.6%',
        standardDrinks: '1.1',
        ingredients: ['Malted barley', 'Hops', 'Water', 'Yeast'],
        description: 'A classic Australian lager with a crisp, clean taste. One 375ml bottle contains 1.1 standard drinks.',
        nutrition: {
            calories: 135,
            carbs: 13.2,
            protein: 1.3,
            fat: 0,
            sugar: 0.6,
            servingSize: '375ml'
        },
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Lager', 'Australian', 'Classic', 'Crisp']
    },
    'carlton-dry': {
        name: 'Carlton Dry',
        type: 'Beer',
        alcohol: 'Australian Lager',
        abv: '4.5%',
        standardDrinks: '1.0',
        ingredients: ['Malted barley', 'Hops', 'Water', 'Yeast'],
        description: 'A dry, crisp lager with a clean finish. One 330ml bottle contains 1.0 standard drinks.',
        nutrition: {
            calories: 120,
            carbs: 11.5,
            protein: 1.1,
            fat: 0,
            sugar: 0.5,
            servingSize: '330ml'
        },
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Lager', 'Australian', 'Dry', 'Crisp']
    },
    'carlton-midstrength': {
        name: 'Carlton Midstrength',
        type: 'Beer',
        alcohol: 'Australian Lager',
        abv: '3.5%',
        standardDrinks: '0.7',
        ingredients: ['Malted barley', 'Hops', 'Water', 'Yeast'],
        description: 'A mid-strength lager with a smooth, easy-drinking character. One 330ml bottle contains 0.7 standard drinks.',
        nutrition: {
            calories: 90,
            carbs: 8.5,
            protein: 0.8,
            fat: 0,
            sugar: 0.3,
            servingSize: '330ml'
        },
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Lager', 'Australian', 'Mid-strength', 'Smooth']
    },
    'carlton-zero': {
        name: 'Carlton Zero',
        type: 'Beer',
        alcohol: 'Non-Alcoholic Lager',
        abv: '0.0%',
        standardDrinks: '0.0',
        ingredients: ['Malted barley', 'Hops', 'Water', 'Yeast'],
        description: 'A non-alcoholic lager with the same crisp taste as Carlton Draught. One 330ml bottle contains 0.0 standard drinks.',
        nutrition: {
            calories: 40,
            carbs: 3.5,
            protein: 0.3,
            fat: 0,
            sugar: 0.2,
            servingSize: '330ml'
        },
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Lager', 'Australian', 'Non-alcoholic', 'Crisp']
    },
    'cascade-brewery': {
        name: 'Cascade Brewery',
        type: 'Beer',
        alcohol: 'Craft Brewery',
        abv: 'Varies',
        standardDrinks: 'Varies',
        ingredients: ['Malted barley', 'Hops', 'Water', 'Yeast'],
        description: 'A historic Tasmanian brewery known for their premium lagers and traditional brewing methods. Various ABV and standard drink counts.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Craft', 'Australian', 'Tasmanian', 'Historic']
    },
    'castlemaine-brewery': {
        name: 'Castlemaine Brewery, Western Australia',
        type: 'Beer',
        alcohol: 'Craft Brewery',
        abv: 'Varies',
        standardDrinks: 'Varies',
        ingredients: ['Malted barley', 'Hops', 'Water', 'Yeast'],
        description: 'A Western Australian craft brewery with a focus on traditional brewing techniques. Various ABV and standard drink counts.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Craft', 'Australian', 'Western Australia', 'Traditional']
    },
    'castlemaine-perkins': {
        name: 'Castlemaine Perkins',
        type: 'Beer',
        alcohol: 'Major Brewery',
        abv: 'Varies',
        standardDrinks: 'Varies',
        ingredients: ['Malted barley', 'Hops', 'Water', 'Yeast'],
        description: 'A Queensland brewery known for their XXXX brand and other popular beers. Various ABV and standard drink counts.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Major Brewery', 'Australian', 'Queensland', 'XXXX']
    },
    'cbco-brewing': {
        name: 'CBCo Brewing',
        type: 'Beer',
        alcohol: 'Craft Brewery',
        abv: 'Varies',
        standardDrinks: 'Varies',
        ingredients: ['Malted barley', 'Hops', 'Water', 'Yeast'],
        description: 'A craft brewery known for their innovative beer styles and quality ingredients. Various ABV and standard drink counts.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Craft', 'Australian', 'Innovative', 'Quality']
    },
    'coopers-brewery': {
        name: 'Coopers Brewery',
        type: 'Beer',
        alcohol: 'Craft Brewery',
        abv: 'Varies',
        standardDrinks: 'Varies',
        ingredients: ['Malted barley', 'Hops', 'Water', 'Yeast'],
        description: 'A South Australian family-owned brewery known for their traditional brewing methods and cloudy beers. Various ABV and standard drink counts.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Craft', 'Australian', 'South Australia', 'Family-owned']
    },
    'crown-lager': {
        name: 'Crown Lager',
        type: 'Beer',
        alcohol: 'Premium Lager',
        abv: '4.9%',
        standardDrinks: '1.2',
        ingredients: ['Malted barley', 'Hops', 'Water', 'Yeast'],
        description: 'Australia\'s premium lager with a smooth, full-bodied taste. One 375ml bottle contains 1.2 standard drinks.',
        nutrition: {
            calories: 145,
            carbs: 14.2,
            protein: 1.4,
            fat: 0,
            sugar: 0.6,
            servingSize: '375ml'
        },
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Lager', 'Australian', 'Premium', 'Smooth']
    },
    'emu-beer': {
        name: 'Emu (beer)',
        type: 'Beer',
        alcohol: 'Australian Lager',
        abv: '4.5%',
        standardDrinks: '1.1',
        ingredients: ['Malted barley', 'Hops', 'Water', 'Yeast'],
        description: 'A classic Australian lager with a distinctive taste. One 375ml bottle contains 1.1 standard drinks.',
        nutrition: {
            calories: 135,
            carbs: 13.2,
            protein: 1.3,
            fat: 0,
            sugar: 0.6,
            servingSize: '375ml'
        },
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Lager', 'Australian', 'Classic', 'Distinctive']
    },
    'emu-brewery': {
        name: 'Emu Brewery',
        type: 'Beer',
        alcohol: 'Craft Brewery',
        abv: 'Varies',
        standardDrinks: 'Varies',
        ingredients: ['Malted barley', 'Hops', 'Water', 'Yeast'],
        description: 'A Western Australian craft brewery with a focus on traditional brewing methods. Various ABV and standard drink counts.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Craft', 'Australian', 'Western Australia', 'Traditional']
    },
    'feral-brewing': {
        name: 'Feral Brewing Company',
        type: 'Beer',
        alcohol: 'Craft Brewery',
        abv: 'Varies',
        standardDrinks: 'Varies',
        ingredients: ['Malted barley', 'Hops', 'Water', 'Yeast'],
        description: 'A Western Australian craft brewery known for their bold, hoppy beers and innovative styles. Various ABV and standard drink counts.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Craft', 'Australian', 'Western Australia', 'Bold']
    },
    'fosters-lager': {
        name: 'Foster\'s Lager',
        type: 'Beer',
        alcohol: 'Australian Lager',
        abv: '4.0%',
        standardDrinks: '0.9',
        ingredients: ['Malted barley', 'Hops', 'Water', 'Yeast'],
        description: 'An internationally recognized Australian lager with a light, refreshing taste. One 330ml bottle contains 0.9 standard drinks.',
        nutrition: {
            calories: 110,
            carbs: 10.5,
            protein: 1.0,
            fat: 0,
            sugar: 0.4,
            servingSize: '330ml'
        },
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Lager', 'Australian', 'International', 'Light']
    },
    'gage-roads-brew': {
        name: 'Gage Roads Brew Co',
        type: 'Beer',
        alcohol: 'Craft Brewery',
        abv: 'Varies',
        standardDrinks: 'Varies',
        ingredients: ['Malted barley', 'Hops', 'Water', 'Yeast'],
        description: 'A Western Australian craft brewery known for their innovative beer styles and quality ingredients. Various ABV and standard drink counts.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Craft', 'Australian', 'Western Australia', 'Innovative']
    },
    'great-northern-brewing': {
        name: 'Great Northern Brewing Co.',
        type: 'Beer',
        alcohol: 'Craft Brewery',
        abv: 'Varies',
        standardDrinks: 'Varies',
        ingredients: ['Malted barley', 'Hops', 'Water', 'Yeast'],
        description: 'A Queensland craft brewery known for their tropical-inspired beers and sessionable styles. Various ABV and standard drink counts.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Craft', 'Australian', 'Queensland', 'Tropical']
    },
    'hahn-brewery': {
        name: 'Hahn Brewery',
        type: 'Beer',
        alcohol: 'Craft Brewery',
        abv: 'Varies',
        standardDrinks: 'Varies',
        ingredients: ['Malted barley', 'Hops', 'Water', 'Yeast'],
        description: 'A New South Wales craft brewery known for their premium lagers and innovative beer styles. Various ABV and standard drink counts.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Craft', 'Australian', 'New South Wales', 'Premium']
    },
    'holgate-brewhouse': {
        name: 'Holgate Brewhouse',
        type: 'Beer',
        alcohol: 'Craft Brewery',
        abv: 'Varies',
        standardDrinks: 'Varies',
        ingredients: ['Malted barley', 'Hops', 'Water', 'Yeast'],
        description: 'A Victorian craft brewery known for their traditional brewing methods and quality beers. Various ABV and standard drink counts.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Craft', 'Australian', 'Victorian', 'Traditional']
    },
    'james-boags-premium': {
        name: 'James Boag\'s Premium',
        type: 'Beer',
        alcohol: 'Premium Lager',
        abv: '5.0%',
        standardDrinks: '1.1',
        ingredients: ['Malted barley', 'Hops', 'Water', 'Yeast'],
        description: 'A premium Tasmanian lager with a smooth, full-bodied taste. One 330ml bottle contains 1.1 standard drinks.',
        nutrition: {
            calories: 125,
            carbs: 11.5,
            protein: 1.2,
            fat: 0,
            sugar: 0.6,
            servingSize: '330ml'
        },
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Lager', 'Australian', 'Premium', 'Tasmanian']
    },
    'kalgoorlie-brewing': {
        name: 'Kalgoorlie Brewing and Ice Company',
        type: 'Beer',
        alcohol: 'Craft Brewery',
        abv: 'Varies',
        standardDrinks: 'Varies',
        ingredients: ['Malted barley', 'Hops', 'Water', 'Yeast'],
        description: 'A Western Australian craft brewery with a rich mining history. Various ABV and standard drink counts.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Craft', 'Australian', 'Western Australia', 'Historic']
    },
    'kb-lager': {
        name: 'KB Lager',
        type: 'Beer',
        alcohol: 'Australian Lager',
        abv: '4.5%',
        standardDrinks: '1.0',
        ingredients: ['Malted barley', 'Hops', 'Water', 'Yeast'],
        description: 'A classic Australian lager with a distinctive taste. One 330ml bottle contains 1.0 standard drinks.',
        nutrition: {
            calories: 120,
            carbs: 11.0,
            protein: 1.1,
            fat: 0,
            sugar: 0.5,
            servingSize: '330ml'
        },
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Lager', 'Australian', 'Classic', 'Distinctive']
    },
    'lion-brewing': {
        name: 'Lion Brewing and Malting Company',
        type: 'Beer',
        alcohol: 'Major Brewery',
        abv: 'Varies',
        standardDrinks: 'Varies',
        ingredients: ['Malted barley', 'Hops', 'Water', 'Yeast'],
        description: 'One of Australia\'s largest brewing companies, producing a wide range of popular beer brands. Various ABV and standard drink counts.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Major Brewery', 'Australian', 'Popular', 'Wide Range']
    },
    'little-creatures-brewery': {
        name: 'Little Creatures Brewery',
        type: 'Beer',
        alcohol: 'Craft Brewery',
        abv: 'Varies',
        standardDrinks: 'Varies',
        ingredients: ['Malted barley', 'Hops', 'Water', 'Yeast'],
        description: 'A Western Australian craft brewery known for their innovative beer styles and quality ingredients. Various ABV and standard drink counts.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Craft', 'Australian', 'Western Australia', 'Innovative']
    },
    'lobethal-bierhaus': {
        name: 'Lobethal Bierhaus',
        type: 'Beer',
        alcohol: 'Craft Brewery',
        abv: 'Varies',
        standardDrinks: 'Varies',
        ingredients: ['Malted barley', 'Hops', 'Water', 'Yeast'],
        description: 'A South Australian craft brewery known for their traditional German-style beers. Various ABV and standard drink counts.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Craft', 'Australian', 'South Australia', 'German-style']
    },
    'malt-shovel-brewery': {
        name: 'Malt Shovel Brewery',
        type: 'Beer',
        alcohol: 'Craft Brewery',
        abv: 'Varies',
        standardDrinks: 'Varies',
        ingredients: ['Malted barley', 'Hops', 'Water', 'Yeast'],
        description: 'A New South Wales craft brewery known for their James Squire range of beers. Various ABV and standard drink counts.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Craft', 'Australian', 'New South Wales', 'James Squire']
    },
    'mash-brewing': {
        name: 'Mash Brewing Company',
        type: 'Beer',
        alcohol: 'Craft Brewery',
        abv: 'Varies',
        standardDrinks: 'Varies',
        ingredients: ['Malted barley', 'Hops', 'Water', 'Yeast'],
        description: 'A Western Australian craft brewery known for their innovative beer styles and quality ingredients. Various ABV and standard drink counts.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Craft', 'Australian', 'Western Australia', 'Innovative']
    },
    'matilda-bay-brewing': {
        name: 'Matilda Bay Brewing Company',
        type: 'Beer',
        alcohol: 'Craft Brewery',
        abv: 'Varies',
        standardDrinks: 'Varies',
        ingredients: ['Malted barley', 'Hops', 'Water', 'Yeast'],
        description: 'A Western Australian craft brewery known for their innovative beer styles and quality ingredients. Various ABV and standard drink counts.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Craft', 'Australian', 'Western Australia', 'Innovative']
    },
    'melbourne-bitter': {
        name: 'Melbourne Bitter',
        type: 'Beer',
        alcohol: 'Australian Bitter',
        abv: '4.8%',
        standardDrinks: '1.0',
        ingredients: ['Malted barley', 'Hops', 'Water', 'Yeast'],
        description: 'A traditional Victorian bitter with a distinctive taste. One 330ml bottle contains 1.0 standard drinks.',
        nutrition: {
            calories: 120,
            carbs: 11.5,
            protein: 1.1,
            fat: 0,
            sugar: 0.5,
            servingSize: '330ml'
        },
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Bitter', 'Australian', 'Victorian', 'Traditional']
    },
    'mountain-goat-beer': {
        name: 'Mountain Goat Beer',
        type: 'Beer',
        alcohol: 'Craft Brewery',
        abv: 'Varies',
        standardDrinks: 'Varies',
        ingredients: ['Malted barley', 'Hops', 'Water', 'Yeast'],
        description: 'A Victorian craft brewery known for their innovative beer styles and quality ingredients. Various ABV and standard drink counts.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Craft', 'Australian', 'Victorian', 'Innovative']
    },
    'nail-brewing': {
        name: 'Nail Brewing',
        type: 'Beer',
        alcohol: 'Craft Brewery',
        abv: 'Varies',
        standardDrinks: 'Varies',
        ingredients: ['Malted barley', 'Hops', 'Water', 'Yeast'],
        description: 'A Western Australian craft brewery known for their innovative beer styles and quality ingredients. Various ABV and standard drink counts.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Craft', 'Australian', 'Western Australia', 'Innovative']
    },
    'nt-draught': {
        name: 'NT Draught',
        type: 'Beer',
        alcohol: 'Australian Lager',
        abv: '4.5%',
        standardDrinks: '1.0',
        ingredients: ['Malted barley', 'Hops', 'Water', 'Yeast'],
        description: 'A Northern Territory lager with a distinctive taste. One 330ml bottle contains 1.0 standard drinks.',
        nutrition: {
            calories: 120,
            carbs: 11.5,
            protein: 1.1,
            fat: 0,
            sugar: 0.5,
            servingSize: '330ml'
        },
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Lager', 'Australian', 'Northern Territory', 'Distinctive']
    },
    'pirate-life-brewing': {
        name: 'Pirate Life Brewing',
        type: 'Beer',
        alcohol: 'Craft Brewery',
        abv: 'Varies',
        standardDrinks: 'Varies',
        ingredients: ['Malted barley', 'Hops', 'Water', 'Yeast'],
        description: 'A South Australian craft brewery known for their bold, hoppy beers and innovative styles. Various ABV and standard drink counts.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Craft', 'Australian', 'South Australia', 'Bold']
    },
    'pure-blonde': {
        name: 'Pure Blonde',
        type: 'Beer',
        alcohol: 'Australian Lager',
        abv: '3.5%',
        standardDrinks: '0.7',
        ingredients: ['Malted barley', 'Hops', 'Water', 'Yeast'],
        description: 'A low-carb mid-strength lager with a light, refreshing taste. One 330ml bottle contains 0.7 standard drinks.',
        nutrition: {
            calories: 90,
            carbs: 8.5,
            protein: 0.8,
            fat: 0,
            sugar: 0.3,
            servingSize: '330ml'
        },
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Lager', 'Australian', 'Low-carb', 'Mid-strength']
    },
    'queensland-brewery': {
        name: 'Queensland Brewery Ltd',
        type: 'Beer',
        alcohol: 'Major Brewery',
        abv: 'Varies',
        standardDrinks: 'Varies',
        ingredients: ['Malted barley', 'Hops', 'Water', 'Yeast'],
        description: 'A Queensland brewery with a rich history in Australian brewing. Various ABV and standard drink counts.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Major Brewery', 'Australian', 'Queensland', 'Historic']
    },
    'reschs': {
        name: 'Resch\'s',
        type: 'Beer',
        alcohol: 'Australian Lager',
        abv: '4.5%',
        standardDrinks: '1.0',
        ingredients: ['Malted barley', 'Hops', 'Water', 'Yeast'],
        description: 'A classic New South Wales lager with a distinctive taste. One 330ml bottle contains 1.0 standard drinks.',
        nutrition: {
            calories: 120,
            carbs: 11.5,
            protein: 1.1,
            fat: 0,
            sugar: 0.5,
            servingSize: '330ml'
        },
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Lager', 'Australian', 'New South Wales', 'Classic']
    },
    'skinny-blonde': {
        name: 'Skinny Blonde',
        type: 'Beer',
        alcohol: 'Australian Lager',
        abv: '3.5%',
        standardDrinks: '0.7',
        ingredients: ['Malted barley', 'Hops', 'Water', 'Yeast'],
        description: 'A low-carb mid-strength lager with a light, refreshing taste. One 330ml bottle contains 0.7 standard drinks.',
        nutrition: {
            calories: 90,
            carbs: 8.5,
            protein: 0.8,
            fat: 0,
            sugar: 0.3,
            servingSize: '330ml'
        },
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Lager', 'Australian', 'Low-carb', 'Mid-strength']
    },
    'south-australian-brewing': {
        name: 'South Australian Brewing Company',
        type: 'Beer',
        alcohol: 'Major Brewery',
        abv: 'Varies',
        standardDrinks: 'Varies',
        ingredients: ['Malted barley', 'Hops', 'Water', 'Yeast'],
        description: 'A South Australian brewery with a rich history in Australian brewing. Various ABV and standard drink counts.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Major Brewery', 'Australian', 'South Australia', 'Historic']
    },
    'southwark-bitter': {
        name: 'Southwark Bitter',
        type: 'Beer',
        alcohol: 'Australian Bitter',
        abv: '4.8%',
        standardDrinks: '1.1',
        ingredients: ['Malted barley', 'Hops', 'Water', 'Yeast'],
        description: 'A traditional South Australian bitter with a distinctive taste. One 375ml bottle contains 1.1 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Bitter', 'Australian', 'South Australia', 'Traditional']
    },
    'st-arnou': {
        name: 'St Arnou',
        type: 'Beer',
        alcohol: 'Craft Brewery',
        abv: 'Varies',
        standardDrinks: 'Varies',
        ingredients: ['Malted barley', 'Hops', 'Water', 'Yeast'],
        description: 'A New South Wales craft brewery known for their premium lagers and traditional brewing methods. Various ABV and standard drink counts.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Craft', 'Australian', 'New South Wales', 'Premium']
    },
    'stone-wood-brewing': {
        name: 'Stone & Wood Brewing Co.',
        type: 'Beer',
        alcohol: 'Craft Brewery',
        abv: 'Varies',
        standardDrinks: 'Varies',
        ingredients: ['Malted barley', 'Hops', 'Water', 'Yeast'],
        description: 'A New South Wales craft brewery known for their Pacific Ale and other innovative beers. Various ABV and standard drink counts.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Craft', 'Australian', 'New South Wales', 'Pacific Ale']
    },
    'swan-beer': {
        name: 'Swan (beer)',
        type: 'Beer',
        alcohol: 'Australian Lager',
        abv: '4.5%',
        standardDrinks: '1.1',
        ingredients: ['Malted barley', 'Hops', 'Water', 'Yeast'],
        description: 'A classic Western Australian lager with a distinctive taste. One 375ml bottle contains 1.1 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Lager', 'Australian', 'Western Australia', 'Classic']
    },
    'swan-brewery': {
        name: 'Swan Brewery',
        type: 'Beer',
        alcohol: 'Craft Brewery',
        abv: 'Varies',
        standardDrinks: 'Varies',
        ingredients: ['Malted barley', 'Hops', 'Water', 'Yeast'],
        description: 'A Western Australian craft brewery with a rich history in Australian brewing. Various ABV and standard drink counts.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Craft', 'Australian', 'Western Australia', 'Historic']
    },
    'thunder-road-brewing': {
        name: 'Thunder Road Brewing Company',
        type: 'Beer',
        alcohol: 'Craft Brewery',
        abv: 'Varies',
        standardDrinks: 'Varies',
        ingredients: ['Malted barley', 'Hops', 'Water', 'Yeast'],
        description: 'A Victorian craft brewery known for their innovative beer styles and quality ingredients. Various ABV and standard drink counts.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Craft', 'Australian', 'Victorian', 'Innovative']
    },
    'tooheys-brewery': {
        name: 'Tooheys Brewery',
        type: 'Beer',
        alcohol: 'Major Brewery',
        abv: 'Varies',
        standardDrinks: 'Varies',
        ingredients: ['Malted barley', 'Hops', 'Water', 'Yeast'],
        description: 'A New South Wales brewery known for their popular Tooheys New and Old brands. Various ABV and standard drink counts.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Major Brewery', 'Australian', 'New South Wales', 'Popular']
    },
    'tooheys-extra-dry': {
        name: 'Tooheys Extra Dry',
        type: 'Beer',
        alcohol: 'Australian Lager',
        abv: '4.4%',
        standardDrinks: '1.0',
        ingredients: ['Malted barley', 'Hops', 'Water', 'Yeast'],
        description: 'A dry, crisp lager with a clean finish. One 375ml bottle contains 1.0 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Lager', 'Australian', 'Dry', 'Crisp']
    },
    'tooheys-new': {
        name: 'Tooheys New',
        type: 'Beer',
        alcohol: 'Australian Lager',
        abv: '4.6%',
        standardDrinks: '1.1',
        ingredients: ['Malted barley', 'Hops', 'Water', 'Yeast'],
        description: 'A classic New South Wales lager with a distinctive taste. One 375ml bottle contains 1.1 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Lager', 'Australian', 'New South Wales', 'Classic']
    },
    'tooheys-old': {
        name: 'Tooheys Old',
        type: 'Beer',
        alcohol: 'Australian Dark Lager',
        abv: '5.0%',
        standardDrinks: '1.2',
        ingredients: ['Malted barley', 'Hops', 'Water', 'Yeast'],
        description: 'A dark lager with a rich, malty taste. One 375ml bottle contains 1.2 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Dark Lager', 'Australian', 'Rich', 'Malty']
    },
    'tooth-and-co': {
        name: 'Tooth and Co.',
        type: 'Beer',
        alcohol: 'Major Brewery',
        abv: 'Varies',
        standardDrinks: 'Varies',
        ingredients: ['Malted barley', 'Hops', 'Water', 'Yeast'],
        description: 'A historic New South Wales brewery with a rich history in Australian brewing. Various ABV and standard drink counts.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Major Brewery', 'Australian', 'New South Wales', 'Historic']
    },
    'vb-gold': {
        name: 'VB Gold',
        type: 'Beer',
        alcohol: 'Australian Lager',
        abv: '3.5%',
        standardDrinks: '0.8',
        ingredients: ['Malted barley', 'Hops', 'Water', 'Yeast'],
        description: 'A mid-strength version of Victoria Bitter with the same distinctive taste. One 375ml bottle contains 0.8 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Lager', 'Australian', 'Mid-strength', 'VB']
    },
    'victoria-bitter': {
        name: 'Victoria Bitter (VB)',
        type: 'Beer',
        alcohol: 'Australian Bitter',
        abv: '4.9%',
        standardDrinks: '1.2',
        ingredients: ['Malted barley', 'Hops', 'Water', 'Yeast'],
        description: 'Australia\'s most popular beer, known for its distinctive bitter taste. One 375ml bottle contains 1.2 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Bitter', 'Australian', 'Popular', 'Classic']
    },
    'west-end-draught': {
        name: 'West End Draught',
        type: 'Beer',
        alcohol: 'Australian Lager',
        abv: '4.5%',
        standardDrinks: '1.1',
        ingredients: ['Malted barley', 'Hops', 'Water', 'Yeast'],
        description: 'A classic South Australian lager with a distinctive taste. One 375ml bottle contains 1.1 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Lager', 'Australian', 'South Australia', 'Classic']
    },
    'xxxx-beer': {
        name: 'XXXX (beer)',
        type: 'Beer',
        alcohol: 'Australian Lager',
        abv: '4.6%',
        standardDrinks: '1.1',
        ingredients: ['Malted barley', 'Hops', 'Water', 'Yeast'],
        description: 'A classic Queensland lager with a distinctive taste. One 375ml bottle contains 1.1 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Lager', 'Australian', 'Queensland', 'Classic']
    },
    'xxxx-gold': {
        name: 'XXXX Gold',
        type: 'Beer',
        alcohol: 'Australian Lager',
        abv: '3.5%',
        standardDrinks: '0.8',
        ingredients: ['Malted barley', 'Hops', 'Water', 'Yeast'],
        description: 'A mid-strength lager from Queensland, perfect for extended drinking sessions. One 375ml bottle contains 0.8 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Lager', 'Australian', 'Mid-strength', 'Queensland']
    },
    'xxxx-summer-bright': {
        name: 'XXXX Summer Bright Lager',
        type: 'Beer',
        alcohol: 'Australian Lager',
        abv: '4.2%',
        standardDrinks: '1.0',
        ingredients: ['Malted barley', 'Hops', 'Water', 'Yeast'],
        description: 'A light, refreshing lager perfect for summer drinking. One 375ml bottle contains 1.0 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Lager', 'Australian', 'Light', 'Summer']
    },
    'yatala-brewery': {
        name: 'Yatala Brewery',
        type: 'Beer',
        alcohol: 'Craft Brewery',
        abv: 'Varies',
        standardDrinks: 'Varies',
        ingredients: ['Malted barley', 'Hops', 'Water', 'Yeast'],
        description: 'A Queensland craft brewery with a rich history in Australian brewing. Various ABV and standard drink counts.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Craft', 'Australian', 'Queensland', 'Historic']
    },
    'young-henrys': {
        name: 'Young Henrys',
        type: 'Beer',
        alcohol: 'Craft Brewery',
        abv: 'Varies',
        standardDrinks: 'Varies',
        ingredients: ['Malted barley', 'Hops', 'Water', 'Yeast'],
        description: 'A New South Wales craft brewery known for their innovative beer styles and quality ingredients. Various ABV and standard drink counts.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Craft', 'Australian', 'New South Wales', 'Innovative']
    },

    // Additional Beer Varieties and Specific Brands
    'pale-ale': {
        name: 'Pale Ale',
        type: 'Beer',
        alcohol: 'Pale Ale',
        abv: '5.0%',
        standardDrinks: '1.2',
        ingredients: ['Malted barley', 'Pale malt', 'Hops', 'Water', 'Yeast'],
        description: 'A classic pale ale with balanced hop and malt character. One 330ml bottle contains 1.2 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Pale Ale', 'Classic', 'Balanced', 'Hoppy']
    },
    'pacific-ale': {
        name: 'Pacific Ale',
        type: 'Beer',
        alcohol: 'Australian Pale Ale',
        abv: '4.4%',
        standardDrinks: '1.0',
        ingredients: ['Malted barley', 'Galaxy hops', 'Water', 'Yeast'],
        description: 'A tropical pale ale with Galaxy hops providing passionfruit and citrus notes. One 330ml bottle contains 1.0 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Pale Ale', 'Australian', 'Tropical', 'Galaxy Hops']
    },
    'little-hazy': {
        name: 'Little Hazy',
        type: 'Beer',
        alcohol: 'Hazy Pale Ale',
        abv: '4.2%',
        standardDrinks: '1.0',
        ingredients: ['Malted barley', 'Wheat malt', 'Oats', 'Hops', 'Water', 'Yeast'],
        description: 'A sessionable hazy pale ale with a smooth, cloudy appearance and tropical hop character. One 330ml can contains 1.0 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Hazy Pale Ale', 'Sessionable', 'Tropical', 'Smooth']
    },
    'hazy-ipa': {
        name: 'Hazy IPA',
        type: 'Beer',
        alcohol: 'India Pale Ale',
        abv: '6.5%',
        standardDrinks: '1.5',
        ingredients: ['Malted barley', 'Wheat malt', 'Oats', 'Citra hops', 'Mosaic hops', 'Water', 'Yeast'],
        description: 'A juicy hazy IPA with intense tropical fruit and citrus hop character. One 330ml can contains 1.5 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Hazy IPA', 'Juicy', 'Tropical', 'Citrus']
    },
    'juicy-xpa': {
        name: 'Juicy XPA',
        type: 'Beer',
        alcohol: 'Extra Pale Ale',
        abv: '4.5%',
        standardDrinks: '1.1',
        ingredients: ['Malted barley', 'Citra hops', 'Mosaic hops', 'Water', 'Yeast'],
        description: 'A juicy extra pale ale with tropical fruit and citrus hop character. One 330ml can contains 1.1 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'XPA', 'Juicy', 'Tropical', 'Citrus']
    },
    'rogers-amber': {
        name: 'Rogers\' Amber',
        type: 'Beer',
        alcohol: 'Amber Ale',
        abv: '3.8%',
        standardDrinks: '0.9',
        ingredients: ['Malted barley', 'Crystal malt', 'Hops', 'Water', 'Yeast'],
        description: 'A mid-strength amber ale with caramel malt character and balanced hop bitterness. One 330ml bottle contains 0.9 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Amber Ale', 'Mid-strength', 'Caramel', 'Balanced']
    },
    'single-fin': {
        name: 'Single Fin',
        type: 'Beer',
        alcohol: 'Blonde Ale',
        abv: '4.5%',
        standardDrinks: '1.0',
        ingredients: ['Malted barley', 'Pale malt', 'Hops', 'Water', 'Yeast'],
        description: 'A smooth blonde ale with a clean, crisp finish. Features delicate notes of pale malt, gentle hop bitterness, and a touch of sweetness. Light to medium-bodied with bright carbonation and a smooth, refreshing mouthfeel. The finish is clean and crisp, making it perfect for hot weather and casual drinking. One 330ml can contains 1.0 standard drinks.',
        nutrition: {
            calories: 120,
            carbs: 11.5,
            protein: 1.1,
            fat: 0,
            sugar: 0.5,
            servingSize: '330ml'
        },
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Blonde Ale', 'Smooth', 'Clean', 'Crisp']
    },
    'air-time': {
        name: 'Air Time',
        type: 'Beer',
        alcohol: 'Session IPA',
        abv: '4.2%',
        standardDrinks: '0.9',
        ingredients: ['Malted barley', 'Citra hops', 'Mosaic hops', 'Water', 'Yeast'],
        description: 'A sessionable IPA with tropical hop character and easy-drinking profile. Features bright notes of passionfruit, mango, and citrus from Citra and Mosaic hops, balanced by light malt sweetness. Light-bodied with crisp carbonation and a smooth, refreshing mouthfeel. The hop profile is bold but the lower alcohol content makes it perfect for extended drinking sessions. One 330ml can contains 0.9 standard drinks.',
        nutrition: {
            calories: 110,
            carbs: 10.5,
            protein: 1.0,
            fat: 0,
            sugar: 0.4,
            servingSize: '330ml'
        },
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Session IPA', 'Tropical', 'Sessionable', 'Hoppy']
    },
    'pipe-dreams': {
        name: 'Pipe Dreams',
        type: 'Beer',
        alcohol: 'Pale Ale',
        abv: '5.0%',
        standardDrinks: '1.1',
        ingredients: ['Malted barley', 'Cascade hops', 'Water', 'Yeast'],
        description: 'A classic pale ale with citrus hop character and balanced malt profile. Features prominent grapefruit and orange notes from Cascade hops, balanced by caramel malt sweetness. Medium-bodied with bright carbonation and a crisp, refreshing mouthfeel. The hop bitterness is assertive but well-balanced, creating a complex and satisfying drinking experience. One 330ml can contains 1.1 standard drinks.',
        nutrition: {
            calories: 125,
            carbs: 11.5,
            protein: 1.2,
            fat: 0,
            sugar: 0.6,
            servingSize: '330ml'
        },
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Pale Ale', 'Classic', 'Citrus', 'Balanced']
    },
    'side-track': {
        name: 'Side Track',
        type: 'Beer',
        alcohol: 'Golden Ale',
        abv: '4.5%',
        standardDrinks: '1.0',
        ingredients: ['Malted barley', 'Pale malt', 'Hops', 'Water', 'Yeast'],
        description: 'A golden ale with a bright, refreshing character and subtle hop notes. Features delicate notes of pale malt, gentle hop bitterness, and a touch of honey sweetness. Light to medium-bodied with bright carbonation and a smooth, thirst-quenching mouthfeel. The finish is clean and refreshing, making it perfect for hot weather and casual drinking. One 330ml can contains 1.0 standard drinks.',
        nutrition: {
            calories: 120,
            carbs: 11.5,
            protein: 1.1,
            fat: 0,
            sugar: 0.5,
            servingSize: '330ml'
        },
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Golden Ale', 'Bright', 'Refreshing', 'Subtle']
    },
    'hazy-as': {
        name: 'Hazy As',
        type: 'Beer',
        alcohol: 'Hazy IPA',
        abv: '6.0%',
        standardDrinks: '1.3',
        ingredients: ['Malted barley', 'Wheat malt', 'Oats', 'Citra hops', 'Mosaic hops', 'Water', 'Yeast'],
        description: 'A hazy IPA with intense tropical fruit and citrus hop character. Features explosive notes of passionfruit, mango, and grapefruit from Citra and Mosaic hops, with a smooth, creamy mouthfeel from the hazy appearance and oat addition. Medium-bodied with bright carbonation and a smooth, pillowy texture. The finish is juicy and smooth with minimal bitterness, characteristic of the New England IPA style. One 330ml can contains 1.3 standard drinks.',
        nutrition: {
            calories: 165,
            carbs: 16.5,
            protein: 1.6,
            fat: 0,
            sugar: 0.8,
            servingSize: '330ml'
        },
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Hazy IPA', 'Tropical', 'Citrus', 'Juicy']
    },
    'yeah-buoy': {
        name: 'Yeah Buoy',
        type: 'Beer',
        alcohol: 'Pale Ale',
        abv: '4.8%',
        standardDrinks: '1.0',
        ingredients: ['Malted barley', 'Galaxy hops', 'Water', 'Yeast'],
        description: 'A tropical pale ale with Galaxy hops providing passionfruit and citrus notes. Features intense notes of passionfruit, mango, and citrus from Galaxy hops, balanced by caramel malt sweetness. Medium-bodied with bright carbonation and a smooth, refreshing mouthfeel. The hop profile is bold yet approachable, creating a refreshing and aromatic drinking experience. Perfect for showcasing Australian hop varieties and tropical fruit lovers. One 330ml can contains 1.0 standard drinks.',
        nutrition: {
            calories: 125,
            carbs: 12.0,
            protein: 1.2,
            fat: 0,
            sugar: 0.6,
            servingSize: '330ml'
        },
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Pale Ale', 'Tropical', 'Galaxy Hops', 'Passionfruit']
    },
    'pinkys-sunset': {
        name: 'Pinky\'s Sunset',
        type: 'Cider',
        alcohol: 'Apple Cider',
        abv: '4.5%',
        standardDrinks: '1.1',
        ingredients: ['Apple juice', 'Yeast', 'Natural flavors'],
        description: 'A refreshing apple cider with natural fruit flavors. One 330ml can contains 1.1 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Cider', 'Apple', 'Refreshing', 'Natural', 'Fruity']
    },
    'hop-hog': {
        name: 'Hop Hog',
        type: 'Beer',
        alcohol: 'India Pale Ale',
        abv: '5.8%',
        standardDrinks: '1.4',
        ingredients: ['Malted barley', 'Citra hops', 'Mosaic hops', 'Simcoe hops', 'Water', 'Yeast'],
        description: 'A bold IPA with intense hop character and tropical fruit notes. One 330ml bottle contains 1.4 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'IPA', 'Bold', 'Hoppy', 'Tropical']
    },
    'biggie-juice': {
        name: 'Biggie Juice',
        type: 'Beer',
        alcohol: 'Double IPA',
        abv: '8.0%',
        standardDrinks: '1.9',
        ingredients: ['Malted barley', 'Citra hops', 'Mosaic hops', 'Simcoe hops', 'Water', 'Yeast'],
        description: 'A big, juicy double IPA with intense tropical fruit and citrus hop character. One 330ml can contains 1.9 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Double IPA', 'Juicy', 'Tropical', 'High ABV']
    },
    'war-hog': {
        name: 'War Hog',
        type: 'Beer',
        alcohol: 'Imperial IPA',
        abv: '8.8%',
        standardDrinks: '2.1',
        ingredients: ['Malted barley', 'Citra hops', 'Mosaic hops', 'Simcoe hops', 'Water', 'Yeast'],
        description: 'An imperial IPA with massive hop character and tropical fruit notes. One 330ml bottle contains 2.1 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Imperial IPA', 'Massive', 'Hoppy', 'Tropical']
    },
    'raging-flem': {
        name: 'Raging Flem',
        type: 'Beer',
        alcohol: 'Belgian Strong Ale',
        abv: '8.5%',
        standardDrinks: '2.0',
        ingredients: ['Malted barley', 'Belgian yeast', 'Hops', 'Water', 'Yeast'],
        description: 'A Belgian-style strong ale with complex flavors and high alcohol content. One 330ml bottle contains 2.0 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Belgian Strong Ale', 'Complex', 'High ABV', 'Belgian-style']
    },
    'feral-white': {
        name: 'Feral White',
        type: 'Beer',
        alcohol: 'Wheat Beer',
        abv: '4.7%',
        standardDrinks: '1.1',
        ingredients: ['Wheat malt', 'Malted barley', 'Coriander', 'Orange peel', 'Water', 'Yeast'],
        description: 'A Belgian-style wheat beer with coriander and orange peel. One 330ml bottle contains 1.1 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Wheat Beer', 'Belgian-style', 'Coriander', 'Orange']
    },
    'golden-ace': {
        name: 'Golden Ace',
        type: 'Beer',
        alcohol: 'Golden Ale',
        abv: '4.5%',
        standardDrinks: '1.1',
        ingredients: ['Malted barley', 'Pale malt', 'Hops', 'Water', 'Yeast'],
        description: 'A golden ale with a bright, refreshing character and subtle hop notes. One 330ml can contains 1.1 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Golden Ale', 'Bright', 'Refreshing', 'Subtle']
    },
    'smoked-porter': {
        name: 'Smoked Porter',
        type: 'Beer',
        alcohol: 'Porter',
        abv: '5.5%',
        standardDrinks: '1.3',
        ingredients: ['Malted barley', 'Smoked malt', 'Chocolate malt', 'Hops', 'Water', 'Yeast'],
        description: 'A rich porter with smoky character and chocolate malt notes. One 330ml bottle contains 1.3 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Porter', 'Smoky', 'Rich', 'Chocolate']
    },
    'watermelon-warhead': {
        name: 'Watermelon Warhead',
        type: 'Beer',
        alcohol: 'Sour Ale',
        abv: '4.0%',
        standardDrinks: '1.0',
        ingredients: ['Wheat malt', 'Malted barley', 'Watermelon', 'Lactobacillus', 'Water', 'Yeast'],
        description: 'A tart sour ale with watermelon character and refreshing acidity. One 330ml can contains 1.0 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Sour Ale', 'Watermelon', 'Tart', 'Refreshing']
    },
    'runt': {
        name: 'Runt',
        type: 'Beer',
        alcohol: 'Session IPA',
        abv: '3.8%',
        standardDrinks: '0.9',
        ingredients: ['Malted barley', 'Citra hops', 'Mosaic hops', 'Water', 'Yeast'],
        description: 'A sessionable IPA with tropical hop character and low alcohol content. One 330ml can contains 0.9 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Session IPA', 'Tropical', 'Sessionable', 'Low ABV']
    },
    'rust': {
        name: 'Rust',
        type: 'Beer',
        alcohol: 'Amber Ale',
        abv: '5.0%',
        standardDrinks: '1.2',
        ingredients: ['Malted barley', 'Crystal malt', 'Hops', 'Water', 'Yeast'],
        description: 'An amber ale with caramel malt character and balanced hop bitterness. One 330ml can contains 1.2 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Amber Ale', 'Caramel', 'Balanced', 'Malty']
    },
    'karma-citra': {
        name: 'Karma Citra',
        type: 'Beer',
        alcohol: 'India Pale Ale',
        abv: '6.0%',
        standardDrinks: '1.4',
        ingredients: ['Malted barley', 'Citra hops', 'Water', 'Yeast'],
        description: 'An IPA showcasing Citra hops with intense citrus and tropical fruit character. One 330ml can contains 1.4 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'IPA', 'Citra Hops', 'Citrus', 'Tropical']
    },
    'fantapants': {
        name: 'Fantapants',
        type: 'Beer',
        alcohol: 'Pale Ale',
        abv: '4.8%',
        standardDrinks: '1.1',
        ingredients: ['Malted barley', 'Galaxy hops', 'Water', 'Yeast'],
        description: 'A tropical pale ale with Galaxy hops providing passionfruit and citrus notes. One 330ml can contains 1.1 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Pale Ale', 'Tropical', 'Galaxy Hops', 'Passionfruit']
    },
    'razorback': {
        name: 'Razorback',
        type: 'Beer',
        alcohol: 'India Pale Ale',
        abv: '6.2%',
        standardDrinks: '1.5',
        ingredients: ['Malted barley', 'Citra hops', 'Mosaic hops', 'Simcoe hops', 'Water', 'Yeast'],
        description: 'A bold IPA with intense hop character and tropical fruit notes. One 330ml can contains 1.5 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'IPA', 'Bold', 'Hoppy', 'Tropical']
    },
    'boris': {
        name: 'Boris',
        type: 'Beer',
        alcohol: 'Russian Imperial Stout',
        abv: '9.0%',
        standardDrinks: '2.1',
        ingredients: ['Malted barley', 'Chocolate malt', 'Roasted barley', 'Hops', 'Water', 'Yeast'],
        description: 'A rich Russian imperial stout with chocolate and coffee notes. One 330ml bottle contains 2.1 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Russian Imperial Stout', 'Rich', 'Chocolate', 'Coffee']
    },
    'amber': {
        name: 'Amber',
        type: 'Beer',
        alcohol: 'Amber Ale',
        abv: '5.0%',
        standardDrinks: '1.2',
        ingredients: ['Malted barley', 'Crystal malt', 'Hops', 'Water', 'Yeast'],
        description: 'A classic amber ale with caramel malt character and balanced hop bitterness. One 330ml can contains 1.2 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Amber Ale', 'Classic', 'Caramel', 'Balanced']
    },
    'bfh': {
        name: 'B.F.H',
        type: 'Beer',
        alcohol: 'India Pale Ale',
        abv: '6.5%',
        standardDrinks: '1.5',
        ingredients: ['Malted barley', 'Citra hops', 'Mosaic hops', 'Simcoe hops', 'Water', 'Yeast'],
        description: 'A bold IPA with intense hop character and tropical fruit notes. One 330ml can contains 1.5 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'IPA', 'Bold', 'Hoppy', 'Tropical']
    },
    'white-hog': {
        name: 'White Hog',
        type: 'Beer',
        alcohol: 'Wheat Beer',
        abv: '4.7%',
        standardDrinks: '1.1',
        ingredients: ['Wheat malt', 'Malted barley', 'Coriander', 'Orange peel', 'Water', 'Yeast'],
        description: 'A Belgian-style wheat beer with coriander and orange peel. One 330ml can contains 1.1 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Wheat Beer', 'Belgian-style', 'Coriander', 'Orange']
    },
    'matsos-ginger-beer': {
        name: 'Matsos Ginger Beer',
        type: 'Non-Alcoholic',
        alcohol: 'Ginger Beer',
        abv: '0.0%',
        standardDrinks: '0.0',
        ingredients: ['Ginger', 'Sugar', 'Water', 'Natural flavors'],
        description: 'A refreshing non-alcoholic ginger beer with natural ginger flavor. One 330ml bottle contains 0.0 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Non-Alcoholic', 'Ginger Beer', 'Refreshing', 'Natural', 'Spicy']
    },
    'swan-draught': {
        name: 'Swan Draught',
        type: 'Beer',
        alcohol: 'Australian Lager',
        abv: '4.5%',
        standardDrinks: '1.1',
        ingredients: ['Malted barley', 'Hops', 'Water', 'Yeast'],
        description: 'A classic Western Australian lager with a distinctive malty sweetness and subtle hop bitterness. Features notes of caramel, toasted bread, and a hint of citrus. Medium-bodied with a smooth, clean finish and moderate carbonation. Perfect for pairing with pub food or enjoying on a hot day. One 375ml bottle contains 1.1 standard drinks.',
        nutrition: {
            calories: 135,
            carbs: 12.5,
            protein: 1.2,
            fat: 0,
            sugar: 0.5,
            servingSize: '375ml'
        },
        image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
        tags: ['Beer', 'Lager', 'Australian', 'Western Australia', 'Classic']
    },
    'carlton-dry': {
        name: 'Carlton Dry',
        type: 'Beer',
        alcohol: 'Australian Lager',
        abv: '4.5%',
        standardDrinks: '1.1',
        ingredients: ['Malted barley', 'Hops', 'Water', 'Yeast'],
        description: 'A premium dry lager with exceptional crispness and a clean, refreshing finish. Features subtle notes of grain, light floral hops, and a touch of sweetness that quickly dries out. Light to medium-bodied with high carbonation and a smooth, thirst-quenching mouthfeel. The finish is clean and dry, making it perfect for hot weather or as a palate cleanser. One 375ml bottle contains 1.1 standard drinks.',
        image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
        tags: ['Beer', 'Lager', 'Australian', 'Dry', 'Crisp']
    },
    'great-northern': {
        name: 'Great Northern',
        type: 'Beer',
        alcohol: 'Australian Lager',
        abv: '4.2%',
        standardDrinks: '1.0',
        ingredients: ['Malted barley', 'Hops', 'Water', 'Yeast'],
        description: 'A light, refreshing lager with a crisp, clean profile perfect for hot weather. Features delicate notes of pale malt, subtle citrus hops, and a hint of honey sweetness. Light-bodied with bright carbonation and a smooth, thirst-quenching mouthfeel. The finish is clean and refreshing with minimal bitterness, making it ideal for outdoor activities and casual drinking. One 330ml bottle contains 1.0 standard drinks.',
        nutrition: {
            calories: 120,
            carbs: 11.2,
            protein: 1.0,
            fat: 0,
            sugar: 0.4,
            servingSize: '330ml'
        },
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Lager', 'Australian', 'Light', 'Refreshing']
    },
    'great-northern-mid': {
        name: 'Great Northern Mid',
        type: 'Beer',
        alcohol: 'Australian Lager',
        abv: '3.5%',
        standardDrinks: '0.8',
        ingredients: ['Malted barley', 'Hops', 'Water', 'Yeast'],
        description: 'A mid-strength version of Great Northern with the same refreshing character and lighter alcohol content. Features the same crisp, clean profile with delicate pale malt notes and subtle citrus hops. Light-bodied with bright carbonation and a smooth, thirst-quenching mouthfeel. Perfect for extended drinking sessions while maintaining the refreshing character of the original. One 330ml bottle contains 0.8 standard drinks.',
        nutrition: {
            calories: 100,
            carbs: 9.5,
            protein: 0.8,
            fat: 0,
            sugar: 0.3,
            servingSize: '330ml'
        },
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Lager', 'Australian', 'Mid-strength', 'Refreshing']
    },
    'varsity-lager': {
        name: 'Varsity Lager',
        type: 'Beer',
        alcohol: 'Low-Carb Lager',
        abv: '4.2%',
        standardDrinks: '1.0',
        ingredients: ['Malted barley', 'Hops', 'Water', 'Yeast', 'Enzymes for low-carb'],
        description: 'A low-carb Australian lager with a crisp, clean taste and smooth finish. Features subtle malt notes with minimal sweetness, balanced by light hop bitterness. Light-bodied with bright carbonation and a clean, dry mouthfeel. The reduced carbohydrate content makes it ideal for those watching their carb intake while still enjoying a full-flavored beer. One 330ml bottle contains 1.0 standard drinks.',
        nutrition: {
            calories: 95,
            carbs: 2.8,
            protein: 0.8,
            fat: 0,
            sugar: 0.2,
            servingSize: '330ml'
        },
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Beer', 'Lager', 'Australian', 'Low-Carb', 'Crisp', 'Clean']
    },
    'sommersby': {
        name: 'Sommersby',
        type: 'Cider',
        alcohol: 'Apple Cider',
        abv: '4.5%',
        standardDrinks: '1.2',
        ingredients: ['Apple juice', 'Water', 'Sugar', 'Yeast', 'Natural flavors'],
        description: 'A refreshing apple cider with a crisp, fruity taste and natural apple sweetness. Features bright notes of fresh apples, subtle tartness, and a hint of floral character. Light-bodied with effervescent carbonation and a smooth, refreshing mouthfeel. The finish is clean and slightly sweet, making it perfect for warm weather and casual drinking. One 330ml can contains 1.2 standard drinks.',
        nutrition: {
            calories: 145,
            carbs: 15.2,
            protein: 0.1,
            fat: 0,
            sugar: 12.8,
            servingSize: '330ml'
        },
        image: 'https://images.unsplash.com/photo-1624368432852-ee84d0c87b3b?w=400&h=300&fit=crop',
        tags: ['Cider', 'Apple', 'Refreshing', 'Fruity', 'Light']
    },
    'minus196-premix': {
        name: '-196 Premix',
        type: 'RTD',
        alcohol: 'Vodka',
        abv: '6.0%',
        standardDrinks: '1.4',
        ingredients: ['Vodka', 'Natural flavors', 'Carbonated water', 'Sugar', 'Citric acid'],
        description: 'A premium ready-to-drink vodka premix with natural flavors and smooth character. Features clean vodka notes, subtle citrus flavors, and a touch of sweetness balanced by crisp carbonation. Light-bodied with bright carbonation and a smooth, refreshing mouthfeel. The finish is clean and crisp with minimal alcohol burn, making it perfect for casual drinking and social occasions. One 330ml can contains 1.4 standard drinks.',
        nutrition: {
            calories: 155,
            carbs: 16.5,
            protein: 0,
            fat: 0,
            sugar: 14.2,
            servingSize: '330ml'
        },
        image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=300&fit=crop',
        tags: ['RTD', 'Vodka', 'Premix', 'Premium', 'Smooth']
    },
    'hard-solo': {
        name: 'Hard Solo',
        type: 'RTD',
        alcohol: 'Vodka',
        abv: '4.5%',
        standardDrinks: '1.1',
        ingredients: ['Vodka', 'Lemon flavoring', 'Carbonated water', 'Sugar', 'Natural flavors'],
        description: 'A hard lemonade version of the classic Solo soft drink. Features bright lemon citrus notes, tangy acidity, and a subtle sweetness balanced by clean vodka character. Light-bodied with bright carbonation and a refreshing, thirst-quenching mouthfeel. The finish is crisp and tangy with lingering lemon notes. Perfect for hot weather and outdoor activities. One 330ml can contains 1.1 standard drinks.',
        nutrition: {
            calories: 142,
            carbs: 15.8,
            protein: 0,
            fat: 0,
            sugar: 13.5,
            servingSize: '330ml'
        },
        image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=400&h=300&fit=crop',
        tags: ['RTD', 'Vodka', 'Lemon', 'Tangy', 'Refreshing']
    },
    'bundaberg-rum-cola': {
        name: 'Bundaberg Rum & Cola',
        type: 'RTD',
        alcohol: 'Rum',
        abv: '5.5%',
        standardDrinks: '1.3',
        ingredients: ['Bundaberg Rum', 'Cola', 'Carbonated water', 'Sugar', 'Natural flavors'],
        description: 'A classic rum and cola premix featuring Bundaberg Rum. Features rich caramel and vanilla notes from the rum, balanced by sweet cola flavors and subtle spice. Medium-bodied with smooth carbonation and a creamy, satisfying mouthfeel. The finish is sweet and smooth with lingering rum character. Perfect for those who enjoy classic cocktails in convenient form. One 330ml can contains 1.3 standard drinks.',
        nutrition: {
            calories: 165,
            carbs: 18.2,
            protein: 0,
            fat: 0,
            sugar: 16.8,
            servingSize: '330ml'
        },
        image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=300&fit=crop',
        tags: ['RTD', 'Rum', 'Cola', 'Bundaberg', 'Classic']
    },
    'jack-daniels-cola': {
        name: 'Jack Daniels & Cola',
        type: 'RTD',
        alcohol: 'Whiskey',
        abv: '5.5%',
        standardDrinks: '1.3',
        ingredients: ['Jack Daniels Tennessee Whiskey', 'Cola', 'Carbonated water', 'Sugar', 'Natural flavors'],
        description: 'A premium whiskey and cola premix featuring Jack Daniels. Features rich caramel, vanilla, and oak notes from the Tennessee whiskey, balanced by sweet cola flavors and subtle spice. Medium-bodied with smooth carbonation and a creamy, satisfying mouthfeel. The finish is smooth and warming with lingering whiskey character. Perfect for whiskey enthusiasts who want convenience without compromising on quality. One 330ml can contains 1.3 standard drinks.',
        nutrition: {
            calories: 168,
            carbs: 18.5,
            protein: 0,
            fat: 0,
            sugar: 17.2,
            servingSize: '330ml'
        },
        image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=300&fit=crop',
        tags: ['RTD', 'Whiskey', 'Cola', 'Jack Daniels', 'Premium']
    },

    // Cocktails with enhanced information
    'margarita': {
        name: 'Margarita',
        type: 'Cocktail',
        alcohol: 'Tequila',
        abv: '15-20%',
        standardDrinks: '1.5',
        ingredients: ['Tequila (2 oz)', 'Lime juice (1 oz)', 'Triple sec (1 oz)', 'Salt rim'],
        description: 'A refreshing cocktail made with tequila, lime juice, and triple sec, typically served with salt on the rim. Features bright citrus notes from fresh lime juice, smooth agave character from tequila, and a touch of sweetness from triple sec. Light-bodied with bright acidity and a crisp, refreshing mouthfeel. The salt rim enhances the flavors and adds complexity. The finish is tart and refreshing with lingering citrus notes. Perfect for warm weather and Mexican cuisine. One standard margarita contains 1.5 standard drinks.',
        nutrition: {
            calories: 168,
            carbs: 8.5,
            protein: 0.2,
            fat: 0,
            sugar: 6.2,
            servingSize: '4 oz'
        },
        image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
        tags: ['Cocktail', 'Tequila', 'Citrus', 'Classic', 'Refreshing']
    },
    'mojito': {
        name: 'Mojito',
        type: 'Cocktail',
        alcohol: 'Rum',
        abv: '12-15%',
        standardDrinks: '1.2',
        ingredients: ['White rum (2 oz)', 'Lime juice (1 oz)', 'Mint leaves', 'Sugar (1 tsp)', 'Soda water'],
        description: 'A traditional Cuban highball cocktail with white rum, sugar, lime juice, soda water, and mint. Features bright citrus notes from fresh lime juice, herbal freshness from muddled mint, and a subtle sweetness balanced by the crisp soda water. Light and refreshing with a clean, cooling finish. Perfect for hot weather and outdoor gatherings. The mint garnish adds aromatic complexity. One standard mojito contains 1.2 standard drinks.',
        nutrition: {
            calories: 148,
            carbs: 8.2,
            protein: 0.1,
            fat: 0,
            sugar: 7.8,
            servingSize: '4 oz'
        },
        image: 'https://images.unsplash.com/photo-1624368432852-ee84d0c87b3b?w=400&h=300&fit=crop',
        tags: ['Cocktail', 'Rum', 'Mint', 'Refreshing', 'Cuban']
    },
    'oldfashioned': {
        name: 'Old Fashioned',
        type: 'Cocktail',
        alcohol: 'Whiskey',
        abv: '25-30%',
        standardDrinks: '1.8',
        ingredients: ['Bourbon whiskey (2 oz)', 'Angostura bitters (2-3 dashes)', 'Sugar cube', 'Orange peel'],
        description: 'A classic whiskey cocktail with bourbon, bitters, sugar, and orange peel. Features rich caramel and vanilla notes from bourbon, complex spice from Angostura bitters, and a subtle sweetness. Full-bodied with a smooth, warming mouthfeel. The orange peel garnish adds bright citrus aromas. The finish is long and complex with lingering oak and spice notes. Perfect for sipping and sophisticated occasions. One standard old fashioned contains 1.8 standard drinks.',
        nutrition: {
            calories: 135,
            carbs: 0.4,
            protein: 0,
            fat: 0,
            sugar: 0,
            servingSize: '3 oz'
        },
        image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=300&fit=crop',
        tags: ['Cocktail', 'Whiskey', 'Classic', 'Bourbon', 'Sophisticated']
    },
    'negroni': {
        name: 'Negroni',
        type: 'Cocktail',
        alcohol: 'Gin',
        abv: '20-25%',
        standardDrinks: '1.5',
        ingredients: ['Gin (1 oz)', 'Campari (1 oz)', 'Sweet vermouth (1 oz)', 'Orange peel'],
        description: 'An Italian cocktail with equal parts gin, Campari, and sweet vermouth. Features juniper and citrus notes from gin, bitter orange and herbs from Campari, and rich fruit and spice from vermouth. Medium-bodied with a complex, layered mouthfeel. The finish is bitter and sophisticated with lingering herbal and citrus notes. The orange peel garnish adds bright aromas. Perfect for aperitivo and sophisticated drinking. One standard negroni contains 1.5 standard drinks.',
        nutrition: {
            calories: 128,
            carbs: 0.2,
            protein: 0,
            fat: 0,
            sugar: 0,
            servingSize: '3 oz'
        },
        image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=400&h=300&fit=crop',
        tags: ['Cocktail', 'Gin', 'Italian', 'Bitter', 'Classic']
    },
    'manhattan': {
        name: 'Manhattan',
        type: 'Cocktail',
        alcohol: 'Whiskey',
        abv: '25-30%',
        standardDrinks: '1.8',
        ingredients: ['Rye whiskey (2 oz)', 'Sweet vermouth (1 oz)', 'Angostura bitters (2-3 dashes)', 'Cherry garnish'],
        description: 'A classic whiskey cocktail with rye, sweet vermouth, and bitters. Features spicy rye notes, rich fruit and spice from vermouth, and complex bitterness from Angostura bitters. Full-bodied with a smooth, warming mouthfeel. The cherry garnish adds a touch of sweetness and visual appeal. The finish is long and sophisticated with lingering spice and fruit notes. Perfect for elegant occasions and whiskey enthusiasts. One standard manhattan contains 1.8 standard drinks.',
        nutrition: {
            calories: 132,
            carbs: 0.3,
            protein: 0,
            fat: 0,
            sugar: 0,
            servingSize: '3 oz'
        },
        image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=400&h=300&fit=crop',
        tags: ['Cocktail', 'Whiskey', 'Classic', 'Rye', 'Sophisticated']
    },

    // Top 100 Cocktails (1-25)
    'daiquiri': {
        name: 'Daiquiri',
        type: 'Cocktail',
        alcohol: 'Rum',
        abv: '15-20%',
        standardDrinks: '1.4',
        ingredients: ['White rum (2 oz)', 'Lime juice (1 oz)', 'Simple syrup (0.75 oz)'],
        description: 'A classic Cuban cocktail with rum, lime juice, and simple syrup. Features bright citrus notes from fresh lime juice, subtle sweetness from simple syrup, and smooth rum character. Light and refreshing with a crisp, clean mouthfeel. The finish is tart and refreshing with lingering citrus notes. Perfect for warm weather and tropical vibes. The simple preparation highlights the quality of the rum. One standard daiquiri contains 1.4 standard drinks.',
        nutrition: {
            calories: 145,
            carbs: 7.2,
            protein: 0.1,
            fat: 0,
            sugar: 6.8,
            servingSize: '3 oz'
        },
        image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
        tags: ['Cocktail', 'Rum', 'Classic', 'Cuban', 'Citrus']
    },
    'martini': {
        name: 'Martini',
        type: 'Cocktail',
        alcohol: 'Gin',
        abv: '25-30%',
        standardDrinks: '1.8',
        ingredients: ['Gin (2.5 oz)', 'Dry vermouth (0.5 oz)', 'Lemon twist or olive garnish'],
        description: 'The quintessential cocktail with gin and dry vermouth. One standard martini contains 1.8 standard drinks.',
        nutrition: {
            calories: 124,
            carbs: 0.2,
            protein: 0,
            fat: 0,
            sugar: 0,
            servingSize: '3 oz'
        },
        image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=400&h=300&fit=crop',
        tags: ['Cocktail', 'Gin', 'Classic', 'Sophisticated', 'Iconic']
    },
    'gin-and-tonic': {
        name: 'Gin & Tonic',
        type: 'Cocktail',
        alcohol: 'Gin',
        abv: '8-12%',
        standardDrinks: '1.2',
        ingredients: ['Gin (2 oz)', 'Tonic water (4-6 oz)', 'Lime wedge'],
        description: 'A refreshing highball cocktail with gin and tonic water. One standard gin & tonic contains 1.2 standard drinks.',
        nutrition: {
            calories: 142,
            carbs: 7.8,
            protein: 0,
            fat: 0,
            sugar: 7.1,
            servingSize: '4 oz'
        },
        image: 'https://images.unsplash.com/photo-1624368432852-ee84d0c87b3b?w=400&h=300&fit=crop',
        tags: ['Cocktail', 'Gin', 'Refreshing', 'Highball', 'Classic']
    },
    'whiskey-sour': {
        name: 'Whiskey Sour',
        type: 'Cocktail',
        alcohol: 'Whiskey',
        abv: '15-20%',
        standardDrinks: '1.4',
        ingredients: ['Bourbon whiskey (2 oz)', 'Lemon juice (1 oz)', 'Simple syrup (0.75 oz)', 'Egg white (optional)'],
        description: 'A classic sour cocktail with bourbon, lemon juice, and simple syrup. One standard whiskey sour contains 1.4 standard drinks.',
        nutrition: {
            calories: 158,
            carbs: 8.2,
            protein: 0.1,
            fat: 0,
            sugar: 7.5,
            servingSize: '3 oz'
        },
        image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=300&fit=crop',
        tags: ['Cocktail', 'Whiskey', 'Sour', 'Classic', 'Bourbon']
    },
    'sidecar': {
        name: 'Sidecar',
        type: 'Cocktail',
        alcohol: 'Cognac',
        abv: '20-25%',
        standardDrinks: '1.6',
        ingredients: ['Cognac (2 oz)', 'Cointreau (0.75 oz)', 'Lemon juice (0.75 oz)', 'Sugar rim'],
        description: 'A sophisticated cocktail with cognac, Cointreau, and lemon juice. One standard sidecar contains 1.6 standard drinks.',
        nutrition: {
            calories: 165,
            carbs: 8.5,
            protein: 0.1,
            fat: 0,
            sugar: 7.8,
            servingSize: '3 oz'
        },
        image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
        tags: ['Cocktail', 'Cognac', 'Sophisticated', 'French', 'Citrus']
    },
    'gimlet': {
        name: 'Gimlet',
        type: 'Cocktail',
        alcohol: 'Gin',
        abv: '20-25%',
        standardDrinks: '1.6',
        ingredients: ['Gin (2 oz)', 'Lime cordial (0.75 oz)', 'Lime wheel garnish'],
        description: 'A classic gin cocktail with lime cordial. One standard gimlet contains 1.6 standard drinks.',
        nutrition: {
            calories: 155,
            carbs: 8.2,
            protein: 0.1,
            fat: 0,
            sugar: 7.5,
            servingSize: '3 oz'
        },
        image: 'https://images.unsplash.com/photo-1624368432852-ee84d0c87b3b?w=400&h=300&fit=crop',
        tags: ['Cocktail', 'Gin', 'Classic', 'Lime', 'Refreshing']
    },
    'sazerac': {
        name: 'Sazerac',
        type: 'Cocktail',
        alcohol: 'Whiskey',
        abv: '25-30%',
        standardDrinks: '1.8',
        ingredients: ['Rye whiskey (2 oz)', 'Peychaud\'s bitters (3 dashes)', 'Absinthe rinse', 'Sugar cube', 'Lemon peel'],
        description: 'A New Orleans classic with rye whiskey, absinthe, and bitters. One standard sazerac contains 1.8 standard drinks.',
        nutrition: {
            calories: 138,
            carbs: 0.3,
            protein: 0,
            fat: 0,
            sugar: 0,
            servingSize: '3 oz'
        },
        image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=300&fit=crop',
        tags: ['Cocktail', 'Whiskey', 'New Orleans', 'Classic', 'Absinthe']
    },
    'boulevardier': {
        name: 'Boulevardier',
        type: 'Cocktail',
        alcohol: 'Whiskey',
        abv: '25-30%',
        standardDrinks: '1.8',
        ingredients: ['Bourbon whiskey (1.5 oz)', 'Campari (1 oz)', 'Sweet vermouth (1 oz)', 'Orange peel'],
        description: 'A whiskey variation of the Negroni with bourbon instead of gin. One standard boulevardier contains 1.8 standard drinks.',
        nutrition: {
            calories: 142,
            carbs: 0.4,
            protein: 0,
            fat: 0,
            sugar: 0,
            servingSize: '3 oz'
        },
        image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=400&h=300&fit=crop',
        tags: ['Cocktail', 'Whiskey', 'Bourbon', 'Bitter', 'Sophisticated']
    },
    'aviation': {
        name: 'Aviation',
        type: 'Cocktail',
        alcohol: 'Gin',
        abv: '20-25%',
        standardDrinks: '1.6',
        ingredients: ['Gin (2 oz)', 'Lemon juice (0.75 oz)', 'Maraschino liqueur (0.5 oz)', 'Crème de violette (0.25 oz)'],
        description: 'A classic gin cocktail with a beautiful purple hue. One standard aviation contains 1.6 standard drinks.',
        image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
        tags: ['Cocktail', 'Gin', 'Classic', 'Purple', 'Sophisticated']
    },
    'last-word': {
        name: 'Last Word',
        type: 'Cocktail',
        alcohol: 'Gin',
        abv: '20-25%',
        standardDrinks: '1.6',
        ingredients: ['Gin (0.75 oz)', 'Green Chartreuse (0.75 oz)', 'Maraschino liqueur (0.75 oz)', 'Lime juice (0.75 oz)'],
        description: 'A complex gin cocktail with equal parts of four ingredients. One standard last word contains 1.6 standard drinks.',
        image: 'https://images.unsplash.com/photo-1624368432852-ee84d0c87b3b?w=400&h=300&fit=crop',
        tags: ['Cocktail', 'Gin', 'Complex', 'Equal Parts', 'Chartreuse']
    },
    'corpse-reviver-2': {
        name: 'Corpse Reviver No. 2',
        type: 'Cocktail',
        alcohol: 'Gin',
        abv: '20-25%',
        standardDrinks: '1.6',
        ingredients: ['Gin (0.75 oz)', 'Cointreau (0.75 oz)', 'Lillet Blanc (0.75 oz)', 'Lemon juice (0.75 oz)', 'Absinthe rinse'],
        description: 'A classic equal-parts cocktail with a complex flavor profile. One standard corpse reviver contains 1.6 standard drinks.',
        image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
        tags: ['Cocktail', 'Gin', 'Equal Parts', 'Complex', 'Classic']
    },
    'penicillin': {
        name: 'Penicillin',
        type: 'Cocktail',
        alcohol: 'Whiskey',
        abv: '15-20%',
        standardDrinks: '1.4',
        ingredients: ['Blended Scotch (2 oz)', 'Lemon juice (0.375 oz)', 'Honey syrup (0.375 oz)', 'Islay Scotch float (0.25 oz)', 'Ginger syrup (0.375 oz)'],
        description: 'A modern classic with Scotch, honey, ginger, and lemon. One standard penicillin contains 1.4 standard drinks.',
        image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=300&fit=crop',
        tags: ['Cocktail', 'Whiskey', 'Scotch', 'Modern', 'Ginger']
    },
    'paper-plane': {
        name: 'Paper Plane',
        type: 'Cocktail',
        alcohol: 'Whiskey',
        abv: '20-25%',
        standardDrinks: '1.6',
        ingredients: ['Bourbon (0.75 oz)', 'Aperol (0.75 oz)', 'Amaro Nonino (0.75 oz)', 'Lemon juice (0.75 oz)'],
        description: 'A modern equal-parts cocktail with bourbon and Italian amari. One standard paper plane contains 1.6 standard drinks.',
        image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=400&h=300&fit=crop',
        tags: ['Cocktail', 'Whiskey', 'Modern', 'Equal Parts', 'Amari']
    },
    'naked-and-famous': {
        name: 'Naked & Famous',
        type: 'Cocktail',
        alcohol: 'Mezcal',
        abv: '20-25%',
        standardDrinks: '1.6',
        ingredients: ['Mezcal (0.75 oz)', 'Yellow Chartreuse (0.75 oz)', 'Aperol (0.75 oz)', 'Lime juice (0.75 oz)'],
        description: 'A modern equal-parts cocktail with mezcal and herbal liqueurs. One standard naked & famous contains 1.6 standard drinks.',
        image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
        tags: ['Cocktail', 'Mezcal', 'Modern', 'Equal Parts', 'Herbal']
    },
    'jungle-bird': {
        name: 'Jungle Bird',
        type: 'Cocktail',
        alcohol: 'Rum',
        abv: '12-15%',
        standardDrinks: '1.2',
        ingredients: ['Dark rum (1.5 oz)', 'Pineapple juice (1.5 oz)', 'Campari (0.75 oz)', 'Lime juice (0.5 oz)', 'Simple syrup (0.5 oz)'],
        description: 'A tropical cocktail with dark rum, pineapple, and Campari. One standard jungle bird contains 1.2 standard drinks.',
        image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
        tags: ['Cocktail', 'Rum', 'Tropical', 'Pineapple', 'Campari']
    },
    'painkiller': {
        name: 'Painkiller',
        type: 'Cocktail',
        alcohol: 'Rum',
        abv: '12-15%',
        standardDrinks: '1.2',
        ingredients: ['Dark rum (2 oz)', 'Pineapple juice (4 oz)', 'Orange juice (1 oz)', 'Cream of coconut (1 oz)', 'Nutmeg garnish'],
        description: 'A tropical cocktail with rum, pineapple, orange, and coconut. One standard painkiller contains 1.2 standard drinks.',
        image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
        tags: ['Cocktail', 'Rum', 'Tropical', 'Pineapple', 'Coconut']
    },
    'pina-colada': {
        name: 'Piña Colada',
        type: 'Cocktail',
        alcohol: 'Rum',
        abv: '12-15%',
        standardDrinks: '1.2',
        ingredients: ['White rum (2 oz)', 'Pineapple juice (2 oz)', 'Cream of coconut (2 oz)', 'Pineapple wedge garnish'],
        description: 'The national drink of Puerto Rico with rum, pineapple, and coconut. One standard piña colada contains 1.2 standard drinks.',
        nutrition: {
            calories: 245,
            carbs: 18.5,
            protein: 0.3,
            fat: 0,
            sugar: 16.2,
            servingSize: '5 oz'
        },
        image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
        tags: ['Cocktail', 'Rum', 'Tropical', 'Pineapple', 'Coconut']
    },
    'mai-tai': {
        name: 'Mai Tai',
        type: 'Cocktail',
        alcohol: 'Rum',
        abv: '15-20%',
        standardDrinks: '1.4',
        ingredients: ['Aged rum (2 oz)', 'Orange curaçao (0.75 oz)', 'Orgeat (0.75 oz)', 'Lime juice (1 oz)', 'Simple syrup (0.25 oz)'],
        description: 'A classic tiki cocktail with aged rum and tropical flavors. One standard mai tai contains 1.4 standard drinks.',
        nutrition: {
            calories: 198,
            carbs: 12.5,
            protein: 0.2,
            fat: 0,
            sugar: 11.8,
            servingSize: '4 oz'
        },
        image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
        tags: ['Cocktail', 'Rum', 'Tiki', 'Tropical', 'Classic']
    },
    'zombie': {
        name: 'Zombie',
        type: 'Cocktail',
        alcohol: 'Rum',
        abv: '20-25%',
        standardDrinks: '1.6',
        ingredients: ['Multiple rums (3 oz total)', 'Falernum (0.5 oz)', 'Donn\'s mix (1 oz)', 'Grenadine (0.25 oz)', 'Angostura bitters (1 dash)'],
        description: 'A complex tiki cocktail with multiple rums and tropical ingredients. One standard zombie contains 1.6 standard drinks.',
        nutrition: {
            calories: 285,
            carbs: 18.2,
            protein: 0.3,
            fat: 0,
            sugar: 16.5,
            servingSize: '6 oz'
        },
        image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
        tags: ['Cocktail', 'Rum', 'Tiki', 'Complex', 'Tropical']
    },
    'dark-n-stormy': {
        name: 'Dark \'n\' Stormy',
        type: 'Cocktail',
        alcohol: 'Rum',
        abv: '8-12%',
        standardDrinks: '1.2',
        ingredients: ['Dark rum (2 oz)', 'Ginger beer (4 oz)', 'Lime wedge'],
        description: 'A refreshing highball with dark rum and ginger beer. One standard dark \'n\' stormy contains 1.2 standard drinks.',
        image: 'https://images.unsplash.com/photo-1624368432852-ee84d0c87b3b?w=400&h=300&fit=crop',
        tags: ['Cocktail', 'Rum', 'Highball', 'Ginger', 'Refreshing']
    },
    'moscow-mule': {
        name: 'Moscow Mule',
        type: 'Cocktail',
        alcohol: 'Vodka',
        abv: '8-12%',
        standardDrinks: '1.2',
        ingredients: ['Vodka (2 oz)', 'Ginger beer (4 oz)', 'Lime juice (0.5 oz)', 'Lime wedge'],
        description: 'A refreshing highball with vodka and ginger beer. One standard moscow mule contains 1.2 standard drinks.',
        nutrition: {
            calories: 156,
            carbs: 8.5,
            protein: 0.1,
            fat: 0,
            sugar: 7.2,
            servingSize: '4 oz'
        },
        image: 'https://images.unsplash.com/photo-1624368432852-ee84d0c87b3b?w=400&h=300&fit=crop',
        tags: ['Cocktail', 'Vodka', 'Highball', 'Ginger', 'Refreshing']
    },
    'caipirinha': {
        name: 'Caipirinha',
        type: 'Cocktail',
        alcohol: 'Cachaça',
        abv: '15-20%',
        standardDrinks: '1.4',
        ingredients: ['Cachaça (2 oz)', 'Lime (1 whole)', 'Sugar (2 tsp)', 'Muddled lime and sugar'],
        description: 'Brazil\'s national cocktail with cachaça, lime, and sugar. One standard caipirinha contains 1.4 standard drinks.',
        nutrition: {
            calories: 165,
            carbs: 8.5,
            protein: 0.1,
            fat: 0,
            sugar: 7.8,
            servingSize: '3 oz'
        },
        image: 'https://images.unsplash.com/photo-1624368432852-ee84d0c87b3b?w=400&h=300&fit=crop',
        tags: ['Cocktail', 'Cachaça', 'Brazilian', 'Lime', 'Muddled']
    },
    'paloma': {
        name: 'Paloma',
        type: 'Cocktail',
        alcohol: 'Tequila',
        abv: '8-12%',
        standardDrinks: '1.2',
        ingredients: ['Tequila blanco (2 oz)', 'Grapefruit soda (4 oz)', 'Lime juice (0.5 oz)', 'Salt rim (optional)'],
        description: 'A refreshing Mexican cocktail with tequila and grapefruit. One standard paloma contains 1.2 standard drinks.',
        nutrition: {
            calories: 185,
            carbs: 12.8,
            protein: 0.2,
            fat: 0,
            sugar: 11.5,
            servingSize: '6 oz'
        },
        image: 'https://images.unsplash.com/photo-1624368432852-ee84d0c87b3b?w=400&h=300&fit=crop',
        tags: ['Cocktail', 'Tequila', 'Mexican', 'Grapefruit', 'Refreshing']
    },
    'el-diablo': {
        name: 'El Diablo',
        type: 'Cocktail',
        alcohol: 'Tequila',
        abv: '12-15%',
        standardDrinks: '1.2',
        ingredients: ['Tequila reposado (2 oz)', 'Crème de cassis (0.5 oz)', 'Lime juice (0.75 oz)', 'Ginger beer (4 oz)'],
        description: 'A tequila cocktail with blackcurrant liqueur and ginger beer. One standard el diablo contains 1.2 standard drinks.',
        nutrition: {
            calories: 175,
            carbs: 10.2,
            protein: 0.1,
            fat: 0,
            sugar: 8.8,
            servingSize: '6 oz'
        },
        image: 'https://images.unsplash.com/photo-1624368432852-ee84d0c87b3b?w=400&h=300&fit=crop',
        tags: ['Cocktail', 'Tequila', 'Ginger', 'Blackcurrant', 'Refreshing']
    },
    'bloody-mary': {
        name: 'Bloody Mary',
        type: 'Cocktail',
        alcohol: 'Vodka',
        abv: '8-12%',
        standardDrinks: '1.2',
        ingredients: ['Vodka (2 oz)', 'Tomato juice (4 oz)', 'Lemon juice (0.5 oz)', 'Worcestershire sauce', 'Hot sauce', 'Celery salt'],
        description: 'A savory cocktail with vodka and tomato juice. One standard bloody mary contains 1.2 standard drinks.',
        nutrition: {
            calories: 125,
            carbs: 8.2,
            protein: 1.8,
            fat: 0,
            sugar: 6.5,
            servingSize: '6 oz'
        },
        image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=300&fit=crop',
        tags: ['Cocktail', 'Vodka', 'Savory', 'Tomato', 'Brunch']
    },

    // Top 100 Cocktails (26-50)
    'cosmopolitan': {
        name: 'Cosmopolitan',
        type: 'Cocktail',
        alcohol: 'Vodka',
        abv: '15-20%',
        standardDrinks: '1.4',
        ingredients: ['Vodka (1.5 oz)', 'Cointreau (0.5 oz)', 'Cranberry juice (0.5 oz)', 'Lime juice (0.5 oz)', 'Orange peel garnish'],
        description: 'A sophisticated vodka cocktail with cranberry and citrus. One standard cosmopolitan contains 1.4 standard drinks.',
        nutrition: {
            calories: 172,
            carbs: 9.5,
            protein: 0.2,
            fat: 0,
            sugar: 8.8,
            servingSize: '4 oz'
        },
        image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
        tags: ['Cocktail', 'Vodka', 'Sophisticated', 'Cranberry', 'Citrus']
    },
    'espresso-martini': {
        name: 'Espresso Martini',
        type: 'Cocktail',
        alcohol: 'Vodka',
        abv: '20-25%',
        standardDrinks: '1.6',
        ingredients: ['Vodka (2 oz)', 'Coffee liqueur (0.5 oz)', 'Espresso (1 oz)', 'Simple syrup (0.5 oz)', 'Coffee beans garnish'],
        description: 'A coffee-flavored vodka cocktail with espresso. One standard espresso martini contains 1.6 standard drinks.',
        nutrition: {
            calories: 185,
            carbs: 8.8,
            protein: 0.1,
            fat: 0,
            sugar: 7.2,
            servingSize: '4 oz'
        },
        image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=400&h=300&fit=crop',
        tags: ['Cocktail', 'Vodka', 'Coffee', 'Modern', 'Sophisticated']
    },
    'white-russian': {
        name: 'White Russian',
        type: 'Cocktail',
        alcohol: 'Vodka',
        abv: '15-20%',
        standardDrinks: '1.4',
        ingredients: ['Vodka (2 oz)', 'Coffee liqueur (1 oz)', 'Heavy cream (1 oz)'],
        description: 'A creamy cocktail with vodka, coffee liqueur, and cream. One standard white russian contains 1.4 standard drinks.',
        nutrition: {
            calories: 225,
            carbs: 8.5,
            protein: 0.8,
            fat: 11.2,
            sugar: 7.8,
            servingSize: '4 oz'
        },
        image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=400&h=300&fit=crop',
        tags: ['Cocktail', 'Vodka', 'Creamy', 'Coffee', 'Dessert']
    },
    'black-russian': {
        name: 'Black Russian',
        type: 'Cocktail',
        alcohol: 'Vodka',
        abv: '20-25%',
        standardDrinks: '1.6',
        ingredients: ['Vodka (2 oz)', 'Coffee liqueur (1 oz)'],
        description: 'A simple cocktail with vodka and coffee liqueur. One standard black russian contains 1.6 standard drinks.',
        nutrition: {
            calories: 165,
            carbs: 6.8,
            protein: 0,
            fat: 0,
            sugar: 5.2,
            servingSize: '3 oz'
        },
        image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=400&h=300&fit=crop',
        tags: ['Cocktail', 'Vodka', 'Simple', 'Coffee', 'Strong']
    },
    'screwdriver': {
        name: 'Screwdriver',
        type: 'Cocktail',
        alcohol: 'Vodka',
        abv: '8-12%',
        standardDrinks: '1.2',
        ingredients: ['Vodka (2 oz)', 'Orange juice (4 oz)', 'Orange slice garnish'],
        description: 'A simple highball with vodka and orange juice. One standard screwdriver contains 1.2 standard drinks.',
        nutrition: {
            calories: 185,
            carbs: 12.5,
            protein: 0.8,
            fat: 0,
            sugar: 10.2,
            servingSize: '6 oz'
        },
        image: 'https://images.unsplash.com/photo-1624368432852-ee84d0c87b3b?w=400&h=300&fit=crop',
        tags: ['Cocktail', 'Vodka', 'Simple', 'Orange', 'Highball']
    },
    'bay-breeze': {
        name: 'Bay Breeze',
        type: 'Cocktail',
        alcohol: 'Vodka',
        abv: '8-12%',
        standardDrinks: '1.2',
        ingredients: ['Vodka (2 oz)', 'Cranberry juice (2 oz)', 'Pineapple juice (2 oz)'],
        description: 'A refreshing cocktail with vodka, cranberry, and pineapple. One standard bay breeze contains 1.2 standard drinks.',
        nutrition: {
            calories: 195,
            carbs: 15.8,
            protein: 0.5,
            fat: 0,
            sugar: 14.2,
            servingSize: '6 oz'
        },
        image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
        tags: ['Cocktail', 'Vodka', 'Refreshing', 'Tropical', 'Fruity']
    },
    'sea-breeze': {
        name: 'Sea Breeze',
        type: 'Cocktail',
        alcohol: 'Vodka',
        abv: '8-12%',
        standardDrinks: '1.2',
        ingredients: ['Vodka (2 oz)', 'Cranberry juice (3 oz)', 'Grapefruit juice (1 oz)', 'Lime wedge'],
        description: 'A refreshing cocktail with vodka, cranberry, and grapefruit. One standard sea breeze contains 1.2 standard drinks.',
        nutrition: {
            calories: 175,
            carbs: 14.2,
            protein: 0.4,
            fat: 0,
            sugar: 12.8,
            servingSize: '6 oz'
        },
        image: 'https://images.unsplash.com/photo-1624368432852-ee84d0c87b3b?w=400&h=300&fit=crop',
        tags: ['Cocktail', 'Vodka', 'Refreshing', 'Grapefruit', 'Citrus']
    },
    'kamikaze': {
        name: 'Kamikaze',
        type: 'Cocktail',
        alcohol: 'Vodka',
        abv: '20-25%',
        standardDrinks: '1.6',
        ingredients: ['Vodka (1 oz)', 'Triple sec (1 oz)', 'Lime juice (1 oz)', 'Lime wedge garnish'],
        description: 'A citrusy cocktail with vodka, triple sec, and lime. One standard kamikaze contains 1.6 standard drinks.',
        nutrition: {
            calories: 165,
            carbs: 8.5,
            protein: 0.1,
            fat: 0,
            sugar: 7.8,
            servingSize: '3 oz'
        },
        image: 'https://images.unsplash.com/photo-1624368432852-ee84d0c87b3b?w=400&h=300&fit=crop',
        tags: ['Cocktail', 'Vodka', 'Citrus', 'Equal Parts', 'Strong']
    },
    'lemon-drop': {
        name: 'Lemon Drop',
        type: 'Cocktail',
        alcohol: 'Vodka',
        abv: '20-25%',
        standardDrinks: '1.6',
        ingredients: ['Vodka (2 oz)', 'Triple sec (0.5 oz)', 'Lemon juice (1 oz)', 'Simple syrup (0.5 oz)', 'Sugar rim'],
        description: 'A sweet and sour vodka cocktail with lemon. One standard lemon drop contains 1.6 standard drinks.',
        nutrition: {
            calories: 175,
            carbs: 9.2,
            protein: 0.1,
            fat: 0,
            sugar: 8.5,
            servingSize: '4 oz'
        },
        image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=300&fit=crop',
        tags: ['Cocktail', 'Vodka', 'Sweet', 'Lemon', 'Sour']
    },
    'blue-lagoon': {
        name: 'Blue Lagoon',
        type: 'Cocktail',
        alcohol: 'Vodka',
        abv: '15-20%',
        standardDrinks: '1.4',
        ingredients: ['Vodka (2 oz)', 'Blue curaçao (1 oz)', 'Lemonade (2 oz)', 'Cherry garnish'],
        description: 'A blue-colored cocktail with vodka and blue curaçao. One standard blue lagoon contains 1.4 standard drinks.',
        nutrition: {
            calories: 185,
            carbs: 12.8,
            protein: 0.2,
            fat: 0,
            sugar: 11.5,
            servingSize: '5 oz'
        },
        image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
        tags: ['Cocktail', 'Vodka', 'Blue', 'Tropical', 'Sweet']
    },
    'sex-on-the-beach': {
        name: 'Sex on the Beach',
        type: 'Cocktail',
        alcohol: 'Vodka',
        abv: '12-15%',
        standardDrinks: '1.2',
        ingredients: ['Vodka (1.5 oz)', 'Peach schnapps (0.5 oz)', 'Cranberry juice (2 oz)', 'Orange juice (2 oz)'],
        description: 'A fruity cocktail with vodka, peach schnapps, and fruit juices. One standard sex on the beach contains 1.2 standard drinks.',
        nutrition: {
            calories: 195,
            carbs: 16.8,
            protein: 1.2,
            fat: 0,
            sugar: 14.5,
            servingSize: '6 oz'
        },
        image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
        tags: ['Cocktail', 'Vodka', 'Fruity', 'Peach', 'Tropical']
    },
    'woo-woo': {
        name: 'Woo Woo',
        type: 'Cocktail',
        alcohol: 'Vodka',
        abv: '12-15%',
        standardDrinks: '1.2',
        ingredients: ['Vodka (1.5 oz)', 'Peach schnapps (0.5 oz)', 'Cranberry juice (3 oz)', 'Lemon wedge'],
        description: 'A simple cocktail with vodka, peach schnapps, and cranberry. One standard woo woo contains 1.2 standard drinks.',
        nutrition: {
            calories: 185,
            carbs: 15.2,
            protein: 0.8,
            fat: 0,
            sugar: 13.8,
            servingSize: '5 oz'
        },
        image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
        tags: ['Cocktail', 'Vodka', 'Simple', 'Peach', 'Cranberry']
    },
    'harvey-wallbanger': {
        name: 'Harvey Wallbanger',
        type: 'Cocktail',
        alcohol: 'Vodka',
        abv: '8-12%',
        standardDrinks: '1.2',
        ingredients: ['Vodka (1.5 oz)', 'Orange juice (4 oz)', 'Galliano (0.5 oz float)', 'Orange slice'],
        description: 'A highball with vodka, orange juice, and Galliano float. One standard harvey wallbanger contains 1.2 standard drinks.',
        nutrition: {
            calories: 195,
            carbs: 16.5,
            protein: 1.8,
            fat: 0,
            sugar: 13.2,
            servingSize: '6 oz'
        },
        image: 'https://images.unsplash.com/photo-1624368432852-ee84d0c87b3b?w=400&h=300&fit=crop',
        tags: ['Cocktail', 'Vodka', 'Highball', 'Orange', 'Galliano']
    },
    'french-75': {
        name: 'French 75',
        type: 'Cocktail',
        alcohol: 'Gin',
        abv: '15-20%',
        standardDrinks: '1.4',
        ingredients: ['Gin (1 oz)', 'Lemon juice (0.5 oz)', 'Simple syrup (0.5 oz)', 'Champagne (2 oz)', 'Lemon twist'],
        description: 'A champagne cocktail with gin, lemon, and simple syrup. One standard french 75 contains 1.4 standard drinks.',
        nutrition: {
            calories: 165,
            carbs: 8.2,
            protein: 0.1,
            fat: 0,
            sugar: 6.8,
            servingSize: '4 oz'
        },
        image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
        tags: ['Cocktail', 'Gin', 'Champagne', 'Sophisticated', 'Classic']
    },
    'ramos-gin-fizz': {
        name: 'Ramos Gin Fizz',
        type: 'Cocktail',
        alcohol: 'Gin',
        abv: '12-15%',
        standardDrinks: '1.2',
        ingredients: ['Gin (2 oz)', 'Lemon juice (0.5 oz)', 'Lime juice (0.5 oz)', 'Simple syrup (1 oz)', 'Egg white', 'Heavy cream (1 oz)', 'Orange flower water (3 drops)', 'Soda water'],
        description: 'A complex gin cocktail with egg white and cream. One standard ramos gin fizz contains 1.2 standard drinks.',
        nutrition: {
            calories: 225,
            carbs: 12.5,
            protein: 2.8,
            fat: 8.5,
            sugar: 10.2,
            servingSize: '6 oz'
        },
        image: 'https://images.unsplash.com/photo-1624368432852-ee84d0c87b3b?w=400&h=300&fit=crop',
        tags: ['Cocktail', 'Gin', 'Complex', 'Egg White', 'Creamy']
    },
    'bee\'s-knees': {
        name: 'Bee\'s Knees',
        type: 'Cocktail',
        alcohol: 'Gin',
        abv: '20-25%',
        standardDrinks: '1.6',
        ingredients: ['Gin (2 oz)', 'Lemon juice (0.75 oz)', 'Honey syrup (0.75 oz)', 'Lemon twist'],
        description: 'A gin cocktail with lemon juice and honey syrup. One standard bee\'s knees contains 1.6 standard drinks.',
        nutrition: {
            calories: 185,
            carbs: 10.8,
            protein: 0.1,
            fat: 0,
            sugar: 9.5,
            servingSize: '3.5 oz'
        },
        image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=300&fit=crop',
        tags: ['Cocktail', 'Gin', 'Honey', 'Lemon', 'Classic']
    },
    'south-side': {
        name: 'South Side',
        type: 'Cocktail',
        alcohol: 'Gin',
        abv: '20-25%',
        standardDrinks: '1.6',
        ingredients: ['Gin (2 oz)', 'Lime juice (1 oz)', 'Simple syrup (0.75 oz)', 'Mint leaves (6-8)', 'Mint sprig garnish'],
        description: 'A gin cocktail with lime, simple syrup, and mint. One standard south side contains 1.6 standard drinks.',
        nutrition: {
            calories: 175,
            carbs: 9.2,
            protein: 0.1,
            fat: 0,
            sugar: 8.5,
            servingSize: '3.75 oz'
        },
        image: 'https://images.unsplash.com/photo-1624368432852-ee84d0c87b3b?w=400&h=300&fit=crop',
        tags: ['Cocktail', 'Gin', 'Mint', 'Lime', 'Refreshing']
    },
    'tom-collins': {
        name: 'Tom Collins',
        type: 'Cocktail',
        alcohol: 'Gin',
        abv: '8-12%',
        standardDrinks: '1.2',
        ingredients: ['Gin (2 oz)', 'Lemon juice (1 oz)', 'Simple syrup (0.75 oz)', 'Soda water (3 oz)', 'Lemon wheel and cherry'],
        description: 'A refreshing highball with gin, lemon, and soda water. One standard tom collins contains 1.2 standard drinks.',
        nutrition: {
            calories: 165,
            carbs: 9.2,
            protein: 0.1,
            fat: 0,
            sugar: 8.5,
            servingSize: '6 oz'
        },
        image: 'https://images.unsplash.com/photo-1624368432852-ee84d0c87b3b?w=400&h=300&fit=crop',
        tags: ['Cocktail', 'Gin', 'Highball', 'Refreshing', 'Classic']
    },
    'john-collins': {
        name: 'John Collins',
        type: 'Cocktail',
        alcohol: 'Whiskey',
        abv: '8-12%',
        standardDrinks: '1.2',
        ingredients: ['Bourbon whiskey (2 oz)', 'Lemon juice (1 oz)', 'Simple syrup (0.75 oz)', 'Soda water (3 oz)', 'Lemon wheel and cherry'],
        description: 'A whiskey variation of the Tom Collins. One standard john collins contains 1.2 standard drinks.',
        nutrition: {
            calories: 165,
            carbs: 9.2,
            protein: 0.1,
            fat: 0,
            sugar: 8.5,
            servingSize: '6 oz'
        },
        image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=300&fit=crop',
        tags: ['Cocktail', 'Whiskey', 'Highball', 'Refreshing', 'Bourbon']
    },
    'mint-julep': {
        name: 'Mint Julep',
        type: 'Cocktail',
        alcohol: 'Whiskey',
        abv: '15-20%',
        standardDrinks: '1.4',
        ingredients: ['Bourbon whiskey (2.5 oz)', 'Simple syrup (0.5 oz)', 'Mint leaves (8-10)', 'Crushed ice', 'Mint sprig garnish'],
        description: 'A classic Kentucky cocktail with bourbon and mint. One standard mint julep contains 1.4 standard drinks.',
        nutrition: {
            calories: 185,
            carbs: 6.2,
            protein: 0,
            fat: 0,
            sugar: 5.8,
            servingSize: '3 oz'
        },
        image: 'https://images.unsplash.com/photo-1624368432852-ee84d0c87b3b?w=400&h=300&fit=crop',
        tags: ['Cocktail', 'Whiskey', 'Mint', 'Kentucky', 'Classic']
    },
    'hot-toddy': {
        name: 'Hot Toddy',
        type: 'Cocktail',
        alcohol: 'Whiskey',
        abv: '15-20%',
        standardDrinks: '1.4',
        ingredients: ['Whiskey (2 oz)', 'Hot water (4 oz)', 'Honey (1 tsp)', 'Lemon juice (0.5 oz)', 'Lemon wheel', 'Cinnamon stick'],
        description: 'A warm cocktail with whiskey, hot water, and honey. One standard hot toddy contains 1.4 standard drinks.',
        nutrition: {
            calories: 165,
            carbs: 8.5,
            protein: 0.1,
            fat: 0,
            sugar: 7.8,
            servingSize: '6.5 oz'
        },
        image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=300&fit=crop',
        tags: ['Cocktail', 'Whiskey', 'Hot', 'Honey', 'Warming']
    },
    'irish-coffee': {
        name: 'Irish Coffee',
        type: 'Cocktail',
        alcohol: 'Whiskey',
        abv: '12-15%',
        standardDrinks: '1.2',
        ingredients: ['Irish whiskey (1.5 oz)', 'Hot coffee (4 oz)', 'Brown sugar (1 tsp)', 'Whipped cream'],
        description: 'A warm cocktail with Irish whiskey and coffee. One standard irish coffee contains 1.2 standard drinks.',
        nutrition: {
            calories: 185,
            carbs: 8.2,
            protein: 1.2,
            fat: 8.5,
            sugar: 7.8,
            servingSize: '5.5 oz'
        },
        image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=400&h=300&fit=crop',
        tags: ['Cocktail', 'Whiskey', 'Hot', 'Coffee', 'Irish']
    },
    'rusty-nail': {
        name: 'Rusty Nail',
        type: 'Cocktail',
        alcohol: 'Whiskey',
        abv: '25-30%',
        standardDrinks: '1.8',
        ingredients: ['Scotch whisky (2 oz)', 'Drambuie (0.5 oz)', 'Lemon twist'],
        description: 'A simple cocktail with Scotch and Drambuie. One standard rusty nail contains 1.8 standard drinks.',
        nutrition: {
            calories: 185,
            carbs: 6.8,
            protein: 0,
            fat: 0,
            sugar: 5.2,
            servingSize: '2.5 oz'
        },
        image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=400&h=300&fit=crop',
        tags: ['Cocktail', 'Whiskey', 'Scotch', 'Simple', 'Strong']
    },
    'godfather': {
        name: 'Godfather',
        type: 'Cocktail',
        alcohol: 'Whiskey',
        abv: '25-30%',
        standardDrinks: '1.8',
        ingredients: ['Scotch whisky (2 oz)', 'Amaretto (0.5 oz)', 'Orange peel'],
        description: 'A simple cocktail with Scotch and Amaretto. One standard godfather contains 1.8 standard drinks.',
        nutrition: {
            calories: 185,
            carbs: 8.2,
            protein: 0,
            fat: 0,
            sugar: 7.5,
            servingSize: '2.5 oz'
        },
        image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=400&h=300&fit=crop',
        tags: ['Cocktail', 'Whiskey', 'Scotch', 'Simple', 'Amaretto']
    },
    'rob-roy': {
        name: 'Rob Roy',
        type: 'Cocktail',
        alcohol: 'Whiskey',
        abv: '25-30%',
        standardDrinks: '1.8',
        ingredients: ['Scotch whisky (2 oz)', 'Sweet vermouth (0.75 oz)', 'Angostura bitters (2 dashes)', 'Cherry garnish'],
        description: 'A Scotch variation of the Manhattan. One standard rob roy contains 1.8 standard drinks.',
        nutrition: {
            calories: 185,
            carbs: 7.2,
            protein: 0,
            fat: 0,
            sugar: 5.8,
            servingSize: '2.75 oz'
        },
        image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=400&h=300&fit=crop',
        tags: ['Cocktail', 'Whiskey', 'Scotch', 'Classic', 'Manhattan Variation']
    },
    'blood-and-sand': {
        name: 'Blood and Sand',
        type: 'Cocktail',
        alcohol: 'Whiskey',
        abv: '20-25%',
        standardDrinks: '1.6',
        ingredients: ['Scotch whisky (0.75 oz)', 'Sweet vermouth (0.75 oz)', 'Cherry liqueur (0.75 oz)', 'Orange juice (0.75 oz)', 'Orange peel'],
        description: 'An equal-parts cocktail with Scotch and fruit juices. One standard blood and sand contains 1.6 standard drinks.',
        image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
        tags: ['Cocktail', 'Whiskey', 'Scotch', 'Equal Parts', 'Fruity']
    },

    // Wines with enhanced information
    'chardonnay': {
        name: 'Chardonnay',
        type: 'Wine',
        alcohol: 'White Wine',
        abv: '13-14.5%',
        standardDrinks: '1.4',
        ingredients: ['Chardonnay grapes'],
        description: 'A green-skinned grape variety used in white wine production, originating in Burgundy, France. One 175ml glass contains 1.4 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Wine', 'White', 'French', 'Elegant', 'Versatile']
    },
    'cabernetSauvignon': {
        name: 'Cabernet Sauvignon',
        type: 'Wine',
        alcohol: 'Red Wine',
        abv: '13.5-15%',
        standardDrinks: '1.5',
        ingredients: ['Cabernet Sauvignon grapes'],
        description: 'A full-bodied red wine with dark fruit, tannins, and aging potential. One 175ml glass contains 1.5 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Wine', 'Red', 'Full-bodied', 'Tannic', 'Classic']
    },
    'pinotNoir': {
        name: 'Pinot Noir',
        type: 'Wine',
        alcohol: 'Red Wine',
        abv: '12.5-14.5%',
        standardDrinks: '1.4',
        ingredients: ['Pinot Noir grapes'],
        description: 'A light to medium-bodied red wine with red fruit and earthy notes. One 175ml glass contains 1.4 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Wine', 'Red', 'Light-bodied', 'Elegant', 'Versatile']
    },
    'sauvignonBlanc': {
        name: 'Sauvignon Blanc',
        type: 'Wine',
        alcohol: 'White Wine',
        abv: '12-14%',
        standardDrinks: '1.3',
        ingredients: ['Sauvignon Blanc grapes'],
        description: 'A crisp white wine with citrus, herbaceous, and tropical fruit notes. One 175ml glass contains 1.3 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Wine', 'White', 'Crisp', 'Citrus', 'Refreshing']
    },
    'merlot': {
        name: 'Merlot',
        type: 'Wine',
        alcohol: 'Red Wine',
        abv: '13-14.5%',
        standardDrinks: '1.4',
        ingredients: ['Merlot grapes'],
        description: 'A medium to full-bodied red wine with soft tannins and plum flavors. One 175ml glass contains 1.4 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Wine', 'Red', 'Medium-bodied', 'Soft', 'Approachable']
    },

    // Spirits with enhanced information
    'whiskey': {
        name: 'Whiskey',
        type: 'Spirit',
        alcohol: 'Whiskey',
        abv: '40-50%',
        standardDrinks: '1.4',
        ingredients: ['Grain mash', 'Water', 'Yeast', 'Oak barrel aged'],
        description: 'A distilled alcoholic drink made from fermented grain mash, typically aged in wooden casks. One 44ml shot contains 1.4 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Spirit', 'Aged', 'Classic', 'Premium', 'Versatile']
    },
    'vodka': {
        name: 'Vodka',
        type: 'Spirit',
        alcohol: 'Vodka',
        abv: '40%',
        standardDrinks: '1.4',
        ingredients: ['Grain or potato mash', 'Water', 'Yeast'],
        description: 'A clear distilled spirit with neutral flavor, perfect for mixing in cocktails. One 44ml shot contains 1.4 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Spirit', 'Neutral', 'Versatile', 'Mixable', 'Clean']
    },
    'gin': {
        name: 'Gin',
        type: 'Spirit',
        alcohol: 'Gin',
        abv: '40-47%',
        standardDrinks: '1.4',
        ingredients: ['Grain spirit', 'Juniper berries', 'Botanicals', 'Water'],
        description: 'A distilled spirit flavored with juniper berries and other botanicals. One 44ml shot contains 1.4 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Spirit', 'Botanical', 'Juniper', 'Classic', 'Versatile']
    },
    'rum': {
        name: 'Rum',
        type: 'Spirit',
        alcohol: 'Rum',
        abv: '40-50%',
        standardDrinks: '1.4',
        ingredients: ['Sugarcane juice or molasses', 'Water', 'Yeast', 'Oak barrel aged'],
        description: 'A distilled spirit made from sugarcane byproducts, often aged in oak barrels. One 44ml shot contains 1.4 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Spirit', 'Sugarcane', 'Caribbean', 'Versatile', 'Aged']
    },
    'tequila': {
        name: 'Tequila',
        type: 'Spirit',
        alcohol: 'Tequila',
        abv: '40-50%',
        standardDrinks: '1.4',
        ingredients: ['Blue agave', 'Water', 'Yeast', 'Oak barrel aged (reposado/anejo)'],
        description: 'A distilled spirit made from blue agave, primarily produced in Mexico. One 44ml shot contains 1.4 standard drinks.',
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
        tags: ['Spirit', 'Agave', 'Mexican', 'Premium', 'Versatile']
    }
};

// Tab switching functionality will be set up after DOM elements are initialized

// Name input functionality will be set up after DOM elements are initialized

function showSuggestions(query) {
    const matches = Object.keys(beverageDatabase).filter(beverage => {
        const data = beverageDatabase[beverage];
        return beverage.includes(query) || 
               data.name.toLowerCase().includes(query) ||
               data.type.toLowerCase().includes(query);
    });
    
    if (matches.length === 0) {
        hideSuggestions();
        return;
    }
    
    suggestions.innerHTML = matches.slice(0, 8).map(beverage => {
        const data = beverageDatabase[beverage];
        return `<div class="suggestion-item" onclick="selectSuggestion('${beverage}')">
            <strong>${data.name}</strong> - ${data.type} (${data.abv || 'N/A'})
        </div>`;
    }).join('');
    
    suggestions.style.display = 'block';
}

function hideSuggestions() {
    suggestions.style.display = 'none';
}

function selectSuggestion(beverageKey) {
    beverageNameInput.value = beverageDatabase[beverageKey].name;
    hideSuggestions();
    addToHistory(beverageKey, 'text');
    displayBeverageInfo(beverageDatabase[beverageKey]);
}

function searchBeverage() {
    const query = beverageNameInput.value.toLowerCase().trim();
    hideSuggestions();
    
    if (!query) {
        showError('Please enter a drink name');
        return;
    }
    
    // Find matching beverage - more flexible search
    const beverageKey = Object.keys(beverageDatabase).find(key => {
        const beverage = beverageDatabase[key];
        return key === query || 
               beverage.name.toLowerCase() === query ||
               beverage.name.toLowerCase().includes(query) ||
               key.includes(query);
    });
    
    if (beverageKey) {
        addToHistory(beverageKey, 'text');
        displayBeverageInfo(beverageDatabase[beverageKey]);
    } else {
        // Show suggestions for similar beverages
        const similarBeverages = Object.keys(beverageDatabase).filter(key => {
            const beverage = beverageDatabase[key];
            return beverage.name.toLowerCase().includes(query) || key.includes(query);
        }).slice(0, 3);
        
        if (similarBeverages.length > 0) {
            const suggestions = similarBeverages.map(key => beverageDatabase[key].name).join(', ');
            showError(`Beverage not found. Did you mean: ${suggestions}?`);
        } else {
            showError('Beverage not found. Try searching for Australian beers like "Swan Draught", "Victoria Bitter", "Coopers Pale Ale", or cocktails like "Margarita", "Martini"');
        }
    }
}

// Photo upload functionality will be set up in DOMContentLoaded

// File inputs are now created dynamically for better mobile compatibility

// Mobile fallback - if file input fails, show alternative options
function checkMobileFileSupport() {
    if (/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        // Add mobile-specific instructions
        const mobileNote = document.createElement('p');
        mobileNote.innerHTML = '<i class="fas fa-mobile-alt"></i> Tap to take photo or choose from gallery';
        mobileNote.style.fontSize = '0.9rem';
        mobileNote.style.color = '#666';
        mobileNote.style.marginTop = '10px';
        
        const uploadContent = document.querySelector('.upload-content');
        if (uploadContent && !document.querySelector('.mobile-note')) {
            mobileNote.className = 'mobile-note';
            uploadContent.appendChild(mobileNote);
        }
    }
}

// Check mobile support on page load
document.addEventListener('DOMContentLoaded', () => {
    checkMobileFileSupport();
    checkForUpdates();
});

// Function to check for updates and clear cache if needed
function checkForUpdates() {
    // Add timestamp to force cache refresh
    const currentVersion = '1.0.2';
    const lastVersion = localStorage.getItem('bevyfinder-version');
    
    if (lastVersion !== currentVersion) {
        // New version detected, clear cache
        clearAllCaches();
        localStorage.setItem('bevyfinder-version', currentVersion);
        console.log('New version detected, cache cleared');
    }
}
// Function to clear all caches
async function clearAllCaches() {
    try {
        // Clear browser cache for this site
        if ('caches' in window) {
            const cacheNames = await caches.keys();
            await Promise.all(
                cacheNames.map(cacheName => caches.delete(cacheName))
            );
        }
        
        // Clear localStorage (optional - uncomment if needed)
        // localStorage.clear();
        
        // Force reload if service worker is available
        if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
            navigator.serviceWorker.controller.postMessage({ type: 'CLEAR_CACHE' });
        }
    } catch (error) {
        console.log('Cache clearing failed:', error);
    }
}

// Upload button event listeners
if (uploadBtn) {
    uploadBtn.addEventListener('click', () => {
        triggerFileInput();
    });
    
    // Mobile touch support for upload button
    uploadBtn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        triggerFileInput();
    }, { passive: false });
}

// Function to trigger file input with mobile compatibility
function triggerFileInput() {
    console.log('Triggering file input...');
    
    // Check if we're on mobile
    const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    console.log('Is mobile:', isMobile);
    
    if (isMobile) {
        // Mobile-specific approach
        showMobileUploadOptions();
    } else {
        // Desktop approach
        triggerDesktopFileInput();
    }
}

// Show mobile upload options
function showMobileUploadOptions() {
    // Create modal for mobile upload options
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.8);
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
    `;
    
    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
        background: white;
        padding: 30px;
        border-radius: 15px;
        text-align: center;
        max-width: 300px;
        width: 90%;
    `;
    
    modalContent.innerHTML = `
        <h3 style="margin-bottom: 20px; color: #333;">Choose Upload Method</h3>
        <button id="camera-btn" style="
            background: #667eea;
            color: white;
            border: none;
            padding: 15px 25px;
            border-radius: 8px;
            margin: 10px;
            width: 100%;
            font-size: 16px;
            cursor: pointer;
        ">
            <i class="fas fa-camera"></i> Take Photo
        </button>
        <button id="gallery-btn" style="
            background: #28a745;
            color: white;
            border: none;
            padding: 15px 25px;
            border-radius: 8px;
            margin: 10px;
            width: 100%;
            font-size: 16px;
            cursor: pointer;
        ">
            <i class="fas fa-images"></i> Choose from Gallery
        </button>
        <button id="cancel-btn" style="
            background: #6c757d;
            color: white;
            border: none;
            padding: 15px 25px;
            border-radius: 8px;
            margin: 10px;
            width: 100%;
            font-size: 16px;
            cursor: pointer;
        ">
            Cancel
        </button>
    `;
    
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
    
    // Add event listeners
    document.getElementById('camera-btn').addEventListener('click', () => {
        document.body.removeChild(modal);
        createMobileFileInput('camera');
    });
    
    document.getElementById('gallery-btn').addEventListener('click', () => {
        document.body.removeChild(modal);
        createMobileFileInput('gallery');
    });
    
    document.getElementById('cancel-btn').addEventListener('click', () => {
        document.body.removeChild(modal);
    });
    
    // Close on background click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });
}

// Create mobile-specific file input
function createMobileFileInput(type) {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    
    if (type === 'camera') {
        input.capture = 'environment';
        console.log('Creating camera input');
    } else {
        console.log('Creating gallery input');
    }
    
    input.style.display = 'none';
    
    // Add to DOM first
    document.body.appendChild(input);
    
    // Add change listener
    input.addEventListener('change', (e) => {
        console.log('File input change event triggered');
        if (e.target.files && e.target.files.length > 0) {
            console.log('File selected:', e.target.files[0].name);
            handleFileUpload(e.target.files[0]);
        } else {
            console.log('No file selected');
        }
        // Clean up
        document.body.removeChild(input);
    });
    
    // Add error handling
    input.addEventListener('error', (e) => {
        console.error('File input error:', e);
        document.body.removeChild(input);
        showError('Unable to access camera/gallery. Please try again.');
    });
    
    // Trigger click with delay to ensure DOM is ready
    setTimeout(() => {
        try {
            input.click();
            console.log('File input clicked');
        } catch (error) {
            console.error('Error clicking file input:', error);
            document.body.removeChild(input);
            showError('Unable to open file picker. Please try again.');
        }
    }, 100);
}

// Desktop file input trigger
function triggerDesktopFileInput() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.style.display = 'none';
    
    input.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
        handleFileUpload(e.target.files[0]);
    }
        document.body.removeChild(input);
});
    
    document.body.appendChild(input);
    input.click();
}

// Remove button event listener will be set up after DOM elements are initialized

function handleFileUpload(file) {
    if (!file.type.startsWith('image/')) {
        showError('Please select an image file');
        return;
    }
    
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
        showError('Image size should be less than 5MB');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
        previewImage.src = e.target.result;
        uploadArea.style.display = 'none';
        previewArea.style.display = 'block';
        
        // Perform actual image recognition
        setTimeout(() => {
            analyzeImage();
        }, 1500);
    };
    reader.readAsDataURL(file);
}

function clearPhotoUpload() {
    uploadArea.style.display = 'block';
    previewArea.style.display = 'none';
    previewImage.src = '';
    clearResults();
}

async function analyzeImage() {
    const loadingText = document.createElement('div');
    loadingText.innerHTML = '<div class="loading"></div> Analyzing image...';
    loadingText.style.textAlign = 'center';
    loadingText.style.padding = '20px';
    loadingText.style.color = '#666';
    
    beverageCard.innerHTML = '';
    beverageCard.appendChild(loadingText);
    resultsSection.style.display = 'block';
    
    try {
        const uploadedImage = document.getElementById('preview-image');
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        
        img.onload = async function() {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            
            // Convert to base64
            const imageData = canvas.toDataURL('image/jpeg', 0.8);
            
            // Use free image recognition API
            const result = await performImageRecognition(imageData);
            displayImageAnalysisResult(result, uploadedImage.src);
        };
        
        img.src = uploadedImage.src;
        
    } catch (error) {
        console.error('Image analysis error:', error);
        showImageAnalysisError();
    }
}

async function performImageRecognition(imageData) {
    // Try multiple free OCR and image recognition services
    const services = [
        () => tryOCRService(imageData),
        () => tryImageRecognitionAPI(imageData),
        () => performLocalImageAnalysis(imageData)
    ];
    
    for (const service of services) {
        try {
            const result = await service();
            if (result && result.success) {
                return result;
            }
        } catch (error) {
            console.log('Service failed, trying next...', error);
            continue;
        }
    }
    
    // Final fallback
    return performLocalImageAnalysis(imageData);
}

async function tryOCRService(imageData) {
    // Try multiple OCR services for better accuracy
    const services = [
        () => tryOCRSpace(imageData),
        () => tryGoogleVisionAPI(imageData),
        () => tryTesseractJS(imageData)
    ];
    
    for (const service of services) {
        try {
            const result = await service();
            if (result && result.success && result.text && result.text.trim().length > 0) {
                console.log('OCR successful with text:', result.text);
                return result;
            }
        } catch (error) {
            console.log('OCR service failed, trying next...', error);
            continue;
        }
    }
    
    throw new Error('All OCR services failed');
}

async function tryOCRSpace(imageData) {
    // Use OCR.space with better parameters
    const apiUrl = 'https://api.ocr.space/parse/image';
    
    try {
        const formData = new FormData();
        formData.append('apikey', 'K81724188988957'); // Free demo key
        formData.append('language', 'eng');
        formData.append('isOverlayRequired', 'false');
        formData.append('filetype', 'jpg');
        formData.append('OCREngine', '2'); // Better OCR engine
        formData.append('scale', 'true'); // Scale image for better recognition
        
        // Convert base64 to blob
        const base64Data = imageData.split(',')[1];
        const byteCharacters = atob(base64Data);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'image/jpeg' });
        
        formData.append('image', blob, 'beverage.jpg');
        
        const response = await fetch(apiUrl, {
            method: 'POST',
            body: formData
        });
        
        if (!response.ok) {
            throw new Error('OCR API request failed');
        }
        
        const data = await response.json();
        
        if (data.ParsedResults && data.ParsedResults.length > 0) {
            const extractedText = data.ParsedResults[0].ParsedText.toLowerCase();
            console.log('OCR.space extracted text:', extractedText);
            
            return {
                success: true,
                text: extractedText,
                tags: extractTagsFromText(extractedText),
                source: 'ocrspace'
            };
        }
        
        throw new Error('No text extracted from OCR.space');
        
    } catch (error) {
        console.log('OCR.space failed:', error);
        throw error;
    }
}

async function tryGoogleVisionAPI(imageData) {
    // Try Google Cloud Vision API (if available)
    // This would require a real API key, so we'll simulate it
    console.log('Google Vision API not available (requires API key)');
    throw new Error('Google Vision API not configured');
}

async function tryTesseractJS(imageData) {
    // Client-side OCR using Tesseract.js
    try {
        // Check if Tesseract is available
        if (typeof Tesseract === 'undefined') {
            // Load Tesseract dynamically
            await loadTesseract();
        }
        
        const result = await Tesseract.recognize(imageData, 'eng', {
            logger: m => console.log(m)
        });
        
        const extractedText = result.data.text.toLowerCase();
        console.log('Tesseract extracted text:', extractedText);
        
        return {
            success: true,
            text: extractedText,
            tags: extractTagsFromText(extractedText),
            source: 'tesseract'
        };
        
    } catch (error) {
        console.log('Tesseract failed:', error);
        throw error;
    }
}

async function loadTesseract() {
    // Dynamically load Tesseract.js
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/tesseract.js@v4.1.1/dist/tesseract.min.js';
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

async function tryImageRecognitionAPI(imageData) {
    // Use a free image recognition service
    const apiUrl = 'https://api.imagga.com/v2/tags';
    const apiKey = 'acc_2c0c0c0c0c0c0c0c'; // Demo key
    
    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${btoa(apiKey + ':')}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                image: imageData.split(',')[1]
            })
        });
        
        if (!response.ok) {
            throw new Error('Image recognition API failed');
        }
        
        const data = await response.json();
        
        if (data.result && data.result.tags) {
            const tags = data.result.tags.map(tag => tag.tag.en).slice(0, 10);
            return {
                success: true,
                tags: tags,
                source: 'imagga'
            };
        }
        
        throw new Error('No tags extracted');
        
    } catch (error) {
        console.log('Image recognition API failed:', error);
        throw error;
    }
}

function extractTagsFromText(text) {
    const tags = [];
    const cleanText = text.replace(/[^\w\s]/g, ' ').toLowerCase();
    
    console.log('Cleaning text for analysis:', cleanText);
    
    // Comprehensive brand name matching
    const brandPatterns = {
        'swan': ['swan', 'swan draught', 'swan lager'],
        'carlton': ['carlton', 'carlton draught', 'carlton dry', 'carlton cold'],
        'guinness': ['guinness', 'guinness draught', 'guinness stout'],
        'corona': ['corona', 'corona extra', 'corona lager'],
        'heineken': ['heineken', 'heineken lager'],
        'budweiser': ['budweiser', 'bud', 'bud light'],
        'stella': ['stella', 'stella artois'],
        'fosters': ['fosters', 'fosters lager'],
        'crown': ['crown', 'crown lager'],
        'coopers': ['coopers', 'coopers pale ale', 'coopers sparkling'],
        'great northern': ['great northern', 'great northern brewing'],
        'victoria bitter': ['victoria bitter', 'vb', 'victoria'],
        'jack daniels': ['jack daniels', 'jack daniel', 'jack'],
        'bundaberg': ['bundaberg', 'bundaberg rum'],
        'sommersby': ['sommersby', 'sommersby cider'],
        'hard solo': ['hard solo', 'solo'],
        'premix': ['premix', '196', '196 premix'],
        'varsity': ['varsity', 'varsity lager'],
        'pure blonde': ['pure blonde', 'pureblonde'],
        'asahi': ['asahi', 'asahi super dry'],
        'ballarat': ['ballarat', 'ballarat bitter'],
        'emu': ['emu', 'emu beer'],
        'xxxx': ['xxxx', '4x', 'four x']
    };
    
    // Check for brand patterns
    for (const [brand, patterns] of Object.entries(brandPatterns)) {
        for (const pattern of patterns) {
            if (cleanText.includes(pattern)) {
                tags.push(brand);
                console.log(`Found brand: ${brand} (pattern: ${pattern})`);
                break;
            }
        }
    }
    
    // Beverage type keywords
    const typeKeywords = {
        'beer': ['beer', 'lager', 'ale', 'stout', 'porter', 'pilsner'],
        'wine': ['wine', 'red wine', 'white wine', 'rose', 'champagne'],
        'spirit': ['spirit', 'whiskey', 'vodka', 'gin', 'rum', 'tequila', 'brandy'],
        'cocktail': ['cocktail', 'margarita', 'martini', 'mojito'],
        'cider': ['cider', 'hard cider'],
        'premix': ['premix', 'rtd', 'ready to drink']
    };
    
    // Check for beverage types
    for (const [type, keywords] of Object.entries(typeKeywords)) {
        for (const keyword of keywords) {
            if (cleanText.includes(keyword)) {
                tags.push(type);
                console.log(`Found type: ${type} (keyword: ${keyword})`);
                break;
            }
        }
    }
    
    // Alcohol content patterns
    const abvPatterns = [
        /(\d+(?:\.\d+)?)\s*%?\s*abv/i,
        /abv\s*(\d+(?:\.\d+)?)\s*%/i,
        /alcohol\s*(\d+(?:\.\d+)?)\s*%/i
    ];
    
    for (const pattern of abvPatterns) {
        const match = cleanText.match(pattern);
        if (match) {
            const abv = parseFloat(match[1]);
            if (abv > 0 && abv <= 100) {
                tags.push(`abv-${abv}`);
                console.log(`Found ABV: ${abv}%`);
            }
        }
    }
    
    // Add general beverage tag if we found anything
    if (tags.length > 0) {
        tags.push('beverage');
    }
    
    console.log('Extracted tags:', tags);
    return tags;
}

function performLocalImageAnalysis(imageData) {
    // Local image analysis using canvas and basic pattern recognition
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    return new Promise((resolve) => {
        img.onload = function() {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const analysis = analyzeImageData(imageData);
            
            resolve({
                success: true,
                tags: analysis.tags,
                colors: analysis.colors,
                text: analysis.text
            });
        };
        img.src = imageData;
    });
}

function analyzeImageData(imageData) {
    const data = imageData.data;
    const width = imageData.width;
    const height = imageData.height;
    
    // Analyze colors
    const colors = {};
    for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        
        const colorKey = `${Math.floor(r/50)*50},${Math.floor(g/50)*50},${Math.floor(b/50)*50}`;
        colors[colorKey] = (colors[colorKey] || 0) + 1;
    }
    
    // Determine dominant colors
    const dominantColors = Object.entries(colors)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .map(([color]) => color.split(',').map(Number));
    
    // Basic pattern recognition
    const tags = [];
    const avgBrightness = data.reduce((sum, val, i) => sum + (i % 4 === 0 ? val : 0), 0) / (data.length / 4);
    
    if (avgBrightness > 150) {
        tags.push('light colored');
    } else if (avgBrightness < 100) {
        tags.push('dark colored');
    }
    
    // Check for common beverage colors
    const hasRed = dominantColors.some(([r]) => r > 150);
    const hasGreen = dominantColors.some(([,g]) => g > 150);
    const hasBlue = dominantColors.some(([, , b]) => b > 150);
    
    if (hasRed && !hasGreen && !hasBlue) tags.push('red beverage');
    if (hasGreen && !hasRed && !hasBlue) tags.push('green beverage');
    if (hasBlue && !hasRed && !hasGreen) tags.push('blue beverage');
    
    tags.push('beverage container');
    
    return { tags, colors: dominantColors, text: 'beverage' };
}
function displayImageAnalysisResult(result, originalImageSrc) {
    const analysisResult = document.createElement('div');
    
    if (result.success && (result.tags || result.text)) {
        // Try to match with database
        const matchedBeverage = findBeverageByTags(result.tags || [], result.text || '');
        
        if (matchedBeverage) {
            // Find the beverage key for history tracking
            const beverageKey = Object.keys(beverageDatabase).find(key => beverageDatabase[key] === matchedBeverage);
            if (beverageKey) {
                addToHistory(beverageKey, 'image');
            }
            displayBeverageInfo(matchedBeverage, true);
        } else {
            // Show analysis details
            let analysisDetails = '';
            if (result.text) {
                analysisDetails += `<p><strong>Extracted Text:</strong></p><p style="font-family: monospace; background: #f5f5f5; padding: 10px; border-radius: 4px; margin: 10px 0;">${result.text}</p>`;
            }
            if (result.tags && result.tags.length > 0) {
                analysisDetails += `<p><strong>Detected Features:</strong></p><p>${result.tags.join(', ')}</p>`;
            }
            
            analysisResult.innerHTML = `
                <div style="text-align: center; padding: 20px; color: #666;">
                    <h3>Image Analysis Complete</h3>
                    <p><strong>Uploaded Image:</strong></p>
                    <img src="${originalImageSrc}" alt="Uploaded beverage" style="max-width: 200px; max-height: 200px; border-radius: 8px; margin: 10px 0;">
                    ${analysisDetails}
                    <p>No exact match found in database. Try searching for the beverage name.</p>
                    <button onclick="switchToSearch()" style="background: #667eea; color: white; border: none; padding: 12px 24px; border-radius: 8px; cursor: pointer; margin-top: 15px; font-weight: 500;">
                        <i class="fas fa-search"></i> Search Instead
                    </button>
                </div>
            `;
        }
    } else {
        showImageAnalysisError();
    }
    
    if (analysisResult.innerHTML) {
        beverageCard.appendChild(analysisResult);
        resultsSection.style.display = 'block';
        resultsSection.scrollIntoView({ behavior: 'smooth' });
    }
}

function findBeverageByTags(tags, extractedText = '') {
    const tagString = tags.join(' ').toLowerCase();
    const textString = extractedText.toLowerCase();
    const matches = [];
    
    console.log('Matching with tags:', tags);
    console.log('Extracted text:', textString);
    
    // Search through database for matches
    for (const [key, beverage] of Object.entries(beverageDatabase)) {
        const beverageText = `${beverage.name} ${beverage.type} ${beverage.alcohol} ${beverage.tags.join(' ')}`.toLowerCase();
        let score = 0;
        let matchDetails = [];
        
        // Exact name matching (highest priority)
        const beverageNameLower = beverage.name.toLowerCase();
        if (textString.includes(beverageNameLower)) {
            score += 15;
            matchDetails.push(`Exact name match: ${beverage.name}`);
        }
        
        // Partial name matching with word boundaries
        const beverageWords = beverageNameLower.split(/\s+/);
        beverageWords.forEach(word => {
            if (word.length > 2) {
                const wordPattern = new RegExp(`\\b${word}\\b`, 'i');
                if (wordPattern.test(textString)) {
                    score += 8;
                    matchDetails.push(`Word match: ${word}`);
                }
            }
        });
        
        // Brand-specific matching with comprehensive patterns
        const brandMatches = {
            'swan': ['swan', 'swan draught', 'swan lager'],
            'carlton': ['carlton', 'carlton draught', 'carlton dry', 'carlton cold'],
            'guinness': ['guinness', 'guinness draught', 'guinness stout'],
            'corona': ['corona', 'corona extra', 'corona lager'],
            'heineken': ['heineken', 'heineken lager'],
            'budweiser': ['budweiser', 'bud', 'bud light'],
            'stella': ['stella', 'stella artois'],
            'fosters': ['fosters', 'fosters lager'],
            'crown': ['crown', 'crown lager'],
            'coopers': ['coopers', 'coopers pale ale', 'coopers sparkling'],
            'great northern': ['great northern', 'great northern brewing'],
            'victoria bitter': ['victoria bitter', 'vb', 'victoria'],
            'jack daniels': ['jack daniels', 'jack daniel', 'jack'],
            'bundaberg': ['bundaberg', 'bundaberg rum'],
            'sommersby': ['sommersby', 'sommersby cider'],
            'hard solo': ['hard solo', 'solo'],
            'premix': ['premix', '196', '196 premix'],
            'varsity': ['varsity', 'varsity lager'],
            'pure blonde': ['pure blonde', 'pureblonde'],
            'asahi': ['asahi', 'asahi super dry'],
            'ballarat': ['ballarat', 'ballarat bitter'],
            'emu': ['emu', 'emu beer'],
            'xxxx': ['xxxx', '4x', 'four x']
        };
        
        // Check brand matches
        for (const [brand, patterns] of Object.entries(brandMatches)) {
            if (beverageText.includes(brand)) {
                for (const pattern of patterns) {
                    if (textString.includes(pattern) || tagString.includes(brand)) {
                        score += 12;
                        matchDetails.push(`Brand match: ${brand} (${pattern})`);
                        break;
                    }
                }
            }
        }
        
        // ABV matching
        if (beverage.abv) {
            const beverageABV = parseFloat(beverage.abv);
            const abvPattern = new RegExp(`\\b${beverageABV}\\s*%?\\b`, 'i');
            if (abvPattern.test(textString)) {
                score += 6;
                matchDetails.push(`ABV match: ${beverage.abv}`);
            }
        }
        
        // Type-based matching
        const typeMatches = {
            'beer': ['beer', 'lager', 'ale', 'stout', 'porter', 'pilsner'],
            'wine': ['wine', 'red wine', 'white wine', 'rose', 'champagne'],
            'spirit': ['spirit', 'whiskey', 'vodka', 'gin', 'rum', 'tequila', 'brandy'],
            'cocktail': ['cocktail', 'margarita', 'martini', 'mojito'],
            'cider': ['cider', 'hard cider'],
            'premix': ['premix', 'rtd', 'ready to drink']
        };
        
        for (const [type, keywords] of Object.entries(typeMatches)) {
            if (beverageText.includes(type)) {
                for (const keyword of keywords) {
                    if (textString.includes(keyword) || tagString.includes(type)) {
                        score += 4;
                        matchDetails.push(`Type match: ${type} (${keyword})`);
                        break;
                    }
                }
            }
        }
        
        // Tag-based matching
        for (const tag of tags) {
            if (beverageText.includes(tag) || beverage.tags.includes(tag)) {
                score += 3;
                matchDetails.push(`Tag match: ${tag}`);
            }
        }
        
        if (score > 0) {
            matches.push({ 
                beverage, 
                score, 
                details: matchDetails,
                key: key 
            });
        }
    }
    
    // Return the best match
    if (matches.length > 0) {
        matches.sort((a, b) => b.score - a.score);
        
        console.log('Top matches:');
        matches.slice(0, 5).forEach((match, index) => {
            console.log(`${index + 1}. ${match.beverage.name} (Score: ${match.score})`);
            console.log(`   Details: ${match.details.join(', ')}`);
        });
        
        const bestMatch = matches[0];
        console.log(`Best match: ${bestMatch.beverage.name} with score ${bestMatch.score}`);
        
        // Only return if score is high enough
        if (bestMatch.score >= 8) {
            return bestMatch.beverage;
        } else {
            console.log('No high-confidence match found');
            return null;
        }
    }
    
    return null;
}

function showImageAnalysisError() {
    const errorResult = document.createElement('div');
    errorResult.innerHTML = `
        <div style="text-align: center; padding: 20px; color: #666;">
            <h3>Analysis Failed</h3>
            <p>Unable to analyze the image. Please try:</p>
            <ul style="text-align: left; max-width: 300px; margin: 0 auto;">
                <li>Using a clearer image</li>
                <li>Ensuring the beverage label is visible</li>
                <li>Using the search function instead</li>
            </ul>
            <button onclick="switchToSearch()" style="background: #667eea; color: white; border: none; padding: 12px 24px; border-radius: 8px; cursor: pointer; margin-top: 15px; font-weight: 500;">
                <i class="fas fa-search"></i> Use Search
            </button>
        </div>
    `;
    
    beverageCard.appendChild(errorResult);
    resultsSection.style.display = 'block';
    resultsSection.scrollIntoView({ behavior: 'smooth' });
}

// Display results with serving size tabs
function displayBeverageInfo(beverage, fromImage = false) {
    const sourceText = fromImage ? ' (Identified from image)' : '';
    
    // Serving size configurations
    const servingSizes = {
        'schooner': { name: 'Schooner', volume: 425, multiplier: 425/330 }, // 425ml
        'pint': { name: 'Pint', volume: 570, multiplier: 570/330 }, // 570ml
        'can-bottle': { name: 'Can/Bottle', volume: 330, multiplier: 1 }, // 330ml (standard)
        'jug': { name: 'Jug', volume: 1140, multiplier: 1140/330 } // 1140ml (2 pints)
    };
    
    // Calculate values for each serving size
    function calculateServingValues(beverage, multiplier) {
        const abv = parseFloat(beverage.abv) || 0;
        const baseVolume = 330; // Standard can/bottle size
        const volume = baseVolume * multiplier;
        const standardDrinks = (volume * abv) / 1000;
        
        let nutrition = null;
        if (beverage.nutrition) {
            nutrition = {
                calories: Math.round(beverage.nutrition.calories * multiplier),
                carbs: Math.round(beverage.nutrition.carbs * multiplier * 10) / 10,
                protein: Math.round(beverage.nutrition.protein * multiplier * 10) / 10,
                fat: Math.round(beverage.nutrition.fat * multiplier * 10) / 10,
                sugar: Math.round(beverage.nutrition.sugar * multiplier * 10) / 10,
                servingSize: `${Math.round(volume)}ml`
            };
        }
        
        return {
            volume: Math.round(volume),
            standardDrinks: standardDrinks.toFixed(1),
            nutrition: nutrition
        };
    }
    
    // Generate tab content for each serving size
    function generateTabContent(servingKey, servingConfig) {
        const values = calculateServingValues(beverage, servingConfig.multiplier);
        
        const nutritionSection = values.nutrition ? `
            <div class="nutrition-section">
                <h4>Nutritional Information (per ${values.nutrition.servingSize})</h4>
                <div class="nutrition-grid">
                    <div class="nutrition-item">
                        <span class="nutrition-label">Calories</span>
                        <span class="nutrition-value">${values.nutrition.calories}</span>
                    </div>
                    <div class="nutrition-item">
                        <span class="nutrition-label">Carbs</span>
                        <span class="nutrition-value">${values.nutrition.carbs}g</span>
                    </div>
                    <div class="nutrition-item">
                        <span class="nutrition-label">Protein</span>
                        <span class="nutrition-value">${values.nutrition.protein}g</span>
                    </div>
                    <div class="nutrition-item">
                        <span class="nutrition-label">Fat</span>
                        <span class="nutrition-value">${values.nutrition.fat}g</span>
                    </div>
                    <div class="nutrition-item">
                        <span class="nutrition-label">Sugar</span>
                        <span class="nutrition-value">${values.nutrition.sugar}g</span>
                    </div>
                </div>
            </div>
        ` : '';
        
        return `
            <div class="serving-details">
                <div class="serving-info">
                    <div class="serving-stat">
                        <span class="stat-label">Volume</span>
                        <span class="stat-value">${values.volume}ml</span>
                    </div>
                    <div class="serving-stat">
                        <span class="stat-label">Standard Drinks</span>
                        <span class="stat-value">${values.standardDrinks}</span>
                    </div>
                    ${beverage.abv ? `
                        <div class="serving-stat">
                            <span class="stat-label">ABV</span>
                            <span class="stat-value">${beverage.abv}</span>
                        </div>
                    ` : ''}
                </div>
                ${nutritionSection}
            </div>
        `;
    }
    
    // Generate all tab contents
    const tabContents = Object.entries(servingSizes).map(([key, config]) => 
        generateTabContent(key, config)
    );
    
    beverageCard.innerHTML = `
        <div class="beverage-info">
            <div class="beverage-details">
                <div class="beverage-header">
                    <div class="beverage-title">
                <h3>${beverage.name}${sourceText}</h3>
                <p><strong>Type:</strong> ${beverage.type}</p>
                <p><strong>Alcohol:</strong> ${beverage.alcohol}</p>
                    </div>
                    <div class="beverage-photo-area" onclick="uploadBeveragePhoto()">
                        <!-- Photo will be displayed here later -->
                    </div>
                </div>
                
                <p><strong>Ingredients:</strong> ${beverage.ingredients.join(', ')}</p>
                <p><strong>Description:</strong> ${beverage.description}</p>
                
                <!-- Serving Size Tabs -->
                <div class="serving-tabs">
                    <div class="serving-tab-buttons">
                        ${Object.entries(servingSizes).map(([key, config], index) => `
                            <button class="serving-tab-btn ${index === 2 ? 'active' : ''}" 
                                    onclick="switchServingTab('${key}', this)">
                                <span class="tab-emoji">${key === 'schooner' ? '🥃' : 
                                                       key === 'pint' ? '🍺' : 
                                                       key === 'can-bottle' ? '🍺' : '🍷'}</span>
                                <span class="tab-name">${config.name}</span>
                            </button>
                        `).join('')}
                    </div>
                    
                    <div class="serving-tab-content">
                        ${tabContents.map((content, index) => `
                            <div class="serving-tab-panel ${index === 2 ? 'active' : ''}" 
                                 id="tab-${Object.keys(servingSizes)[index]}">
                                ${content}
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div class="beverage-tags">
                    ${beverage.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
            </div>
        </div>
    `;
    
    // Add like and favorite buttons to the beverage card
    const beverageKey = Object.keys(beverageDatabase).find(key => beverageDatabase[key] === beverage);
    if (beverageKey) {
        // Create action buttons container
        const actionButtons = document.createElement('div');
        actionButtons.className = 'beverage-action-buttons';
        
        // Like button
        const likeBtn = document.createElement('button');
        likeBtn.className = `like-btn ${isLiked(beverageKey) ? 'liked' : ''}`;
        likeBtn.setAttribute('data-beverage', beverageKey);
        likeBtn.innerHTML = `<i class="${isLiked(beverageKey) ? 'fas' : 'far'} fa-thumbs-up"></i> <span class="like-count">${getLikeCount(beverageKey)}</span>`;
        likeBtn.title = isLiked(beverageKey) ? 'Unlike this drink' : 'Like this drink';
        likeBtn.onclick = () => {
            if (auth.isUserAuthenticated()) {
                if (isLiked(beverageKey)) {
                    unlikeBeverage(beverageKey);
                } else {
                    likeBeverage(beverageKey);
                }
            } else {
                showAuthNotification('Sign up to like drinks!', 'info');
            }
        };
        
        // Favorite button
        const favoriteBtn = document.createElement('button');
        favoriteBtn.className = `favorite-btn ${isFavorite(beverageKey) ? 'favorited' : ''}`;
        favoriteBtn.setAttribute('data-beverage', beverageKey);
        
        if (auth.isUserAuthenticated()) {
            favoriteBtn.innerHTML = `<i class="${isFavorite(beverageKey) ? 'fas' : 'far'} fa-heart"></i>`;
            favoriteBtn.title = isFavorite(beverageKey) ? 'Remove from favorites' : 'Add to favorites';
            favoriteBtn.onclick = () => {
                if (isFavorite(beverageKey)) {
                    removeFromFavorites(beverageKey);
                } else {
                    addToFavorites(beverageKey);
                }
            };
        } else {
            favoriteBtn.innerHTML = `<i class="fas fa-user-plus"></i>`;
            favoriteBtn.title = 'Sign up to save favorites';
            favoriteBtn.onclick = () => {
                showAuthNotification('Sign up to save your favorite drinks!', 'info');
            };
        }
        
        // Add buttons to container
        actionButtons.appendChild(likeBtn);
        actionButtons.appendChild(favoriteBtn);
        
        // Insert the action buttons into the beverage card header
        const beverageHeader = beverageCard.querySelector('.beverage-header');
        if (beverageHeader) {
            beverageHeader.appendChild(actionButtons);
        }
    }

    // Add reviews section
    const reviewsSection = document.createElement('div');
    reviewsSection.className = 'reviews-section';
    reviewsSection.innerHTML = `
        <h3><i class="fas fa-star"></i> Reviews</h3>
        <div class="reviews-container" id="reviews-container-${beverageKey}">
            <div class="loading-reviews">Loading reviews...</div>
        </div>
        <div class="review-form" id="review-form-${beverageKey}" style="display: none;">
            <h4>Write a Review</h4>
            <div class="rating-input">
                <label>Rating:</label>
                <div class="star-rating">
                    <i class="far fa-star" data-rating="1"></i>
                    <i class="far fa-star" data-rating="2"></i>
                    <i class="far fa-star" data-rating="3"></i>
                    <i class="far fa-star" data-rating="4"></i>
                    <i class="far fa-star" data-rating="5"></i>
                </div>
            </div>
            <textarea placeholder="Share your thoughts about this drink..." maxlength="1000"></textarea>
            <button onclick="submitReview('${beverageKey}')" class="submit-review-btn">
                <i class="fas fa-paper-plane"></i> Submit Review
            </button>
        </div>
        <button onclick="toggleReviewForm('${beverageKey}')" class="write-review-btn" id="write-review-btn-${beverageKey}">
            <i class="fas fa-edit"></i> Write a Review
        </button>
    `;
    beverageCard.appendChild(reviewsSection);

    // Load reviews
    loadReviews(beverageKey);
    
    resultsSection.style.display = 'block';
    resultsSection.scrollIntoView({ behavior: 'smooth' });
}

// Function to switch between serving size tabs
function switchServingTab(tabKey, buttonElement) {
    // Remove active class from all buttons and panels
    document.querySelectorAll('.serving-tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.serving-tab-panel').forEach(panel => panel.classList.remove('active'));
    
    // Add active class to clicked button and corresponding panel
    buttonElement.classList.add('active');
    document.getElementById(`tab-${tabKey}`).classList.add('active');
}

function clearResults() {
    resultsSection.style.display = 'none';
    beverageCard.innerHTML = '';
}

function uploadBeveragePhoto() {
    // Create a file input for the beverage photo
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.style.display = 'none';
    
    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const photoArea = document.querySelector('.beverage-photo-area');
                photoArea.innerHTML = `
                    <img src="${e.target.result}" alt="Beverage photo" 
                         style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px;">
                `;
                photoArea.style.border = 'none';
                photoArea.style.background = 'none';
            };
            reader.readAsDataURL(file);
        }
    });
    
    document.body.appendChild(fileInput);
    fileInput.click();
    document.body.removeChild(fileInput);
}

// Review Functions
async function loadReviews(drinkId) {
    try {
        const response = await fetch(`http://localhost:3000/api/reviews/drink/${drinkId}`);
        const data = await response.json();
        
        const container = document.getElementById(`reviews-container-${drinkId}`);
        if (!container) return;

        if (data.success) {
            displayReviews(drinkId, data.data);
        } else {
            container.innerHTML = '<p class="no-reviews">No reviews yet</p>';
        }
    } catch (error) {
        console.error('Error loading reviews:', error);
        const container = document.getElementById(`reviews-container-${drinkId}`);
        if (container) {
            container.innerHTML = '<p class="error-loading">Error loading reviews</p>';
        }
    }
}

function displayReviews(drinkId, reviewData) {
    const container = document.getElementById(`reviews-container-${drinkId}`);
    if (!container) return;

    const { reviews, stats } = reviewData;

    if (reviews.length === 0) {
        container.innerHTML = '<p class="no-reviews">No reviews yet. Be the first to review!</p>';
        return;
    }

    let reviewsHTML = `
        <div class="reviews-summary">
            <div class="average-rating">
                <span class="rating-number">${stats.average}</span>
                <div class="stars">
                    ${generateStars(stats.average)}
                </div>
                <span class="review-count">(${stats.count} reviews)</span>
            </div>
        </div>
        <div class="reviews-list">
    `;

    reviews.forEach(review => {
        reviewsHTML += `
            <div class="review-item">
                <div class="review-header">
                    <div class="reviewer-info">
                        <span class="reviewer-name">${review.userId.name}</span>
                        <div class="review-stars">
                            ${generateStars(review.rating)}
                        </div>
                    </div>
                    <span class="review-date">${new Date(review.createdAt).toLocaleDateString()}</span>
                </div>
                ${review.review ? `<div class="review-text">${review.review}</div>` : ''}
                <div class="review-actions">
                    <button onclick="markReviewHelpful('${review._id}')" class="helpful-btn">
                        <i class="fas fa-thumbs-up"></i> Helpful (${review.helpful})
                    </button>
                </div>
            </div>
        `;
    });

    reviewsHTML += '</div>';
    container.innerHTML = reviewsHTML;
}

function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    let starsHTML = '';

    for (let i = 1; i <= 5; i++) {
        if (i <= fullStars) {
            starsHTML += '<i class="fas fa-star"></i>';
        } else if (i === fullStars + 1 && hasHalfStar) {
            starsHTML += '<i class="fas fa-star-half-alt"></i>';
        } else {
            starsHTML += '<i class="far fa-star"></i>';
        }
    }

    return starsHTML;
}

function toggleReviewForm(drinkId) {
    const form = document.getElementById(`review-form-${drinkId}`);
    const btn = document.getElementById(`write-review-btn-${drinkId}`);
    
    if (form.style.display === 'none') {
        form.style.display = 'block';
        btn.innerHTML = '<i class="fas fa-times"></i> Cancel';
        
        // Setup star rating
        setupStarRating(drinkId);
    } else {
        form.style.display = 'none';
        btn.innerHTML = '<i class="fas fa-edit"></i> Write a Review';
    }
}

function setupStarRating(drinkId) {
    const stars = document.querySelectorAll(`#review-form-${drinkId} .star-rating i`);
    let selectedRating = 0;

    stars.forEach(star => {
        star.addEventListener('mouseenter', () => {
            const rating = parseInt(star.dataset.rating);
            highlightStars(stars, rating);
        });

        star.addEventListener('click', () => {
            selectedRating = parseInt(star.dataset.rating);
            highlightStars(stars, selectedRating);
        });
    });

    document.querySelector(`#review-form-${drinkId} .star-rating`).addEventListener('mouseleave', () => {
        highlightStars(stars, selectedRating);
    });
}

function highlightStars(stars, rating) {
    stars.forEach((star, index) => {
        if (index < rating) {
            star.className = 'fas fa-star';
        } else {
            star.className = 'far fa-star';
        }
    });
}

async function submitReview(drinkId) {
    if (!auth.isUserAuthenticated()) {
        showAuthNotification('Please sign in to write reviews', 'warning');
        return;
    }

    const form = document.getElementById(`review-form-${drinkId}`);
    const stars = form.querySelectorAll('.star-rating i.fas');
    const textarea = form.querySelector('textarea');
    
    const rating = stars.length;
    const review = textarea.value.trim();

    if (rating === 0) {
        showNotification('Please select a rating', 'error');
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/api/reviews', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${auth.api.getToken()}`
            },
            body: JSON.stringify({
                drinkId,
                rating,
                review
            })
        });

        const data = await response.json();

        if (data.success) {
            showNotification('Review submitted successfully!', 'success');
            toggleReviewForm(drinkId);
            loadReviews(drinkId);
        } else {
            showNotification(data.message, 'error');
        }
    } catch (error) {
        console.error('Error submitting review:', error);
        showNotification('Failed to submit review', 'error');
    }
}

async function markReviewHelpful(reviewId) {
    if (!auth.isUserAuthenticated()) {
        showAuthNotification('Please sign in to mark reviews as helpful', 'warning');
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/api/reviews/${reviewId}/helpful`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${auth.api.getToken()}`
            }
        });

        const data = await response.json();

        if (data.success) {
            // Update the helpful count in the UI
            const btn = event.target.closest('.helpful-btn');
            if (btn) {
                btn.innerHTML = `<i class="fas fa-thumbs-up"></i> Helpful (${data.data.helpful})`;
            }
        }
    } catch (error) {
        console.error('Error marking review helpful:', error);
    }
}

function showError(message) {
    // Create a temporary error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    errorDiv.style.marginTop = '10px';
    errorDiv.style.padding = '10px';
    errorDiv.style.backgroundColor = '#fff8f8';
    errorDiv.style.border = '1px solid #dc3545';
    errorDiv.style.borderRadius = '8px';
    errorDiv.style.color = '#dc3545';
    
    // Insert after the input
    const inputGroup = beverageNameInput.closest('.input-group');
    inputGroup.appendChild(errorDiv);
    
    // Remove after 3 seconds
    setTimeout(() => {
        errorDiv.remove();
    }, 3000);
}

// Close suggestions when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('.input-wrapper') && !e.target.closest('.suggestions')) {
        hideSuggestions();
    }
});

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    console.log('BevyFinder initialized!');
    console.log('Available beverages:', Object.keys(beverageDatabase));
});

// Dashboard Functions
function showDashboard() {
    hideAllPages();
    const dashboardPage = document.getElementById('dashboard-page');
    
    if (dashboardPage) {
        dashboardPage.style.display = 'block';
        updateDashboardContent();
    }
}

function updateDashboardContent() {
    const user = auth.getCurrentUser();
    if (!user) return;

    const container = document.getElementById('dashboard-container');
    const emptyDashboard = document.getElementById('empty-dashboard');

    if (!user.stats || (user.stats.searches === 0 && user.stats.favorites === 0)) {
        container.style.display = 'none';
        emptyDashboard.style.display = 'flex';
        return;
    }

    container.style.display = 'block';
    emptyDashboard.style.display = 'none';

    container.innerHTML = `
        <div class="dashboard-stats">
            <div class="stat-card">
                <i class="fas fa-search"></i>
                <div class="stat-info">
                    <span class="stat-value">${user.stats.searches || 0}</span>
                    <span class="stat-label">Total Searches</span>
                </div>
            </div>
            <div class="stat-card">
                <i class="fas fa-heart"></i>
                <div class="stat-info">
                    <span class="stat-value">${user.stats.favorites || 0}</span>
                    <span class="stat-label">Favorites</span>
                </div>
            </div>
            <div class="stat-card">
                <i class="fas fa-star"></i>
                <div class="stat-info">
                    <span class="stat-value">${user.profile?.preferences?.favoriteDrinks?.length || 0}</span>
                    <span class="stat-label">Drinks Rated</span>
                </div>
            </div>
        </div>

        <div class="dashboard-sections">
            <div class="dashboard-section">
                <h3><i class="fas fa-chart-line"></i> Recent Activity</h3>
                <div class="recent-activity" id="recent-activity">
                    <!-- Recent activity will be populated here -->
                </div>
            </div>

            <div class="dashboard-section">
                <h3><i class="fas fa-trophy"></i> Top Favorites</h3>
                <div class="top-favorites" id="top-favorites">
                    <!-- Top favorites will be populated here -->
                </div>
            </div>
        </div>
    `;

    // Populate recent activity
    populateRecentActivity();
    
    // Populate top favorites
    populateTopFavorites();
}

function populateRecentActivity() {
    const recentActivity = document.getElementById('recent-activity');
    if (!recentActivity) return;

    const user = auth.getCurrentUser();
    const history = searchHistory.slice(0, 5); // Last 5 searches

    if (history.length === 0) {
        recentActivity.innerHTML = '<p class="no-activity">No recent activity</p>';
        return;
    }

    recentActivity.innerHTML = history.map(item => {
        const beverage = beverageDatabase[item.beverageKey];
        if (!beverage) return '';
        
        return `
            <div class="activity-item">
                <div class="activity-icon">
                    <i class="fas fa-search"></i>
                </div>
                <div class="activity-content">
                    <div class="activity-title">${beverage.name}</div>
                    <div class="activity-time">${item.time} - ${item.date}</div>
                </div>
            </div>
        `;
    }).join('');
}

function populateTopFavorites() {
    const topFavorites = document.getElementById('top-favorites');
    if (!topFavorites) return;

    const user = auth.getCurrentUser();
    const favorites = user.profile?.preferences?.favoriteDrinks || [];

    if (favorites.length === 0) {
        topFavorites.innerHTML = '<p class="no-favorites">No favorites yet</p>';
        return;
    }

    const topFavoritesList = favorites.slice(0, 5).map(drinkKey => {
        const beverage = beverageDatabase[drinkKey];
        if (!beverage) return '';
        
        return `
            <div class="favorite-item">
                <div class="favorite-icon">
                    <i class="fas fa-heart"></i>
                </div>
                <div class="favorite-content">
                    <div class="favorite-title">${beverage.name}</div>
                    <div class="favorite-type">${beverage.type} • ${beverage.abv}</div>
                </div>
            </div>
        `;
    }).join('');

    topFavorites.innerHTML = topFavoritesList;
}

// Dashboard Functions
function showDashboard() {
    hideAllPages();
    const dashboardPage = document.getElementById('dashboard-page');
    
    if (dashboardPage) {
        dashboardPage.style.display = 'block';
        updateDashboardContent();
    }
}

function updateDashboardContent() {
    const user = auth.getCurrentUser();
    if (!user) return;

    const container = document.getElementById('dashboard-container');
    const emptyDashboard = document.getElementById('empty-dashboard');

    if (!user.stats || (user.stats.searches === 0 && user.stats.favorites === 0)) {
        container.style.display = 'none';
        emptyDashboard.style.display = 'flex';
        return;
    }

    container.style.display = 'block';
    emptyDashboard.style.display = 'none';

    container.innerHTML = `
        <div class="dashboard-stats">
            <div class="stat-card">
                <i class="fas fa-search"></i>
                <div class="stat-info">
                    <span class="stat-value">${user.stats.searches || 0}</span>
                    <span class="stat-label">Total Searches</span>
                </div>
            </div>
            <div class="stat-card">
                <i class="fas fa-heart"></i>
                <div class="stat-info">
                    <span class="stat-value">${user.stats.favorites || 0}</span>
                    <span class="stat-label">Favorites</span>
                </div>
            </div>
            <div class="stat-card">
                <i class="fas fa-star"></i>
                <div class="stat-info">
                    <span class="stat-value">${user.profile?.preferences?.favoriteDrinks?.length || 0}</span>
                    <span class="stat-label">Drinks Rated</span>
                </div>
            </div>
        </div>

        <div class="dashboard-sections">
            <div class="dashboard-section">
                <h3><i class="fas fa-chart-line"></i> Recent Activity</h3>
                <div class="recent-activity" id="recent-activity">
                    <!-- Recent activity will be populated here -->
                </div>
            </div>

            <div class="dashboard-section">
                <h3><i class="fas fa-trophy"></i> Top Favorites</h3>
                <div class="top-favorites" id="top-favorites">
                    <!-- Top favorites will be populated here -->
                </div>
            </div>
        </div>
    `;

    // Populate recent activity
    populateRecentActivity();
    
    // Populate top favorites
    populateTopFavorites();
}

function populateRecentActivity() {
    const recentActivity = document.getElementById('recent-activity');
    if (!recentActivity) return;

    const user = auth.getCurrentUser();
    const history = searchHistory.slice(0, 5); // Last 5 searches

    if (history.length === 0) {
        recentActivity.innerHTML = '<p class="no-activity">No recent activity</p>';
        return;
    }

    recentActivity.innerHTML = history.map(item => {
        const beverage = beverageDatabase[item.beverageKey];
        if (!beverage) return '';
        
        return `
            <div class="activity-item">
                <div class="activity-icon">
                    <i class="fas fa-search"></i>
                </div>
                <div class="activity-content">
                    <div class="activity-title">${beverage.name}</div>
                    <div class="activity-time">${item.time} - ${item.date}</div>
                </div>
            </div>
        `;
    }).join('');
}

function populateTopFavorites() {
    const topFavorites = document.getElementById('top-favorites');
    if (!topFavorites) return;

    const user = auth.getCurrentUser();
    const favorites = user.profile?.preferences?.favoriteDrinks || [];

    if (favorites.length === 0) {
        topFavorites.innerHTML = '<p class="no-favorites">No favorites yet</p>';
        return;
    }

    const topFavoritesList = favorites.slice(0, 5).map(drinkKey => {
        const beverage = beverageDatabase[drinkKey];
        if (!beverage) return '';
        
        return `
            <div class="favorite-item">
                <div class="favorite-icon">
                    <i class="fas fa-heart"></i>
                </div>
                <div class="favorite-content">
                    <div class="favorite-title">${beverage.name}</div>
                    <div class="favorite-type">${beverage.type} • ${beverage.abv}</div>
                </div>
            </div>
        `;
    }).join('');

    topFavorites.innerHTML = topFavoritesList;
}

// User Profile Functions
function showUserProfile() {
    hideAllPages();
    
    // Create profile page if it doesn't exist
    let profilePage = document.getElementById('profile-page');
    if (!profilePage) {
        profilePage = createProfilePage();
        document.body.appendChild(profilePage);
    }
    
    profilePage.style.display = 'block';
    updateProfileContent();
    
    if (typeof analytics !== 'undefined') {
        analytics.trackPageView('profile');
    }
}

function createProfilePage() {
    const profilePage = document.createElement('div');
    profilePage.id = 'profile-page';
    profilePage.className = 'profile-page';
    profilePage.style.display = 'none';
    
    profilePage.innerHTML = `
        <header class="header">
            <h1 class="logo-clickable" onclick="goToWelcomePage()"><i class="fas fa-wine-glass-alt"></i> BevyFinder</h1>
            <p>Your Personal Profile & Account Details</p>
        </header>

        <main class="main-content">
            <div class="profile-container">
                <div class="profile-section">
                    <h3><i class="fas fa-user-circle"></i> Account Information</h3>
                    <div class="profile-info">
                        <div class="info-item">
                            <label><i class="fas fa-user"></i> Full Name:</label>
                            <span id="profile-name" class="profile-value"></span>
                        </div>
                        <div class="info-item">
                            <label><i class="fas fa-envelope"></i> Email Address:</label>
                            <span id="profile-email" class="profile-value"></span>
                        </div>
                        <div class="info-item">
                            <label><i class="fas fa-calendar-alt"></i> Member Since:</label>
                            <span id="profile-created" class="profile-value"></span>
                        </div>
                        <div class="info-item">
                            <label><i class="fas fa-clock"></i> Last Active:</label>
                            <span id="profile-last-active" class="profile-value"></span>
                        </div>
                        <div class="info-item">
                            <label><i class="fas fa-id-badge"></i> User ID:</label>
                            <span id="profile-id" class="profile-value"></span>
                        </div>
                    </div>
                </div>

                <div class="profile-section">
                    <h3><i class="fas fa-user-cog"></i> Personal Details</h3>
                    <div class="profile-info">
                        <div class="info-item">
                            <label><i class="fas fa-birthday-cake"></i> Age:</label>
                            <span id="profile-age" class="profile-value"></span>
                        </div>
                        <div class="info-item">
                            <label><i class="fas fa-weight"></i> Weight:</label>
                            <span id="profile-weight" class="profile-value"></span>
                        </div>
                        <div class="info-item">
                            <label><i class="fas fa-ruler-vertical"></i> Height:</label>
                            <span id="profile-height" class="profile-value"></span>
                        </div>
                        <div class="info-item">
                            <label><i class="fas fa-venus-mars"></i> Gender:</label>
                            <span id="profile-gender" class="profile-value"></span>
                        </div>
                    </div>
                </div>

                <div class="profile-section">
                    <h3><i class="fas fa-chart-bar"></i> Activity Statistics</h3>
                    <div class="stats-grid">
                        <div class="stat-card">
                            <i class="fas fa-search"></i>
                            <div class="stat-info">
                                <span class="stat-value" id="profile-searches">0</span>
                                <span class="stat-label">Total Searches</span>
                            </div>
                        </div>
                        <div class="stat-card">
                            <i class="fas fa-heart"></i>
                            <div class="stat-info">
                                <span class="stat-value" id="profile-favorites">0</span>
                                <span class="stat-label">Favorite Drinks</span>
                            </div>
                        </div>
                        <div class="stat-card">
                            <i class="fas fa-star"></i>
                            <div class="stat-info">
                                <span class="stat-value" id="profile-reviews">0</span>
                                <span class="stat-label">Reviews Written</span>
                            </div>
                        </div>
                        <div class="stat-card">
                            <i class="fas fa-trophy"></i>
                            <div class="stat-info">
                                <span class="stat-value" id="profile-level">New</span>
                                <span class="stat-label">Member Level</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="profile-section">
                    <h3><i class="fas fa-heart"></i> Your Favorite Drinks</h3>
                    <div class="favorites-list" id="profile-favorites-list">
                        <!-- Favorites will be populated here -->
                    </div>
                </div>

                <div class="profile-section">
                    <h3><i class="fas fa-cog"></i> Account Actions</h3>
                    <div class="profile-actions">
                        <button class="profile-btn primary" onclick="editProfile()">
                            <i class="fas fa-edit"></i>
                            Edit Profile
                        </button>
                        <button class="profile-btn secondary" onclick="exportData()">
                            <i class="fas fa-download"></i>
                            Export Data
                        </button>
                        <button class="profile-btn danger" onclick="auth.signOut()">
                            <i class="fas fa-sign-out-alt"></i>
                            Sign Out
                        </button>
                    </div>
                </div>
            </div>
        </main>
    `;
    
    return profilePage;
}

function updateProfileContent() {
    const user = auth.getCurrentUser();
    if (!user) return;

    // Update basic info
    document.getElementById('profile-name').textContent = user.name;
    document.getElementById('profile-email').textContent = user.email;
    document.getElementById('profile-created').textContent = new Date(user.createdAt).toLocaleDateString('en-AU', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    document.getElementById('profile-last-active').textContent = new Date(user.stats.lastActive).toLocaleDateString('en-AU', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    document.getElementById('profile-id').textContent = user.id;
    
    // Update personal details
    if (user.personalDetails) {
        document.getElementById('profile-age').textContent = user.personalDetails.age ? `${user.personalDetails.age} years` : 'Not set';
        document.getElementById('profile-weight').textContent = user.personalDetails.weight ? `${user.personalDetails.weight} kg` : 'Not set';
        document.getElementById('profile-height').textContent = user.personalDetails.height ? `${user.personalDetails.height} cm` : 'Not set';
        document.getElementById('profile-gender').textContent = user.personalDetails.gender ? user.personalDetails.gender.charAt(0).toUpperCase() + user.personalDetails.gender.slice(1) : 'Not set';
    } else {
        document.getElementById('profile-age').textContent = 'Not set';
        document.getElementById('profile-weight').textContent = 'Not set';
        document.getElementById('profile-height').textContent = 'Not set';
        document.getElementById('profile-gender').textContent = 'Not set';
    }
    
    // Update stats
    document.getElementById('profile-searches').textContent = user.stats.searches || 0;
    document.getElementById('profile-favorites').textContent = user.stats.favorites || 0;
    document.getElementById('profile-reviews').textContent = '0'; // Will be updated when reviews are implemented
    document.getElementById('profile-level').textContent = getMemberLevel(user.stats.searches);
    
    // Update favorites list
    const favoritesList = document.getElementById('profile-favorites-list');
    const favorites = user.profile.preferences.favoriteDrinks || [];
    
    if (favorites.length === 0) {
        favoritesList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-heart"></i>
                <h3>No favorites yet</h3>
                <p>Start exploring drinks to add them to your favorites!</p>
                <button class="start-exploring-btn" onclick="goToHome()">
                    <i class="fas fa-search"></i>
                    Start Exploring
                </button>
            </div>
        `;
    } else {
        favoritesList.innerHTML = favorites.map(drinkKey => {
            const drink = beverageDatabase[drinkKey];
            if (drink) {
                return `
                    <div class="favorite-drink-item">
                        <div class="drink-info">
                            <h4>${drink.name}</h4>
                            <span class="drink-type">${drink.type}</span>
                            <span class="drink-abv">${drink.abv}% ABV</span>
                        </div>
                        <div class="drink-actions">
                            <button class="drink-btn" onclick="viewFavorite('${drinkKey}')" title="View Details">
                                <i class="fas fa-eye"></i>
                            </button>
                            <button class="drink-btn remove" onclick="removeFromFavorites('${drinkKey}')" title="Remove from Favorites">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                `;
            }
            return '';
        }).join('');
    }
}

// Helper function to determine member level
function getMemberLevel(searches) {
    if (searches >= 100) return 'Expert';
    if (searches >= 50) return 'Enthusiast';
    if (searches >= 20) return 'Regular';
    if (searches >= 5) return 'Beginner';
    return 'New';
}

// Profile action functions
function editProfile() {
    const user = auth.getCurrentUser();
    if (!user) {
        showNotification('Please sign in to edit your profile', 'error');
        return;
    }
    
    // Create edit profile form
    const editForm = document.createElement('div');
    editForm.className = 'edit-profile-modal';
    editForm.innerHTML = `
        <div class="edit-profile-overlay">
            <div class="edit-profile-container">
                <div class="edit-profile-header">
                    <h3><i class="fas fa-edit"></i> Edit Profile</h3>
                    <button class="close-edit-btn" onclick="closeEditProfile()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                
                <form class="edit-profile-form" id="edit-profile-form">
                    <div class="form-section">
                        <h4><i class="fas fa-user"></i> Account Information</h4>
                        <div class="form-group">
                            <label for="edit-name">Full Name</label>
                            <input type="text" id="edit-name" value="${user.name}" required>
                        </div>
                        <div class="form-group">
                            <label for="edit-email">Email Address</label>
                            <input type="email" id="edit-email" value="${user.email}" required>
                        </div>
                    </div>
                    
                    <div class="form-section">
                        <h4><i class="fas fa-lock"></i> Security</h4>
                        <div class="form-group">
                            <label for="edit-password">New Password (leave blank to keep current)</label>
                            <input type="password" id="edit-password" placeholder="Enter new password">
                        </div>
                        <div class="form-group">
                            <label for="edit-confirm-password">Confirm New Password</label>
                            <input type="password" id="edit-confirm-password" placeholder="Confirm new password">
                        </div>
                    </div>
                    
                    <div class="form-section">
                        <h4><i class="fas fa-user-cog"></i> Personal Details</h4>
                        <div class="form-group">
                            <label for="edit-age">Age</label>
                            <input type="number" id="edit-age" value="${user.personalDetails?.age || ''}" min="18" max="120" required>
                        </div>
                        <div class="form-group">
                            <label for="edit-weight">Weight (kg)</label>
                            <input type="number" id="edit-weight" value="${user.personalDetails?.weight || ''}" min="30" max="300" step="0.1" required>
                        </div>
                        <div class="form-group">
                            <label for="edit-height">Height (cm)</label>
                            <input type="number" id="edit-height" value="${user.personalDetails?.height || ''}" min="100" max="250" required>
                        </div>
                        <div class="form-group">
                            <label for="edit-gender">Gender</label>
                            <select id="edit-gender" required>
                                <option value="">Select gender</option>
                                <option value="male" ${user.personalDetails?.gender === 'male' ? 'selected' : ''}>Male</option>
                                <option value="female" ${user.personalDetails?.gender === 'female' ? 'selected' : ''}>Female</option>
                                <option value="other" ${user.personalDetails?.gender === 'other' ? 'selected' : ''}>Other</option>
                            </select>
                        </div>
                    </div>
                    
                    <div class="edit-profile-actions">
                        <button type="button" class="cancel-btn" onclick="closeEditProfile()">
                            <i class="fas fa-times"></i> Cancel
                        </button>
                        <button type="submit" class="save-btn">
                            <i class="fas fa-save"></i> Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    document.body.appendChild(editForm);
    
    // Add form submission handler
    document.getElementById('edit-profile-form').addEventListener('submit', handleProfileUpdate);
}

function closeEditProfile() {
    const modal = document.querySelector('.edit-profile-modal');
    if (modal) {
        modal.remove();
    }
}

async function handleProfileUpdate(event) {
    event.preventDefault();
    
    const user = auth.getCurrentUser();
    if (!user) {
        showNotification('Please sign in to update your profile', 'error');
        return;
    }
    
    // Get form values
    const name = document.getElementById('edit-name').value.trim();
    const email = document.getElementById('edit-email').value.trim();
    const password = document.getElementById('edit-password').value;
    const confirmPassword = document.getElementById('edit-confirm-password').value;
    const age = parseInt(document.getElementById('edit-age').value);
    const weight = parseFloat(document.getElementById('edit-weight').value);
    const height = parseInt(document.getElementById('edit-height').value);
    const gender = document.getElementById('edit-gender').value;
    
    // Validation
    if (!name || !email) {
        showNotification('Name and email are required', 'error');
        return;
    }
    
    if (password && password !== confirmPassword) {
        showNotification('Passwords do not match', 'error');
        return;
    }
    
    if (age < 18 || age > 120) {
        showNotification('Age must be between 18 and 120', 'error');
        return;
    }
    
    if (weight < 30 || weight > 300) {
        showNotification('Weight must be between 30 and 300 kg', 'error');
        return;
    }
    
    if (height < 100 || height > 250) {
        showNotification('Height must be between 100 and 250 cm', 'error');
        return;
    }
    
    if (!gender) {
        showNotification('Please select your gender', 'error');
        return;
    }
    
    try {
        // Prepare update data
        const updateData = {
            name,
            email,
            personalDetails: {
                age,
                weight,
                height,
                gender
            }
        };
        
        // Add password if provided
        if (password) {
            updateData.password = password;
        }
        
        // Update profile
        await auth.updateProfile(updateData);
        
        showNotification('Profile updated successfully!', 'success');
        closeEditProfile();
        
        // Refresh profile display
        updateProfileContent();
        
    } catch (error) {
        showNotification('Failed to update profile: ' + error.message, 'error');
    }
}

function exportData() {
    const user = auth.getCurrentUser();
    if (!user) return;
    
    const data = {
        user: {
            name: user.name,
            email: user.email,
            createdAt: user.createdAt,
            stats: user.stats,
            favorites: user.profile.preferences.favoriteDrinks
        },
        exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bevyfinder-data-${user.name}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showNotification('Data exported successfully!', 'success');
}

// Night Tracker Functions
function showTrackingPage() {
    // Check if user is authenticated
    if (!auth.isUserAuthenticated()) {
        showNotification('Please sign in to access the Night Tracker', 'error');
        showAuthPage();
        return;
    }
    
    hideAllPages();
    trackingPage.style.display = 'block';
    loadTrackingSession();
    updateTrackingDisplay();
}

function loadTrackingSession() {
    const savedSession = localStorage.getItem('bevyfinder_tracking_session');
    if (savedSession) {
        currentSession = JSON.parse(savedSession);
        if (currentSession.isActive) {
            startSessionTimer();
        }
    }
}

function saveTrackingSession() {
    localStorage.setItem('bevyfinder_tracking_session', JSON.stringify(currentSession));
}

function startSession() {
    currentSession.isActive = true;
    currentSession.startTime = new Date().toISOString();
    currentSession.drinks = [];
    currentSession.totalAlcohol = 0;
    currentSession.totalCalories = 0;
    currentSession.totalCarbs = 0;

    currentSession.totalSugar = 0;
    currentSession.totalFat = 0;
    
    saveTrackingSession();
    startSessionTimer();
    updateTrackingDisplay();
    updateSessionButtons();
}

function endSession() {
    currentSession.isActive = false;
    saveTrackingSession();
    stopSessionTimer();
    updateTrackingDisplay();
    updateSessionButtons();
}

function resetSession() {
    currentSession = {
        isActive: false,
        startTime: null,
        drinks: [],
        totalAlcohol: 0,
        totalCalories: 0,
        totalCarbs: 0,

        totalSugar: 0,
        totalFat: 0
    };
    
    saveTrackingSession();
    stopSessionTimer();
    updateTrackingDisplay();
    updateSessionButtons();
}

function startSessionTimer() {
    if (currentSession.timerInterval) {
        clearInterval(currentSession.timerInterval);
    }
    
    currentSession.timerInterval = setInterval(() => {
        updateSessionTime();
    }, 1000);
}

function stopSessionTimer() {
    if (currentSession.timerInterval) {
        clearInterval(currentSession.timerInterval);
        currentSession.timerInterval = null;
    }
}

function updateSessionTime() {
    if (!currentSession.isActive || !currentSession.startTime) {
        sessionTime.textContent = '00:00:00';
        return;
    }
    
    const startTime = new Date(currentSession.startTime);
    const now = new Date();
    const diff = now - startTime;
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    sessionTime.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function updateSessionButtons() {
    if (currentSession.isActive) {
        startSessionBtn.style.display = 'none';
        endSessionBtn.style.display = 'inline-block';
        resetSessionBtn.style.display = 'inline-block';
    } else {
        startSessionBtn.style.display = 'inline-block';
        endSessionBtn.style.display = 'none';
        resetSessionBtn.style.display = currentSession.drinks.length > 0 ? 'inline-block' : 'none';
    }
}

function updateTrackingDisplay() {
    // Update summary cards
    totalAlcohol.textContent = currentSession.totalAlcohol.toFixed(1);
    totalCalories.textContent = Math.round(currentSession.totalCalories);
    totalCarbs.textContent = Math.round(currentSession.totalCarbs);
    totalSugar.textContent = Math.round(currentSession.totalSugar);
    totalFat.textContent = Math.round(currentSession.totalFat);
    
    // Update detailed nutrition display
    const totalCaloriesDetailed = document.getElementById('total-calories-detailed');
    if (totalCaloriesDetailed) {
        totalCaloriesDetailed.textContent = Math.round(currentSession.totalCalories);
    }
    
    // Update sobriety status
    updateSobrietyStatus();
    
    // Update drink list
    updateDrinkList();
    
    // Update session buttons
    updateSessionButtons();
    
    // Update session time
    updateSessionTime();
}

function updateSobrietyStatus() {
    const user = auth.getCurrentUser();
    let status, details, className, bac = 0;
    
    if (currentSession.totalAlcohol === 0) {
        status = 'Sober';
        details = 'No alcohol consumed';
        className = 'sober';
    } else {
        // Calculate BAC using AI-enhanced algorithm
        bac = calculateBAC(user);
        
        // AI-powered intoxication assessment
        const intoxicationData = assessIntoxication(bac, user);
        status = intoxicationData.status;
        details = intoxicationData.details;
        className = intoxicationData.className;
    }
    
    sobrietyStatus.textContent = status;
    sobrietyDetails.textContent = details;
    
    // Update BAC display
    if (bacLevel) {
        bacLevel.textContent = `BAC: ${(bac * 1000).toFixed(3)}%`;
        
        // Color code BAC level based on realistic thresholds
        if (bac < 0.03) {
            bacLevel.style.color = '#4CAF50'; // Green - Safe
        } else if (bac < 0.08) {
            bacLevel.style.color = '#8BC34A'; // Light Green - Caution
        } else if (bac < 0.15) {
            bacLevel.style.color = '#ff9800'; // Orange - Warning
        } else if (bac < 0.25) {
            bacLevel.style.color = '#f44336'; // Red - Danger
        } else if (bac < 0.35) {
            bacLevel.style.color = '#9c27b0'; // Purple - Critical
        } else {
            bacLevel.style.color = '#000000'; // Black - Extreme Danger
        }
    }
    
    // Update CSS class
    const sobrietyCard = sobrietyStatus.closest('.summary-card');
    sobrietyCard.className = `summary-card sobriety-card ${className}`;
    
    // Store BAC for other calculations
    currentSession.currentBAC = bac;
}

function calculateBAC(user) {
    if (!user || !user.personalDetails) {
        // Fallback to simple calculation if no personal details
        return currentSession.totalAlcohol * 0.02; // Simple fallback
    }
    
    const { age, weight, height, gender } = user.personalDetails;
    
    // Calculate time since first drink
    const sessionStart = currentSession.startTime ? new Date(currentSession.startTime) : new Date();
    const now = new Date();
    const hoursElapsed = (now - sessionStart) / (1000 * 60 * 60);
    
    // Simplified but realistic BAC calculation
    // 1 standard drink = 14g pure alcohol
    const totalAlcoholGrams = currentSession.totalAlcohol * 14;
    
    // Widmark factor (r) - standard values
    const r = gender === 'male' ? 0.68 : 0.55;
    const weightGrams = weight * 1000;
    
    // Widmark formula: BAC = (A / (r * W)) * 100 - (β * t)
    let bac = (totalAlcoholGrams / (r * weightGrams)) * 100;
    
    // Metabolism rate (β) - standard values
    const metabolismRate = gender === 'male' ? 0.015 : 0.017;
    bac -= (metabolismRate * hoursElapsed);
    
    // Ensure BAC doesn't go below 0
    return Math.max(0, bac);
}

function getWidmarkFactor(gender, age, weight, height) {
    // Realistic Widmark factor calculation
    let baseFactor = gender === 'male' ? 0.68 : 0.55;
    
    // Age adjustments (minimal impact)
    if (age < 25) baseFactor *= 0.98; // Slightly faster in young adults
    else if (age > 65) baseFactor *= 1.02; // Slightly slower in elderly
    
    // BMI adjustments (minimal impact)
    const heightMeters = height / 100;
    const bmi = weight / (heightMeters * heightMeters);
    if (bmi > 30) baseFactor *= 1.02; // Slight impact for high BMI
    else if (bmi < 18.5) baseFactor *= 0.98; // Slight impact for low BMI
    
    return baseFactor;
}

function getMetabolismRate(gender, age, weight) {
    // Realistic metabolism rate calculation
    let baseRate = gender === 'male' ? 0.015 : 0.017; // Standard rates per hour
    
    // Age adjustments (minimal impact)
    if (age < 25) baseRate *= 1.02; // Slightly faster in young adults
    else if (age > 65) baseRate *= 0.98; // Slightly slower in elderly
    
    // Weight adjustments (minimal impact)
    if (weight < 60) baseRate *= 1.01; // Very slight impact for lighter people
    else if (weight > 100) baseRate *= 0.99; // Very slight impact for heavier people
    
    return baseRate;
}

function assessIntoxication(bac, user) {
    // Realistic intoxication assessment based on real-world BAC levels
    const { age, gender } = user?.personalDetails || {};
    
    let status, details, className;
    
    if (bac === 0) {
        status = 'Sober';
        details = 'No alcohol detected';
        className = 'sober';
    } else if (bac < 0.03) {
        status = 'Sober';
        details = 'Minimal effects - safe to drive';
        className = 'sober';
    } else if (bac < 0.05) {
        status = 'Slightly Buzzed';
        details = 'Mild euphoria - judgment may be slightly impaired';
        className = 'buzzed';
    } else if (bac < 0.08) {
        status = 'Buzzed';
        details = 'Relaxed, talkative - coordination slightly affected';
        className = 'buzzed';
    } else if (bac < 0.10) {
        status = 'Legally Impaired';
        details = 'Illegal to drive - judgment and coordination impaired';
        className = 'drunk';
    } else if (bac < 0.15) {
        status = 'Drunk';
        details = 'Clear impairment - do not drive, seek safe transport';
        className = 'drunk';
    } else if (bac < 0.20) {
        status = 'Very Drunk';
        details = 'Severe impairment - slurred speech, poor coordination';
        className = 'very-drunk';
    } else if (bac < 0.25) {
        status = 'Heavily Intoxicated';
        details = 'Confusion, disorientation - medical attention advised';
        className = 'very-drunk';
    } else if (bac < 0.35) {
        status = 'Severely Intoxicated';
        details = 'Stupor, unconsciousness possible - seek medical help';
        className = 'very-drunk';
    } else if (bac < 0.45) {
        status = 'Dangerously Intoxicated';
        details = 'Coma, death possible - call emergency services immediately';
        className = 'very-drunk';
    } else {
        status = 'Life-Threatening';
        details = 'Extreme danger - call emergency services immediately';
        className = 'very-drunk';
    }
    
    // Add personalized warnings
    if (age && age < 21) {
        details += ' (Underage drinking is illegal)';
    }
    
    if (bac >= 0.08) {
        details += ' - DO NOT DRIVE';
    } else if (bac >= 0.05) {
        details += ' - Consider alternative transportation';
    }
    
    // Add health warnings for high BAC
    if (bac >= 0.20) {
        details += ' - Seek medical attention if symptoms worsen';
    }
    
    return { status, details, className };
}

function updateDrinkList() {
    if (currentSession.drinks.length === 0) {
        drinkList.style.display = 'none';
        emptyDrinks.style.display = 'block';
        return;
    }
    
    drinkList.style.display = 'block';
    emptyDrinks.style.display = 'none';
    
    drinkList.innerHTML = '';
    
    currentSession.drinks.forEach((drink, index) => {
        const drinkItem = document.createElement('div');
        drinkItem.className = 'drink-item';
        drinkItem.innerHTML = `
            <div class="drink-info">
                <div class="drink-name">${drink.name}</div>
                <div class="drink-details">
                    ${drink.servingSize}ml • ${drink.abv}% ABV • ${Math.round(drink.calories)} cal
                </div>
                <div class="drink-time">${drink.time}</div>
            </div>
            <button class="drink-remove" onclick="removeDrink(${index})">
                <i class="fas fa-times"></i>
            </button>
        `;
        drinkList.appendChild(drinkItem);
    });
}

function addDrink() {
    const searchValue = trackingDrinkSearch.value.trim();
    if (!searchValue) {
        showNotification('Please enter a drink name', 'error');
        return;
    }
    
    // Find drink in database
    const drink = findDrinkByName(searchValue);
    if (!drink) {
        showNotification('Drink not found. Please try a different name.', 'error');
        return;
    }
    
    // Add drink to session
    const drinkEntry = {
        name: drink.name,
        servingSize: drink.servingSize || 330,
        abv: drink.abv || 5,
        calories: drink.calories || 150,
        carbs: drink.carbs || 15,
        sugar: drink.sugar || 5,
        fat: drink.fat || 0,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    currentSession.drinks.push(drinkEntry);
    
    // Update totals
    currentSession.totalAlcohol += (drinkEntry.servingSize * drinkEntry.abv / 100) / 10; // Standard drinks
    currentSession.totalCalories += drinkEntry.calories;
    currentSession.totalCarbs += drinkEntry.carbs;
    currentSession.totalSugar += drinkEntry.sugar;
    currentSession.totalFat += drinkEntry.fat;
    
    saveTrackingSession();
    updateTrackingDisplay();
    
    // Clear search
    trackingDrinkSearch.value = '';
    hideTrackingSuggestions();
    
    showNotification(`Added ${drinkEntry.name}`, 'success');
}

function removeDrink(index) {
    const drink = currentSession.drinks[index];
    
    // Subtract from totals
    currentSession.totalAlcohol -= (drink.servingSize * drink.abv / 100) / 10;
    currentSession.totalCalories -= drink.calories;
    currentSession.totalCarbs -= drink.carbs;
    currentSession.totalSugar -= drink.sugar;
    currentSession.totalFat -= drink.fat;
    
    // Remove drink
    currentSession.drinks.splice(index, 1);
    
    saveTrackingSession();
    updateTrackingDisplay();
    
    showNotification(`Removed ${drink.name}`, 'success');
}

function findDrinkByName(name) {
    const searchTerm = name.toLowerCase();
    
    for (const [key, drink] of Object.entries(beverageDatabase)) {
        if (drink.name.toLowerCase().includes(searchTerm)) {
            return { ...drink, key };
        }
    }
    
    return null;
}

function showTrackingSuggestions(query) {
    if (!query.trim()) {
        hideTrackingSuggestions();
        return;
    }
    
    const suggestions = [];
    const searchTerm = query.toLowerCase();
    
    for (const [key, drink] of Object.entries(beverageDatabase)) {
        if (drink.name.toLowerCase().includes(searchTerm)) {
            suggestions.push({ ...drink, key });
        }
        
        if (suggestions.length >= 5) break;
    }
    
    if (suggestions.length > 0) {
        trackingDrinkSuggestions.innerHTML = '';
        suggestions.forEach(drink => {
            const suggestion = document.createElement('div');
            suggestion.className = 'suggestion-item';
            suggestion.textContent = drink.name;
            suggestion.onclick = () => {
                trackingDrinkSearch.value = drink.name;
                hideTrackingSuggestions();
            };
            trackingDrinkSuggestions.appendChild(suggestion);
        });
        trackingDrinkSuggestions.style.display = 'block';
    } else {
        hideTrackingSuggestions();
    }
}

function hideTrackingSuggestions() {
    trackingDrinkSuggestions.style.display = 'none';
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

function showAuthPage() {
    hideAllPages();
    const authPage = document.getElementById('auth-page');
    if (authPage) {
        authPage.style.display = 'block';
    }
}

// Profile Menu Functions
function toggleProfileMenu() {
    const profileMenu = document.getElementById('profile-menu');
    const isVisible = profileMenu.style.display !== 'none';
    
    if (isVisible) {
        profileMenu.style.display = 'none';
    } else {
        profileMenu.style.display = 'block';
        updateProfileMenuContent();
    }
}

function updateProfileMenuContent() {
    const username = document.getElementById('profile-menu-username');
    const signinBtn = document.getElementById('profile-menu-signin');
    const signupBtn = document.getElementById('profile-menu-signup');
    const profileBtn = document.getElementById('profile-menu-profile');
    const signoutBtn = document.getElementById('profile-menu-signout');
    
    if (auth.isAuthenticated && auth.currentUser) {
        username.textContent = auth.currentUser.name;
        signinBtn.style.display = 'none';
        signupBtn.style.display = 'none';
        profileBtn.style.display = 'block';
        signoutBtn.style.display = 'block';
    } else {
        username.textContent = 'Guest';
        signinBtn.style.display = 'block';
        signupBtn.style.display = 'block';
        profileBtn.style.display = 'none';
        signoutBtn.style.display = 'none';
    }
}

// Pinboard Dashboard Functions
function showFeaturedPage() {
    hideAllPages();
    const featuredPage = document.getElementById('featured-page');
    if (featuredPage) {
        featuredPage.style.display = 'flex';
        loadFeaturedDrinks();
    } else {
        showNotification('Featured page coming soon!', 'info');
    }
}

function showFriendsPage() {
    showNotification('Friends page coming soon!', 'info');
}

function showSettings() {
    showNotification('Settings page coming soon!', 'info');
}

function showAbout() {
    showNotification('About page coming soon!', 'info');
}

// Featured page functionality
async function loadFeaturedDrinks() {
    try {
        // Get like counts for all drinks
        const likeCounts = JSON.parse(localStorage.getItem('bevyfinder_like_counts') || '{}');
        
        // Sort drinks by like count (descending)
        const sortedDrinks = Object.entries(likeCounts)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 10) // Top 10
            .map(([beverageKey, likeCount]) => ({
                beverageKey,
                likeCount,
                beverage: beverageDatabase[beverageKey]
            }))
            .filter(item => item.beverage); // Only include drinks that exist in database

        displayFeaturedDrinks(sortedDrinks);
    } catch (error) {
        console.error('Error loading featured drinks:', error);
        showNotification('Failed to load featured drinks', 'error');
    }
}

function displayFeaturedDrinks(featuredDrinks) {
    const featuredContainer = document.getElementById('featured-container');
    if (!featuredContainer) return;

    if (featuredDrinks.length === 0) {
        featuredContainer.innerHTML = `
            <div class="empty-featured">
                <div class="empty-state">
                    <i class="fas fa-fire"></i>
                    <h3>No Featured Drinks Yet</h3>
                    <p>Start liking drinks to see them featured here!</p>
                    <button class="start-exploring-btn" onclick="goToHome()">
                        <i class="fas fa-search"></i>
                        Start Exploring
                    </button>
                </div>
            </div>
        `;
        return;
    }

    featuredContainer.innerHTML = featuredDrinks.map((item, index) => `
        <div class="featured-card" onclick="viewFeaturedDrink('${item.beverageKey}')">
            <div class="featured-rank">#${index + 1}</div>
            <div class="featured-info">
                <h3>${item.beverage.name}</h3>
                <p class="featured-type">${item.beverage.type}</p>
                <p class="featured-description">${item.beverage.description.substring(0, 100)}${item.beverage.description.length > 100 ? '...' : ''}</p>
                <div class="featured-stats">
                    <span class="like-count-display">
                        <i class="fas fa-thumbs-up"></i> ${item.likeCount} likes
                    </span>
                    <span class="abv-display">
                        <i class="fas fa-wine-bottle"></i> ${item.beverage.abv || 'N/A'}% ABV
                    </span>
                </div>
            </div>
            <div class="featured-actions">
                <button class="like-btn ${isLiked(item.beverageKey) ? 'liked' : ''}" 
                        onclick="event.stopPropagation(); ${isLiked(item.beverageKey) ? 'unlikeBeverage' : 'likeBeverage'}('${item.beverageKey}')">
                    <i class="${isLiked(item.beverageKey) ? 'fas' : 'far'} fa-thumbs-up"></i>
                </button>
                <button class="favorite-btn ${isFavorite(item.beverageKey) ? 'favorited' : ''}" 
                        onclick="event.stopPropagation(); ${isFavorite(item.beverageKey) ? 'removeFromFavorites' : 'addToFavorites'}('${item.beverageKey}')">
                    <i class="${isFavorite(item.beverageKey) ? 'fas' : 'far'} fa-heart"></i>
                </button>
            </div>
        </div>
    `).join('');
}

function viewFeaturedDrink(beverageKey) {
    const beverage = beverageDatabase[beverageKey];
    if (beverage) {
        goToHome();
        setTimeout(() => {
            displayBeverageInfo(beverage);
        }, 100);
    }
}

// Profile Functions
function signOut() {
    if (auth) {
        auth.signOut();
        showNotification('Signed out successfully!', 'success');
        // Close profile menu
        const profileMenu = document.getElementById('profile-menu');
        if (profileMenu) {
            profileMenu.style.display = 'none';
        }
    }
}

function showProfilePage() {
    showNotification('Profile page coming soon!', 'info');
    // Close profile menu
    const profileMenu = document.getElementById('profile-menu');
    if (profileMenu) {
        profileMenu.style.display = 'none';
    }
}



// Initialize authentication system

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    try {
    console.log('DOM Content Loaded - Initializing app...');
    
    // Initialize DOM elements
    welcomePage = document.getElementById('welcome-page');
    mainApp = document.getElementById('main-app');
    startBtn = document.getElementById('start-btn');
    
    console.log('DOM Elements found:', {
        welcomePage: !!welcomePage,
        mainApp: !!mainApp,
        startBtn: !!startBtn
    });
    tabBtns = document.querySelectorAll('.tab-btn');
    tabContents = document.querySelectorAll('.tab-content');
    beverageNameInput = document.getElementById('beverage-name');
    searchBtn = document.getElementById('search-btn');
    suggestions = document.getElementById('suggestions');
    uploadArea = document.getElementById('upload-area');
    previewArea = document.getElementById('preview-area');
    previewImage = document.getElementById('preview-image');
    removeBtn = document.getElementById('remove-btn');
    resultsSection = document.getElementById('results-section');
    beverageCard = document.getElementById('beverage-card');
    uploadBtn = document.getElementById('upload-btn');
    
    // Menu and Sidebar Elements
    menuBtn = document.getElementById('menu-btn');
    sidebar = document.getElementById('sidebar');
    closeMenuBtn = document.getElementById('close-menu-btn');
    sidebarOverlay = document.getElementById('sidebar-overlay');
    sidebarBtns = document.querySelectorAll('.sidebar-btn');
    
    console.log('Menu Elements found:', {
        menuBtn: !!menuBtn,
        sidebar: !!sidebar,
        closeMenuBtn: !!closeMenuBtn,
        sidebarOverlay: !!sidebarOverlay,
        sidebarBtns: sidebarBtns.length
    });
    
    // Favorites Elements
    favoritesPage = document.getElementById('favorites-page');
    favoritesContainer = document.getElementById('favorites-container');
    emptyFavorites = document.getElementById('empty-favorites');
    
    // History Elements
    historyPage = document.getElementById('history-page');
    historyContainer = document.getElementById('history-container');
    emptyHistory = document.getElementById('empty-history');
    historyActions = document.getElementById('history-actions');
    
    // Tracking Elements
    trackingPage = document.getElementById('tracking-page');
    startSessionBtn = document.getElementById('start-session-btn');
    endSessionBtn = document.getElementById('end-session-btn');
    resetSessionBtn = document.getElementById('reset-session-btn');
    sessionTime = document.getElementById('session-time');
    totalAlcohol = document.getElementById('total-alcohol');
    totalCalories = document.getElementById('total-calories');
    totalCarbs = document.getElementById('total-carbs');
    totalProtein = document.getElementById('total-protein');
    totalSugar = document.getElementById('total-sugar');
    totalFat = document.getElementById('total-fat');
    sobrietyStatus = document.getElementById('sobriety-status');
    sobrietyDetails = document.getElementById('sobriety-details');
    bacLevel = document.getElementById('bac-level');
    trackingDrinkSearch = document.getElementById('tracking-drink-search');
    addDrinkBtn = document.getElementById('add-drink-btn');
    trackingDrinkSuggestions = document.getElementById('tracking-drink-suggestions');
    drinkList = document.getElementById('drink-list');
    emptyDrinks = document.getElementById('empty-drinks');
    safetyTips = document.getElementById('safety-tips');
    
    // Set up event listeners
    console.log('Setting up event listeners...');
    
    // Close profile menu when clicking outside
    document.addEventListener('click', function(event) {
        const profileMenu = document.getElementById('profile-menu');
        const profileButtons = document.querySelectorAll('.profile-btn-header');
        
        let isProfileButton = false;
        profileButtons.forEach(btn => {
            if (btn.contains(event.target)) {
                isProfileButton = true;
            }
        });
        
        if (!isProfileButton && profileMenu && !profileMenu.contains(event.target)) {
            profileMenu.style.display = 'none';
        }
    });
    
    if (startBtn) {
        console.log('Adding click listener to start button');
        startBtn.addEventListener('click', showMainApp);
    } else {
        console.error('Start button not found!');
    }
    
    if (searchBtn) {
        searchBtn.addEventListener('click', searchBeverage);
    }
    
    if (beverageNameInput) {
        beverageNameInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();
            
            // Clear previous timeout
            clearTimeout(searchTimeout);
            
            if (query.length < 2) {
                hideSuggestions();
                return;
            }
            
            // Debounce search
            searchTimeout = setTimeout(() => {
                showSuggestions(query);
            }, 300);
        });
        
        beverageNameInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                searchBeverage();
            }
        });
    }
    
    // Menu Event Listeners
    if (menuBtn) {
        console.log('Adding click listener to menu button');
        menuBtn.addEventListener('click', openMenu);
    } else {
        console.error('Menu button not found!');
    }
    
    if (closeMenuBtn) {
        closeMenuBtn.addEventListener('click', closeMenu);
    }
    
    if (sidebarOverlay) {
        sidebarOverlay.addEventListener('click', closeMenu);
    }
    
    // Sidebar button event listeners
    sidebarBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            handleSidebarButtonClick(btn.id);
        });
    });
    
    // Tab switching functionality
    if (tabBtns && tabBtns.length > 0) {
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const targetTab = btn.getAttribute('data-tab');
                
                // Remove active class from all tabs and contents
                tabBtns.forEach(b => b.classList.remove('active'));
                tabContents.forEach(content => content.classList.remove('active'));
                
                // Add active class to clicked tab and corresponding content
                btn.classList.add('active');
                const targetContent = document.getElementById(`${targetTab}-tab`);
                if (targetContent) {
                    targetContent.classList.add('active');
                }
                
                // Clear previous results
                clearResults();
                
                // Track analytics
                if (typeof analytics !== 'undefined') {
                    analytics.trackFeature('tab_switch', targetTab);
                }
                
                console.log(`Switched to ${targetTab} tab`);
            });
        });
    }
    
    // Photo upload functionality
    if (uploadArea) {
        uploadArea.addEventListener('click', () => {
            triggerFileInput();
        });
        
        // Mobile-specific touch events
        uploadArea.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const photoInput = document.getElementById('photo-input');
            if (photoInput) photoInput.click();
        }, { passive: false });
        
        uploadArea.addEventListener('touchend', (e) => {
            e.preventDefault();
        }, { passive: false });
        
        // Desktop drag and drop events
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('dragover');
        });
        
        uploadArea.addEventListener('dragleave', () => {
            uploadArea.classList.remove('dragover');
        });
        
        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('dragover');
            
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                handleFileUpload(files[0]);
            }
        });
    }
    
    // Remove button functionality
    if (removeBtn) {
        removeBtn.addEventListener('click', () => {
            clearPhotoUpload();
        });
    }
    
    // Session control buttons
    if (startSessionBtn) {
        startSessionBtn.addEventListener('click', startSession);
    }
    if (endSessionBtn) {
        endSessionBtn.addEventListener('click', endSession);
    }
    if (resetSessionBtn) {
        resetSessionBtn.addEventListener('click', resetSession);
    }
    
    // Add drink button
    if (addDrinkBtn) {
        addDrinkBtn.addEventListener('click', addDrink);
    }
    
    // Drink search input
    if (trackingDrinkSearch) {
        trackingDrinkSearch.addEventListener('input', (e) => {
            showTrackingSuggestions(e.target.value);
        });
        
        trackingDrinkSearch.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                addDrink();
            }
        });
        
        trackingDrinkSearch.addEventListener('blur', () => {
            setTimeout(hideTrackingSuggestions, 200);
        });
    }
    
    console.log('App initialized successfully!');
    } catch (error) {
        console.error('Error during app initialization:', error);
    }
});

// Final test - if you see this, the script loaded completely
console.log('Script.js finished loading!');