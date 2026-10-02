"use client";

import { getTranslation } from "@firebase-oss/ui-core";
import {
  type SignUpAuthScreenProps as FirebaseSignUpAuthScreenProps,
  useOnUserAuthenticated,
  useUI,
} from "@firebase-oss/ui-react";
import type { User, UserCredential } from "firebase/auth";
import { type ComponentProps, useRef } from "react";
import { AuthCard, AuthCardProviders } from "@/components/notes-app/auth-card";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SignUpForm } from "./sign-up-form";

type SignUpCardProps = FirebaseSignUpAuthScreenProps &
  Omit<ComponentProps<"div">, "children">;

function SignUpCard({
  children,
  onSignUp,
  onSignInClick,
  ref,
  ...props
}: SignUpCardProps) {
  const ui = useUI();
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
    <AuthCard ref={ref} {...props}>
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
        {children ? <AuthCardProviders>{children}</AuthCardProviders> : null}
      </CardContent>
    </AuthCard>
  );
}

export {
  SignUpCard,
  SignUpCard as SignUpAuthScreen,
  type SignUpCardProps,
  type SignUpCardProps as SignUpAuthScreenProps,
};
