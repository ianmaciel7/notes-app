"use client";

import { useTranslations } from "next-intl";

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
  return translate("authenticationFailed");
}
