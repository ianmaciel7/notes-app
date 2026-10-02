"use client";

import { useTranslations } from "next-intl";
import type { ComponentProps } from "react";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";

type AuthGreetingHeaderProps = ComponentProps<"div">;

function AuthGreetingHeader({ className, ...props }: AuthGreetingHeaderProps) {
  const { user } = useAuth();
  const t = useTranslations("auth");

  const userName =
    user?.displayName ||
    (user?.email ? user.email.split("@")[0] : t("defaultUser"));

  return (
    <div
      data-slot="auth-greeting-header"
      className={cn("flex flex-col gap-2", className)}
      {...props}
    >
      <h1 className="text-2xl font-bold tracking-tight text-foreground">
        {user ? t("userGreeting", { name: userName }) : t("guestGreeting")}
      </h1>
      <p className="text-sm text-muted-foreground">
        {user ? t("userDescription") : t("guestDescription")}
      </p>
    </div>
  );
}

// Backwards-compatible aliases
export {
  AuthGreetingHeader as AuthGreeting,
  AuthGreetingHeader,
  type AuthGreetingHeaderProps,
  type AuthGreetingHeaderProps as AuthGreetingProps,
};
