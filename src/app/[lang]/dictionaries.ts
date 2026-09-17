import { notFound } from "next/navigation";

import {
  type AppMessages,
  type Locale,
  supportedLocales,
} from "@/lib/i18n/types";

const dictionaryLoaders = {
  en: () => import("./dictionaries/en.json").then((module) => module.default),
  "pt-BR": () =>
    import("./dictionaries/pt-BR.json").then((module) => module.default),
} satisfies Record<Locale, () => Promise<AppMessages>>;

export function isSupportedLocale(locale: string): locale is Locale {
  return supportedLocales.some((supportedLocale) => supportedLocale === locale);
}

export async function getDictionary(locale: string): Promise<AppMessages> {
  if (!isSupportedLocale(locale)) notFound();

  return dictionaryLoaders[locale]();
}
