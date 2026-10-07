"use client";

import { getTranslation } from "@firebase-oss/ui-core";
import {
  type EmailLinkAuthScreenProps,
  useOnUserAuthenticated,
  useUI,
} from "@firebase-oss/ui-react";
import { EmailLinkAuthForm } from "@/components/notes-app/email-link-auth-form";
import { MultiFactorAuthAssertionScreen } from "@/components/notes-app/multi-factor-auth-assertion-screen";
import { RedirectError } from "@/components/notes-app/redirect-error";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export type { EmailLinkAuthScreenProps };

export function EmailLinkAuthScreen({
  children,
  onSignIn,
  ...props
}: EmailLinkAuthScreenProps) {
  const ui = useUI();

  const titleText = getTranslation(ui, "labels", "signIn");
  const subtitleText = getTranslation(ui, "prompts", "signInToAccount");

  useOnUserAuthenticated(onSignIn);

  if (ui.multiFactorResolver) {
    return <MultiFactorAuthAssertionScreen />;
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
