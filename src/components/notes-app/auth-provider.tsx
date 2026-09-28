"use client";

import { initializeUI } from "@firebase-oss/ui-core";
import {
  FirebaseUIProvider,
  type FirebaseUIProviderProps,
} from "@firebase-oss/ui-react";
import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import { createContext, useEffect, useState } from "react";
import { app, auth } from "@/lib/firebase/client";

export interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  signOutUser: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

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
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsLoading(false);
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
