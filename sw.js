// Service Worker for BevyFinder - Enhanced Auto-Update System
const CACHE_NAME = 'bevyfinder-v1.0.11';
const STATIC_CACHE = 'bevyfinder-static-v1.0.11';
const DYNAMIC_CACHE = 'bevyfinder-dynamic-v1.0.11';

// Files to cache immediately
const STATIC_FILES = [
  '/',
  '/index.html',
  '/styles.css',
  '/script.js',
  '/auth.js',
  '/server-api.js',
  '/analytics.js',
  '/fallback-analytics.js',
  '/manifest.json',
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/webfonts/fa-solid-900.woff2',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/webfonts/fa-regular-400.woff2'
];

// Install event - cache static files
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('Service Worker: Caching static files');
        return cache.addAll(STATIC_FILES);
      })
      .then(() => {
        console.log('Service Worker: Static files cached');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('Service Worker: Cache installation failed:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('Service Worker: Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Service Worker: Activated and ready');
        return self.clients.claim();
      })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Handle API requests
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(handleApiRequest(request));
    return;
  }

  // Handle static files
  if (isStaticFile(request.url)) {
    event.respondWith(handleStaticRequest(request));
    return;
  }

  // Handle navigation requests
  if (request.mode === 'navigate') {
    event.respondWith(handleNavigationRequest(request));
    return;
  }

  // Default: network first, cache fallback
  event.respondWith(handleDynamicRequest(request));
});

// Handle API requests - network only
async function handleApiRequest(request) {
  try {
    const response = await fetch(request);
    return response;
  } catch (error) {
    console.log('Service Worker: API request failed:', error);
    return new Response(JSON.stringify({ 
      error: 'Network error', 
      message: 'Please check your connection' 
    }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Handle static files - cache first
async function handleStaticRequest(request) {
  try {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.log('Service Worker: Static file fetch failed:', error);
    return new Response('Offline - Static file not available', { status: 503 });
  }
}

// Handle navigation requests - cache first, network fallback
async function handleNavigationRequest(request) {
  try {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.log('Service Worker: Navigation request failed:', error);
    return caches.match('/index.html');
  }
}

// Handle dynamic requests - network first, cache fallback
async function handleDynamicRequest(request) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.log('Service Worker: Dynamic request failed, trying cache:', error);
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    return new Response('Offline - Content not available', { status: 503 });
  }
}

// Check if file is static
function isStaticFile(url) {
  const staticExtensions = ['.css', '.js', '.json', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.woff', '.woff2'];
  return staticExtensions.some(ext => url.includes(ext)) || 
         url.includes('fonts.googleapis.com') || 
         url.includes('cdnjs.cloudflare.com');
}

// Handle background sync
self.addEventListener('sync', (event) => {
  console.log('Service Worker: Background sync triggered:', event.tag);
  
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  } else if (event.tag === 'session-sync') {
    event.waitUntil(syncSessionData());
  }
});

// Background sync function
async function doBackgroundSync() {
  try {
    // Sync any pending data
    console.log('Service Worker: Performing background sync');
    
    // You can add offline data sync logic here
    // For example, syncing likes, favorites, etc.
    
  } catch (error) {
    console.error('Service Worker: Background sync failed:', error);
  }
}

// Session sync function
async function syncSessionData() {
  try {
    console.log('Service Worker: Syncing session data');
    
    // Get session data from IndexedDB or localStorage
    const sessionData = await getSessionData();
    
    if (sessionData && sessionData.isActive) {
      // Update session duration and stats
      const updatedSession = updateSessionStats(sessionData);
      
      // Save updated session data
      await saveSessionData(updatedSession);
      
      // Send notification if BAC is high
      if (updatedSession.currentBAC > 0.08) {
        await sendSafetyNotification(updatedSession);
      }
    }
  } catch (error) {
    console.error('Service Worker: Session sync failed:', error);
  }
}

// Get session data from storage
async function getSessionData() {
  try {
    // Try to get from IndexedDB first, fallback to localStorage
    const db = await openDB();
    const session = await db.get('sessions', 'current');
    return session || JSON.parse(localStorage.getItem('bevyfinder_session') || 'null');
  } catch (error) {
    console.log('Service Worker: Using localStorage fallback for session data');
    return JSON.parse(localStorage.getItem('bevyfinder_session') || 'null');
  }
}

// Save session data to storage
async function saveSessionData(sessionData) {
  try {
    // Save to IndexedDB first, fallback to localStorage
    const db = await openDB();
    await db.put('sessions', sessionData, 'current');
  } catch (error) {
    console.log('Service Worker: Using localStorage fallback for session data');
    localStorage.setItem('bevyfinder_session', JSON.stringify(sessionData));
  }
}

// Update session statistics
function updateSessionStats(sessionData) {
  const now = Date.now();
  const elapsedMinutes = (now - sessionData.startTime) / (1000 * 60);
  
  // Calculate current BAC based on time elapsed
  const updatedSession = {
    ...sessionData,
    currentTime: now,
    elapsedMinutes: elapsedMinutes,
    currentBAC: calculateCurrentBAC(sessionData, elapsedMinutes)
  };
  
  return updatedSession;
}

// Calculate current BAC based on time elapsed
function calculateCurrentBAC(sessionData, elapsedMinutes) {
  let totalAlcohol = 0;
  
  // Calculate total alcohol consumed
  sessionData.drinks.forEach(drink => {
    const drinkTime = new Date(drink.timestamp).getTime();
    const drinkElapsedMinutes = (Date.now() - drinkTime) / (1000 * 60);
    
    // Alcohol metabolism rate (varies by person, using average)
    const metabolismRate = 0.015; // % per hour
    const metabolized = (drinkElapsedMinutes / 60) * metabolismRate;
    
    const remainingAlcohol = Math.max(0, drink.alcoholContent - metabolized);
    totalAlcohol += remainingAlcohol;
  });
  
  // Convert to BAC (simplified calculation)
  const weight = sessionData.userWeight || 70; // kg
  const gender = sessionData.userGender || 'male';
  const distributionRatio = gender === 'male' ? 0.68 : 0.55;
  
  const bac = (totalAlcohol * 100) / (weight * distributionRatio * 10);
  return Math.max(0, bac);
}

// Send safety notification
async function sendSafetyNotification(sessionData) {
  try {
    const payload = JSON.stringify({
      title: 'Safety Alert - High BAC',
      body: `Your current BAC is ${(sessionData.currentBAC * 100).toFixed(3)}%. Please consider stopping drinking.`,
      icon: '/icon-192x192.png',
      badge: '/icon-72x72.png',
      data: {
        url: '/tracking-page',
        type: 'safety',
        bacLevel: sessionData.currentBAC
      }
    });
    
    // Get all push subscriptions and send notifications
    const subscriptions = await getPushSubscriptions();
    for (const subscription of subscriptions) {
      try {
        await self.registration.pushManager.sendNotification(subscription, payload);
      } catch (error) {
        console.error('Service Worker: Failed to send safety notification:', error);
      }
    }
  } catch (error) {
    console.error('Service Worker: Safety notification failed:', error);
  }
}

// Get push subscriptions
async function getPushSubscriptions() {
  try {
    const db = await openDB();
    const subscriptions = await db.getAll('pushSubscriptions');
    return subscriptions;
  } catch (error) {
    console.log('Service Worker: No push subscriptions found');
    return [];
  }
}

// Open IndexedDB
async function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('BevyFinderDB', 1);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      
      // Create sessions store
      if (!db.objectStoreNames.contains('sessions')) {
        const sessionStore = db.createObjectStore('sessions', { keyPath: 'id' });
        sessionStore.createIndex('isActive', 'isActive', { unique: false });
      }
      
      // Create push subscriptions store
      if (!db.objectStoreNames.contains('pushSubscriptions')) {
        db.createObjectStore('pushSubscriptions', { keyPath: 'endpoint' });
      }
    };
  });
}

// Handle push notifications
self.addEventListener('push', (event) => {
  console.log('Service Worker: Push notification received');
  
  const options = {
    body: event.data ? event.data.text() : 'New update from BevyFinder!',
    icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🍺</text></svg>',
    badge: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🍺</text></svg>',
    vibrate: [200, 100, 200],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Explore Drinks',
        icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🔍</text></svg>'
      },
      {
        action: 'close',
        title: 'Close',
        icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">❌</text></svg>'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('BevyFinder', options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('Service Worker: Notification clicked', event.notification.data);
  
  event.notification.close();

  const data = event.notification.data || {};

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/?action=search')
    );
  } else if (event.action === 'close') {
    // Just close the notification
  } else {
    // Handle different notification types
    let targetUrl = '/';
    
    if (data.type === 'friend_drink_update') {
      targetUrl = '/social-feed-page';
    } else if (data.type === 'safety') {
      targetUrl = '/tracking-page';
    } else if (data.type === 'session') {
      targetUrl = '/tracking-page';
    } else if (data.url) {
      targetUrl = data.url;
    }
    
    event.waitUntil(
      clients.openWindow(targetUrl)
    );
  }
});

// Handle messages from main thread
self.addEventListener('message', (event) => {
  console.log('Service Worker: Message received:', event.data);
  
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => caches.delete(cacheName))
        );
      })
    );
  } else if (event.data && event.data.type === 'CHECK_UPDATE') {
    // Check for updates
    event.waitUntil(checkForUpdates());
  }
});

// Check for updates
async function checkForUpdates() {
  try {
    const response = await fetch('/index.html', { cache: 'no-cache' });
    const newETag = response.headers.get('etag');
    
    if (newETag && newETag !== CACHE_NAME) {
      console.log('Service Worker: Update available');
      // You can trigger a refresh or show update notification
    }
  } catch (error) {
    console.log('Service Worker: Update check failed:', error);
  }
} 