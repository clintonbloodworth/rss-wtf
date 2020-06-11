/* eslint-env serviceworker */

import {
  del,
  get,
  set,
  keys,
  Store,
} from 'idb-keyval';

const CACHE = 'cache';

self.addEventListener('install', event => {
  event.waitUntil(async function () {
    const cache = await caches.open(CACHE);

    await cache.addAll([
      '/',
      'main.css',
      'main.js',
      'fonts.css',
      'vendor.js',
    ]);

    return self.skipWaiting();
  }());
});

self.addEventListener('activate', event => {
  const currentCaches = [CACHE];

  event.waitUntil(async function () {
    await clients.claim();
    const keys = await caches.keys();
    const filtered = keys.filter(cache => !currentCaches.includes(cache));
    await Promise.all(filtered.map(cache => caches.delete(cache)));
  }());
});

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  const isSelf = event.request.url.startsWith(self.location.origin);

  if (!isSelf) {
    return;
  }

  event.respondWith(async function () {
    const cache = await caches.open(CACHE);
    const cached = await cache.match(event.request);
    const request = fetch(event.request);

    event.waitUntil(async function () {
      const response = await request;
      await cache.put(event.request, response.clone());
    }());

    return cached || request;
  }());
});
