"use client";

import type {
  // cspell:disable-next-line
  SignInAuthScreenProps as SignInAuthCardProps,
} from "@firebase-oss/ui-react";
import { MultiFactorAuthAssertionCard } from "@/components/notes-app/multi-factor-auth-assertion-card";
import { RedirectError } from "@/components/notes-app/redirect-error";
import { SignInAuthForm } from "@/components/notes-app/sign-in-auth-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useSignInCard } from "@/hooks/use-sign-in-card";

export type { SignInAuthCardProps };

export function SignInAuthCard({
  children,
  onSignIn,
  ...props
}: SignInAuthCardProps) {
  const { titleText, subtitleText, hasMultiFactorResolver } =
    useSignInCard(onSignIn);

  if (hasMultiFactorResolver) {
    return <MultiFactorAuthAssertionCard />;
  }

  return (
    <div className="max-w-sm mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>{titleText}</CardTitle>
          <CardDescription>{subtitleText}</CardDescription>
        </CardHeader>
        <CardContent>
          <SignInAuthForm {...props} />
          {children ? (
            <>
              <Separator className="my-4" />
              <div className="space-y-2">{children}</div>
              <div className="mt-4">
                <RedirectError />
              </div>
            </>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
