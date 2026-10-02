"use client";

import { getTranslation } from "@firebase-oss/ui-core";
import {
  type SignInAuthScreenProps as FirebaseSignInAuthScreenProps,
  useOnUserAuthenticated,
  useUI,
} from "@firebase-oss/ui-react";
import type { UserCredential } from "firebase/auth";
import type { ComponentProps } from "react";
import {
  AuthCard,
  AuthCardProviderGroup,
} from "@/components/notes-app/auth-card";
import { LoginForm } from "@/components/notes-app/login-form";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type LoginCardProps = FirebaseSignInAuthScreenProps &
  Omit<ComponentProps<"div">, "children">;

function LoginCard({
  children,
  onSignIn,
  onForgotPasswordClick,
  onSignUpClick,
  ...props
}: LoginCardProps) {
  const ui = useUI();

  const titleText = getTranslation(ui, "labels", "signIn");
  const subtitleText = getTranslation(ui, "prompts", "signInToAccount");

  useOnUserAuthenticated(onSignIn);

  return (
    <AuthCard data-slot="login-card" {...props}>
      <CardHeader>
        <CardTitle>
          <h1>{titleText}</h1>
        </CardTitle>
        <CardDescription>{subtitleText}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <LoginForm
          onSignIn={(credential: UserCredential) => onSignIn?.(credential.user)}
          onForgotPasswordClick={onForgotPasswordClick}
          onSignUpClick={onSignUpClick}
        />
        {children ? (
          <AuthCardProviderGroup>{children}</AuthCardProviderGroup>
        ) : null}
      </CardContent>
    </AuthCard>
  );
}

export {
  LoginCard,
  LoginCard as SignInAuthScreen,
  type LoginCardProps,
  type LoginCardProps as SignInAuthScreenProps,
};
