// sw.js — PAT Workspace PWA service worker
// Chỉ cache app shell (HTML/manifest/icon tĩnh). KHÔNG can thiệp vào
// localStorage / IndexedDB — đó là dữ liệu nghiệp vụ sống, service worker
// không đọc/ghi/chặn các luồng đó (chúng vốn không đi qua network/fetch).

const CACHE_NAME = 'pat-workspace-cache-v1';

const APP_SHELL = [
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './icon-512-maskable.png'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;

  // Chỉ xử lý GET cho tài nguyên tĩnh cùng origin (app shell).
  // Mọi request khác (nếu có) đi qua network bình thường, không đụng vào.
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;

      return fetch(req)
        .then((res) => {
          // Cache thêm các tài nguyên tĩnh mới tải được (best-effort).
          const resClone = res.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(req, resClone);
          });
          return res;
        })
        .catch(() => {
          // Offline & không có trong cache → fallback về index.html
          // (chỉ áp dụng cho điều hướng trang, không phải mọi request).
          if (req.mode === 'navigate') {
            return caches.match('./index.html');
          }
          return caches.match('./index.html');
        });
    })
  );
});
