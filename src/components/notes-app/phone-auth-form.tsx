"use client";

import {
  FirebaseUIError,
  formatPhoneNumber,
  getTranslation,
  type PhoneAuthNumberFormSchema,
  type PhoneAuthVerifyFormSchema,
} from "@firebase-oss/ui-core";
import {
  type PhoneAuthFormProps as FirebasePhoneAuthFormProps,
  usePhoneAuthNumberFormSchema,
  usePhoneAuthVerifyFormSchema,
  usePhoneNumberFormAction,
  useRecaptchaVerifier,
  useUI,
  useVerifyPhoneNumberFormAction,
} from "@firebase-oss/ui-react";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import type { UserCredential } from "firebase/auth";
import type { ComponentProps } from "react";
import { useRef, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { Policies } from "@/components/notes-app/auth-policies-card";
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

export interface VerifyPhoneNumberFormProps
  extends Omit<ComponentProps<"form">, "onSubmit"> {
  verificationId: string;
  onSuccess: (credential: UserCredential) => void;
}

function VerifyPhoneNumberForm({
  verificationId,
  onSuccess,
  className,
  ...props
}: VerifyPhoneNumberFormProps) {
  const ui = useUI();
  const schema = usePhoneAuthVerifyFormSchema();
  const action = useVerifyPhoneNumberFormAction();

  const form = useForm<PhoneAuthVerifyFormSchema>({
    resolver: standardSchemaResolver(schema),
    mode: "onChange",
    defaultValues: {
      verificationId,
      verificationCode: "",
    },
  });

  async function onSubmit(values: PhoneAuthVerifyFormSchema) {
    try {
      const credential = await action(values);
      if (credential) {
        onSuccess(credential);
      }
    } catch (error) {
      const message =
        error instanceof FirebaseUIError ? error.message : String(error);
      form.setError("root", { message });
    }
  }

  return (
    <FormProvider {...form}>
      <form
        {...props}
        onSubmit={(event) => {
          event.preventDefault();
          void form.handleSubmit(onSubmit)(event);
        }}
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

export interface PhoneNumberFormProps
  extends Omit<ComponentProps<"form">, "onSubmit"> {
  onSubmit: (verificationId: string) => void;
}

function PhoneNumberForm({
  onSubmit: onVerificationSuccess,
  className,
  ...props
}: PhoneNumberFormProps) {
  const ui = useUI();
  const recaptchaContainerRef = useRef<HTMLDivElement>(null);
  const recaptchaVerifier = useRecaptchaVerifier(recaptchaContainerRef);
  const countrySelector = useRef<CountrySelectorRef>(null);
  const action = usePhoneNumberFormAction();
  const schema = usePhoneAuthNumberFormSchema();

  const form = useForm<PhoneAuthNumberFormSchema>({
    resolver: standardSchemaResolver(schema),
    mode: "onChange",
    defaultValues: {
      phoneNumber: "",
    },
  });

  async function onSubmit(values: PhoneAuthNumberFormSchema) {
    try {
      const countrySelectorInstance = countrySelector.current;
      const verifier = recaptchaVerifier;
      if (!countrySelectorInstance || !verifier) {
        form.setError("root", {
          message: getTranslation(ui, "errors", "unknownError"),
        });
        return;
      }
      const formatted = formatPhoneNumber(
        values.phoneNumber,
        countrySelectorInstance.getCountry(),
      );
      const verificationId = await action({
        phoneNumber: formatted,
        recaptchaVerifier: verifier,
      });
      onVerificationSuccess(verificationId);
    } catch (error) {
      const message =
        error instanceof FirebaseUIError ? error.message : String(error);
      form.setError("root", { message });
    }
  }

  return (
    <FormProvider {...form}>
      <form
        {...props}
        onSubmit={(event) => {
          event.preventDefault();
          void form.handleSubmit(onSubmit)(event);
        }}
        className={cn("flex flex-col gap-4", className)}
      >
        <FieldGroup>
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
          <div ref={recaptchaContainerRef} />
          <Policies />
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

export interface PhoneAuthFormProps extends FirebasePhoneAuthFormProps {}

export function PhoneAuthForm(props: PhoneAuthFormProps) {
  const [verificationId, setVerificationId] = useState<string | null>(null);

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
