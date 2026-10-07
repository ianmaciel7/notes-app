"use client";

import { getTranslation } from "@firebase-oss/ui-core";
import {
  AppleLogo,
  type AppleSignInButtonProps,
  useUI,
} from "@firebase-oss/ui-react";
import { OAuthProvider } from "firebase/auth";

import { OAuthButton } from "@/components/notes-app/oauth-button";

export type { AppleSignInButtonProps };

export function AppleSignInButton({
  provider,
  ...props
}: AppleSignInButtonProps) {
  const ui = useUI();

  return (
    <OAuthButton
      {...props}
      provider={provider || new OAuthProvider("apple.com")}
    >
      <AppleLogo />
      <span>{getTranslation(ui, "labels", "signInWithApple")}</span>
    </OAuthButton>
  );
}
