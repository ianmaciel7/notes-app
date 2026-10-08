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
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useSmsMultiFactorAssertionForm } from "@/hooks/use-sms-multi-factor-assertion-form";
import { useSmsMultiFactorAssertionPhoneForm } from "@/hooks/use-sms-multi-factor-assertion-phone-form";
import { useSmsMultiFactorAssertionVerifyForm } from "@/hooks/use-sms-multi-factor-assertion-verify-form";

type PhoneMultiFactorInfo = MultiFactorInfo & {
  phoneNumber?: string;
};

type SmsMultiFactorAssertionPhoneFormProps = PropsWithChildren<{
  hint: MultiFactorInfo;
  onSubmit: (verificationId: string) => void;
}>;

function SmsMultiFactorAssertionPhoneForm(
  props: SmsMultiFactorAssertionPhoneFormProps,
) {
  const { ui, recaptchaContainerRef, error, onSubmit } =
    useSmsMultiFactorAssertionPhoneForm(props.hint, props.onSubmit);

  return (
    <div className="flex flex-col gap-4">
      <Field>
        <FieldLabel>{getTranslation(ui, "labels", "phoneNumber")}</FieldLabel>
        <FieldDescription>
          {getTranslation(ui, "messages", "mfaSmsAssertionPrompt", {
            phoneNumber: (props.hint as PhoneMultiFactorInfo).phoneNumber || "",
          })}
        </FieldDescription>
      </Field>
      <div className="fui-recaptcha-container" ref={recaptchaContainerRef} />
      <Button onClick={onSubmit} disabled={ui.state !== "idle"}>
        {getTranslation(ui, "labels", "sendCode")}
      </Button>
      {error && <div className="text-sm text-destructive">{error}</div>}
    </div>
  );
}

type SmsMultiFactorAssertionVerifyFormProps = PropsWithChildren<{
  verificationId: string;
  onSuccess: (credential: UserCredential) => void;
}>;

function SmsMultiFactorAssertionVerifyForm(
  props: SmsMultiFactorAssertionVerifyFormProps,
) {
  const { ui, form, onSubmit } = useSmsMultiFactorAssertionVerifyForm(props);

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
              <FieldDescription>
                {getTranslation(ui, "prompts", "smsVerificationPrompt")}
              </FieldDescription>
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

export type SmsMultiFactorAssertionFormProps = PropsWithChildren<{
  hint: MultiFactorInfo;
  onSuccess?: (credential: UserCredential) => void;
}>;

export function SmsMultiFactorAssertionForm(
  props: SmsMultiFactorAssertionFormProps,
) {
  const { verification, setVerification } = useSmsMultiFactorAssertionForm();

  if (!verification) {
    return (
      <SmsMultiFactorAssertionPhoneForm
        hint={props.hint}
        onSubmit={(verificationId) => setVerification({ verificationId })}
      />
    );
  }

  return (
    <SmsMultiFactorAssertionVerifyForm
      verificationId={verification.verificationId}
      onSuccess={(credential) => {
        props.onSuccess?.(credential);
      }}
    />
  );
}
