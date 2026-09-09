import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { ThemeProvider } from "@/components/theme-provider";
import { InteractionProvider } from "@/components/ui/interaction-provider";

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
  const locale = await getLocale();
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
          <ThemeProvider>
            <InteractionProvider>{children}</InteractionProvider>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
