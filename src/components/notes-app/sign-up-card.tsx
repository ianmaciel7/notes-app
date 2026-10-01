"use client";

import { getTranslation } from "@firebase-oss/ui-core";
import {
  type SignUpAuthScreenProps as FirebaseSignUpAuthScreenProps,
  useOnUserAuthenticated,
  useUI,
} from "@firebase-oss/ui-react";
import type { User, UserCredential } from "firebase/auth";
import { useTranslations } from "next-intl";
import { type ComponentProps, useRef } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FieldGroup, FieldSeparator } from "@/components/ui/field";
import { cn } from "@/lib/utils";
import { SignUpForm } from "./sign-up-form";

export interface SignUpCardProps
  extends FirebaseSignUpAuthScreenProps,
    Omit<ComponentProps<"div">, "children"> {}

export function SignUpCard({
  children,
  onSignUp,
  onSignInClick,
  className,
  ref,
  ...props
}: SignUpCardProps) {
  const ui = useUI();
  const t = useTranslations("auth");
  const handledUserIdRef = useRef<string | null>(null);

  const titleText = getTranslation(ui, "labels", "signUp");
  const subtitleText = getTranslation(ui, "prompts", "enterDetailsToCreate");

  const handleSignUp = (user: User) => {
    if (handledUserIdRef.current === user.uid) {
      return;
    }

    handledUserIdRef.current = user.uid;
    onSignUp?.(user);
  };

  useOnUserAuthenticated(children ? handleSignUp : undefined);

  return (
    <Card
      ref={ref}
      className={cn("w-full max-w-sm mx-auto", className)}
      {...props}
    >
      <CardHeader>
        <CardTitle>
          <h1>{titleText}</h1>
        </CardTitle>
        <CardDescription>{subtitleText}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <SignUpForm
          onSignInClick={onSignInClick}
          onSignUp={(credential: UserCredential) => {
            handleSignUp(credential.user);
          }}
        />
        {children ? (
          <FieldGroup className="pt-1">
            <FieldSeparator className="uppercase [&>span]:bg-card">
              {t("orContinueWith")}
            </FieldSeparator>
            <FieldGroup className="gap-2.5">{children}</FieldGroup>
          </FieldGroup>
        ) : null}
      </CardContent>
    </Card>
  );
}

export {
  SignUpCard as SignUpAuthScreen,
  type SignUpCardProps as SignUpAuthScreenProps,
};
