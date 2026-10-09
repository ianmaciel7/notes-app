"use client";

import {
  MicrosoftLogo,
  type MicrosoftSignInButtonProps,
} from "@firebase-oss/ui-react";
import { OAuthProvider } from "firebase/auth";

import { OAuthButton } from "@/app/(public)/_components/oauth-button";
import { useTranslation } from "@/hooks/use-translation";

export type { MicrosoftSignInButtonProps };

export function MicrosoftSignInButton({
  provider,
  ...props
}: MicrosoftSignInButtonProps) {
  const translate = useTranslation();

  return (
    <OAuthButton
      {...props}
      provider={provider || new OAuthProvider("microsoft.com")}
    >
      <MicrosoftLogo />
      <span>{translate("labels", "signInWithMicrosoft")}</span>
    </OAuthButton>
  );
}
