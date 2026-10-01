"use client";

import type { PropsWithChildren, ReactNode } from "react";
import { Spinner } from "@/components/ui/spinner";
import { useRequireGuest } from "@/hooks/use-require-guest";

export interface RequireGuestProps extends PropsWithChildren {
  fallback?: ReactNode;
  redirectTo?: string;
}

export function RequireGuest({
  children,
  fallback,
  redirectTo = "/",
}: RequireGuestProps) {
  const { user, isLoading } = useRequireGuest(redirectTo);

  if (isLoading) {
    return (
      fallback ?? (
        <div
          data-testid="guest-loading"
          className="flex h-full min-h-[50vh] w-full items-center justify-center p-8"
        >
          <Spinner className="size-8" />
        </div>
      )
    );
  }

  if (user) {
    return null;
  }

  return <>{children}</>;
}
