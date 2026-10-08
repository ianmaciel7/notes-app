"use client";

import { AppleLogo, type AppleSignInButtonProps } from "@firebase-oss/ui-react";
import { OAuthProvider } from "firebase/auth";

import { OAuthButton } from "@/components/notes-app/oauth-button";
import { useTranslation } from "@/hooks/use-translation";

export type { AppleSignInButtonProps };

export function AppleSignInButton({
  provider,
  ...props
}: AppleSignInButtonProps) {
  const translate = useTranslation();

  return (
    <OAuthButton
      {...props}
      provider={provider || new OAuthProvider("apple.com")}
    >
      <AppleLogo />
      <span>{translate("labels", "signInWithApple")}</span>
    </OAuthButton>
  );
}
