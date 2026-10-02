"use client";

import { getTranslation } from "@firebase-oss/ui-core";
import { useUI } from "@firebase-oss/ui-react";
import { FactorId } from "firebase/auth";
import type { ComponentProps } from "react";
import { useState } from "react";

import { SmsMfaEnrollmentFieldGroup } from "@/components/notes-app/sms-mfa-enrollment-field-group";
import { TotpMfaEnrollmentFieldGroup } from "@/components/notes-app/totp-mfa-enrollment-field-group";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import { cn } from "@/lib/utils";

type Hint = (typeof FactorId)[keyof typeof FactorId];

type MfaEnrollmentFieldGroupProps = ComponentProps<typeof FieldGroup> & {
  onEnrollment?: () => void;
  hints?: Hint[];
};

const DEFAULT_HINTS = [FactorId.TOTP, FactorId.PHONE] as const;

function MfaEnrollmentFieldGroup({
  onEnrollment,
  hints: hintsProp,
  className,
  ...props
}: MfaEnrollmentFieldGroupProps) {
  const hints = hintsProp ?? DEFAULT_HINTS;

  if (hints.length === 0) {
    throw new Error("MfaEnrollmentFieldGroup must have at least one hint");
  }

  // If only a single hint is provided, select it by default to improve UX.
  const [hint, setHint] = useState<Hint | undefined>(
    hints.length === 1 ? hints[0] : undefined,
  );

  if (hint) {
    if (hint === FactorId.TOTP) {
      return (
        <TotpMfaEnrollmentFieldGroup
          onSuccess={onEnrollment}
          {...props}
          className={className}
        />
      );
    }

    if (hint === FactorId.PHONE) {
      return (
        <SmsMfaEnrollmentFieldGroup
          onSuccess={onEnrollment}
          {...props}
          className={className}
        />
      );
    }

    throw new Error(`Unknown multi-factor enrollment type: ${hint}`);
  }

  return (
    <FieldGroup
      data-slot="mfa-enrollment-field-group"
      {...props}
      className={cn("gap-2", className)}
    >
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
    <Button data-slot="mfa-enrollment-totp-button" {...props} variant="outline">
      {labelText}
    </Button>
  );
}

function SmsButton(props: ComponentProps<typeof Button>) {
  const ui = useUI();
  const labelText = getTranslation(ui, "labels", "mfaSmsVerification");
  return (
    <Button data-slot="mfa-enrollment-sms-button" {...props} variant="outline">
      {labelText}
    </Button>
  );
}

export { MfaEnrollmentFieldGroup, type MfaEnrollmentFieldGroupProps };
