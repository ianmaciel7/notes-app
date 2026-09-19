"use client";

import { getTranslation } from "@firebase-oss/ui-core";
import {
  type ForgotPasswordAuthScreenProps,
  useUI,
} from "@firebase-oss/ui-react";

import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export type ForgotPasswordCardProps = ForgotPasswordAuthScreenProps;

export function ForgotPasswordCard(props: ForgotPasswordCardProps) {
  const ui = useUI();

  const titleText = getTranslation(ui, "labels", "forgotPassword");
  const subtitleText = getTranslation(ui, "prompts", "enterEmailToReset");

  return (
    <div className="max-w-sm mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>{titleText}</CardTitle>
          <CardDescription>{subtitleText}</CardDescription>
        </CardHeader>
        <CardContent>
          <ForgotPasswordForm {...props} />
        </CardContent>
      </Card>
    </div>
  );
}
