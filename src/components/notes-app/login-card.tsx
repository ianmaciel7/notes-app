"use client";

import { getTranslation } from "@firebase-oss/ui-core";
import {
  type SignInAuthScreenProps as FirebaseSignInAuthScreenProps,
  useOnUserAuthenticated,
  useUI,
} from "@firebase-oss/ui-react";
import type { UserCredential } from "firebase/auth";
import { useTranslations } from "next-intl";
import type { ComponentProps } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FieldSeparator } from "@/components/ui/field";
import { cn } from "@/lib/utils";
import { LoginForm } from "./login-form";

export interface LoginCardProps
  extends FirebaseSignInAuthScreenProps,
    Omit<ComponentProps<"div">, "children"> {}

export function LoginCard({
  children,
  onSignIn,
  onForgotPasswordClick,
  onSignUpClick,
  className,
  ref,
  ...props
}: LoginCardProps) {
  const ui = useUI();
  const t = useTranslations("auth");

  const titleText = getTranslation(ui, "labels", "signIn");
  const subtitleText = getTranslation(ui, "prompts", "signInToAccount");

  useOnUserAuthenticated(onSignIn);

  return (
    <div
      ref={ref}
      className={cn("w-full max-w-sm mx-auto", className)}
      {...props}
    >
      <Card>
        <CardHeader>
          <CardTitle>
            <h1>{titleText}</h1>
          </CardTitle>
          <CardDescription>{subtitleText}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <LoginForm
            onSignIn={(credential: UserCredential) =>
              onSignIn?.(credential.user)
            }
            onForgotPasswordClick={onForgotPasswordClick}
            onSignUpClick={onSignUpClick}
          />
          {children ? (
            <div className="flex flex-col gap-4 pt-1">
              <FieldSeparator className="uppercase [&>span]:bg-card">
                {t("orContinueWith")}
              </FieldSeparator>
              <div className="flex flex-col gap-2.5">{children}</div>
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}

export {
  LoginCard as SignInAuthScreen,
  type LoginCardProps as SignInAuthScreenProps,
};
