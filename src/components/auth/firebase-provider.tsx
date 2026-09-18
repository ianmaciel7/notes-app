"use client";

import { initializeUI, providerPopupStrategy } from "@firebase-oss/ui-core";
import { FirebaseUIProvider } from "@firebase-oss/ui-react";
import { onIdTokenChanged } from "firebase/auth";
import { type ReactNode, useEffect } from "react";

import { syncSession } from "@/lib/auth/client-session";
import { auth, firebaseApp } from "@/lib/firebase/client";

const ui = initializeUI({
  app: firebaseApp,
  behaviors: [providerPopupStrategy()],
});

export function FirebaseProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    return onIdTokenChanged(auth, async (user) => {
      if (user) {
        const token = await user.getIdToken();
        await syncSession(token);
      } else {
        await fetch("/api/session", { method: "DELETE" });
      }
    });
  }, []);

  return <FirebaseUIProvider ui={ui}>{children}</FirebaseUIProvider>;
}
