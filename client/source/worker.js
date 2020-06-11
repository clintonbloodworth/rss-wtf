/* eslint-env serviceworker */

const CACHE_VERSION = "v1";

self.addEventListener("install", event => {
  event.waitUntil(async function () {
    const cache = await caches.open(CACHE_VERSION);

    await cache.addAll([
      "/",
      "/index.css",
      "/index.js",
      "/favicon.svg",
      "/apple-touch-icon.png",
      "/fonts/monospace/italic/500.css",
      "/fonts/monospace/normal/500.css",
      "/fonts/monospace/normal/700.css",
      "/fonts/sans-serif/normal/500.css",
      "/fonts/sans-serif/normal/600.css",
      "/fonts/sans-serif/normal/700.css",
      "/fonts/serif.css",
    ]);

    return self.skipWaiting();
  }());
});

self.addEventListener("fetch", async event => {
  const isOwnOrigin = event.request.url.startsWith(self.location.origin);
  const url = new URL(event.request.url);

  const isFavicon = url.origin === process.env.API_URL
  && url.pathname === "/favicon";

  if (!isFavicon && !isOwnOrigin) {
    return;
  }

  event.respondWith(async function () {
    const cache = await caches.open(CACHE_VERSION);
    const response = await cache.match(event.request);
    const request = fetch(event.request)
      .then(response => {
        cache.put(event.request, response.clone());
        return response;
      });

    return response || request;
  }());
});
