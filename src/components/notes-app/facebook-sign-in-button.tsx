"use client";

import { FacebookAuthProvider } from "firebase/auth";
import { getTranslation } from "@firebase-oss/ui-core";
import { useUI, type FacebookSignInButtonProps, FacebookLogo } from "@firebase-oss/ui-react";

import { OAuthButton } from "@/components/notes-app/oauth-button";

export type { FacebookSignInButtonProps };

export function FacebookSignInButton({ provider, ...props }: FacebookSignInButtonProps) {
  const ui = useUI();

  return (
    <OAuthButton {...props} provider={provider || new FacebookAuthProvider()}>
      <FacebookLogo />
      <span>{getTranslation(ui, "labels", "signInWithFacebook")}</span>
    </OAuthButton>
  );
}
