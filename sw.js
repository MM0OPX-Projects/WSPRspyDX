const cacheName = "wsprspydx-v54";
const appFiles = ["./", "./index.html", "./styles.css?v=54", "./app.js?v=54", "./manifest.webmanifest", "./icon.svg", "./world-map.png"];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(cacheName).then((cache) => cache.addAll(appFiles)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== cacheName).map((key) => caches.delete(key))))
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  if (url.hostname === "db1.wspr.live" || url.hostname === "services.swpc.noaa.gov") return;
  event.respondWith(caches.match(event.request).then((cached) => cached || fetch(event.request)));
});
