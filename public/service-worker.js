/* public/service-worker.js */

/* Basic, framework-agnostic service worker for Vite apps */

const CACHE_NAME = 'meet-app-cache-v1';
const APP_SHELL = [
  '/',              // root
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
  '/meet-app-144.png',
  '/meet-app-192.png',
  '/meet-app-512.png'
];

// Install: precache app shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

// Activate: cleanup old caches & take control
self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      );
      if ('navigationPreload' in self.registration) {
        try {
          await self.registration.navigationPreload.enable();
        } catch {}
      }
    })()
  );
  self.clients.claim();
});

// Fetch: 
// - For navigations: network-first, fallback to cached index.html (SPA mode)
// - For same-origin assets: stale-while-revalidate
self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Only GET requests
  if (request.method !== 'GET') return;

  // Handle navigation requests (SPA)
  if (request.mode === 'navigate') {
    event.respondWith(
      (async () => {
        try {
          // Prefer the network
          const preload = await event.preloadResponse;
          if (preload) return preload;
          const network = await fetch(request);
          return network;
        } catch {
          // Fallback to cached app shell
          const cache = await caches.open(CACHE_NAME);
          const cached = await cache.match('/index.html');
          return cached || Response.error();
        }
      })()
    );
    return;
  }

  // Same-origin assets: stale-while-revalidate
  const url = new URL(request.url);
  if (url.origin === self.location.origin) {
    event.respondWith(
      (async () => {
        const cache = await caches.open(CACHE_NAME);
        const cached = await cache.match(request);
        const fetchPromise = fetch(request)
          .then((response) => {
            // Cache a clone of successful responses
            if (response && response.status === 200) {
              cache.put(request, response.clone());
            }
            return response;
          })
          .catch(() => undefined);
        return cached || fetchPromise;
      })()
    );
  }
});

// Optional: allow clients to trigger a SW update activation immediately
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
