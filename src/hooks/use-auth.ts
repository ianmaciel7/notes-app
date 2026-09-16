"use client";

import * as React from "react";
import { AuthContext, type AuthContextType } from "@/components/auth-provider";
import type { Permission, UserRole } from "@/domain/auth";

const defaultAuthContext: AuthContextType = {
  user: null,
  loading: false,
  error: null,
  role: "guest",
  isAnonymous: false,
  isAuthenticated: false,
  permissions: [],
  hasPermission: () => false,
  loginWithEmail: async () => {
    throw new Error("useAuth must be used within an AuthProvider");
  },
  registerWithEmail: async () => {
    throw new Error("useAuth must be used within an AuthProvider");
  },
  loginWithGoogle: async () => {
    throw new Error("useAuth must be used within an AuthProvider");
  },
  loginAnonymously: async () => {
    throw new Error("useAuth must be used within an AuthProvider");
  },
  linkAccountWithEmail: async () => {
    throw new Error("useAuth must be used within an AuthProvider");
  },
  linkAccountWithGoogle: async () => {
    throw new Error("useAuth must be used within an AuthProvider");
  },
  resetPassword: async () => {
    throw new Error("useAuth must be used within an AuthProvider");
  },
  updateUserProfile: async () => {
    throw new Error("useAuth must be used within an AuthProvider");
  },
  logout: async () => {},
  clearError: () => {},
};

export function useAuth(): AuthContextType {
  const context = React.useContext(AuthContext);
  return context ?? defaultAuthContext;
}

export function useUserRole(): UserRole {
  const { role } = useAuth();
  return role;
}

export function usePermission(permission: Permission): boolean {
  const { hasPermission } = useAuth();
  return hasPermission(permission);
}
