"use client";

import { getTranslation } from "@firebase-oss/ui-core";
import {
  type ForgotPasswordAuthScreenProps as FirebaseForgotPasswordAuthScreenProps,
  useUI,
} from "@firebase-oss/ui-react";
import type { ComponentProps } from "react";
import { ForgotPasswordAuthForm } from "@/components/notes-app/forgot-password-auth-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface ForgotPasswordAuthScreenProps
  extends FirebaseForgotPasswordAuthScreenProps,
    Omit<ComponentProps<"div">, "children"> {}

export function ForgotPasswordAuthScreen({
  onPasswordSent,
  onBackToSignInClick,
  className,
  ref,
}: ForgotPasswordAuthScreenProps) {
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
          <ForgotPasswordAuthForm
            onPasswordSent={onPasswordSent}
            onBackToSignInClick={onBackToSignInClick}
          />
        </CardContent>
      </Card>
    </div>
  );
}
