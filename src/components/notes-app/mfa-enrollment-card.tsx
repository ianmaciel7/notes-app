"use client";

import { getTranslation } from "@firebase-oss/ui-core";
import {
  type MultiFactorAuthEnrollmentFormProps as FirebaseMultiFactorAuthEnrollmentFormProps,
  useUI,
} from "@firebase-oss/ui-react";
import type { ComponentProps } from "react";
import { MfaEnrollmentForm } from "@/components/notes-app/mfa-enrollment-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface MfaEnrollmentCardProps
  extends FirebaseMultiFactorAuthEnrollmentFormProps,
    Omit<ComponentProps<"div">, "children"> {}

export function MfaEnrollmentCard({
  className,
  ...props
}: MfaEnrollmentCardProps) {
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
          <MfaEnrollmentForm {...props} />
        </CardContent>
      </Card>
    </div>
  );
}

export type MultiFactorAuthEnrollmentFormProps = MfaEnrollmentCardProps;
