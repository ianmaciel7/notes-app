"use client";

import type { PropsWithChildren, ReactNode } from "react";
import { Empty, EmptyMedia } from "@/components/ui/empty";
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
        <Empty data-testid="guest-loading" className="h-full min-h-[50vh] p-8">
          <EmptyMedia>
            <Spinner className="size-8" />
          </EmptyMedia>
        </Empty>
      )
    );
  }

  if (user) {
    return null;
  }

  return <>{children}</>;
}
