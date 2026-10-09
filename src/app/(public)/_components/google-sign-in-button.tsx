"use client";

import {
  GoogleLogo,
  type GoogleSignInButtonProps,
} from "@firebase-oss/ui-react";
import { GoogleAuthProvider } from "firebase/auth";

import { OAuthButton } from "@/app/(public)/_components/oauth-button";
import { useTranslation } from "@/hooks/use-translation";

export type { GoogleSignInButtonProps };

export function GoogleSignInButton({
  provider,
  ...props
}: GoogleSignInButtonProps) {
  const translate = useTranslation();

  return (
    <OAuthButton {...props} provider={provider || new GoogleAuthProvider()}>
      <GoogleLogo />
      <span>{translate("labels", "signInWithGoogle")}</span>
    </OAuthButton>
  );
}
