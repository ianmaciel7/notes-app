import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import type { ReactNode } from "react";
import { LocalePicker } from "@/components/notes-app/locale-picker";

export async function IntlProvider({ children }: { children: ReactNode }) {
  const locale = await getLocale();
  const messages = await getMessages();
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <header className="flex justify-end p-3">
        <LocalePicker />
      </header>
      {children}
    </NextIntlClientProvider>
  );
}
