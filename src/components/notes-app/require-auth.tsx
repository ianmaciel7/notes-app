"use client";

import type { PropsWithChildren, ReactNode } from "react";
import { Spinner } from "@/components/ui/spinner";
import { useRequireAuth } from "@/hooks/use-require-auth";

export interface RequireAuthProps extends PropsWithChildren {
  fallback?: ReactNode;
  redirectTo?: string;
}

export function RequireAuth({
  children,
  fallback,
  redirectTo = "/login",
}: RequireAuthProps) {
  const { user, isLoading } = useRequireAuth(redirectTo);

  if (isLoading) {
    return (
      fallback ?? (
        <div
          data-testid="auth-loading"
          className="flex h-full min-h-[50vh] w-full items-center justify-center p-8"
        >
          <Spinner className="size-8" />
        </div>
      )
    );
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
}
