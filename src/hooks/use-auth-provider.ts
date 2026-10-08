"use client";

import { initializeUI, providerRedirectStrategy } from "@firebase-oss/ui-core";
import { onAuthStateChanged, type User } from "firebase/auth";
import { usePathname, useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { getFirebaseClient } from "@/lib/firebase/client";
import { isProtectedPath } from "@/lib/firebase/session";
import { syncLocalePreference } from "@/lib/i18n/actions";
import { applyAuthLocale } from "@/lib/i18n/client";
import type { Locale } from "@/lib/i18n/config";

const firebaseClient = getFirebaseClient();
const firebaseUi = initializeUI({
  app: firebaseClient.app,
  auth: firebaseClient.auth,
  behaviors: [providerRedirectStrategy()],
});

export function useAuthProvider() {
  const [errorKey, setErrorKey] = useState<
    "sessionFailed" | "preferenceSyncFailed"
  >();
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale() as Locale;
  const translate = useTranslations("auth");
  const isProtectedRoute = isProtectedPath(pathname);

  // Changes made with the locale picker also update Firebase UI/Auth.
  useEffect(() => {
    applyAuthLocale(firebaseClient.auth, firebaseUi.get(), locale);
  }, [locale]);

  useEffect(() => {
    return onAuthStateChanged(
      firebaseClient.auth,
      async (user: User | null) => {
        if (!user) {
          return;
        }

        try {
          const idToken = await user.getIdToken(true);
          const response = await fetch("/api/auth/session", {
            body: JSON.stringify({ idToken }),
            headers: { "Content-Type": "application/json" },
            method: "POST",
          });

          if (!response.ok) {
            throw new Error("Unable to establish a server session.");
          }

          try {
            // Profile preferences are trusted only after session verification.
            const profileLocale = await syncLocalePreference();
            if (profileLocale) {
              applyAuthLocale(
                firebaseClient.auth,
                firebaseUi.get(),
                profileLocale,
              );
              document.documentElement.lang = profileLocale;
            }
          } catch {
            // A preference service outage must not lock users out.
            setErrorKey("preferenceSyncFailed");
          }

          if (!isProtectedRoute) {
            router.replace("/dashboard");
          }
          router.refresh();
        } catch {
          setErrorKey("sessionFailed");
        }
      },
    );
  }, [router, isProtectedRoute]);

  return { error: errorKey ? translate(errorKey) : undefined, firebaseUi };
}
