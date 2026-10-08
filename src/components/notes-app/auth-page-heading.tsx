"use client";

import { useTranslations } from "next-intl";

type AuthHeadingKey =
  | "signIn"
  | "signUp"
  | "resetPassword"
  | "signInWithEmailLink"
  | "signInWithPhone";

export function AuthPageHeading({ message }: { message: AuthHeadingKey }) {
  const translate = useTranslations("auth");
  return <h1 className="sr-only">{translate(message)}</h1>;
}
