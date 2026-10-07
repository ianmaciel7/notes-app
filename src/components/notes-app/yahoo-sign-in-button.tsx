"use client";

import { getTranslation } from "@firebase-oss/ui-core";
import {
  useUI,
  YahooLogo,
  type YahooSignInButtonProps,
} from "@firebase-oss/ui-react";
import { OAuthProvider } from "firebase/auth";

import { OAuthButton } from "@/components/notes-app/oauth-button";

export type { YahooSignInButtonProps };

export function YahooSignInButton({
  provider,
  ...props
}: YahooSignInButtonProps) {
  const ui = useUI();

  return (
    <OAuthButton
      {...props}
      provider={provider || new OAuthProvider("yahoo.com")}
    >
      <YahooLogo />
      <span>{getTranslation(ui, "labels", "signInWithYahoo")}</span>
    </OAuthButton>
  );
}
