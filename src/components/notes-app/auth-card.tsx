"use client";

import { useTranslations } from "next-intl";
import type { ComponentProps } from "react";
import { Card } from "@/components/ui/card";
import { FieldGroup, FieldSeparator } from "@/components/ui/field";
import { cn } from "@/lib/utils";

type AuthCardProps = ComponentProps<typeof Card>;

function AuthCard({ className, ...props }: AuthCardProps) {
  return (
    <Card {...props} className={cn("mx-auto w-full max-w-sm", className)} />
  );
}

type AuthCardProvidersProps = ComponentProps<typeof FieldGroup>;

function AuthCardProviders({
  className,
  children,
  ...props
}: AuthCardProvidersProps) {
  const t = useTranslations("auth");

  return (
    <FieldGroup {...props} className={cn("pt-1", className)}>
      <FieldSeparator className="uppercase [&>span]:bg-card">
        {t("orContinueWith")}
      </FieldSeparator>
      <FieldGroup className="gap-2.5">{children}</FieldGroup>
    </FieldGroup>
  );
}

export {
  AuthCard,
  AuthCardProviders,
  type AuthCardProps,
  type AuthCardProvidersProps,
};
