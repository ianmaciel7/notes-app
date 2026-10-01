"use client";

import { initializeUI } from "@firebase-oss/ui-core";
import {
  FirebaseUIProvider,
  type FirebaseUIProviderProps,
} from "@firebase-oss/ui-react";
import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import { useEffect, useState } from "react";
import { AuthContext } from "@/lib/auth-context";
import { app, auth } from "@/lib/firebase/client";
import {
  getClientCookieLocale,
  initGuestFirebaseLocale,
  syncFirebaseLocale,
} from "@/lib/i18n/locale-sync";

const defaultUi = initializeUI({ app });

export interface AuthProviderProps extends Omit<FirebaseUIProviderProps, "ui"> {
  ui?: FirebaseUIProviderProps["ui"];
  initialUser?: User | null;
}

export function AuthProvider({
  children,
  ui = defaultUi,
  initialUser = null,
  ...props
}: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(initialUser);
  const [isLoading, setIsLoading] = useState(!initialUser);

  useEffect(() => {
    // Initial guest/user language setup for Firebase Auth instance
    const initialCookieLocale = getClientCookieLocale();
    if (initialCookieLocale) {
      auth.languageCode = initialCookieLocale;
    } else {
      initGuestFirebaseLocale(auth);
    }

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsLoading(false);

      if (currentUser) {
        const activeLocale = getClientCookieLocale();
        if (activeLocale) {
          syncFirebaseLocale(auth, activeLocale);
        }
      } else {
        const activeLocale = getClientCookieLocale();
        if (!activeLocale) {
          initGuestFirebaseLocale(auth);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  async function signOutUser() {
    await signOut(auth);
  }

  return (
    <FirebaseUIProvider ui={ui} {...props}>
      <AuthContext value={{ user, isLoading, signOutUser }}>
        {children}
      </AuthContext>
    </FirebaseUIProvider>
  );
}
