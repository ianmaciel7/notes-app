"use client";

import { useTranslations } from "next-intl";
import type { ComponentProps } from "react";
import { Card } from "@/components/ui/card";
import { FieldGroup, FieldSeparator } from "@/components/ui/field";
import { cn } from "@/lib/utils";

type AuthCardProps = ComponentProps<typeof Card>;

function AuthCard({ className, ...props }: AuthCardProps) {
  return (
    <Card
      data-slot="auth-card"
      {...props}
      className={cn("mx-auto w-full max-w-sm", className)}
    />
  );
}

type AuthCardProviderGroupProps = ComponentProps<typeof FieldGroup>;

function AuthCardProviderGroup({
  className,
  children,
  ...props
}: AuthCardProviderGroupProps) {
  const t = useTranslations("auth");

  return (
    <FieldGroup
      data-slot="auth-card-provider-group"
      {...props}
      className={cn("pt-1", className)}
    >
      <FieldSeparator className="uppercase [&>span]:bg-card">
        {t("orContinueWith")}
      </FieldSeparator>
      <FieldGroup className="gap-2.5">{children}</FieldGroup>
    </FieldGroup>
  );
}

export {
  AuthCard,
  AuthCardProviderGroup,
  type AuthCardProps,
  type AuthCardProviderGroupProps,
};
