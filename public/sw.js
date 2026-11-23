/* Retire the previous Hangzhou PWA and its cached pages. */
self.addEventListener("install", (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    const cachesToRemove = (await caches.keys()).filter((key) => key.startsWith("hz-trip-"));
    await Promise.all(cachesToRemove.map((key) => caches.delete(key)));
    await self.registration.unregister();
  })());
});
