const CACHE = 'weather-pwa-v1';
const ASSETS = ['/', '/index.html', '/manifest.json'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ));
  self.clients.claim();
});

// 네트워크 우선 → 실패 시 캐시 (날씨 데이터는 항상 최신)
self.addEventListener('fetch', e => {
  if (e.request.url.includes('open-meteo.com')) return; // API는 캐시 안 함
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});
