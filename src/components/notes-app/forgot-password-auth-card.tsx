"use client";

import type {
  // cspell:disable-next-line
  ForgotPasswordAuthScreenProps as ForgotPasswordAuthCardProps,
} from "@firebase-oss/ui-react";
import { ForgotPasswordAuthForm } from "@/components/notes-app/forgot-password-auth-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useTranslation } from "@/hooks/use-translation";

export type { ForgotPasswordAuthCardProps };

export function ForgotPasswordAuthCard(props: ForgotPasswordAuthCardProps) {
  const translate = useTranslation();

  const titleText = translate("labels", "resetPassword");
  const subtitleText = translate("prompts", "enterEmailToReset");

  return (
    <div className="max-w-sm mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>{titleText}</CardTitle>
          <CardDescription>{subtitleText}</CardDescription>
        </CardHeader>
        <CardContent>
          <ForgotPasswordAuthForm {...props} />
        </CardContent>
      </Card>
    </div>
  );
}
