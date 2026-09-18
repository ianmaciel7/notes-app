import { type Locale, supportedLocales } from "@/lib/i18n/types";

export function localePath(locale: Locale, path: `/${string}`): string {
  const normalizedPath = stripLocalePrefix(path);

  return normalizedPath === "/" ? `/${locale}` : `/${locale}${normalizedPath}`;
}

function stripLocalePrefix(path: `/${string}`): `/${string}` {
  const matchingLocale = supportedLocales.find(
    (locale) => path === `/${locale}` || path.startsWith(`/${locale}/`),
  );

  if (!matchingLocale) return path;

  const strippedPath = path.slice(matchingLocale.length + 1);

  if (strippedPath === "") return "/";

  return strippedPath.startsWith("/")
    ? (strippedPath as `/${string}`)
    : (`/${strippedPath}` as `/${string}`);
}
