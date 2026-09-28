"use client";

import {
  enrollWithMultiFactorAssertion,
  FirebaseUIError,
  generateTotpQrCode,
  generateTotpSecret,
  getTranslation,
} from "@firebase-oss/ui-core";
import {
  useMultiFactorTotpAuthNumberFormSchema,
  useMultiFactorTotpAuthVerifyFormSchema,
  useUI,
} from "@firebase-oss/ui-react";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { TotpMultiFactorGenerator, type TotpSecret } from "firebase/auth";
import type { ComponentProps } from "react";
import { useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { cn } from "@/lib/utils";

export type TotpMultiFactorSecretGenerationFormProps = Omit<
  ComponentProps<"form">,
  "onSubmit"
> & {
  onSubmit: (secret: TotpSecret, displayName: string) => void;
};

function TotpMultiFactorSecretGenerationForm({
  onSubmit: onSubmitProp,
  className,
  ...props
}: TotpMultiFactorSecretGenerationFormProps) {
  const ui = useUI();
  const schema = useMultiFactorTotpAuthNumberFormSchema();

  const form = useForm<{ displayName: string }>({
    resolver: standardSchemaResolver(schema),
    mode: "onChange",
    defaultValues: {
      displayName: "",
    },
  });

  const onSubmit = async (values: { displayName: string }) => {
    try {
      const secret = await generateTotpSecret(ui);
      onSubmitProp(secret, values.displayName);
    } catch (error) {
      const message =
        error instanceof FirebaseUIError ? error.message : String(error);
      form.setError("root", { message });
    }
  };

  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn("flex flex-col gap-y-4", className)}
        {...props}
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
          <FieldError>{form.formState.errors.root.message}</FieldError>
        )}
      </form>
    </FormProvider>
  );
}

export type MultiFactorEnrollmentVerifyTotpFormProps = Omit<
  ComponentProps<"form">,
  "onSubmit"
> & {
  secret: TotpSecret;
  displayName: string;
  onSuccess: () => void;
};

export function MultiFactorEnrollmentVerifyTotpForm({
  secret,
  displayName,
  onSuccess,
  className,
  ...props
}: MultiFactorEnrollmentVerifyTotpFormProps) {
  const ui = useUI();
  const schema = useMultiFactorTotpAuthVerifyFormSchema();

  const form = useForm<{ verificationCode: string }>({
    resolver: standardSchemaResolver(schema),
    mode: "onChange",
    defaultValues: {
      verificationCode: "",
    },
  });

  const onSubmit = async (values: { verificationCode: string }) => {
    try {
      const assertion = TotpMultiFactorGenerator.assertionForEnrollment(
        secret,
        values.verificationCode,
      );
      await enrollWithMultiFactorAssertion(
        ui,
        assertion,
        values.verificationCode,
      );
      onSuccess();
    } catch (error) {
      const message =
        error instanceof FirebaseUIError ? error.message : String(error);
      form.setError("root", { message });
    }
  };

  const qrCodeDataUrl = generateTotpQrCode(ui, secret, displayName);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-y-4 items-center justify-center">
        <img src={qrCodeDataUrl} alt="TOTP QR Code" className="mx-auto" />
        <code className="text-xs text-muted-foreground text-center">
          {secret.secretKey.toString()}
        </code>
        <p className="text-xs text-muted-foreground text-center">
          {getTranslation(ui, "prompts", "mfaTotpQrCodePrompt")}
        </p>
      </div>
      <FormProvider {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className={cn("flex flex-col gap-y-4", className)}
          {...props}
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
            <FieldError>{form.formState.errors.root.message}</FieldError>
          )}
        </form>
      </FormProvider>
    </div>
  );
}

export type TotpMultiFactorEnrollmentFormProps = ComponentProps<"div"> & {
  onSuccess?: () => void;
};

export function TotpMfaEnrollmentForm({
  onSuccess,
  className,
  ...props
}: TotpMultiFactorEnrollmentFormProps) {
  const ui = useUI();

  const [enrollment, setEnrollment] = useState<{
    secret: TotpSecret;
    displayName: string;
  } | null>(null);

  if (!ui.auth.currentUser) {
    throw new Error(
      "User must be authenticated to enroll with multi-factor authentication",
    );
  }

  return (
    <div className={cn(className)} {...props}>
      {!enrollment ? (
        <TotpMultiFactorSecretGenerationForm
          onSubmit={(secret, displayName) =>
            setEnrollment({ secret, displayName })
          }
        />
      ) : (
        <MultiFactorEnrollmentVerifyTotpForm
          {...enrollment}
          onSuccess={() => {
            onSuccess?.();
          }}
        />
      )}
    </div>
  );
}

export {
  TotpMfaEnrollmentForm as TotpMultiFactorEnrollmentForm,
  type TotpMultiFactorEnrollmentFormProps as TotpMfaEnrollmentFormProps,
};
