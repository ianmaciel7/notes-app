"use client";

import {
  PhoneMultiFactorGenerator,
  TotpMultiFactorGenerator,
  type UserCredential,
} from "firebase/auth";
import type { ComponentProps, PropsWithChildren } from "react";

import { SmsMultiFactorAssertionForm } from "@/components/notes-app/sms-multi-factor-assertion-form";
import { TotpMultiFactorAssertionForm } from "@/components/notes-app/totp-multi-factor-assertion-form";
import { Button } from "@/components/ui/button";
import { useMultiFactorAuthAssertionForm } from "@/hooks/use-multi-factor-auth-assertion-form";
import { useTranslation } from "@/hooks/use-translation";

export type MultiFactorAuthAssertionFormProps = PropsWithChildren<{
  onSuccess?: (credential: UserCredential) => void;
}>;

export function MultiFactorAuthAssertionForm({
  onSuccess,
}: MultiFactorAuthAssertionFormProps) {
  const { resolver, hint, setHint } = useMultiFactorAuthAssertionForm();
  const translate = useTranslation();
  const mfaAssertionFactorPrompt = translate(
    "prompts",
    "mfaAssertionFactorPrompt",
  );

  if (hint) {
    if (hint.factorId === PhoneMultiFactorGenerator.FACTOR_ID) {
      return <SmsMultiFactorAssertionForm hint={hint} onSuccess={onSuccess} />;
    }

    if (hint.factorId === TotpMultiFactorGenerator.FACTOR_ID) {
      return <TotpMultiFactorAssertionForm hint={hint} onSuccess={onSuccess} />;
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm text-muted-foreground">
        {mfaAssertionFactorPrompt}
      </p>
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
    </div>
  );
}

function TotpButton(props: ComponentProps<typeof Button>) {
  const translate = useTranslation();
  const labelText = translate("labels", "mfaTotpVerification");
  return <Button {...props}>{labelText}</Button>;
}

function SmsButton(props: ComponentProps<typeof Button>) {
  const translate = useTranslation();
  const labelText = translate("labels", "mfaSmsVerification");
  return <Button {...props}>{labelText}</Button>;
}
