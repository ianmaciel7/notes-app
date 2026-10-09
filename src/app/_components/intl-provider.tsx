import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import type { PropsWithChildren } from "react";
import { LocalePicker } from "@/app/_components/locale-picker";
import { ThemeDropdownMenu } from "@/app/_components/theme-dropdown-menu";

type IntlProviderProps = PropsWithChildren;

export async function IntlProvider({ children }: IntlProviderProps) {
  const locale = await getLocale();
  const messages = await getMessages();
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <header className="flex items-end justify-end gap-3 p-3">
        <ThemeDropdownMenu />
        <LocalePicker />
      </header>
      {children}
    </NextIntlClientProvider>
  );
}
