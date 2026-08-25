const CACHE_VERSION = 2;
const CORE_CACHE_NAME = `notes-app-core-v${CACHE_VERSION}`;
const RUNTIME_CACHE_NAME = `notes-app-runtime-v${CACHE_VERSION}`;

const CORE_ASSETS = [
  "/",
  "/en",
  "/es",
  "/pt-BR",
  "/offline.html",
  "/manifest.webmanifest",
  "/favicon.ico",
  "/file.svg",
  "/globe.svg",
  "/next.svg",
  "/vercel.svg",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CORE_CACHE_NAME).then(async (cache) => {
      await Promise.all(
        CORE_ASSETS.map(async (asset) => {
          try {
            await cache.add(asset);
          } catch {
            throw new Error(`Could not pre-cache ${asset}`);
          }
        }),
      );
      await self.skipWaiting();
    }),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    Promise.all([
      caches.keys().then((cacheNames) =>
        Promise.all(
          cacheNames
            .filter(
              (cacheName) =>
                cacheName !== CORE_CACHE_NAME &&
                cacheName !== RUNTIME_CACHE_NAME,
            )
            .map((cacheName) => caches.delete(cacheName)),
        ),
      ),
      self.clients.claim(),
    ]),
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;

  const requestUrl = new URL(request.url);
  if (requestUrl.origin !== self.location.origin) return;

  const isNavigationRequest =
    request.mode === "navigate" ||
    (request.headers.get("accept")?.includes("text/html") ?? false);

  const isNextStaticRequest =
    requestUrl.pathname.startsWith("/_next/") ||
    requestUrl.pathname.startsWith("/favicon.ico") ||
    requestUrl.pathname.startsWith("/manifest.webmanifest") ||
    requestUrl.pathname.endsWith(".svg");

  if (isNavigationRequest) {
    event.respondWith(
      (async () => {
        try {
          const networkResponse = await fetch(request);
          const responseClone = networkResponse.clone();
          const cache = await caches.open(CORE_CACHE_NAME);
          await cache.put(request, responseClone);
          return networkResponse;
        } catch {
          const cache = await caches.open(CORE_CACHE_NAME);
          const offlineFallback = await cache.match("/offline.html");
          const cachedPage = await caches.match(request);
          return (
            cachedPage ??
            offlineFallback ??
            new Response("Offline. The requested page is not available offline.", {
              status: 503,
              headers: { "Content-Type": "text/plain; charset=utf-8" },
            })
          );
        }
      })(),
    );
    return;
  }

  if (isNextStaticRequest) {
    event.respondWith(
      (async () => {
        const cachedResponse = await caches.match(request);
        if (cachedResponse) return cachedResponse;

        try {
          const networkResponse = await fetch(request);
          const cache = await caches.open(RUNTIME_CACHE_NAME);
          await cache.put(request, networkResponse.clone());
          return networkResponse;
        } catch {
          return new Response("Offline. The requested file is not cached.", {
            status: 503,
            headers: { "Content-Type": "text/plain; charset=utf-8" },
          });
        }
      })(),
    );
    return;
  }

  event.respondWith(
    (async () => {
      const cachedResponse = await caches.match(request);
      if (cachedResponse) return cachedResponse;

      try {
        const networkResponse = await fetch(request);
        const cache = await caches.open(RUNTIME_CACHE_NAME);
        await cache.put(request, networkResponse.clone());
        return networkResponse;
      } catch {
        return new Response("Offline. The requested file is not cached.", {
          status: 503,
          headers: { "Content-Type": "text/plain; charset=utf-8" },
        });
      }
    })(),
  );
});
