"use client";

import { getTranslation } from "@firebase-oss/ui-core";
import {
  type EmailLinkAuthScreenProps as FirebaseEmailLinkAuthScreenProps,
  useOnUserAuthenticated,
  useUI,
} from "@firebase-oss/ui-react";
import type { UserCredential } from "firebase/auth";
import type { ComponentProps } from "react";
import { EmailLinkAuthForm } from "@/components/notes-app/email-link-form";
import { MfaAssertionCard } from "@/components/notes-app/mfa-assertion-card";
import { RedirectError } from "@/components/notes-app/redirect-error-alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FieldGroup } from "@/components/ui/field";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

type EmailLinkCardProps = FirebaseEmailLinkAuthScreenProps &
  Omit<ComponentProps<"div">, "children">;

function EmailLinkCard({
  children,
  onSignIn,
  onEmailSent,
  className,
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
    <Card
      ref={ref}
      className={cn("w-full max-w-sm mx-auto", className)}
      {...props}
    >
      <CardHeader>
        <CardTitle>{titleText}</CardTitle>
        <CardDescription>{subtitleText}</CardDescription>
      </CardHeader>
      <CardContent>
        <EmailLinkAuthForm
          onSignIn={(credential: UserCredential) => onSignIn?.(credential.user)}
          onEmailSent={onEmailSent}
        />
        {children ? (
          <>
            <Separator className="my-4" />
            <FieldGroup className="gap-2">
              {children}
              <RedirectError />
            </FieldGroup>
          </>
        ) : null}
      </CardContent>
    </Card>
  );
}

type EmailLinkAuthScreenProps = EmailLinkCardProps;

export {
  EmailLinkCard,
  EmailLinkCard as EmailLinkAuthScreen,
  type EmailLinkCardProps,
  type EmailLinkAuthScreenProps,
};
