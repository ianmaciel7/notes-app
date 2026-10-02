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
import Image from "next/image";
import { useTranslations } from "next-intl";
import type { ComponentProps } from "react";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { AuthFormErrorAlert } from "@/components/notes-app/auth-form-error-alert";
import { AuthFormInput } from "@/components/notes-app/auth-form-input";
import { AuthSubmitButton } from "@/components/notes-app/auth-submit-button";
import { VerificationCodeInput } from "@/components/notes-app/verification-code-input";
import { Field, FieldDescription, FieldGroup } from "@/components/ui/field";
import { InputGroup, InputGroupInput } from "@/components/ui/input-group";
import { cn } from "@/lib/utils";

type TotpMultiFactorSecretGenerationFormProps = Omit<
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
        {...props}
        className={cn("flex flex-col gap-4", className)}
      >
        <FieldGroup>
          <AuthFormInput
            name="displayName"
            type="text"
            label={getTranslation(ui, "labels", "displayName")}
          />
          <AuthSubmitButton type="submit" busy={ui.state !== "idle"}>
            {getTranslation(ui, "labels", "generateQrCode")}
          </AuthSubmitButton>
          <AuthFormErrorAlert message={form.formState.errors.root?.message} />
        </FieldGroup>
      </form>
    </FormProvider>
  );
}

type MultiFactorEnrollmentVerifyTotpFormProps = Omit<
  ComponentProps<"form">,
  "onSubmit"
> & {
  secret: TotpSecret;
  displayName: string;
  onSuccess: () => void;
};

function MultiFactorEnrollmentVerifyTotpForm({
  secret,
  displayName,
  onSuccess,
  className,
  ...props
}: MultiFactorEnrollmentVerifyTotpFormProps) {
  const ui = useUI();
  const t = useTranslations("auth");
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
    <FieldGroup className="gap-4">
      <Field className="items-center justify-center">
        <Image
          src={qrCodeDataUrl}
          alt={t("totpQrCodeAlt")}
          width={192}
          height={192}
          unoptimized
          className="mx-auto"
        />
        <InputGroup>
          <InputGroupInput
            readOnly
            value={secret.secretKey.toString()}
            aria-label={t("totpSecret")}
          />
        </InputGroup>
        <FieldDescription className="text-center">
          {getTranslation(ui, "prompts", "mfaTotpQrCodePrompt")}
        </FieldDescription>
      </Field>
      <FormProvider {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          {...props}
          className={cn("flex flex-col gap-4", className)}
        >
          <FieldGroup>
            <VerificationCodeInput
              label={getTranslation(ui, "labels", "verificationCode")}
            />
            <AuthSubmitButton type="submit" busy={ui.state !== "idle"}>
              {getTranslation(ui, "labels", "verifyCode")}
            </AuthSubmitButton>
            <AuthFormErrorAlert message={form.formState.errors.root?.message} />
          </FieldGroup>
        </form>
      </FormProvider>
    </FieldGroup>
  );
}

type TotpMfaEnrollmentFormProps = ComponentProps<"div"> & {
  onSuccess?: () => void;
};

function TotpMfaEnrollmentForm({
  onSuccess,
  className,
  ...props
}: TotpMfaEnrollmentFormProps) {
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
    <div {...props} className={cn(className)}>
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
  MultiFactorEnrollmentVerifyTotpForm,
  TotpMfaEnrollmentForm,
  TotpMfaEnrollmentForm as TotpMultiFactorEnrollmentForm,
  type TotpMultiFactorSecretGenerationFormProps,
  type MultiFactorEnrollmentVerifyTotpFormProps,
  type TotpMfaEnrollmentFormProps,
  type TotpMfaEnrollmentFormProps as TotpMultiFactorEnrollmentFormProps,
};
