"use client";

import { getTranslation } from "@firebase-oss/ui-core";
import {
  GitHubLogo,
  type GitHubSignInButtonProps,
  useUI,
} from "@firebase-oss/ui-react";
import { GithubAuthProvider } from "firebase/auth";

import { OAuthButton } from "@/components/notes-app/oauth-button";

export type { GitHubSignInButtonProps };

export function GitHubSignInButton({
  provider,
  ...props
}: GitHubSignInButtonProps) {
  const ui = useUI();

  return (
    <OAuthButton {...props} provider={provider || new GithubAuthProvider()}>
      <GitHubLogo />
      <span>{getTranslation(ui, "labels", "signInWithGitHub")}</span>
    </OAuthButton>
  );
}
