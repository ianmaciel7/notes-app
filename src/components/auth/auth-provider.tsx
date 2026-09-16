"use client";

import * as React from "react";
import {
  createUserWithEmailAndPassword,
  EmailAuthProvider,
  linkWithCredential,
  linkWithPopup,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInAnonymously as fbSignInAnonymously,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut as fbSignOut,
  updateProfile as fbUpdateProfile,
  type User,
} from "firebase/auth";

import { getUserPermissions, getUserRole, hasPermission as checkPermission, type Permission, type UserRole } from "@/domain/auth";
import { auth, googleAuthProvider } from "@/integrations/firebase";

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  role: UserRole;
  isAnonymous: boolean;
  isAuthenticated: boolean;
  permissions: Permission[];
  hasPermission: (permission: Permission) => boolean;
  loginWithEmail: (email: string, pass: string) => Promise<User>;
  registerWithEmail: (email: string, pass: string, displayName?: string) => Promise<User>;
  loginWithGoogle: () => Promise<User>;
  loginAnonymously: () => Promise<User>;
  linkAccountWithEmail: (email: string, pass: string) => Promise<User>;
  linkAccountWithGoogle: () => Promise<User>;
  resetPassword: (email: string) => Promise<void>;
  updateUserProfile: (profile: { displayName?: string; photoURL?: string }) => Promise<void>;
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
    case "auth/credential-already-in-use":
      return "Esta credencial já está associada a outra conta.";
    case "auth/weak-password":
      return "A senha deve ter pelo menos 6 caracteres.";
    case "auth/popup-closed-by-user":
      return "O login com Google foi cancelado.";
    case "auth/network-request-failed":
      return "Erro de conexão. Verifique sua internet ou se o emulador do Firebase está ativo.";
    case "auth/operation-not-allowed":
      return "Este método de login não está ativado no Firebase ou no Emulador.";
    case "auth/requires-recent-login":
      return "Esta operação requer autenticação recente. Faça login novamente.";
    case "auth/too-many-requests":
      return "Muitas tentativas malsucedidas. Tente novamente mais tarde.";
    case "auth/user-mismatch":
      return "As credenciais fornecidas não pertencem ao usuário atual.";
    case "auth/provider-already-linked":
      return "Este provedor já está vinculado à sua conta.";
    case "auth/popup-blocked":
      return "O pop-up de autenticação foi bloqueado pelo navegador.";
    case "auth/cancelled-popup-request":
      return "Autenticação via pop-up cancelada.";
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

  const role: UserRole = React.useMemo(() => getUserRole(user), [user]);
  const permissions: Permission[] = React.useMemo(() => getUserPermissions(role), [role]);
  const isAnonymous = user?.isAnonymous ?? false;
  const isAuthenticated = !!user;

  const hasPermissionCallback = React.useCallback(
    (permission: Permission) => checkPermission(role, permission),
    [role],
  );

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

  const registerWithEmail = React.useCallback(
    async (email: string, pass: string, displayName?: string) => {
      setError(null);
      setLoading(true);
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
        if (displayName && userCredential.user) {
          await fbUpdateProfile(userCredential.user, { displayName });
        }
        setUser(userCredential.user);
        return userCredential.user;
      } catch (err) {
        const friendlyMessage = getFriendlyErrorMessage(err);
        setError(friendlyMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

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

  const loginAnonymously = React.useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      const userCredential = await fbSignInAnonymously(auth);
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

  const linkAccountWithEmail = React.useCallback(
    async (email: string, pass: string) => {
      if (!auth.currentUser) {
        throw new Error("Nenhum usuário ativo para vincular conta.");
      }
      setError(null);
      setLoading(true);
      try {
        const credential = EmailAuthProvider.credential(email, pass);
        const userCredential = await linkWithCredential(auth.currentUser, credential);
        setUser(userCredential.user);
        return userCredential.user;
      } catch (err) {
        const friendlyMessage = getFriendlyErrorMessage(err);
        setError(friendlyMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const linkAccountWithGoogle = React.useCallback(async () => {
    if (!auth.currentUser) {
      throw new Error("Nenhum usuário ativo para vincular conta.");
    }
    setError(null);
    setLoading(true);
    try {
      const userCredential = await linkWithPopup(auth.currentUser, googleAuthProvider);
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

  const resetPassword = React.useCallback(async (email: string) => {
    setError(null);
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (err) {
      const friendlyMessage = getFriendlyErrorMessage(err);
      setError(friendlyMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateUserProfile = React.useCallback(
    async (profile: { displayName?: string; photoURL?: string }) => {
      if (!auth.currentUser) {
        throw new Error("Nenhum usuário ativo para atualizar o perfil.");
      }
      setError(null);
      setLoading(true);
      try {
        await fbUpdateProfile(auth.currentUser, profile);
        await auth.currentUser.reload?.();
        setUser(Object.assign(Object.create(Object.getPrototypeOf(auth.currentUser)), auth.currentUser));
      } catch (err) {
        const friendlyMessage = getFriendlyErrorMessage(err);
        setError(friendlyMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

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
      role,
      isAnonymous,
      isAuthenticated,
      permissions,
      hasPermission: hasPermissionCallback,
      loginWithEmail,
      registerWithEmail,
      loginWithGoogle,
      loginAnonymously,
      linkAccountWithEmail,
      linkAccountWithGoogle,
      resetPassword,
      updateUserProfile,
      logout,
      clearError,
    }),
    [
      user,
      loading,
      error,
      role,
      isAnonymous,
      isAuthenticated,
      permissions,
      hasPermissionCallback,
      loginWithEmail,
      registerWithEmail,
      loginWithGoogle,
      loginAnonymously,
      linkAccountWithEmail,
      linkAccountWithGoogle,
      resetPassword,
      updateUserProfile,
      logout,
      clearError,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

