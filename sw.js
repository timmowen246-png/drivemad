// Name of the cache storage
const CACHE_NAME = 'v1_pages';

// Assets to cache immediately on installation
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/styles.css',
  '/app.js'
];

// 1. Install Event: Caches core application assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Caching files');
        return cache.addAll(ASSETS_TO_CACHE);
      })
      .then(() => self.skipWaiting()) // Forces the waiting service worker to become active
  );
});

// 2. Activate Event: Cleans up old caches if the version changes
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('Service Worker: Clearing old cache');
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// 3. Fetch Event: Serves cached content when offline, falls back to network
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return the cached response
        if (response) {
          return response;
        }
        
        // Cache miss - fetch from network
        return fetch(event.request).catch(() => {
          // Optional: Return a fallback offline page if network fails completely
          return caches.match('/offline.html');
        });
      })
  );
});