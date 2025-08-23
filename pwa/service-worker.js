const CACHE_NAME = "tabungan-v1";
const urlsToCache = [
    "../index.html",
    "../app.html",
    "../assets/css/index.css",
    "../assets/css/style.css",
    "../favicon/favicon.ico",
    "../images/icon-192x192.png",
    "../images/icon-512x512.png",
    "../pwa/manifest.json",
    "../pwa/service-worker.js"
];

// Install Service Worker
self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
    );
});

// Fetch (cache first)
self.addEventListener("fetch", (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});

// Activate (hapus cache lama)
self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) =>
            Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        return caches.delete(cache);
                    }
                })
            )
        )
    );
});
