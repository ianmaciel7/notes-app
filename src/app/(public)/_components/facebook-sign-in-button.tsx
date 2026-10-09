"use client";

import {
  FacebookLogo,
  type FacebookSignInButtonProps,
} from "@firebase-oss/ui-react";
import { FacebookAuthProvider } from "firebase/auth";

import { OAuthButton } from "@/app/(public)/_components/oauth-button";
import { useTranslation } from "@/hooks/use-translation";

export type { FacebookSignInButtonProps };

export function FacebookSignInButton({
  provider,
  ...props
}: FacebookSignInButtonProps) {
  const translate = useTranslation();

  return (
    <OAuthButton {...props} provider={provider || new FacebookAuthProvider()}>
      <FacebookLogo />
      <span>{translate("labels", "signInWithFacebook")}</span>
    </OAuthButton>
  );
}
