"use client";

import { getTranslation } from "@firebase-oss/ui-core";
import { useUI } from "@firebase-oss/ui-react";
import { FactorId } from "firebase/auth";
import type { ComponentProps } from "react";
import { useState } from "react";

import { SmsMultiFactorEnrollmentForm } from "@/components/notes-app/sms-mfa-enrollment-form";
import { TotpMultiFactorEnrollmentForm } from "@/components/notes-app/totp-mfa-enrollment-form";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import { cn } from "@/lib/utils";

type Hint = (typeof FactorId)[keyof typeof FactorId];

export type MfaEnrollmentFormProps = ComponentProps<"div"> & {
  onEnrollment?: () => void;
  hints?: Hint[];
};

const DEFAULT_HINTS = [FactorId.TOTP, FactorId.PHONE] as const;

export function MfaEnrollmentForm({
  onEnrollment,
  hints: hintsProp,
  className,
  ...props
}: MfaEnrollmentFormProps) {
  const hints = hintsProp ?? DEFAULT_HINTS;

  if (hints.length === 0) {
    throw new Error("MfaEnrollmentForm must have at least one hint");
  }

  // If only a single hint is provided, select it by default to improve UX.
  const [hint, setHint] = useState<Hint | undefined>(
    hints.length === 1 ? hints[0] : undefined,
  );

  if (hint) {
    if (hint === FactorId.TOTP) {
      return (
        <TotpMultiFactorEnrollmentForm
          onSuccess={onEnrollment}
          className={className}
          {...props}
        />
      );
    }

    if (hint === FactorId.PHONE) {
      return (
        <SmsMultiFactorEnrollmentForm
          onSuccess={onEnrollment}
          className={className}
          {...props}
        />
      );
    }

    throw new Error(`Unknown multi-factor enrollment type: ${hint}`);
  }

  return (
    <FieldGroup className={cn("gap-2", className)} {...props}>
      {hints.map((hint) => {
        if (hint === FactorId.TOTP) {
          return <TotpButton key={hint} onClick={() => setHint(hint)} />;
        }

        if (hint === FactorId.PHONE) {
          return <SmsButton key={hint} onClick={() => setHint(hint)} />;
        }

        return null;
      })}
    </FieldGroup>
  );
}

function TotpButton(props: ComponentProps<typeof Button>) {
  const ui = useUI();
  const labelText = getTranslation(ui, "labels", "mfaTotpVerification");
  return (
    <Button {...props} variant="outline">
      {labelText}
    </Button>
  );
}

function SmsButton(props: ComponentProps<typeof Button>) {
  const ui = useUI();
  const labelText = getTranslation(ui, "labels", "mfaSmsVerification");
  return (
    <Button {...props} variant="outline">
      {labelText}
    </Button>
  );
}
