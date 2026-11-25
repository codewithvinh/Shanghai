const prefix = 'giang-nam:' + self.registration.scope + ':';
const cacheName = prefix + 'b58ebb73f0aa0040';
const shell = new URL('./index.html', self.registration.scope).href;
const localAssets = [
  './index.html', './trip.css', './trip.js', './data.json', './manifest.webmanifest',
  './trip-map.js', './leaflet.js', './leaflet.css',
  './fonts/InterVariable.woff2', './fonts/InterVariable-Italic.woff2',
  './icons/giang-nam.svg', './icons/giang-nam-180.png', './icons/giang-nam-192.png', './icons/giang-nam-512.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const response = await fetch('./data.json', { cache: 'reload' });
    if (!response.ok) throw new Error('Trip data is unavailable.');
    const data = await response.clone().json();
    const images = [
      ...data.photos.days,
      ...Object.values(data.photos.food).map(({ path }) => path),
      ...data.pins.map(({ img }) => img).filter(Boolean),
    ];
    const assets = new Set([...localAssets, ...images.map((path) => '../' + path)]);
    assets.delete('./data.json');
    const cache = await caches.open(cacheName);
    await cache.addAll([...assets].map((url) => new Request(url, { cache: 'reload' })));
    await cache.put('./data.json', response);
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((key) => key.startsWith(prefix) && key !== cacheName).map((key) => caches.delete(key)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  if (request.method !== 'GET' || url.origin !== self.location.origin) return;
  const scope = self.registration.scope;
  const navigate = request.mode === 'navigate' && (url.origin + url.pathname === scope || url.origin + url.pathname === shell);
  event.respondWith((async () => {
    const cache = await caches.open(cacheName);
    const saved = await cache.match(navigate ? shell : request);
    return saved || fetch(request);
  })());
});
