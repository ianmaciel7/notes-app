"use server";

import { refresh } from "next/cache";
import { cookies } from "next/headers";
import {
  isSupportedLocale,
  LOCALE_COOKIE_NAME,
  type Locale,
} from "@/lib/i18n/config";

export async function setLocalePreference(locale: string): Promise<void> {
  if (!isSupportedLocale(locale)) {
    throw new Error(`Unsupported locale: ${locale}`);
  }

  const cookieStore = await cookies();
  cookieStore.set(LOCALE_COOKIE_NAME, locale as Locale, {
    maxAge: 31_536_000,
    path: "/",
    sameSite: "lax",
  });
  refresh();
}
