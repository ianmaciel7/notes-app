"use client";

import { getTranslation } from "@firebase-oss/ui-core";
import { useOnUserAuthenticated, useUI } from "@firebase-oss/ui-react";
import type { User } from "firebase/auth";
import type { ComponentProps, PropsWithChildren } from "react";
import {
  AuthCard,
  AuthCardProviderGroup,
} from "@/components/notes-app/auth-card";
import { MfaAssertionCard } from "@/components/notes-app/mfa-assertion-card";
import { PhoneAuthForm } from "@/components/notes-app/phone-auth-form";
import { RedirectError } from "@/components/notes-app/redirect-error-alert";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type PhoneAuthCardProps = PropsWithChildren<
  Omit<ComponentProps<"div">, "children">
> & {
  onSignIn?: (user: User) => void;
};

function PhoneAuthCard({ children, onSignIn, ...props }: PhoneAuthCardProps) {
  const ui = useUI();

  const titleText = getTranslation(ui, "labels", "signIn");
  const subtitleText = getTranslation(ui, "prompts", "signInToAccount");

  useOnUserAuthenticated(onSignIn);

  if (ui.multiFactorResolver) {
    return <MfaAssertionCard />;
  }

  return (
    <AuthCard data-slot="phone-auth-card" {...props}>
      <CardHeader>
        <CardTitle>
          <h1>{titleText}</h1>
        </CardTitle>
        <CardDescription>{subtitleText}</CardDescription>
      </CardHeader>
      <CardContent>
        <PhoneAuthForm />
        {children ? (
          <AuthCardProviderGroup>
            {children}
            <RedirectError />
          </AuthCardProviderGroup>
        ) : null}
      </CardContent>
    </AuthCard>
  );
}

type PhoneAuthScreenProps = PhoneAuthCardProps;

export {
  PhoneAuthCard,
  PhoneAuthCard as PhoneAuthScreen,
  type PhoneAuthCardProps,
  type PhoneAuthScreenProps,
};
