"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import type { ComponentProps } from "react";
import { LanguageSelect } from "@/components/notes-app/language-select";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";

type UserMenuProps = ComponentProps<"div">;

function UserMenu({ className, ...props }: UserMenuProps) {
  const { user, isLoading, signOutUser } = useAuth();
  const t = useTranslations("auth");

  if (isLoading) {
    return (
      <Skeleton
        data-testid="user-menu-loading"
        className={cn("h-8 w-24", className)}
        {...props}
      />
    );
  }

  if (!user) {
    return (
      <div className={cn("flex items-center gap-3", className)} {...props}>
        <LanguageSelect />
        <Button
          render={
            <Link href="/login" data-testid="login-link">
              {t("signIn")}
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
    (user.isAnonymous ? t("anonymous") : t("defaultUser"));

  return (
    <div
      data-testid="user-menu"
      className={cn(
        "flex items-center gap-3 text-sm text-foreground",
        className,
      )}
      {...props}
    >
      <LanguageSelect />
      <span
        data-testid="user-identifier"
        className="max-w-45 truncate font-medium"
      >
        {userIdentifier}
      </span>
      <Button
        data-testid="sign-out-btn"
        size="sm"
        variant="ghost"
        onClick={() => signOutUser()}
      >
        {t("signOut")}
      </Button>
    </div>
  );
}

export { UserMenu, type UserMenuProps };
