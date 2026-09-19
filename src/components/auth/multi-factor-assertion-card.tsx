"use client";

import { getTranslation } from "@firebase-oss/ui-core";
import {
  type MultiFactorAuthAssertionScreenProps,
  useUI,
} from "@firebase-oss/ui-react";
import { MultiFactorAssertionForm } from "@/components/auth/multi-factor-assertion-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export type MultiFactorAssertionCardProps = MultiFactorAuthAssertionScreenProps;

export function MultiFactorAssertionCard(props: MultiFactorAssertionCardProps) {
  const ui = useUI();

  const titleText = getTranslation(ui, "labels", "multiFactorAssertion");
  const subtitleText = getTranslation(ui, "prompts", "mfaAssertionPrompt");

  return (
    <div className="max-w-sm mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>{titleText}</CardTitle>
          <CardDescription>{subtitleText}</CardDescription>
        </CardHeader>
        <CardContent>
          <MultiFactorAssertionForm {...props} />
        </CardContent>
      </Card>
    </div>
  );
}
