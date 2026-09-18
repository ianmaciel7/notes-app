"use client";

import { getTranslation } from "@firebase-oss/ui-core";
import {
  type SignInAuthScreenProps as FirebaseSignInAuthScreenProps,
  useOnUserAuthenticated,
  useUI,
} from "@firebase-oss/ui-react";
import type { User, UserCredential } from "firebase/auth";
import { AlertCircle } from "lucide-react";
import { useState } from "react";

import { GitHubSignInButton } from "@/components/github-sign-in-button";
import { GoogleSignInButton } from "@/components/google-sign-in-button";
import { MultiFactorAuthAssertionScreen } from "@/components/multi-factor-auth-assertion-screen";
import { SignInAuthForm } from "@/components/sign-in-auth-form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useI18n } from "@/hooks/use-i18n";
import { getAuthErrorMessage } from "@/lib/i18n/auth-errors";

export interface SignInAuthScreenProps
  extends Omit<FirebaseSignInAuthScreenProps, "onSignIn"> {
  onSignIn?: (credential?: UserCredential | User) => void | Promise<void>;
  oauthErrorMessage?: string | null;
  onOAuthError?: (error: unknown) => void;
}

export function SignInAuthScreen({
  children,
  onSignIn,
  oauthErrorMessage,
  onOAuthError,
  ...props
}: SignInAuthScreenProps) {
  const ui = useUI();
  const { t, locale } = useI18n();
  const [internalOAuthError, setInternalOAuthError] = useState<string | null>(
    null,
  );

  const titleText = getTranslation(ui, "labels", "signIn");
  const subtitleText = getTranslation(ui, "prompts", "signInToAccount");

  useOnUserAuthenticated((user) => onSignIn?.(user));

  if (ui.multiFactorResolver) {
    return <MultiFactorAuthAssertionScreen />;
  }

  const handleOAuthError = (error: unknown) => {
    onOAuthError?.(error);
    setInternalOAuthError(getAuthErrorMessage(error, locale));
  };

  const displayedOAuthError = oauthErrorMessage ?? internalOAuthError;

  const handleCredentialSignIn = onSignIn
    ? (credential: UserCredential) => onSignIn(credential.user)
    : undefined;

  return (
    <div className="max-w-sm mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>{titleText}</CardTitle>
          <CardDescription>{subtitleText}</CardDescription>
        </CardHeader>
        <CardContent>
          <SignInAuthForm onSignIn={handleCredentialSignIn} {...props} />
          <div className="relative my-4">
            <Separator />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-xs text-muted-foreground">
              {t("common.orContinueWith")}
            </span>
          </div>
          {displayedOAuthError ? (
            <div className="mb-4">
              <Alert variant="destructive" role="alert">
                <AlertCircle className="size-4" />
                <AlertDescription>{displayedOAuthError}</AlertDescription>
              </Alert>
            </div>
          ) : null}
          <div className="space-y-2">
            {children ?? (
              <>
                <GoogleSignInButton
                  onSignIn={handleCredentialSignIn}
                  onError={handleOAuthError}
                />
                <GitHubSignInButton
                  onSignIn={handleCredentialSignIn}
                  onError={handleOAuthError}
                />
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
