// Service worker mínimo — solo existe para que el navegador habilite
// el botón "Instalar app". A propósito NO cachea nada: como esta app
// se está actualizando seguido, preferimos que siempre pida todo en
// vivo antes que arriesgarnos a mostrar una versión vieja guardada.

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  // Borra cualquier caché vieja de versiones anteriores de este service worker
  event.waitUntil(
    caches.keys().then((nombres) => Promise.all(nombres.map((n) => caches.delete(n))))
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  // Passthrough puro: siempre va a la red, nunca sirve algo cacheado.
  event.respondWith(fetch(event.request));
});
