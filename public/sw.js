/* Hangzhou-trip PWA — multi-page shell + images */
const CACHE = "hz-trip-v2026-11-23i";

const PRECACHE = [
  "./hangzhou-days.html",
  "./hangzhou-food.html",
  "./hangzhou-budget.html",
  "./hangzhou-pins.html",
  "./hangzhou-map.html",
  "./hangzhou-trip.html",
  "./hangzhou-trip.css",
  "./js/hangzhou-amap-config.js",
  "./js/hangzhou-data.js",
  "./js/hangzhou-shared.js",
  "./js/hangzhou-days.js",
  "./js/hangzhou-food.js",
  "./js/hangzhou-budget.js",
  "./js/hangzhou-pins.js",
  "./js/hangzhou-map.js",
  "./manifest.webmanifest",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/apple-touch-icon.png",
  "./img/food-fuxiaoguan.jpg",
  "./img/food-greentea.jpg",
  "./img/food-sanbao.jpg",
  "./img/food-shengjian.jpg",
  "./img/food-waipojia.jpg",
  "./img/food-xinzhouji.jpg",
  "./img/food-yuxingji.jpg",
  "./img/hotel-wuzhen.jpg",
  "./img/sight-bund.jpg",
  "./img/sight-disney.jpg",
  "./img/sight-lingyin.jpg",
  "./img/sight-lujiazui.jpg",
  "./img/sight-qinghefang.jpg",
  "./img/sight-westlake.jpg",
  "./img/sight-wukang.jpg",
  "./img/sight-wuzhen.jpg",
  "./img/sight-xintiandi.jpg",
  "./img/sight-yuyuan.jpg",
  "./img/transit-pvg.jpg",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(PRECACHE)).then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k.startsWith("hz-trip-") && k !== CACHE).map((k) => caches.delete(k))),
    ).then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  if (req.mode === "navigate" || url.pathname.endsWith(".html")) {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy));
          return res;
        })
        .catch(() =>
          caches.match(req).then((hit) => hit || caches.match("./hangzhou-days.html")),
        ),
    );
    return;
  }

  // CSS/JS: network first so phone gets map/UI fixes without stuck cache
  if (/\.(?:js|css)$/i.test(url.pathname)) {
    event.respondWith(
      fetch(req)
        .then((res) => {
          if (res.ok) {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put(req, copy));
          }
          return res;
        })
        .catch(() => caches.match(req)),
    );
    return;
  }

  event.respondWith(
    caches.match(req).then((hit) => {
      if (hit) return hit;
      return fetch(req).then((res) => {
        if (!res.ok) return res;
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(req, copy));
        return res;
      });
    }),
  );
});
