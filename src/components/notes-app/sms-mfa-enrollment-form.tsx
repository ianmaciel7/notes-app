"use client";

import {
  enrollWithMultiFactorAssertion,
  FirebaseUIError,
  formatPhoneNumber,
  getTranslation,
  verifyPhoneNumber,
} from "@firebase-oss/ui-core";
import {
  useMultiFactorPhoneAuthNumberFormSchema,
  useMultiFactorPhoneAuthVerifyFormSchema,
  useRecaptchaVerifier,
  useUI,
} from "@firebase-oss/ui-react";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import {
  multiFactor,
  PhoneAuthProvider,
  PhoneMultiFactorGenerator,
} from "firebase/auth";
import type { ComponentProps } from "react";
import { useRef, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { AuthFormInput } from "@/components/notes-app/auth-form-input";
import {
  CountrySelect,
  type CountrySelectorRef,
} from "@/components/notes-app/country-select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

type MultiFactorEnrollmentPhoneNumberFormProps = Omit<
  ComponentProps<"form">,
  "onSubmit"
> & {
  onSubmit: (verificationId: string, displayName?: string) => void;
};

function MultiFactorEnrollmentPhoneNumberForm({
  onSubmit: onSubmitProp,
  className,
  ...props
}: MultiFactorEnrollmentPhoneNumberFormProps) {
  const ui = useUI();
  const recaptchaContainerRef = useRef<HTMLDivElement>(null);
  const recaptchaVerifier = useRecaptchaVerifier(recaptchaContainerRef);
  const countrySelector = useRef<CountrySelectorRef>(null);
  const schema = useMultiFactorPhoneAuthNumberFormSchema();

  const form = useForm<{ displayName: string; phoneNumber: string }>({
    resolver: standardSchemaResolver(schema),
    mode: "onChange",
    defaultValues: {
      displayName: "",
      phoneNumber: "",
    },
  });

  const onSubmit = async (values: {
    displayName: string;
    phoneNumber: string;
  }) => {
    try {
      const countrySelectorInstance = countrySelector.current;
      const currentUser = ui.auth.currentUser;
      const verifier = recaptchaVerifier;
      if (!countrySelectorInstance || !currentUser || !verifier) {
        form.setError("root", {
          message: getTranslation(ui, "errors", "unknownError"),
        });
        return;
      }
      const formatted = formatPhoneNumber(
        values.phoneNumber,
        countrySelectorInstance.getCountry(),
      );
      const mfaUser = multiFactor(currentUser);
      const confirmationResult = await verifyPhoneNumber(
        ui,
        formatted,
        verifier,
        mfaUser,
      );
      onSubmitProp(confirmationResult, values.displayName);
    } catch (error) {
      const message =
        error instanceof FirebaseUIError ? error.message : String(error);
      form.setError("root", { message });
    }
  };

  return (
    <FormProvider {...form}>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          void form.handleSubmit(onSubmit)(event);
        }}
        {...props}
        className={cn("flex flex-col gap-4", className)}
      >
        <FieldGroup>
          <AuthFormInput
            name="displayName"
            label={getTranslation(ui, "labels", "displayName")}
            type="text"
          />
          <Controller
            control={form.control}
            name="phoneNumber"
            render={({ field, fieldState }) => (
              <Field data-invalid={!!fieldState.error}>
                <FieldLabel htmlFor="phoneNumber">
                  {getTranslation(ui, "labels", "phoneNumber")}
                </FieldLabel>
                <InputGroup>
                  <InputGroupAddon>
                    <CountrySelect ref={countrySelector} />
                  </InputGroupAddon>
                  <InputGroupInput
                    {...field}
                    id="phoneNumber"
                    type="tel"
                    aria-invalid={!!fieldState.error}
                  />
                </InputGroup>
                {fieldState.error && (
                  <FieldError>{fieldState.error.message}</FieldError>
                )}
              </Field>
            )}
          />
          <div
            className="fui-recaptcha-container"
            ref={recaptchaContainerRef}
          />
          <Button type="submit" disabled={ui.state !== "idle"}>
            {ui.state !== "idle" && <Spinner data-icon="inline-start" />}
            {getTranslation(ui, "labels", "sendCode")}
          </Button>
          {form.formState.errors.root && (
            <Alert variant="destructive">
              <AlertDescription>
                {form.formState.errors.root.message}
              </AlertDescription>
            </Alert>
          )}
        </FieldGroup>
      </form>
    </FormProvider>
  );
}

type MultiFactorEnrollmentVerifyPhoneNumberFormProps = Omit<
  ComponentProps<"form">,
  "onSubmit"
> & {
  verificationId: string;
  displayName?: string;
  onSuccess: () => void;
};

function MultiFactorEnrollmentVerifyPhoneNumberForm({
  verificationId,
  displayName,
  onSuccess,
  className,
  ...props
}: MultiFactorEnrollmentVerifyPhoneNumberFormProps) {
  const ui = useUI();
  const schema = useMultiFactorPhoneAuthVerifyFormSchema();

  const form = useForm<{ verificationId: string; verificationCode: string }>({
    resolver: standardSchemaResolver(schema),
    mode: "onChange",
    defaultValues: {
      verificationId,
      verificationCode: "",
    },
  });

  const onSubmit = async (values: {
    verificationId: string;
    verificationCode: string;
  }) => {
    try {
      const credential = PhoneAuthProvider.credential(
        values.verificationId,
        values.verificationCode,
      );
      const assertion = PhoneMultiFactorGenerator.assertion(credential);
      await enrollWithMultiFactorAssertion(ui, assertion, displayName);
      onSuccess();
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
            {ui.state !== "idle" && <Spinner data-icon="inline-start" />}
            {getTranslation(ui, "labels", "verifyCode")}
          </Button>
          {form.formState.errors.root && (
            <Alert variant="destructive">
              <AlertDescription>
                {form.formState.errors.root.message}
              </AlertDescription>
            </Alert>
          )}
        </FieldGroup>
      </form>
    </FormProvider>
  );
}

type SmsMfaEnrollmentFormProps = ComponentProps<"div"> & {
  onSuccess?: () => void;
};

function SmsMfaEnrollmentForm({
  onSuccess,
  className,
  ...props
}: SmsMfaEnrollmentFormProps) {
  const ui = useUI();

  const [verification, setVerification] = useState<{
    verificationId: string;
    displayName?: string;
  } | null>(null);

  if (!ui.auth.currentUser) {
    throw new Error(
      "User must be authenticated to enroll with multi-factor authentication",
    );
  }

  return (
    <FieldGroup {...props} className={cn(className)}>
      {!verification ? (
        <MultiFactorEnrollmentPhoneNumberForm
          onSubmit={(verificationId, displayName) =>
            setVerification({ verificationId, displayName })
          }
        />
      ) : (
        <MultiFactorEnrollmentVerifyPhoneNumberForm
          {...verification}
          onSuccess={() => {
            onSuccess?.();
          }}
        />
      )}
    </FieldGroup>
  );
}

export {
  MultiFactorEnrollmentVerifyPhoneNumberForm,
  SmsMfaEnrollmentForm,
  SmsMfaEnrollmentForm as SmsMultiFactorEnrollmentForm,
  type MultiFactorEnrollmentPhoneNumberFormProps,
  type MultiFactorEnrollmentVerifyPhoneNumberFormProps,
  type SmsMfaEnrollmentFormProps,
  type SmsMfaEnrollmentFormProps as SmsMultiFactorEnrollmentFormProps,
};
