"use client";

import { getTranslation } from "@firebase-oss/ui-core";
import { useOnUserAuthenticated, useUI } from "@firebase-oss/ui-react";
import type { User } from "firebase/auth";
import type { ComponentProps, PropsWithChildren } from "react";
import { MultiFactorAuthAssertionScreen } from "@/components/notes-app/multi-factor-auth-assertion-screen";
import { Policies } from "@/components/notes-app/policies";
import { RedirectError } from "@/components/notes-app/redirect-error";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface OAuthScreenProps
  extends PropsWithChildren<Omit<ComponentProps<"div">, "children">> {
  onSignIn?: (user: User) => void;
}

export function OAuthScreen({
  children,
  onSignIn,
  className,
  ...props
}: OAuthScreenProps) {
  const ui = useUI();

  const titleText = getTranslation(ui, "labels", "signIn");
  const subtitleText = getTranslation(ui, "prompts", "signInToAccount");

  useOnUserAuthenticated(onSignIn);

  if (ui.multiFactorResolver) {
    return <MultiFactorAuthAssertionScreen />;
  }

  return (
    <div className={cn("max-w-sm mx-auto", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>{titleText}</CardTitle>
          <CardDescription>{subtitleText}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">{children}</div>
          <div className="mt-4 space-y-4">
            <RedirectError />
            <Policies />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
