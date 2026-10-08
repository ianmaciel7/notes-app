"use client";

import { getTranslation } from "@firebase-oss/ui-core";
import type { PropsWithChildren } from "react";
import { Controller, FormProvider } from "react-hook-form";
import {
  AuthFieldError,
  AuthRootError,
} from "@/components/notes-app/auth-field-error";
import { CountrySelector } from "@/components/notes-app/country-selector";
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
import { useAuthenticatedUserGuard } from "@/hooks/use-authenticated-user-guard";
import { useMultiFactorEnrollmentPhoneNumberForm } from "@/hooks/use-multi-factor-enrollment-phone-number-form";
import { useMultiFactorEnrollmentVerifyPhoneNumberForm } from "@/hooks/use-multi-factor-enrollment-verify-phone-number-form";
import { useSmsMultiFactorEnrollmentForm } from "@/hooks/use-sms-multi-factor-enrollment-form";

type MultiFactorEnrollmentPhoneNumberFormProps = PropsWithChildren<{
  onSubmit: (verificationId: string, displayName?: string) => void;
}>;

function MultiFactorEnrollmentPhoneNumberForm(
  props: MultiFactorEnrollmentPhoneNumberFormProps,
) {
  const { ui, form, recaptchaContainerRef, countrySelector, onSubmit } =
    useMultiFactorEnrollmentPhoneNumberForm(props.onSubmit);

  return (
    <FormProvider {...form}>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          void form.handleSubmit(onSubmit)(event);
        }}
        className="flex flex-col gap-y-4"
      >
        <Controller
          control={form.control}
          name="displayName"
          render={({ field, fieldState }) => (
            <Field data-invalid={!!fieldState.error}>
              <FieldLabel htmlFor="displayName">
                {getTranslation(ui, "labels", "displayName")}
              </FieldLabel>
              <Input
                {...field}
                id="displayName"
                type="text"
                aria-invalid={!!fieldState.error}
              />
              {fieldState.error && (
                <FieldError>
                  <AuthFieldError field="displayName" />
                </FieldError>
              )}
            </Field>
          )}
        />
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
                  className="flex-grow"
                  aria-invalid={!!fieldState.error}
                />
              </div>
              {fieldState.error && (
                <FieldError>
                  <AuthFieldError field="phoneNumber" />
                </FieldError>
              )}
            </Field>
          )}
        />
        <div className="fui-recaptcha-container" ref={recaptchaContainerRef} />
        <Button type="submit" disabled={ui.state !== "idle"}>
          {getTranslation(ui, "labels", "sendCode")}
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

type MultiFactorEnrollmentVerifyPhoneNumberFormProps = PropsWithChildren<{
  verificationId: string;
  displayName?: string;
  onSuccess: () => void;
}>;

export function MultiFactorEnrollmentVerifyPhoneNumberForm(
  props: MultiFactorEnrollmentVerifyPhoneNumberFormProps,
) {
  const { ui, form, onSubmit } =
    useMultiFactorEnrollmentVerifyPhoneNumberForm(props);

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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

export type SmsMultiFactorEnrollmentFormProps = PropsWithChildren<{
  onSuccess?: () => void;
}>;

export function SmsMultiFactorEnrollmentForm(
  props: SmsMultiFactorEnrollmentFormProps,
) {
  const { verification, setVerification } = useSmsMultiFactorEnrollmentForm();
  useAuthenticatedUserGuard();

  if (!verification) {
    return (
      <MultiFactorEnrollmentPhoneNumberForm
        onSubmit={(verificationId, displayName) =>
          setVerification({ verificationId, displayName })
        }
      />
    );
  }

  return (
    <MultiFactorEnrollmentVerifyPhoneNumberForm
      {...verification}
      onSuccess={() => {
        props.onSuccess?.();
      }}
    />
  );
}
