// @ts-nocheck
const precacheVersion = self.__precacheManifest.map((p) => p.revision).join('');
const precacheFiles = self.__precacheManifest.map((p) => p.url);

self.addEventListener('install', (ev) => {
  // Do not finish installing until every file in the app has been cached
  ev.waitUntil(
    caches
      .open(precacheVersion)
      .then((cache) =>
        cache.addAll([
          ...precacheFiles,
          'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@48,400,0,0',
        ])
      )
  );
});

// Optionally, to clear previous precaches, also use the following:
self.addEventListener('activate', (ev) => {
  ev.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.filter((k) => k !== precacheVersion).map((k) => caches.delete(k))
        )
      )
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    (async () => {
      const r = await caches.match(e.request);
      console.log(`[Service Worker] Fetching resource: ${e.request.url}`);
      if (r) {
        return r;
      }
      const response = await fetch(e.request);
      const cache = await caches.open(precacheVersion);
      console.log(`[Service Worker] Caching new resource: ${e.request.url}`);
      cache.put(e.request, response.clone());
      return response;
    })()
  );
});
