"use client";

import { useTranslations } from "next-intl";
import type { ComponentProps } from "react";
import { useFormContext } from "react-hook-form";

type FieldName =
  | "email"
  | "password"
  | "displayName"
  | "phoneNumber"
  | "verificationCode"
  | "general";

type AuthFieldErrorProps = ComponentProps<"span"> & { field: FieldName };

export function AuthFieldError({ field }: AuthFieldErrorProps) {
  const translate = useTranslations("validation");
  return translate(field);
}

type AuthRootErrorProps = ComponentProps<"div">;

export function AuthRootError(_props: AuthRootErrorProps) {
  const translate = useTranslations("auth");
  const { formState } = useFormContext();
  const failure = formState.errors.root?.type;

  if (failure === "requiresRecentLogin") {
    return translate("requiresRecentLogin");
  }

  if (failure === "unverifiedEmail") {
    return translate("emailVerificationRequired");
  }

  return translate("authenticationFailed");
}
