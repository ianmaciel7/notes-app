import "server-only";

import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import {
  type AppMessages,
  defaultLocale,
  hasLocale,
  type Locale,
  localeCookieName,
} from "@/lib/i18n/types";

const dictionaryLoaders = {
  en: () => import("./dictionaries/en.json").then((module) => module.default),
  "pt-BR": () =>
    import("./dictionaries/pt-BR.json").then((module) => module.default),
} satisfies Record<Locale, () => Promise<AppMessages>>;

export { hasLocale };
export const isSupportedLocale = hasLocale;

export async function getServerLocale(): Promise<Locale> {
  try {
    const cookieStore = await cookies();
    const cookieLocale = cookieStore.get(localeCookieName)?.value;
    if (hasLocale(cookieLocale)) return cookieLocale;
  } catch {
    // Outside request context
  }

  return defaultLocale;
}

export async function getDictionary(locale?: string): Promise<AppMessages> {
  if (locale !== undefined) {
    if (!hasLocale(locale)) notFound();
    return dictionaryLoaders[locale]();
  }

  const resolvedLocale = await getServerLocale();
  return dictionaryLoaders[resolvedLocale]();
}
