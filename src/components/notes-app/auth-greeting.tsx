"use client";

import { useTranslations } from "next-intl";
import type { ComponentProps } from "react";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";

export interface AuthGreetingProps extends ComponentProps<"div"> {}

export function AuthGreeting({ className, ...props }: AuthGreetingProps) {
  const { user } = useAuth();
  const t = useTranslations("auth");

  const userName =
    user?.displayName ||
    (user?.email ? user.email.split("@")[0] : t("defaultUser"));

  return (
    <div className={cn("space-y-2", className)} {...props}>
      <h1 className="text-2xl font-bold tracking-tight text-foreground">
        {user ? t("userGreeting", { name: userName }) : t("guestGreeting")}
      </h1>
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        {user ? t("userDescription") : t("guestDescription")}
      </p>
    </div>
  );
}
