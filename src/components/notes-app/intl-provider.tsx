import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import type { ReactNode } from "react";
import { LocalePicker } from "@/components/notes-app/locale-picker";
import { ThemeToggle } from "@/components/notes-app/theme-toggle";

export async function IntlProvider({ children }: { children: ReactNode }) {
  const locale = await getLocale();
  const messages = await getMessages();
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <header className="flex items-end justify-end gap-3 p-3">
        <ThemeToggle />
        <LocalePicker />
      </header>
      {children}
    </NextIntlClientProvider>
  );
}
