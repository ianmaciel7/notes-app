"use client";

import { useTranslations } from "next-intl";
import { useFormContext } from "react-hook-form";

type FieldName =
  | "email"
  | "password"
  | "displayName"
  | "phoneNumber"
  | "verificationCode"
  | "general";

export function AuthFieldError({ field }: { field: FieldName }) {
  const translate = useTranslations("validation");
  return translate(field);
}

export function AuthRootError() {
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
