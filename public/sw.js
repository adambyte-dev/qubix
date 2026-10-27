self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (event) => {
  // Online-first pass-through for dynamic media extractor
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
