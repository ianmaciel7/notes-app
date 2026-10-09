"use server";

import { refresh } from "next/cache";
import { cookies } from "next/headers";
import { syncProfileLocale, writeProfileLocale } from "@/data/locale-dal";
import {
  isSupportedLocale,
  LOCALE_COOKIE_NAME,
  type Locale,
} from "@/lib/i18n/config";

async function saveLocaleCookie(locale: Locale) {
  const cookieStore = await cookies();
  cookieStore.set(LOCALE_COOKIE_NAME, locale, {
    maxAge: 31_536_000,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
  refresh();
}

/** Explicit locale choices are saved to the user's own profile when signed in. */
export async function setLocalePreference(locale: string): Promise<void> {
  if (!isSupportedLocale(locale)) {
    throw new Error("Unsupported locale.");
  }

  await writeProfileLocale(locale);
  await saveLocaleCookie(locale);
}

/** Called once after login exchanges an ID token for a verified cookie. */
export async function syncLocalePreference(): Promise<Locale | null> {
  const explicitCookie = (await cookies()).get(LOCALE_COOKIE_NAME)?.value;
  const stored = await syncProfileLocale(
    isSupportedLocale(explicitCookie) ? explicitCookie : null,
  );
  if (!stored) {
    // Never save browser auto-detection as a user's explicit preference.
    return null;
  }

  if (stored !== explicitCookie) {
    await saveLocaleCookie(stored);
  }

  return stored;
}
