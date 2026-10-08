"use client";

import { useTranslations } from "next-intl";
import type { ComponentProps } from "react";

type AuthHeadingKey =
  | "signIn"
  | "signUp"
  | "resetPassword"
  | "signInWithEmailLink"
  | "signInWithPhone";

type AuthPageHeadingProps = ComponentProps<"h1"> & {
  message: AuthHeadingKey;
};

export function AuthPageHeading({ message, ...props }: AuthPageHeadingProps) {
  const translate = useTranslations("auth");
  return (
    <h1 {...props} className="sr-only">
      {translate(message)}
    </h1>
  );
}
