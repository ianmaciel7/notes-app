"use client";

import {
  TwitterLogo,
  type TwitterSignInButtonProps,
} from "@firebase-oss/ui-react";
import { TwitterAuthProvider } from "firebase/auth";

import { OAuthButton } from "@/app/(public)/_components/oauth-button";
import { useTranslation } from "@/hooks/use-translation";

export type { TwitterSignInButtonProps };

export function TwitterSignInButton({
  provider,
  ...props
}: TwitterSignInButtonProps) {
  const translate = useTranslation();

  return (
    <OAuthButton {...props} provider={provider || new TwitterAuthProvider()}>
      <TwitterLogo />
      <span>{translate("labels", "signInWithTwitter")}</span>
    </OAuthButton>
  );
}
