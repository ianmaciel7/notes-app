"use client";

import { FirebaseUIProvider } from "@firebase-oss/ui-react";
import type { PropsWithChildren } from "react";
import { useAuthProvider } from "@/hooks/use-auth-provider";

export function AuthProvider({ children }: PropsWithChildren) {
  const { error, firebaseUi } = useAuthProvider();

  return (
    <FirebaseUIProvider ui={firebaseUi}>
      {error ? <p role="alert">{error}</p> : null}
      {children}
    </FirebaseUIProvider>
  );
}
