import { notFound } from "next/navigation";
import { lang } from "next/root-params";
import { type AppMessages, hasLocale, type Locale } from "@/lib/i18n/types";

const dictionaryLoaders = {
  en: () => import("./dictionaries/en.json").then((module) => module.default),
  "pt-BR": () =>
    import("./dictionaries/pt-BR.json").then((module) => module.default),
} satisfies Record<Locale, () => Promise<AppMessages>>;

export { hasLocale };
export const isSupportedLocale = hasLocale;

export async function getDictionary(locale?: string): Promise<AppMessages> {
  const resolvedLocale = locale ?? (await lang());
  if (!hasLocale(resolvedLocale)) notFound();

  return dictionaryLoaders[resolvedLocale]();
}
