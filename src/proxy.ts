import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { type Locale, supportedLocales } from "@/lib/i18n/types";

const defaultLocale: Locale = "en";

function negotiateLocale(acceptLanguage: string | null): Locale {
  if (!acceptLanguage) return defaultLocale;

  const languageRanges = acceptLanguage
    .split(",")
    .map((value, index) => {
      const [language, ...parameters] = value.trim().split(";");
      const quality = parameters.find((parameter) =>
        parameter.startsWith("q="),
      );
      const weight = quality ? Number.parseFloat(quality.slice(2)) : 1;

      return { index, language: language.toLowerCase(), weight };
    })
    .filter(
      ({ language, weight }) => language && !Number.isNaN(weight) && weight > 0,
    )
    .sort((a, b) => b.weight - a.weight || a.index - b.index);

  for (const { language } of languageRanges) {
    const exactLocale = supportedLocales.find(
      (locale) => locale.toLowerCase() === language,
    );

    if (exactLocale) return exactLocale;

    const languageCode = language.split("-")[0];
    const matchingLocale = supportedLocales.find(
      (locale) => locale.toLowerCase().split("-")[0] === languageCode,
    );

    if (matchingLocale) return matchingLocale;
  }

  return defaultLocale;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasSupportedLocale = supportedLocales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );

  if (hasSupportedLocale) return NextResponse.next();

  const locale = negotiateLocale(request.headers.get("accept-language"));
  return NextResponse.redirect(new URL(`/${locale}${pathname}`, request.url));
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
