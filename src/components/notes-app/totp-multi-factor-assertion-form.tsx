"use client";

import { getTranslation } from "@firebase-oss/ui-core";
import type { MultiFactorInfo, UserCredential } from "firebase/auth";
import type { PropsWithChildren } from "react";
import { Controller, FormProvider } from "react-hook-form";
import {
  AuthFieldError,
  AuthRootError,
} from "@/components/notes-app/auth-field-error";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useTotpMultiFactorAssertionForm } from "@/hooks/use-totp-multi-factor-assertion-form";

type TotpMultiFactorAssertionFormProps = PropsWithChildren<{
  hint: MultiFactorInfo;
  onSuccess?: (credential: UserCredential) => void;
}>;

export function TotpMultiFactorAssertionForm(
  props: TotpMultiFactorAssertionFormProps,
) {
  const { ui, form, onSubmit } = useTotpMultiFactorAssertionForm(props);

  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-y-4"
      >
        <Controller
          control={form.control}
          name="verificationCode"
          render={({ field, fieldState }) => (
            <Field data-invalid={!!fieldState.error}>
              <FieldLabel htmlFor="verificationCode">
                {getTranslation(ui, "labels", "verificationCode")}
              </FieldLabel>
              <InputOTP
                id="verificationCode"
                maxLength={6}
                {...field}
                aria-invalid={!!fieldState.error}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
              {fieldState.error && (
                <FieldError>
                  <AuthFieldError field="verificationCode" />
                </FieldError>
              )}
            </Field>
          )}
        />
        <Button type="submit" disabled={ui.state !== "idle"}>
          {getTranslation(ui, "labels", "verifyCode")}
        </Button>
        {form.formState.errors.root && (
          <Field data-invalid="true">
            <FieldError>
              <AuthRootError />
            </FieldError>
          </Field>
        )}
      </form>
    </FormProvider>
  );
}
