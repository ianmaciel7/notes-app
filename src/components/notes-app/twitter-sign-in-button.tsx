"use client";

import { getTranslation } from "@firebase-oss/ui-core";
import {
  TwitterLogo,
  type TwitterSignInButtonProps,
  useUI,
} from "@firebase-oss/ui-react";
import { TwitterAuthProvider } from "firebase/auth";

import { OAuthButton } from "@/components/notes-app/oauth-button";

export type { TwitterSignInButtonProps };

export function TwitterSignInButton({
  provider,
  ...props
}: TwitterSignInButtonProps) {
  const ui = useUI();

  return (
    <OAuthButton {...props} provider={provider || new TwitterAuthProvider()}>
      <TwitterLogo />
      <span>{getTranslation(ui, "labels", "signInWithTwitter")}</span>
    </OAuthButton>
  );
}
