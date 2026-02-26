// service-worker.js – Ntuconnect PWA

const CACHE_NAME = 'ntuconnect-v1';
const urlsToCache = [
  '/ntuonline/index.html',
  '/ntuonline/manifest.json',
  '/ntuonline/icon-192.png',
  '/ntuonline/icon-512.png',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css',
  'https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap'
];

// Install event – cache core assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
      .catch(err => console.error('Cache addAll failed:', err))
  );
  self.skipWaiting(); // Activate worker immediately
});

// Activate event – clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(name => name !== CACHE_NAME)
          .map(name => caches.delete(name))
      );
    })
  );
  self.clients.claim(); // Take control of all clients
});

// Fetch event – serve cached content when offline
self.addEventListener('fetch', event => {
  const request = event.request;

  // For same‑origin requests, use network‑first (fresh content)
  if (request.url.startsWith(self.location.origin)) {
    event.respondWith(
      fetch(request)
        .then(response => {
          // Clone the response before caching
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(request, responseToCache);
          });
          return response;
        })
        .catch(() => caches.match(request))
    );
  } else {
    // For cross‑origin requests (CDN fonts, styles), use cache‑first, fallback to network
    event.respondWith(
      caches.match(request)
        .then(response => response || fetch(request))
    );
  }
});
