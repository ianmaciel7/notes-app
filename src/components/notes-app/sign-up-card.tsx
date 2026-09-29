"use client";

import { getTranslation } from "@firebase-oss/ui-core";
import {
  type SignUpAuthScreenProps as FirebaseSignUpAuthScreenProps,
  useOnUserAuthenticated,
  useUI,
} from "@firebase-oss/ui-react";
import type { User, UserCredential } from "firebase/auth";
import { useTranslations } from "next-intl";
import { type ComponentProps, useCallback, useRef } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { SignUpForm } from "./sign-up-form";

export interface SignUpAuthScreenProps
  extends FirebaseSignUpAuthScreenProps,
    Omit<ComponentProps<"div">, "children"> {}

export function SignUpCard({
  children,
  onSignUp,
  onSignInClick,
  className,
  ref,
  ...props
}: SignUpAuthScreenProps) {
  const ui = useUI();
  const t = useTranslations("auth");
  const handledUserIdRef = useRef<string | null>(null);

  const titleText = getTranslation(ui, "labels", "signUp");
  const subtitleText = getTranslation(ui, "prompts", "enterDetailsToCreate");

  const handleSignUp = useCallback(
    (user: User) => {
      if (handledUserIdRef.current === user.uid) {
        return;
      }

      handledUserIdRef.current = user.uid;
      onSignUp?.(user);
    },
    [onSignUp],
  );

  useOnUserAuthenticated(children ? handleSignUp : undefined);

  return (
    <div
      ref={ref}
      className={cn("w-full max-w-sm mx-auto", className)}
      {...props}
    >
      <Card className="border border-border/80 shadow-xl shadow-black/5 dark:shadow-none bg-card">
        <CardHeader className="space-y-1.5 pb-4">
          <CardTitle className="text-xl font-semibold tracking-tight">
            {titleText}
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            {subtitleText}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <SignUpForm
            onSignInClick={onSignInClick}
            onSignUp={(credential: UserCredential) => {
              handleSignUp(credential.user);
            }}
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
  SignUpCard as SignUpAuthScreen,
  type SignUpAuthScreenProps as SignUpCardProps,
};
