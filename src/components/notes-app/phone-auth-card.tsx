"use client";

import { getTranslation } from "@firebase-oss/ui-core";
import { useOnUserAuthenticated, useUI } from "@firebase-oss/ui-react";
import type { User } from "firebase/auth";
import type { ComponentProps, PropsWithChildren } from "react";
import { MfaAssertionCard } from "@/components/notes-app/mfa-assertion-card";
import { PhoneAuthForm } from "@/components/notes-app/phone-auth-form";
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

export interface PhoneAuthCardProps
  extends PropsWithChildren<Omit<ComponentProps<"div">, "children">> {
  onSignIn?: (user: User) => void;
}

export function PhoneAuthCard({
  children,
  onSignIn,
  className,
  ...props
}: PhoneAuthCardProps) {
  const ui = useUI();

  const titleText = getTranslation(ui, "labels", "signIn");
  const subtitleText = getTranslation(ui, "prompts", "signInToAccount");

  useOnUserAuthenticated(onSignIn);

  if (ui.multiFactorResolver) {
    return <MfaAssertionCard />;
  }

  return (
    <Card className={cn("w-full max-w-sm mx-auto", className)} {...props}>
      <CardHeader>
        <CardTitle>{titleText}</CardTitle>
        <CardDescription>{subtitleText}</CardDescription>
      </CardHeader>
      <CardContent>
        <PhoneAuthForm />
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

export { PhoneAuthCard as PhoneAuthScreen };

export type PhoneAuthScreenProps = PhoneAuthCardProps;
