import "server-only";

import { getFirebaseAdminFirestore } from "@/lib/firebase/admin";
import { getCurrentIdentity } from "@/lib/firebase/identity";
import { isSupportedLocale, type Locale } from "@/lib/i18n/config";

// Locale preferences live at users/{uid}.locale (ADR 0007). Like every Data
// Access Layer function, these authenticate their own caller and take no uid:
// a guest has no profile, so a read returns null and a write does nothing.

function preferenceDocument(uid: string) {
  if (process.env.NODE_ENV !== "production") {
    if (process.env.FIRESTORE_EMULATOR_HOST !== "127.0.0.1:8080") {
      throw new Error(
        "Start the Firestore Emulator before reading preferences.",
      );
    }
  }

  return getFirebaseAdminFirestore().collection("users").doc(uid);
}

/** The signed-in user's saved locale, or null for a guest or no saved value. */
export async function readProfileLocale(): Promise<Locale | null> {
  const identity = await getCurrentIdentity();
  if (!identity) {
    return null;
  }

  const snapshot = await preferenceDocument(identity.uid).get();
  const value: unknown = snapshot.data()?.locale;
  return typeof value === "string" && isSupportedLocale(value) ? value : null;
}

/** Saves the locale to the signed-in user's profile. False for a guest. */
export async function writeProfileLocale(locale: Locale): Promise<boolean> {
  const identity = await getCurrentIdentity();
  if (!identity) {
    return false;
  }

  await preferenceDocument(identity.uid).set({ locale }, { merge: true });
  return true;
}

/**
 * Returns the signed-in user's saved locale, or saves an explicit locale when
 * no preference exists. A guest has no profile and returns null.
 */
export async function syncProfileLocale(
  explicitLocale: Locale | null,
): Promise<Locale | null> {
  const identity = await getCurrentIdentity();
  if (!identity) {
    return null;
  }

  const profile = preferenceDocument(identity.uid);
  const snapshot = await profile.get();
  const value: unknown = snapshot.data()?.locale;
  if (typeof value === "string" && isSupportedLocale(value)) {
    return value;
  }

  if (!explicitLocale) {
    return null;
  }

  await profile.set({ locale: explicitLocale }, { merge: true });
  return explicitLocale;
}
