import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { routing } from "@/i18n/routing";

export const metadata: Metadata = {
  title: "Notas atômicas",
  description: "Object-centered knowledge workspace",
  manifest: "/manifest.webmanifest",
};

const developmentServiceWorkerCleanupScript = `
(function () {
  if (!("serviceWorker" in navigator)) return;
  if (window.location.hostname !== "localhost" && !window.location.hostname.startsWith("127.")) return;
  if (window.sessionStorage.getItem("notes-app-dev-sw-cleaned") === "1") return;

  var cacheCleanup = "caches" in window
    ? caches.keys().then(function (cacheNames) {
        return Promise.all(
          cacheNames
            .filter(function (cacheName) {
              return cacheName.indexOf("notes-app-") === 0;
            })
            .map(function (cacheName) {
              return caches.delete(cacheName);
            })
        );
      })
    : Promise.resolve();

  Promise.all([
    navigator.serviceWorker.getRegistrations().then(function (registrations) {
      return Promise.all(
        registrations.map(function (registration) {
          return registration.unregister();
        })
      );
    }),
    cacheCleanup,
  ])
    .then(function () {
      window.sessionStorage.setItem("notes-app-dev-sw-cleaned", "1");
      if (navigator.serviceWorker.controller) window.location.reload();
    })
    .catch(function () {
      window.sessionStorage.setItem("notes-app-dev-sw-cleaned", "1");
    });
})();
`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang={routing.defaultLocale} className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        {process.env.NODE_ENV !== "production" && (
          <Script
            id="development-service-worker-cleanup"
            strategy="beforeInteractive"
            // biome-ignore lint/security/noDangerouslySetInnerHtml: static dev-only script clears stale service workers before hydration.
            dangerouslySetInnerHTML={{
              __html: developmentServiceWorkerCleanupScript,
            }}
          />
        )}
        {children}
      </body>
    </html>
  );
}
