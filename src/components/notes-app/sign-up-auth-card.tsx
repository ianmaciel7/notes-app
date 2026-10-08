"use client";

// cspell:disable-next-line
import type { SignUpAuthScreenProps as SignUpAuthCardProps } from "@firebase-oss/ui-react";
import { useTranslations } from "next-intl";
import { MultiFactorAuthAssertionCard } from "@/components/notes-app/multi-factor-auth-assertion-card";
import { SignUpAuthForm } from "@/components/notes-app/sign-up-auth-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useSignUpAuthCard } from "@/hooks/use-sign-up-auth-card";

export type { SignUpAuthCardProps };

export function SignUpAuthCard({
  children,
  onSignUp,
  ...props
}: SignUpAuthCardProps) {
  const { ui, handleSignUp } = useSignUpAuthCard(onSignUp, !!children);

  const translate = useTranslations("auth");
  const titleText = translate("signUp");
  const subtitleText = translate("signUpSubtitle");

  if (ui.multiFactorResolver) {
    return <MultiFactorAuthAssertionCard />;
  }

  return (
    <div className="max-w-sm mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>{titleText}</CardTitle>
          <CardDescription>{subtitleText}</CardDescription>
        </CardHeader>
        <CardContent>
          <SignUpAuthForm
            {...props}
            onSignUp={(credential) => {
              handleSignUp(credential.user);
            }}
          />
          {children ? (
            <>
              <Separator className="my-4" />
              <div className="flex flex-col gap-2">{children}</div>
            </>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
