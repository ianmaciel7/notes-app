"use client";

import { getTranslation } from "@firebase-oss/ui-core";
import {
  type MultiFactorAuthAssertionScreenProps as FirebaseMultiFactorAuthAssertionScreenProps,
  useUI,
} from "@firebase-oss/ui-react";
import type { ComponentProps } from "react";
import { MultiFactorAuthAssertionForm } from "@/components/notes-app/multi-factor-auth-assertion-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface MultiFactorAuthAssertionScreenProps
  extends FirebaseMultiFactorAuthAssertionScreenProps,
    Omit<ComponentProps<"div">, "children"> {}

export function MultiFactorAuthAssertionScreen({
  className,
  ...props
}: MultiFactorAuthAssertionScreenProps) {
  const ui = useUI();

  const titleText = getTranslation(ui, "labels", "multiFactorAssertion");
  const subtitleText = getTranslation(ui, "prompts", "mfaAssertionPrompt");

  return (
    <div className={cn("max-w-sm mx-auto", className)}>
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
