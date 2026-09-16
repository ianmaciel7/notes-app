"use client";

import * as React from "react";
import { AuthContext, type AuthContextType } from "@/components/auth-provider";

const defaultAuthContext: AuthContextType = {
  user: null,
  loading: false,
  error: null,
  loginWithEmail: async () => {
    throw new Error("useAuth must be used within an AuthProvider");
  },
  registerWithEmail: async () => {
    throw new Error("useAuth must be used within an AuthProvider");
  },
  loginWithGoogle: async () => {
    throw new Error("useAuth must be used within an AuthProvider");
  },
  logout: async () => {},
  clearError: () => {},
};

export function useAuth(): AuthContextType {
  const context = React.useContext(AuthContext);
  return context ?? defaultAuthContext;
}
