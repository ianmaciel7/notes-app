"use client";

import * as React from "react";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut as fbSignOut,
  type User,
} from "firebase/auth";

import { auth, googleAuthProvider } from "@/integrations/firebase";

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  loginWithEmail: (email: string, pass: string) => Promise<User>;
  registerWithEmail: (email: string, pass: string) => Promise<User>;
  loginWithGoogle: () => Promise<User>;
  logout: () => Promise<void>;
  clearError: () => void;
}

export const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export function getFriendlyErrorMessage(error: unknown): string {
  if (typeof error !== "object" || error === null || !("code" in error)) {
    return error instanceof Error ? error.message : "Ocorreu um erro inesperado.";
  }

  const code = (error as { code: string }).code;

  switch (code) {
    case "auth/invalid-email":
      return "Endereço de e-mail inválido.";
    case "auth/user-disabled":
      return "Esta conta de usuário foi desativada.";
    case "auth/user-not-found":
    case "auth/wrong-password":
    case "auth/invalid-credential":
      return "E-mail ou senha incorretos.";
    case "auth/email-already-in-use":
      return "Este e-mail já está cadastrado.";
    case "auth/weak-password":
      return "A senha deve ter pelo menos 6 caracteres.";
    case "auth/popup-closed-by-user":
      return "O login com Google foi cancelado.";
    case "auth/network-request-failed":
      return "Erro de conexão. Verifique sua internet ou se o emulador está ativo.";
    case "auth/operation-not-allowed":
      return "Este método de login não está ativado no Firebase.";
    default:
      return (error as { message?: string }).message || "Falha na autenticação.";
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<User | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (currentUser) => {
        setUser(currentUser);
        setLoading(false);
      },
      (err) => {
        setError(getFriendlyErrorMessage(err));
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, []);

  const clearError = React.useCallback(() => {
    setError(null);
  }, []);

  const loginWithEmail = React.useCallback(async (email: string, pass: string) => {
    setError(null);
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, pass);
      setUser(userCredential.user);
      return userCredential.user;
    } catch (err) {
      const friendlyMessage = getFriendlyErrorMessage(err);
      setError(friendlyMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const registerWithEmail = React.useCallback(async (email: string, pass: string) => {
    setError(null);
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
      setUser(userCredential.user);
      return userCredential.user;
    } catch (err) {
      const friendlyMessage = getFriendlyErrorMessage(err);
      setError(friendlyMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const loginWithGoogle = React.useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      const userCredential = await signInWithPopup(auth, googleAuthProvider);
      setUser(userCredential.user);
      return userCredential.user;
    } catch (err) {
      const friendlyMessage = getFriendlyErrorMessage(err);
      setError(friendlyMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = React.useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      await fbSignOut(auth);
      setUser(null);
    } catch (err) {
      const friendlyMessage = getFriendlyErrorMessage(err);
      setError(friendlyMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const value = React.useMemo(
    () => ({
      user,
      loading,
      error,
      loginWithEmail,
      registerWithEmail,
      loginWithGoogle,
      logout,
      clearError,
    }),
    [user, loading, error, loginWithEmail, registerWithEmail, loginWithGoogle, logout, clearError],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
