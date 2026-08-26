import type { Metadata } from "next";
import "./globals.css";
import { DevelopmentServiceWorkerCleanup } from "@/components/development-service-worker-cleanup";
import { routing } from "@/i18n/routing";

export const metadata: Metadata = {
  title: "Notas atômicas",
  description: "Object-centered knowledge workspace",
  manifest: "/manifest.webmanifest",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang={routing.defaultLocale} className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        {process.env.NODE_ENV !== "production" && (
          <DevelopmentServiceWorkerCleanup />
        )}
        {children}
      </body>
    </html>
  );
}
