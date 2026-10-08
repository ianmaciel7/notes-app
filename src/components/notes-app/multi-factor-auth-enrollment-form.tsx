"use client";

import { FactorId } from "firebase/auth";
import type { ComponentProps, PropsWithChildren } from "react";

import { SmsMultiFactorEnrollmentForm } from "@/components/notes-app/sms-multi-factor-enrollment-form";
import { TotpMultiFactorEnrollmentForm } from "@/components/notes-app/totp-multi-factor-enrollment-form";
import { Button } from "@/components/ui/button";
import {
  type Hint,
  useMultiFactorAuthEnrollmentForm,
} from "@/hooks/use-multi-factor-auth-enrollment-form";
import { useTranslation } from "@/hooks/use-translation";

export type MultiFactorAuthEnrollmentFormProps = PropsWithChildren<{
  onEnrollment?: () => void;
  hints?: Hint[];
}>;

export function MultiFactorAuthEnrollmentForm(
  props: MultiFactorAuthEnrollmentFormProps,
) {
  const { hints, hint, setHint } = useMultiFactorAuthEnrollmentForm(
    props.hints,
  );

  if (hint) {
    if (hint === FactorId.TOTP) {
      return <TotpMultiFactorEnrollmentForm onSuccess={props.onEnrollment} />;
    }

    if (hint === FactorId.PHONE) {
      return <SmsMultiFactorEnrollmentForm onSuccess={props.onEnrollment} />;
    }

    throw new Error(`Unknown multi-factor enrollment type: ${hint}`);
  }

  return (
    <div className="flex flex-col gap-2">
      {hints.map((hint) => {
        if (hint === FactorId.TOTP) {
          return <TotpButton key={hint} onClick={() => setHint(hint)} />;
        }

        if (hint === FactorId.PHONE) {
          return <SmsButton key={hint} onClick={() => setHint(hint)} />;
        }

        return null;
      })}
    </div>
  );
}

function TotpButton(props: ComponentProps<typeof Button>) {
  const translate = useTranslation();
  const labelText = translate("labels", "mfaTotpVerification");
  return (
    <Button {...props} variant="outline">
      {labelText}
    </Button>
  );
}

function SmsButton(props: ComponentProps<typeof Button>) {
  const translate = useTranslation();
  const labelText = translate("labels", "mfaSmsVerification");
  return (
    <Button {...props} variant="outline">
      {labelText}
    </Button>
  );
}
