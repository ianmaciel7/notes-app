"use client";

import { getTranslation } from "@firebase-oss/ui-core";
import {
  MicrosoftLogo,
  type MicrosoftSignInButtonProps,
  useUI,
} from "@firebase-oss/ui-react";
import { OAuthProvider } from "firebase/auth";

import { OAuthButton } from "@/components/notes-app/oauth-button";

export type { MicrosoftSignInButtonProps };

export function MicrosoftSignInButton({
  provider,
  ...props
}: MicrosoftSignInButtonProps) {
  const ui = useUI();

  return (
    <OAuthButton
      {...props}
      provider={provider || new OAuthProvider("microsoft.com")}
    >
      <MicrosoftLogo />
      <span>{getTranslation(ui, "labels", "signInWithMicrosoft")}</span>
    </OAuthButton>
  );
}
