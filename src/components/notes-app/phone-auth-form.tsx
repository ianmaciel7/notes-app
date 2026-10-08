"use client";

import { getTranslation } from "@firebase-oss/ui-core";
import type { PhoneAuthFormProps } from "@firebase-oss/ui-react";
import type { UserCredential } from "firebase/auth";
import type { PropsWithChildren } from "react";
import { Controller, FormProvider } from "react-hook-form";
import { CountrySelector } from "@/components/notes-app/country-selector";
import { Policies } from "@/components/notes-app/policies";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { usePhoneAuthForm } from "@/hooks/use-phone-auth-form";
import { usePhoneNumberForm } from "@/hooks/use-phone-number-form";
import { usePhoneVerifyForm } from "@/hooks/use-phone-verify-form";

type VerifyPhoneNumberFormProps = PropsWithChildren<{
  verificationId: string;
  onSuccess: (credential: UserCredential) => void;
}>;

function VerifyPhoneNumberForm(props: VerifyPhoneNumberFormProps) {
  const { ui, form, onSubmit } = usePhoneVerifyForm(props);

  return (
    <FormProvider {...form}>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          void form.handleSubmit(onSubmit)(event);
        }}
        className="flex flex-col gap-4"
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
                <FieldError>{fieldState.error.message}</FieldError>
              )}
            </Field>
          )}
        />
        <Button type="submit" disabled={ui.state !== "idle"}>
          {getTranslation(ui, "labels", "verifyCode")}
        </Button>
        {form.formState.errors.root && (
          <Field data-invalid="true">
            <FieldError>{form.formState.errors.root.message}</FieldError>
          </Field>
        )}
      </form>
    </FormProvider>
  );
}

type PhoneNumberFormProps = PropsWithChildren<{
  onSubmit: (verificationId: string) => void;
}>;

function PhoneNumberForm(props: PhoneNumberFormProps) {
  const {
    ui,
    form,
    recaptchaContainerRef,
    countrySelector,
    onSubmit,
    recaptchaVerifier,
  } = usePhoneNumberForm(props.onSubmit);

  return (
    <FormProvider {...form}>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          void form.handleSubmit(onSubmit)(event);
        }}
        className="flex flex-col gap-4"
      >
        <Controller
          control={form.control}
          name="phoneNumber"
          render={({ field, fieldState }) => (
            <Field data-invalid={!!fieldState.error}>
              <FieldLabel htmlFor="phoneNumber">
                {getTranslation(ui, "labels", "phoneNumber")}
              </FieldLabel>
              <div className="flex items-center gap-2">
                <CountrySelector ref={countrySelector} />
                <Input
                  {...field}
                  id="phoneNumber"
                  type="tel"
                  aria-invalid={!!fieldState.error}
                />
              </div>
              {fieldState.error && (
                <FieldError>{fieldState.error.message}</FieldError>
              )}
            </Field>
          )}
        />
        <div ref={recaptchaContainerRef} />
        <Policies />
        <Button
          type="submit"
          disabled={ui.state !== "idle" || !recaptchaVerifier}
        >
          {getTranslation(ui, "labels", "sendCode")}
        </Button>
        {form.formState.errors.root && (
          <Field data-invalid="true">
            <FieldError>{form.formState.errors.root.message}</FieldError>
          </Field>
        )}
      </form>
    </FormProvider>
  );
}

export type { PhoneAuthFormProps };

export function PhoneAuthForm(props: PhoneAuthFormProps) {
  const { verificationId, setVerificationId } = usePhoneAuthForm();

  if (!verificationId) {
    return <PhoneNumberForm onSubmit={setVerificationId} />;
  }

  return (
    <VerifyPhoneNumberForm
      verificationId={verificationId}
      onSuccess={(credential) => {
        props.onSignIn?.(credential);
      }}
    />
  );
}
