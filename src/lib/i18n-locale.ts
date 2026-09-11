export const locales = ["en", "es", "pt-BR"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "pt-BR";
export const localeCookieName = "NEXT_LOCALE";
export const localeStorageKey = "notes-app-locale";

const localeCookieMaxAgeSeconds = 60 * 60 * 24 * 365;

export function isSupportedLocale(value: unknown): value is Locale {
  return typeof value === "string" && locales.includes(value as Locale);
}

export function resolveServerLocale(rawCookieLocale: string | null | undefined): Locale {
  return isSupportedLocale(rawCookieLocale) ? rawCookieLocale : defaultLocale;
}

export function resolveBrowserLocale({
  cookieLocale,
  fallbackLocale = defaultLocale,
  storedLocale,
}: {
  cookieLocale: string | null | undefined;
  fallbackLocale?: string | null | undefined;
  storedLocale: string | null | undefined;
}): Locale {
  if (isSupportedLocale(storedLocale)) return storedLocale;
  if (isSupportedLocale(cookieLocale)) return cookieLocale;
  if (isSupportedLocale(fallbackLocale)) return fallbackLocale;

  return defaultLocale;
}

export function getLocalePersistenceAction({
  cookieLocale,
  serverLocale,
  storedLocale,
}: {
  cookieLocale: string | null | undefined;
  serverLocale: Locale;
  storedLocale: string | null | undefined;
}) {
  const locale = resolveBrowserLocale({
    cookieLocale,
    fallbackLocale: serverLocale,
    storedLocale,
  });

  return {
    locale,
    shouldReload: locale !== serverLocale,
    shouldWriteCookie: cookieLocale !== locale,
    shouldWriteStorage: storedLocale !== locale,
  };
}

export function buildLocaleCookie(locale: Locale): string {
  return `${localeCookieName}=${locale}; Path=/; Max-Age=${localeCookieMaxAgeSeconds}; SameSite=Lax`;
}

export function readCookieValue(cookieString: string, name: string): string | null {
  const cookie = cookieString
    .split(";")
    .map((entry) => entry.trim())
    .find((entry) => entry.startsWith(`${name}=`));

  if (!cookie) return null;

  return decodeURIComponent(cookie.slice(name.length + 1));
}
