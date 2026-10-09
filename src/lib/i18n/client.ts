import type { Auth } from "firebase/auth";
import { setLocalePreference } from "@/actions/locale-actions";
import {
  defaultLocale,
  isSupportedLocale,
  LOCALE_COOKIE_NAME,
  type Locale,
  matchLocale,
  negotiateLocale,
} from "@/lib/i18n/config";
import {
  type FirebaseUiLocale,
  getFirebaseUiLocale,
} from "@/lib/i18n/firebase-ui-locale";

type FirebaseUiLocaleTarget = {
  setLocale: (locale: FirebaseUiLocale) => void;
};

export function readLocaleCookie(): Locale | undefined {
  if (typeof document === "undefined") {
    return undefined;
  }

  const cookie = document.cookie
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${LOCALE_COOKIE_NAME}=`));

  if (!cookie) {
    return undefined;
  }

  const separatorIndex = cookie.indexOf("=");
  if (separatorIndex < 0) {
    return undefined;
  }

  let value: string;
  try {
    value = decodeURIComponent(cookie.slice(separatorIndex + 1));
  } catch {
    return undefined;
  }

  return isSupportedLocale(value) ? value : undefined;
}

export function resolveClientLocale(): Locale {
  const cookieLocale = readLocaleCookie();
  if (cookieLocale) {
    return cookieLocale;
  }

  if (typeof navigator !== "undefined") {
    const negotiatedLocale = negotiateLocale(navigator.languages?.join(","));
    if (negotiatedLocale) {
      return negotiatedLocale;
    }

    const browserLocale = matchLocale(navigator.language);
    if (browserLocale) {
      return browserLocale;
    }
  }

  return defaultLocale;
}

/** Mirrors a resolved locale to Firebase Auth and to Firebase UI text. */
export function applyAuthLocale(
  auth: Auth,
  ui: FirebaseUiLocaleTarget,
  locale: Locale,
): void {
  auth.languageCode = locale;
  ui.setLocale(getFirebaseUiLocale(locale));
}

/** Persists an explicit choice on the server, then mirrors it to Firebase. */
export async function changeLocalePreference(
  auth: Auth,
  ui: FirebaseUiLocaleTarget,
  locale: Locale,
): Promise<void> {
  await setLocalePreference(locale);
  applyAuthLocale(auth, ui, locale);
  // The root layout is reused on refresh, so its pre-paint script does not rerun.
  document.documentElement.lang = locale;
}
