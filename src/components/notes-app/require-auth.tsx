"use client";

import type { PropsWithChildren, ReactNode } from "react";
import { Empty, EmptyMedia } from "@/components/ui/empty";
import { Spinner } from "@/components/ui/spinner";
import { useRequireAuth } from "@/hooks/use-require-auth";

type RequireAuthProps = PropsWithChildren<{
  fallback?: ReactNode;
  redirectTo?: string;
}>;

function RequireAuth({
  children,
  fallback,
  redirectTo = "/login",
}: RequireAuthProps) {
  const { user, isLoading } = useRequireAuth(redirectTo);

  if (isLoading) {
    return (
      fallback ?? (
        <Empty
          data-slot="require-auth"
          data-testid="require-auth-loading"
          className="h-full min-h-64 p-8"
        >
          <EmptyMedia>
            <Spinner className="size-8" />
          </EmptyMedia>
        </Empty>
      )
    );
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
}

export { RequireAuth, type RequireAuthProps };
