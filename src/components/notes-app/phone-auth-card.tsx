"use client";

import { getTranslation } from "@firebase-oss/ui-core";
import { useOnUserAuthenticated, useUI } from "@firebase-oss/ui-react";
import type { User } from "firebase/auth";
import type { ComponentProps, PropsWithChildren } from "react";
import { MultiFactorAuthAssertionScreen } from "@/components/notes-app/multi-factor-auth-assertion-screen";
import { PhoneAuthForm } from "@/components/notes-app/phone-auth-form";
import { RedirectError } from "@/components/notes-app/redirect-error";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

export interface PhoneAuthScreenProps
  extends PropsWithChildren<Omit<ComponentProps<"div">, "children">> {
  onSignIn?: (user: User) => void;
}

export function PhoneAuthScreen({
  children,
  onSignIn,
  className,
  ...props
}: PhoneAuthScreenProps) {
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
          <PhoneAuthForm />
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
