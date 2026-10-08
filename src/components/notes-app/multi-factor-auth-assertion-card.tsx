"use client";

import type {
  // cspell:disable-next-line
  MultiFactorAuthAssertionScreenProps as MultiFactorAuthAssertionCardProps,
} from "@firebase-oss/ui-react";
import { useTranslations } from "next-intl";
import { MultiFactorAuthAssertionForm } from "@/components/notes-app/multi-factor-auth-assertion-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export type MultiFactorAuthEnrollmentCardProps =
  MultiFactorAuthAssertionCardProps;

export function MultiFactorAuthAssertionCard(
  props: MultiFactorAuthEnrollmentCardProps,
) {
  const translate = useTranslations("auth");

  const titleText = translate("multiFactorAssertion");
  const subtitleText = translate("multiFactorAssertionSubtitle");

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
