const CACHE_NAME = 'ji-handling-v1';

// Active files to cache on first install as a fallback
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => {
      // Force the waiting service worker to become active immediately
      return self.skipWaiting();
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((name) => {
          if (name !== CACHE_NAME) {
            return caches.delete(name);
          }
        })
      );
    }).then(() => {
      // Claim clients immediately so the new worker controls the page right away
      return self.clients.claim();
    })
  );
});

// Network-first fetch strategy
self.addEventListener('fetch', (event) => {
  // Only handle GET requests
  if (event.request.method !== 'GET') return;

  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        // If successful, clone and save to cache for offline fallback
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        // Offline fallback: try to serve from cache
        return caches.match(event.request);
      })
  );
});

// Full integration for background native PWA local/remote pushes
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : { title: 'Notifikasi Baru', body: 'Ada instruksi lapangan baru.' };
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: 'https://lh3.googleusercontent.com/d/1ADaHuVjVHr8tP1WuWy1q6f8bLGdFYU9a=w400',
      badge: 'https://lh3.googleusercontent.com/d/1ADaHuVjVHr8tP1WuWy1q6f8bLGdFYU9a=w400'
    })
  );
});

// Direct message listener to reliable show notification from the active client web app
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SHOW_NOTIFICATION') {
    const { title, body } = event.data;
    event.waitUntil(
      self.registration.showNotification(title, {
        body,
        icon: 'https://lh3.googleusercontent.com/d/1ADaHuVjVHr8tP1WuWy1q6f8bLGdFYU9a=w400',
        badge: 'https://lh3.googleusercontent.com/d/1ADaHuVjVHr8tP1WuWy1q6f8bLGdFYU9a=w400'
      })
    );
  }
});
