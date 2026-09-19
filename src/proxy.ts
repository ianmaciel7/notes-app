import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import {
  defaultLocale,
  hasLocale,
  type Locale,
  localeCookieName,
  localeHeaderName,
  supportedLocales,
} from "@/lib/i18n/types";

const sessionCookieName = "firebase_session";
const localeCookieOptions = {
  maxAge: 60 * 60 * 24 * 365,
  path: "/",
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV !== "development",
};

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

  const matchedLocale = supportedLocales.find(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );

  const savedLocale = request.cookies.get(localeCookieName)?.value;
  const locale = hasLocale(savedLocale)
    ? savedLocale
    : negotiateLocale(request.headers.get("accept-language"));
  const requestHeaders = new Headers(request.headers);

  requestHeaders.set(localeHeaderName, matchedLocale ?? locale);

  // If session expired or was revoked, clear cookie
  if (request.nextUrl.searchParams.get("expired") === "true") {
    const response = NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
    response.cookies.delete(sessionCookieName);
    return response;
  }

  if (matchedLocale) {
    const response = NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
    response.cookies.set(localeCookieName, matchedLocale, localeCookieOptions);
    return response;
  }

  const redirectUrl = request.nextUrl.clone();
  redirectUrl.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;

  const response = NextResponse.redirect(redirectUrl);
  response.cookies.set(localeCookieName, locale, localeCookieOptions);
  return response;
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
