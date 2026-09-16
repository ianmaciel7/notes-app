"use client";

import * as React from "react";
import { AuthContext, type AuthContextType } from "@/contexts/auth-context";

export function useAuth(): AuthContextType {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
