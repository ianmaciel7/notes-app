"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";

export interface UserMenuProps extends ComponentProps<"div"> {}

export function UserMenu({ className, ...props }: UserMenuProps) {
  const { user, isLoading, signOutUser } = useAuth();

  if (isLoading) {
    return (
      <div
        data-testid="user-menu-loading"
        className={cn("h-8 w-24 animate-pulse rounded bg-muted", className)}
        {...props}
      />
    );
  }

  if (!user) {
    return (
      <div className={className} {...props}>
        <Button
          render={
            <Link href="/login" data-testid="login-link">
              Entrar
            </Link>
          }
          nativeButton={false}
          size="sm"
          variant="outline"
        />
      </div>
    );
  }

  const userIdentifier =
    user.displayName ||
    user.email ||
    (user.isAnonymous ? "Convidado" : "Usuário");

  return (
    <div
      data-testid="user-menu"
      className={cn(
        "flex items-center gap-x-3 text-sm text-foreground",
        className,
      )}
      {...props}
    >
      <span
        data-testid="user-identifier"
        className="truncate font-medium max-w-[180px]"
      >
        {userIdentifier}
      </span>
      <Button
        data-testid="sign-out-btn"
        size="sm"
        variant="ghost"
        onClick={() => signOutUser()}
      >
        Sair
      </Button>
    </div>
  );
}
