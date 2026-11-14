// VERSION and PRECACHE are filled in at build time (see vite.config.js).
const VERSION = '__SW_VERSION__';
const PRECACHE = /*__SW_PRECACHE__*/[];

const CACHE_PREFIX = 'rights-guide-';
const CACHE_NAME = CACHE_PREFIX + VERSION;
const SCOPE = self.registration.scope;
const NAVIGATION_TIMEOUT_MS = 3000;

// Save the whole app on first visit so it works offline from then on.
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) =>
        cache.addAll(PRECACHE.map((path) => new Request(new URL(path, SCOPE).href, { cache: 'reload' })))
      )
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((names) =>
        Promise.all(
          names
            .filter((name) => name.startsWith(CACHE_PREFIX) && name !== CACHE_NAME)
            .map((name) => caches.delete(name))
        )
      )
      .then(() => self.clients.claim())
  );
});

// Page loads: newest version when online, saved copy when offline or the
// connection is too slow to answer in time.
async function handleNavigation(request) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(SCOPE, { ignoreVary: true });

  const network = fetch(request).then((response) => {
    if (response.ok) cache.put(SCOPE, response.clone());
    return response;
  });

  if (!cached) return network;

  const timeout = new Promise((resolve) => setTimeout(() => resolve(cached), NAVIGATION_TIMEOUT_MS));
  return Promise.race([network.catch(() => cached), timeout]);
}

// Everything else (scripts, styles, fonts, icons): saved copy first.
async function handleAsset(request) {
  const cache = await caches.open(CACHE_NAME);
  // ignoreVary: saved copies must match however the page asks for them
  const cached = await cache.match(request, { ignoreVary: true });
  if (cached) return cached;

  const response = await fetch(request);
  if (response.ok) cache.put(request, response.clone());
  return response;
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET' || !request.url.startsWith(SCOPE)) return;

  event.respondWith(request.mode === 'navigate' ? handleNavigation(request) : handleAsset(request));
});
