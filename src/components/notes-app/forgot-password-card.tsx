"use client";

import { getTranslation } from "@firebase-oss/ui-core";
import {
  type ForgotPasswordAuthScreenProps as FirebaseForgotPasswordAuthScreenProps,
  useUI,
} from "@firebase-oss/ui-react";
import type { ComponentProps } from "react";
import { ForgotPasswordForm } from "@/components/notes-app/forgot-password-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

type ForgotPasswordCardProps = FirebaseForgotPasswordAuthScreenProps &
  Omit<ComponentProps<"div">, "children">;

function ForgotPasswordCard({
  onPasswordSent,
  onBackToSignInClick,
  className,
  ref,
  ...props
}: ForgotPasswordCardProps) {
  const ui = useUI();

  const titleText = getTranslation(ui, "labels", "resetPassword");
  const subtitleText = getTranslation(ui, "prompts", "enterEmailToReset");

  return (
    <Card
      ref={ref}
      data-slot="forgot-password-card"
      className={cn("w-full max-w-sm mx-auto", className)}
      {...props}
    >
      <CardHeader>
        <CardTitle>{titleText}</CardTitle>
        <CardDescription>{subtitleText}</CardDescription>
      </CardHeader>
      <CardContent>
        <ForgotPasswordForm
          onPasswordSent={onPasswordSent}
          onBackToSignInClick={onBackToSignInClick}
        />
      </CardContent>
    </Card>
  );
}

type ForgotPasswordAuthScreenProps = ForgotPasswordCardProps;

export {
  ForgotPasswordCard,
  ForgotPasswordCard as ForgotPasswordAuthScreen,
  type ForgotPasswordCardProps,
  type ForgotPasswordAuthScreenProps,
};
