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
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

export interface EmailLinkAuthScreenProps
  extends FirebaseEmailLinkAuthScreenProps,
    Omit<ComponentProps<"div">, "children"> {}

export function EmailLinkCard({
  children,
  onSignIn,
  onEmailSent,
  className,
  ref,
  ...props
}: EmailLinkAuthScreenProps) {
  const ui = useUI();

  const titleText = getTranslation(ui, "labels", "signIn");
  const subtitleText = getTranslation(ui, "prompts", "signInToAccount");

  useOnUserAuthenticated(onSignIn);

  if (ui.multiFactorResolver) {
    return <MfaAssertionCard />;
  }

  return (
    <div ref={ref} className={cn("max-w-sm mx-auto", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>{titleText}</CardTitle>
          <CardDescription>{subtitleText}</CardDescription>
        </CardHeader>
        <CardContent>
          <EmailLinkAuthForm
            onSignIn={(credential: UserCredential) =>
              onSignIn?.(credential.user)
            }
            onEmailSent={onEmailSent}
          />
          {children ? (
            <>
              <Separator className="my-4" />
              <div className="space-y-2">
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

export {
  EmailLinkCard as EmailLinkAuthScreen,
  type EmailLinkAuthScreenProps as EmailLinkCardProps,
};
