const CACHE_NAME = 'ntuconnect-chat-v1';
const urlsToCache = [
  'index.html',
  'manifest.json',
  'https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js',
  'https://www.gstatic.com/firebasejs/10.13.2/firebase-auth-compat.js',
  'https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore-compat.js',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css'
];

// Install event: cache static assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting())
  );
});

// Activate event: clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(name => name !== CACHE_NAME)
          .map(name => caches.delete(name))
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event: network-first for Firebase requests, cache-first for static assets
self.addEventListener('fetch', event => {
  const requestUrl = new URL(event.request.url);

  // For Firebase API calls, go network-first (fallback to cache if offline)
  if (requestUrl.hostname.includes('firebase') || requestUrl.pathname.includes('firestore')) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // Optionally cache dynamic responses? We'll skip for simplicity.
          return response;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // For everything else (our local assets, CDN), use cache-first
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
