import type { ReactNode } from "react";
import { getMessages } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";

import { routing } from "@/i18n/routing";
import { OfflineFirstBridge } from "@/components/offline-first-bridge";

type LocaleLayoutProps = {
  children: ReactNode;
  params: Promise<{
    locale: string;
  }>;
};

const OFFLINE_MESSAGE_BY_LOCALE = {
  en: "You are currently offline. Data already loaded is still available.",
  es: "Estás sin conexión. Los datos ya cargados aún están disponibles.",
  "pt-BR": "Você está sem conexão. Os dados já carregados continuam disponíveis.",
} as const;

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <OfflineFirstBridge
        message={
          OFFLINE_MESSAGE_BY_LOCALE[
            locale as keyof typeof OFFLINE_MESSAGE_BY_LOCALE
          ] ?? OFFLINE_MESSAGE_BY_LOCALE.en
        }
      />
      {children}
    </NextIntlClientProvider>
  );
}
