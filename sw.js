const CACHE_NAME = 'dripsanta-v1';
const ASSETS = [
  '/dripsanta/',
  '/dripsanta/index.html',
  '/dripsanta/scarpe.html',
  '/dripsanta/vestiti.html',
  '/dripsanta/accessori.html',
  '/dripsanta/calcio.html',
  '/dripsanta/borse.html',
  '/dripsanta/elettronica.html',
  '/dripsanta/recensioni.html',
  '/dripsanta/manifest.json',
  '/dripsanta/sw.js',
];

// Install: cache all assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

// Activate: remove old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch: network-first, fallback to cache
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
