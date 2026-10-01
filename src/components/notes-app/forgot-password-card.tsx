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

export interface ForgotPasswordCardProps
  extends FirebaseForgotPasswordAuthScreenProps,
    Omit<ComponentProps<"div">, "children"> {}

export function ForgotPasswordCard({
  onPasswordSent,
  onBackToSignInClick,
  className,
  ref,
}: ForgotPasswordCardProps) {
  const ui = useUI();

  const titleText = getTranslation(ui, "labels", "resetPassword");
  const subtitleText = getTranslation(ui, "prompts", "enterEmailToReset");

  return (
    <div ref={ref} className={cn("max-w-sm mx-auto", className)}>
      <Card>
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
    </div>
  );
}

export { ForgotPasswordCard as ForgotPasswordAuthScreen };

export type ForgotPasswordAuthScreenProps = ForgotPasswordCardProps;
