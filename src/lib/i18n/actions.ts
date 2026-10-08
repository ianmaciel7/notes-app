"use server";

import { refresh } from "next/cache";
import { cookies } from "next/headers";
import { getCurrentIdentity } from "@/lib/firebase/identity";
import {
  isSupportedLocale,
  LOCALE_COOKIE_NAME,
  type Locale,
} from "@/lib/i18n/config";
import {
  readProfileLocale,
  writeProfileLocale,
} from "@/lib/i18n/profile-preference";

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

  const identity = await getCurrentIdentity();
  if (identity) {
    await writeProfileLocale(identity.uid, locale);
  }

  await saveLocaleCookie(locale);
}

/** Called once after login exchanges an ID token for a verified cookie. */
export async function syncLocalePreference(): Promise<Locale | null> {
  const identity = await getCurrentIdentity();
  if (!identity) {
    return null;
  }

  const stored = await readProfileLocale(identity.uid);
  if (stored) {
    await saveLocaleCookie(stored);
    return stored;
  }

  // A guest's explicit selection can become the initial profile preference.
  const explicitCookie = (await cookies()).get(LOCALE_COOKIE_NAME)?.value;
  if (isSupportedLocale(explicitCookie)) {
    await writeProfileLocale(identity.uid, explicitCookie);
    return explicitCookie;
  }

  // Never save browser auto-detection as a user's explicit preference.
  return null;
}
