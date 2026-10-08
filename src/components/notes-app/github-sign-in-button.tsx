"use client";

import {
  GitHubLogo,
  type GitHubSignInButtonProps,
} from "@firebase-oss/ui-react";
import { GithubAuthProvider } from "firebase/auth";

import { OAuthButton } from "@/components/notes-app/oauth-button";
import { useTranslation } from "@/hooks/use-translation";

export type { GitHubSignInButtonProps };

export function GitHubSignInButton({
  provider,
  ...props
}: GitHubSignInButtonProps) {
  const translate = useTranslation();

  return (
    <OAuthButton {...props} provider={provider || new GithubAuthProvider()}>
      <GitHubLogo />
      <span>{translate("labels", "signInWithGitHub")}</span>
    </OAuthButton>
  );
}
