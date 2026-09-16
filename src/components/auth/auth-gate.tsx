"use client";

import * as React from "react";
import { Lock, ShieldAlert } from "lucide-react";

import { AuthDialog } from "@/components/auth/auth-dialog";
import { Button } from "@/components/ui/button";
import type { Permission, UserRole } from "@/domain/auth";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";

export interface AuthGateProps extends React.ComponentProps<"div"> {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  requireAuth?: boolean;
  requireVerified?: boolean;
  requireRole?: UserRole;
  requirePermission?: Permission;
  showLoginButton?: boolean;
  title?: string;
  description?: string;
}

export function AuthGate({
  children,
  fallback,
  requireAuth = true,
  requireVerified = false,
  requireRole,
  requirePermission,
  showLoginButton = true,
  title = "Acesso Restrito",
  description,
  className,
  ...props
}: AuthGateProps) {
  const { user, loading, role, hasPermission, isAuthenticated, isAnonymous } = useAuth();
  const [dialogOpen, setDialogOpen] = React.useState(false);

  if (loading) {
    return (
      <div className={cn("p-8 flex items-center justify-center min-h-[160px]", className)} {...props}>
        <div className="animate-pulse flex flex-col items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-muted" />
          <div className="h-4 w-32 bg-muted rounded" />
        </div>
      </div>
    );
  }

  let isAllowed = true;
  let reason = "";

  if (requireAuth) {
    if (!isAuthenticated || isAnonymous) {
      isAllowed = false;
      reason = "Faça login com sua conta para acessar esta funcionalidade.";
    }
  }

  if (isAllowed && requireVerified && user && !user.emailVerified) {
    isAllowed = false;
    reason = "Por favor, confirme seu endereço de e-mail para continuar.";
  }

  if (isAllowed && requireRole) {
    if (role !== requireRole && role !== "admin") {
      isAllowed = false;
      reason = "Você não possui o nível de permissão necessário.";
    }
  }

  if (isAllowed && requirePermission) {
    if (!hasPermission(requirePermission)) {
      isAllowed = false;
      reason = "Você não tem autorização para realizar esta ação.";
    }
  }

  if (isAllowed) {
    return <>{children}</>;
  }

  if (fallback !== undefined) {
    return <>{fallback}</>;
  }

  const displayDescription = description || reason;

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-6 sm:p-8 rounded-xl border border-dashed border-border bg-card/50 text-center max-w-md mx-auto my-6",
        className,
      )}
      {...props}
    >
      <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-3.5">
        {requireRole || requirePermission ? <ShieldAlert size={22} /> : <Lock size={22} />}
      </div>
      <h3 className="text-base font-semibold tracking-tight text-foreground">{title}</h3>
      <p className="text-xs sm:text-sm text-muted-foreground mt-1 mb-5 leading-relaxed">
        {displayDescription}
      </p>

      {showLoginButton && (
        <>
          <Button
            type="button"
            onClick={() => setDialogOpen(true)}
            className="min-w-[140px]"
          >
            {isAnonymous ? "Vincular Conta" : "Entrar na Conta"}
          </Button>
          <AuthDialog open={dialogOpen} onClose={() => setDialogOpen(false)} />
        </>
      )}
    </div>
  );
}
