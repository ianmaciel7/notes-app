"use client";

import type { MultiFactorAuthEnrollmentFormProps } from "@firebase-oss/ui-react";
import { useTranslations } from "next-intl";
import { MultiFactorAuthEnrollmentForm } from "@/components/notes-app/multi-factor-auth-enrollment-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export type MultiFactorAuthEnrollmentCardProps =
  MultiFactorAuthEnrollmentFormProps;

export function MultiFactorAuthEnrollmentCard(
  props: MultiFactorAuthEnrollmentCardProps,
) {
  const translate = useTranslations("auth");

  const titleText = translate("multiFactorEnrollment");
  const subtitleText = translate("multiFactorEnrollmentSubtitle");

  return (
    <div className="max-w-sm mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>{titleText}</CardTitle>
          <CardDescription>{subtitleText}</CardDescription>
        </CardHeader>
        <CardContent>
          <MultiFactorAuthEnrollmentForm {...props} />
        </CardContent>
      </Card>
    </div>
  );
}
