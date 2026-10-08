"use client";

import { YahooLogo, type YahooSignInButtonProps } from "@firebase-oss/ui-react";
import { OAuthProvider } from "firebase/auth";

import { OAuthButton } from "@/components/notes-app/oauth-button";
import { useTranslation } from "@/hooks/use-translation";

export type { YahooSignInButtonProps };

export function YahooSignInButton({
  provider,
  ...props
}: YahooSignInButtonProps) {
  const translate = useTranslation();

  return (
    <OAuthButton
      {...props}
      provider={provider || new OAuthProvider("yahoo.com")}
    >
      <YahooLogo />
      <span>{translate("labels", "signInWithYahoo")}</span>
    </OAuthButton>
  );
}
