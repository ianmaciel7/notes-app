import "server-only";

import { getFirebaseAdminFirestore } from "@/lib/firebase/admin";
import { isSupportedLocale, type Locale } from "@/lib/i18n/config";

/**
 * The Admin SDK accesses user preferences only after the server verifies
 * the HttpOnly session. Client-provided UIDs are never trusted.
 * This is a narrow locale seam, not the general Firestore DAL (ADR 0008).
 */
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

export async function readProfileLocale(uid: string): Promise<Locale | null> {
  const snapshot = await preferenceDocument(uid).get();
  const value: unknown = snapshot.data()?.locale;
  return typeof value === "string" && isSupportedLocale(value) ? value : null;
}

export async function writeProfileLocale(
  uid: string,
  locale: Locale,
): Promise<void> {
  await preferenceDocument(uid).set({ locale }, { merge: true });
}
