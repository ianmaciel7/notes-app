"use client";

import type {
  // cspell:disable-next-line
  MultiFactorAuthAssertionScreenProps as MultiFactorAuthAssertionCardProps,
} from "@firebase-oss/ui-react";
import { MultiFactorAuthAssertionForm } from "@/components/notes-app/multi-factor-auth-assertion-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useTranslation } from "@/hooks/use-translation";

export type MultiFactorAuthEnrollmentCardProps =
  MultiFactorAuthAssertionCardProps;

export function MultiFactorAuthAssertionCard(
  props: MultiFactorAuthEnrollmentCardProps,
) {
  const translate = useTranslation();

  const titleText = translate("labels", "multiFactorAssertion");
  const subtitleText = translate("prompts", "mfaAssertionPrompt");

  return (
    <div className="max-w-sm mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>{titleText}</CardTitle>
          <CardDescription>{subtitleText}</CardDescription>
        </CardHeader>
        <CardContent>
          <MultiFactorAuthAssertionForm {...props} />
        </CardContent>
      </Card>
    </div>
  );
}
