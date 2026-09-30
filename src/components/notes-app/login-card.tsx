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
      <Card className="border border-border/80 shadow-xl shadow-black/5 dark:shadow-none bg-card">
        <CardHeader className="space-y-1.5 pb-4">
          <CardTitle className="text-xl font-semibold tracking-tight">
            <h1>{titleText}</h1>
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            {subtitleText}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <LoginForm
            onSignIn={(credential: UserCredential) =>
              onSignIn?.(credential.user)
            }
            onForgotPasswordClick={onForgotPasswordClick}
            onSignUpClick={onSignUpClick}
          />
          {children ? (
            <div className="space-y-4 pt-1">
              <div className="relative flex items-center justify-center">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">
                    {t("orContinueWith")}
                  </span>
                </div>
              </div>
              <div className="space-y-2.5">{children}</div>
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
