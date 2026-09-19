"use client";

import { initializeUI, providerPopupStrategy } from "@firebase-oss/ui-core";
import { FirebaseUIProvider } from "@firebase-oss/ui-react";
import type { ReactNode } from "react";

import { firebaseApp } from "@/lib/firebase/client";

const ui = initializeUI({
  app: firebaseApp,
  behaviors: [providerPopupStrategy()],
});

export function FirebaseProvider({ children }: { children: ReactNode }) {
  return <FirebaseUIProvider ui={ui}>{children}</FirebaseUIProvider>;
}
