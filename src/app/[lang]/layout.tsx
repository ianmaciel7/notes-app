import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { notFound } from "next/navigation";

import "../globals.css";

import { FirebaseProvider } from "@/components/firebase-provider";
import { I18nProvider } from "@/components/i18n-provider";
import { ThemeProvider } from "@/components/theme-provider";
import { supportedLocales } from "@/lib/i18n/types";

import { getDictionary, hasLocale } from "./dictionaries";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export function generateStaticParams() {
  return supportedLocales.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: Pick<LayoutProps<"/[lang]">, "params">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  const dictionary = await getDictionary(lang);
  return {
    title: dictionary.home.metadataTitle,
    description: dictionary.home.metadataDescription,
  };
}

export default async function LocaleLayout({
  children,
  params,
}: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  const dictionary = await getDictionary(lang);

  return (
    <html
      lang={lang}
      suppressHydrationWarning
      className={[
        geistSans.variable,
        geistMono.variable,
        "h-full antialiased",
      ].join(" ")}
    >
      <body className="min-h-full flex flex-col">
        <I18nProvider dictionary={dictionary} locale={lang}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <FirebaseProvider>{children}</FirebaseProvider>
          </ThemeProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
