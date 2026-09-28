"use client";

import { getTranslation } from "@firebase-oss/ui-core";
import {
  type MultiFactorAuthEnrollmentFormProps as FirebaseMultiFactorAuthEnrollmentFormProps,
  useUI,
} from "@firebase-oss/ui-react";
import type { ComponentProps } from "react";
import { MultiFactorAuthEnrollmentForm } from "@/components/notes-app/multi-factor-auth-enrollment-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface MultiFactorAuthEnrollmentScreenProps
  extends FirebaseMultiFactorAuthEnrollmentFormProps,
    Omit<ComponentProps<"div">, "children"> {}

export function MultiFactorAuthEnrollmentScreen({
  className,
  ...props
}: MultiFactorAuthEnrollmentScreenProps) {
  const ui = useUI();

  const titleText = getTranslation(ui, "labels", "multiFactorEnrollment");
  const subtitleText = getTranslation(ui, "prompts", "mfaEnrollmentPrompt");

  return (
    <div className={cn("max-w-sm mx-auto", className)}>
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
