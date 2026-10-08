"use client";

import type {
  // cspell:disable-next-line
  EmailLinkAuthScreenProps as EmailLinkAuthCardProps,
} from "@firebase-oss/ui-react";
import { EmailLinkAuthForm } from "@/components/notes-app/email-link-auth-form";
import { MultiFactorAuthAssertionCard } from "@/components/notes-app/multi-factor-auth-assertion-card";
import { RedirectError } from "@/components/notes-app/redirect-error";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useSignInCard } from "@/hooks/use-sign-in-card";

export type { EmailLinkAuthCardProps };

export function EmailLinkAuthCard({
  children,
  onSignIn,
  ...props
}: EmailLinkAuthCardProps) {
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
          <EmailLinkAuthForm {...props} />
          {children ? (
            <>
              <Separator className="my-4" />
              <div className="flex flex-col gap-2">
                {children}
                <RedirectError />
              </div>
            </>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
