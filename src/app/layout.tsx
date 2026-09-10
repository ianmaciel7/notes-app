import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { InteractionSoundTools } from "@/components/interaction-sounds";
import { LocaleStorageSync } from "@/components/locale-storage-sync";
import { ThemeProvider } from "@/components/theme-provider";
import { InteractionProvider } from "@/components/ui/interaction-provider";
import { resolveServerLocale } from "@/lib/i18n-locale";

export const metadata: Metadata = {
  title: "Notes App",
  description: "Unified Study & Knowledge Management System",
};

const themeScript = `(function() {
  try {
    var savedTheme = localStorage.getItem('notes-app-theme');
    var supportDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (savedTheme === 'dark' || (!savedTheme || savedTheme === 'system') && supportDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  } catch (e) {}
})();`;

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = resolveServerLocale(await getLocale());
  const messages = await getMessages();

  return (
    <html lang={locale} className="h-full antialiased font-sans" suppressHydrationWarning>
      <head>
        <Script id="notes-app-theme" strategy="beforeInteractive">
          {themeScript}
        </Script>
      </head>
      <body className="h-full flex flex-col overflow-hidden bg-background text-foreground font-sans">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <LocaleStorageSync locale={locale} />
          <ThemeProvider>
            <InteractionProvider>
              {children}
              <InteractionSoundTools />
            </InteractionProvider>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
