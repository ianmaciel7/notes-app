"use client";

import {
  initializeUI,
  providerPopupStrategy,
  providerRedirectStrategy,
} from "@firebase-oss/ui-core";
import { onAuthStateChanged, type User } from "firebase/auth";
import { usePathname, useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { getFirebaseClient } from "@/lib/firebase/client";
import { isProtectedPath } from "@/lib/firebase/session";
import { createServerSession } from "@/lib/firebase/session-client";
import { syncLocalePreference } from "@/lib/i18n/actions";
import { applyAuthLocale } from "@/lib/i18n/client";
import type { Locale } from "@/lib/i18n/config";

const firebaseClient = getFirebaseClient();
// Embedded Electron browsers (for example Cursor's) do not preserve
// `window.opener` in popups, which breaks the popup result relay, so they use
// the redirect flow instead.
const isElectronBrowser =
  typeof navigator !== "undefined" && navigator.userAgent.includes("Electron/");
const firebaseUi = initializeUI({
  app: firebaseClient.app,
  auth: firebaseClient.auth,
  behaviors: [
    isElectronBrowser ? providerRedirectStrategy() : providerPopupStrategy(),
  ],
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
          await createServerSession(await user.getIdToken(true));

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
