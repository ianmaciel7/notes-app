import type { Metadata } from "next";
import { Geist_Mono, Inter } from "next/font/google";
import Script from "next/script";
import { Suspense } from "react";
import { IntlProvider } from "@/components/notes-app/intl-provider";
import { createLocaleLangScript } from "@/components/notes-app/locale-lang-script";
import { defaultLocale, locales } from "@/lib/i18n/config";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: { default: "Notes App", template: "%s | Notes App" },
  description: "Exam study notes.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang={defaultLocale}
      suppressHydrationWarning
      className={`${inter.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Script id="locale-lang" strategy="beforeInteractive">
          {createLocaleLangScript(locales, defaultLocale)}
        </Script>
        <Suspense fallback={null}>
          <IntlProvider>{children}</IntlProvider>
        </Suspense>
      </body>
    </html>
  );
}
