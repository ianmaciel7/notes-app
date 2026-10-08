"use client";

import { generateTotpQrCode, getTranslation } from "@firebase-oss/ui-core";
import type { TotpSecret } from "firebase/auth";
import Image from "next/image";
import type { PropsWithChildren } from "react";
import { Controller, FormProvider } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useAuthenticatedUserGuard } from "@/hooks/use-authenticated-user-guard";
import { useMultiFactorEnrollmentVerifyTotpForm } from "@/hooks/use-multi-factor-enrollment-verify-totp-form";
import { useTotpMultiFactorEnrollmentForm } from "@/hooks/use-totp-multi-factor-enrollment-form";
import { useTotpMultiFactorSecretGenerationForm } from "@/hooks/use-totp-multi-factor-secret-generation-form";

type TotpMultiFactorSecretGenerationFormProps = PropsWithChildren<{
  onSubmit: (secret: TotpSecret, displayName: string) => void;
}>;

function TotpMultiFactorSecretGenerationForm(
  props: TotpMultiFactorSecretGenerationFormProps,
) {
  const { ui, form, onSubmit } = useTotpMultiFactorSecretGenerationForm(props);

  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
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
                <FieldError>{fieldState.error.message}</FieldError>
              )}
            </Field>
          )}
        />
        <Button type="submit" disabled={ui.state !== "idle"}>
          {getTranslation(ui, "labels", "generateQrCode")}
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

type MultiFactorEnrollmentVerifyTotpFormProps = PropsWithChildren<{
  secret: TotpSecret;
  displayName: string;
  onSuccess: () => void;
}>;

export function MultiFactorEnrollmentVerifyTotpForm(
  props: MultiFactorEnrollmentVerifyTotpFormProps,
) {
  const { ui, form, onSubmit } = useMultiFactorEnrollmentVerifyTotpForm(props);

  const qrCodeDataUrl = generateTotpQrCode(ui, props.secret, props.displayName);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-y-4 items-center justify-center">
        <Image
          src={qrCodeDataUrl}
          alt="TOTP QR Code"
          width={200}
          height={200}
          unoptimized
          className="mx-auto"
        />
        <code className="text-xs text-muted-foreground text-center">
          {props.secret.secretKey.toString()}
        </code>
        <p className="text-xs text-muted-foreground text-center">
          {getTranslation(ui, "prompts", "mfaTotpQrCodePrompt")}
        </p>
      </div>
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
    </div>
  );
}

export type TotpMultiFactorEnrollmentFormProps = PropsWithChildren<{
  onSuccess?: () => void;
}>;

export function TotpMultiFactorEnrollmentForm(
  props: TotpMultiFactorEnrollmentFormProps,
) {
  const { enrollment, setEnrollment } = useTotpMultiFactorEnrollmentForm();
  useAuthenticatedUserGuard();

  if (!enrollment) {
    return (
      <TotpMultiFactorSecretGenerationForm
        onSubmit={(secret, displayName) =>
          setEnrollment({ secret, displayName })
        }
      />
    );
  }

  return (
    <MultiFactorEnrollmentVerifyTotpForm
      {...enrollment}
      onSuccess={() => {
        props.onSuccess?.();
      }}
    />
  );
}
