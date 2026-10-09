"use client";

import type {
  // cspell:disable-next-line
  ForgotPasswordAuthScreenProps as ForgotPasswordAuthCardProps,
} from "@firebase-oss/ui-react";
import { useTranslations } from "next-intl";
import { ForgotPasswordAuthForm } from "@/app/(public)/_components/forgot-password-auth-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export type { ForgotPasswordAuthCardProps };

export function ForgotPasswordAuthCard(props: ForgotPasswordAuthCardProps) {
  const translate = useTranslations("auth");

  const titleText = translate("resetPassword");
  const subtitleText = translate("resetPasswordSubtitle");

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
