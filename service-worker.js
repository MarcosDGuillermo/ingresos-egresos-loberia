// Service worker mínimo: solo lo necesario para que el navegador
// habilite el botón "Instalar app". No cachea nada de la lógica de
// datos (siempre se pide en vivo al Apps Script), pero sí permite que
// el shell (HTML/CSS/JS) cargue un poco más rápido en visitas repetidas.

const CACHE_NAME = "ingresos-egresos-shell-v1";
const ARCHIVOS_SHELL = ["./index.html", "./manifest.json"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ARCHIVOS_SHELL))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((nombres) =>
      Promise.all(
        nombres
          .filter((n) => n !== CACHE_NAME)
          .map((n) => caches.delete(n))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  // Nunca cachear las llamadas al backend (Apps Script) — siempre en vivo.
  if (event.request.url.includes("script.google.com")) return;

  event.respondWith(
    caches.match(event.request).then((cacheado) => cacheado || fetch(event.request))
  );
});
