"use client";

import type { MultiFactorAuthEnrollmentFormProps } from "@firebase-oss/ui-react";
import { MultiFactorAuthEnrollmentForm } from "@/components/notes-app/multi-factor-auth-enrollment-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useTranslation } from "@/hooks/use-translation";

export type MultiFactorAuthEnrollmentCardProps =
  MultiFactorAuthEnrollmentFormProps;

export function MultiFactorAuthEnrollmentCard(
  props: MultiFactorAuthEnrollmentCardProps,
) {
  const translate = useTranslation();

  const titleText = translate("labels", "multiFactorEnrollment");
  const subtitleText = translate("prompts", "mfaEnrollmentPrompt");

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
