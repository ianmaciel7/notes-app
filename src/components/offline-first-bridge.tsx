"use client";

import * as React from "react";

type OfflineFirstBridgeProps = {
  message: string;
};

type OfflineSyncDiagnostics = {
  readonly conflictCount: number;
  readonly mediaUnavailableCount: number;
  readonly pendingCount: number;
  readonly status: string;
};

const APP_CACHE_PREFIX = "notes-app-";
const SYNC_DIAGNOSTICS_EVENT = "notes-app-sync-diagnostics";

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
  const [diagnostics, setDiagnostics] =
    React.useState<OfflineSyncDiagnostics | null>(null);

  React.useEffect(() => {
    registerServiceWorker();

    function handleOnline() {
      setIsOffline(false);
    }

    function handleOffline() {
      setIsOffline(true);
    }

    function handleDiagnostics(event: Event) {
      if (!(event instanceof CustomEvent)) return;
      setDiagnostics(event.detail as OfflineSyncDiagnostics);
    }

    setIsOffline(!navigator.onLine);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    window.addEventListener(SYNC_DIAGNOSTICS_EVENT, handleDiagnostics);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener(SYNC_DIAGNOSTICS_EVENT, handleDiagnostics);
    };
  }, []);

  if (!isOffline && !diagnostics) return null;

  const syncSummary = diagnostics
    ? [
        diagnostics.pendingCount > 0
          ? `${diagnostics.pendingCount} pending`
          : null,
        diagnostics.conflictCount > 0
          ? `${diagnostics.conflictCount} conflicts`
          : null,
        diagnostics.mediaUnavailableCount > 0
          ? `${diagnostics.mediaUnavailableCount} media unavailable`
          : null,
      ]
        .filter(Boolean)
        .join(" · ")
    : "";

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-x-0 top-0 z-[140] bg-amber-500 px-3 py-2 text-center text-sm font-medium text-black"
    >
      {isOffline ? message : "Workspace sync status updated."}
      {syncSummary ? ` ${syncSummary}.` : null}
    </div>
  );
}

export function notifyWorkspaceSyncDiagnostics(
  diagnostics: OfflineSyncDiagnostics,
) {
  window.dispatchEvent(
    new CustomEvent(SYNC_DIAGNOSTICS_EVENT, { detail: diagnostics }),
  );
}
