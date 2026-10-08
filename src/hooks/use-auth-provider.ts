"use client";

import { initializeUI, providerRedirectStrategy } from "@firebase-oss/ui-core";
import { onAuthStateChanged, type User } from "firebase/auth";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getFirebaseClient } from "@/lib/firebase/client";
import { isProtectedPath } from "@/lib/firebase/session";
import { applyAuthLocale, resolveClientLocale } from "@/lib/i18n/client";

const firebaseClient = getFirebaseClient();
const firebaseUi = initializeUI({
  app: firebaseClient.app,
  auth: firebaseClient.auth,
  behaviors: [providerRedirectStrategy()],
});

export function useAuthProvider() {
  const [error, setError] = useState<string>();
  const router = useRouter();
  const pathname = usePathname();
  const isProtectedRoute = isProtectedPath(pathname);

  useEffect(() => {
    return onAuthStateChanged(
      firebaseClient.auth,
      async (user: User | null) => {
        // Applied after mount (not in initializeUI) so the first client render
        // matches the server-rendered text and hydration stays consistent.
        applyAuthLocale(
          firebaseClient.auth,
          firebaseUi.get(),
          resolveClientLocale(),
        );

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

          if (!isProtectedRoute) {
            router.replace("/dashboard");
            router.refresh();
          }
        } catch (cause) {
          setError(
            cause instanceof Error ? cause.message : "Authentication failed.",
          );
        }
      },
    );
  }, [router, isProtectedRoute]);

  return { error, firebaseUi };
}
