"use client";

import { getTranslation } from "@firebase-oss/ui-core";
import {
  type MultiFactorAuthAssertionScreenProps as FirebaseMultiFactorAuthAssertionScreenProps,
  useUI,
} from "@firebase-oss/ui-react";
import type { ComponentProps } from "react";
import { MfaAssertionForm } from "@/components/notes-app/mfa-assertion-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface MfaAssertionCardProps
  extends FirebaseMultiFactorAuthAssertionScreenProps,
    Omit<ComponentProps<"div">, "children"> {}

export function MfaAssertionCard({
  className,
  ...props
}: MfaAssertionCardProps) {
  const ui = useUI();

  const titleText = getTranslation(ui, "labels", "multiFactorAssertion");
  const subtitleText = getTranslation(ui, "prompts", "mfaAssertionPrompt");

  return (
    <Card className={cn("w-full max-w-sm mx-auto", className)}>
      <CardHeader>
        <CardTitle>{titleText}</CardTitle>
        <CardDescription>{subtitleText}</CardDescription>
      </CardHeader>
      <CardContent>
        <MfaAssertionForm {...props} />
      </CardContent>
    </Card>
  );
}

export { MfaAssertionCard as MultiFactorAuthAssertionScreen };

export type MultiFactorAuthAssertionScreenProps = MfaAssertionCardProps;
