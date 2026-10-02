"use client";

import { getTranslation } from "@firebase-oss/ui-core";
import { useOnUserAuthenticated, useUI } from "@firebase-oss/ui-react";
import type { User } from "firebase/auth";
import type { ComponentProps, PropsWithChildren } from "react";
import { AuthCard, AuthCardProviderGroup } from "@/components/notes-app/auth-card";
import { Policies } from "@/components/notes-app/auth-policies-description";
import { MultiFactorAuthAssertionScreen } from "@/components/notes-app/mfa-assertion-card";
import { RedirectError } from "@/components/notes-app/redirect-error-alert";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FieldGroup } from "@/components/ui/field";

type OAuthCardProps = PropsWithChildren<
  Omit<ComponentProps<"div">, "children">
> & {
  onSignIn?: (user: User) => void;
};

function OAuthCard({ children, onSignIn, ...props }: OAuthCardProps) {
  const ui = useUI();

  const titleText = getTranslation(ui, "labels", "signIn");
  const subtitleText = getTranslation(ui, "prompts", "signInToAccount");

  useOnUserAuthenticated(onSignIn);

  if (ui.multiFactorResolver) {
    return <MultiFactorAuthAssertionScreen />;
  }

  return (
    <AuthCard data-slot="oauth-card" {...props}>
      <CardHeader>
        <CardTitle>
          <h1>{titleText}</h1>
        </CardTitle>
        <CardDescription>{subtitleText}</CardDescription>
      </CardHeader>
      <CardContent>
        <AuthCardProviderGroup>{children}</AuthCardProviderGroup>
        <FieldGroup className="mt-4">
          <RedirectError />
          <Policies />
        </FieldGroup>
      </CardContent>
    </AuthCard>
  );
}

export { OAuthCard, type OAuthCardProps };
