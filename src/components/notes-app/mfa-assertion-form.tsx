"use client";

import { getTranslation } from "@firebase-oss/ui-core";
import { useMultiFactorAssertionCleanup, useUI } from "@firebase-oss/ui-react";
import {
  type MultiFactorInfo,
  PhoneMultiFactorGenerator,
  TotpMultiFactorGenerator,
  type UserCredential,
} from "firebase/auth";
import type { ComponentProps } from "react";
import { useState } from "react";

import { SmsMfaAssertionForm } from "@/components/notes-app/sms-mfa-assertion-form";
import { TotpMfaAssertionForm } from "@/components/notes-app/totp-mfa-assertion-form";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldGroup } from "@/components/ui/field";
import { cn } from "@/lib/utils";

type MfaAssertionFormProps = ComponentProps<"div"> & {
  onSuccess?: (credential: UserCredential) => void;
};

function MfaAssertionForm({
  onSuccess,
  className,
  ...props
}: MfaAssertionFormProps) {
  const ui = useUI();
  const resolver = ui.multiFactorResolver;
  const mfaAssertionFactorPrompt = getTranslation(
    ui,
    "prompts",
    "mfaAssertionFactorPrompt",
  );

  useMultiFactorAssertionCleanup();

  if (!resolver) {
    throw new Error(
      "MultiFactorAuthAssertionForm requires a multi-factor resolver",
    );
  }

  // If only a single hint is provided, select it by default to improve UX.
  const [hint, setHint] = useState<MultiFactorInfo | undefined>(
    resolver.hints.length === 1 ? resolver.hints[0] : undefined,
  );

  if (hint) {
    if (hint.factorId === PhoneMultiFactorGenerator.FACTOR_ID) {
      return (
        <SmsMfaAssertionForm
          hint={hint}
          onSuccess={onSuccess}
          {...props}
          className={className}
        />
      );
    }

    if (hint.factorId === TotpMultiFactorGenerator.FACTOR_ID) {
      return (
        <TotpMfaAssertionForm
          hint={hint}
          onSuccess={onSuccess}
          {...props}
          className={className}
        />
      );
    }
  }

  return (
    <FieldGroup data-slot="mfa-assertion-form" {...props} className={cn("gap-2", className)}>
      <Field>
        <FieldDescription>{mfaAssertionFactorPrompt}</FieldDescription>
      </Field>
      {resolver.hints.map((hint) => {
        if (hint.factorId === TotpMultiFactorGenerator.FACTOR_ID) {
          return (
            <TotpButton key={hint.factorId} onClick={() => setHint(hint)} />
          );
        }

        if (hint.factorId === PhoneMultiFactorGenerator.FACTOR_ID) {
          return (
            <SmsButton key={hint.factorId} onClick={() => setHint(hint)} />
          );
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
    <Button data-slot="mfa-assertion-totp-button" {...props} variant="outline">
      {labelText}
    </Button>
  );
}

function SmsButton(props: ComponentProps<typeof Button>) {
  const ui = useUI();
  const labelText = getTranslation(ui, "labels", "mfaSmsVerification");
  return (
    <Button data-slot="mfa-assertion-sms-button" {...props} variant="outline">
      {labelText}
    </Button>
  );
}

export {
  MfaAssertionForm,
  MfaAssertionForm as MultiFactorAuthAssertionForm,
  type MfaAssertionFormProps,
  type MfaAssertionFormProps as MultiFactorAuthAssertionFormProps,
};
