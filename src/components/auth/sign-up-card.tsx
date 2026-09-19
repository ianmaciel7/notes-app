"use client";

import { getTranslation } from "@firebase-oss/ui-core";
import {
  type SignUpAuthScreenProps as FirebaseSignUpAuthScreenProps,
  useOnUserAuthenticated,
  useUI,
} from "@firebase-oss/ui-react";
import type { User, UserCredential } from "firebase/auth";
import { AlertCircleIcon } from "lucide-react";
import { useState } from "react";

import { GitHubSignInButton } from "@/components/auth/github-sign-in-button";
import { GoogleSignInButton } from "@/components/auth/google-sign-in-button";
import { MultiFactorAssertionCard } from "@/components/auth/multi-factor-assertion-card";
import { SignUpForm } from "@/components/auth/sign-up-form";
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

export interface SignUpCardProps
  extends Omit<FirebaseSignUpAuthScreenProps, "onSignUp"> {
  onSignUp?: (credential?: UserCredential | User) => void | Promise<void>;
  oauthErrorMessage?: string | null;
  onOAuthError?: (error: unknown) => void;
}

export function SignUpCard({
  children,
  onSignUp,
  oauthErrorMessage,
  onOAuthError,
  ...props
}: SignUpCardProps) {
  const ui = useUI();
  const { t, locale } = useI18n();
  const [internalOAuthError, setInternalOAuthError] = useState<string | null>(
    null,
  );

  const titleText = getTranslation(ui, "labels", "signUp");
  const subtitleText = getTranslation(ui, "prompts", "enterDetailsToCreate");

  useOnUserAuthenticated((user) => onSignUp?.(user));

  if (ui.multiFactorResolver) {
    return <MultiFactorAssertionCard />;
  }

  const handleOAuthError = (error: unknown) => {
    onOAuthError?.(error);
    setInternalOAuthError(getAuthErrorMessage(error, locale));
  };

  const displayedOAuthError = oauthErrorMessage ?? internalOAuthError;

  const handleCredentialSignUp = onSignUp
    ? (credential: UserCredential) => onSignUp(credential.user)
    : undefined;

  return (
    <div className="max-w-sm mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>{titleText}</CardTitle>
          <CardDescription>{subtitleText}</CardDescription>
        </CardHeader>
        <CardContent>
          <SignUpForm onSignUp={handleCredentialSignUp} {...props} />
          <div className="relative my-4">
            <Separator />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-xs text-muted-foreground">
              {t("common.orContinueWith")}
            </span>
          </div>
          {displayedOAuthError ? (
            <div className="mb-4">
              <Alert variant="destructive" role="alert">
                <AlertCircleIcon className="size-4" />
                <AlertDescription>{displayedOAuthError}</AlertDescription>
              </Alert>
            </div>
          ) : null}
          <div className="space-y-2">
            {children ?? (
              <>
                <GoogleSignInButton
                  onSignIn={handleCredentialSignUp}
                  onError={handleOAuthError}
                />
                <GitHubSignInButton
                  onSignIn={handleCredentialSignUp}
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
