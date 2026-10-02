"use client";

import { getTranslation } from "@firebase-oss/ui-core";
import { useOnUserAuthenticated, useUI } from "@firebase-oss/ui-react";
import type { User } from "firebase/auth";
import type { ComponentProps, PropsWithChildren } from "react";
import { Policies } from "@/components/notes-app/auth-policies-card";
import { MultiFactorAuthAssertionScreen } from "@/components/notes-app/mfa-assertion-card";
import { RedirectError } from "@/components/notes-app/redirect-error-alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FieldGroup } from "@/components/ui/field";
import { cn } from "@/lib/utils";

type OAuthCardProps = PropsWithChildren<
  Omit<ComponentProps<"div">, "children">
> & {
  onSignIn?: (user: User) => void;
};

function OAuthCard({
  children,
  onSignIn,
  className,
  ...props
}: OAuthCardProps) {
  const ui = useUI();

  const titleText = getTranslation(ui, "labels", "signIn");
  const subtitleText = getTranslation(ui, "prompts", "signInToAccount");

  useOnUserAuthenticated(onSignIn);

  if (ui.multiFactorResolver) {
    return <MultiFactorAuthAssertionScreen />;
  }

  return (
    <Card
      data-slot="oauth-card"
      className={cn("w-full max-w-sm mx-auto", className)}
      {...props}
    >
      <CardHeader>
        <CardTitle>
          <h1>{titleText}</h1>
        </CardTitle>
        <CardDescription>{subtitleText}</CardDescription>
      </CardHeader>
      <CardContent>
        <FieldGroup className="gap-2">{children}</FieldGroup>
        <FieldGroup className="mt-4">
          <RedirectError />
          <Policies />
        </FieldGroup>
      </CardContent>
    </Card>
  );
}

export { OAuthCard, type OAuthCardProps };
