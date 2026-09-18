import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { I18nProvider } from "@/components/i18n-provider";
import { supportedLocales } from "@/lib/i18n/types";

import { getDictionary, hasLocale } from "./dictionaries";

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
    <I18nProvider dictionary={dictionary} locale={lang}>
      {children}
    </I18nProvider>
  );
}
