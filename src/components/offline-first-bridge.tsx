"use client";

import * as React from "react";

type OfflineFirstBridgeProps = {
  message: string;
};

const APP_CACHE_PREFIX = "notes-app-";

async function clearDevelopmentServiceWorkerState() {
  await Promise.all([
    navigator.serviceWorker
      .getRegistrations()
      .then((registrations) =>
        Promise.all(
          registrations.map((registration) => registration.unregister()),
        ),
      ),
    "caches" in window
      ? caches
          .keys()
          .then((cacheNames) =>
            Promise.all(
              cacheNames
                .filter((cacheName) => cacheName.startsWith(APP_CACHE_PREFIX))
                .map((cacheName) => caches.delete(cacheName)),
            ),
          )
      : Promise.resolve(),
  ]);
}

function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) return;

  if (process.env.NODE_ENV !== "production") {
    void clearDevelopmentServiceWorkerState();
    return;
  }

  if (
    window.location.protocol !== "https:" &&
    window.location.hostname !== "localhost" &&
    !window.location.hostname.startsWith("127.")
  ) {
    return;
  }

  void navigator.serviceWorker
    .register("/sw.js", {
      scope: "/",
    })
    .catch(() => {
      // If registration fails, continue running in best-effort mode.
    });
}

export function OfflineFirstBridge({ message }: OfflineFirstBridgeProps) {
  const [isOffline, setIsOffline] = React.useState(false);

  React.useEffect(() => {
    registerServiceWorker();

    function handleOnline() {
      setIsOffline(false);
    }

    function handleOffline() {
      setIsOffline(true);
    }

    setIsOffline(!navigator.onLine);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (!isOffline) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-x-0 top-0 z-[140] bg-amber-500 px-3 py-2 text-center text-sm font-medium text-black"
    >
      {message}
    </div>
  );
}
