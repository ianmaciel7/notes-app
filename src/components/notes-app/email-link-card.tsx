"use client";

import { getTranslation } from "@firebase-oss/ui-core";
import {
  type EmailLinkAuthScreenProps as FirebaseEmailLinkAuthScreenProps,
  useOnUserAuthenticated,
  useUI,
} from "@firebase-oss/ui-react";
import type { UserCredential } from "firebase/auth";
import type { ComponentProps } from "react";
import { AuthCard, AuthCardProviders } from "@/components/notes-app/auth-card";
import { EmailLinkAuthForm } from "@/components/notes-app/email-link-form";
import { MfaAssertionCard } from "@/components/notes-app/mfa-assertion-card";
import { RedirectError } from "@/components/notes-app/redirect-error-alert";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type EmailLinkCardProps = FirebaseEmailLinkAuthScreenProps &
  Omit<ComponentProps<"div">, "children">;

function EmailLinkCard({
  children,
  onSignIn,
  onEmailSent,
  ref,
  ...props
}: EmailLinkCardProps) {
  const ui = useUI();

  const titleText = getTranslation(ui, "labels", "signIn");
  const subtitleText = getTranslation(ui, "prompts", "signInToAccount");

  useOnUserAuthenticated(onSignIn);

  if (ui.multiFactorResolver) {
    return <MfaAssertionCard />;
  }

  return (
    <AuthCard data-slot="email-link-card" ref={ref} {...props}>
      <CardHeader>
        <CardTitle>
          <h1>{titleText}</h1>
        </CardTitle>
        <CardDescription>{subtitleText}</CardDescription>
      </CardHeader>
      <CardContent>
        <EmailLinkAuthForm
          onSignIn={(credential: UserCredential) => onSignIn?.(credential.user)}
          onEmailSent={onEmailSent}
        />
        {children ? (
          <AuthCardProviders>
            {children}
            <RedirectError />
          </AuthCardProviders>
        ) : null}
      </CardContent>
    </AuthCard>
  );
}

type EmailLinkAuthScreenProps = EmailLinkCardProps;

export {
  EmailLinkCard,
  EmailLinkCard as EmailLinkAuthScreen,
  type EmailLinkCardProps,
  type EmailLinkAuthScreenProps,
};
