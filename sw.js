const CACHE_NAME = 'ai-meeting-assistant-v1';

// On install, cache the core app shell files.
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        // Caching core assets. Others will be cached on-the-fly by the fetch handler.
        return cache.addAll([
          '/',
          '/index.html',
          '/icon.svg',
          '/favicon.svg',
          'https://cdn.tailwindcss.com'
        ]);
      })
  );
});

// On fetch, use a cache-first strategy for app assets, and network-first for APIs.
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Only handle GET requests.
  if (request.method !== 'GET') {
    return;
  }

  // Always fetch API requests from the network to avoid caching dynamic data.
  if (url.hostname.includes('googleapis.com')) {
    event.respondWith(fetch(request));
    return;
  }

  // For other requests, use a cache-first strategy.
  event.respondWith(
    caches.match(request)
      .then(cachedResponse => {
        // If the resource is in the cache, return it.
        if (cachedResponse) {
          return cachedResponse;
        }

        // If not in cache, fetch from the network.
        return fetch(request).then(
          networkResponse => {
            // Check if we received a valid response before caching.
            if (!networkResponse || networkResponse.status !== 200) {
              return networkResponse;
            }
            
            // Clone the response because it's a stream and can only be consumed once.
            const responseToCache = networkResponse.clone();

            caches.open(CACHE_NAME)
              .then(cache => {
                // Cache the new resource for future use.
                cache.put(request, responseToCache);
              });

            return networkResponse;
          }
        );
      })
  );
});

// On activate, clean up old, unused caches.
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
