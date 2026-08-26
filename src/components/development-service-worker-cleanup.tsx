"use client";

import { useEffect } from "react";

const cleanedSessionKey = "notes-app-dev-sw-cleaned";
const appCachePrefix = "notes-app-";

export function DevelopmentServiceWorkerCleanup() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    if (
      window.location.hostname !== "localhost" &&
      !window.location.hostname.startsWith("127.")
    ) {
      return;
    }
    if (window.sessionStorage.getItem(cleanedSessionKey) === "1") return;

    const cacheCleanup =
      "caches" in window
        ? caches
            .keys()
            .then((cacheNames) =>
              Promise.all(
                cacheNames
                  .filter((cacheName) => cacheName.startsWith(appCachePrefix))
                  .map((cacheName) => caches.delete(cacheName)),
              ),
            )
        : Promise.resolve();

    Promise.all([
      navigator.serviceWorker
        .getRegistrations()
        .then((registrations) =>
          Promise.all(
            registrations.map((registration) => registration.unregister()),
          ),
        ),
      cacheCleanup,
    ])
      .then(() => {
        window.sessionStorage.setItem(cleanedSessionKey, "1");
        if (navigator.serviceWorker.controller) window.location.reload();
      })
      .catch(() => {
        window.sessionStorage.setItem(cleanedSessionKey, "1");
      });
  }, []);

  return null;
}
