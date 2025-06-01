
const CACHE_NAME = 'funnelcraft-v1';
const urlsToCache = [
  '/',
  '/manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        // Only cache files that actually exist
        return cache.addAll(urlsToCache.filter(url => {
          // Skip files that might not exist in development
          if (url.includes('bundle.js') || url.includes('main.css')) {
            return false;
          }
          return true;
        }));
      })
      .catch((error) => {
        console.log('Cache installation failed:', error);
      })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});
