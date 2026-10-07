"use client";

import {
  FirebaseUIError,
  formatPhoneNumber,
  getTranslation,
  type PhoneAuthNumberFormSchema,
  type PhoneAuthVerifyFormSchema,
} from "@firebase-oss/ui-core";
import {
  type PhoneAuthFormProps,
  useDefaultCountry,
  usePhoneAuthNumberFormSchema,
  usePhoneAuthVerifyFormSchema,
  usePhoneNumberFormAction,
  useRecaptchaVerifier,
  useUI,
  useVerifyPhoneNumberFormAction,
} from "@firebase-oss/ui-react";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import type { UserCredential } from "firebase/auth";
import { useRef, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import {
  CountrySelector,
  type CountrySelectorRef,
} from "@/components/notes-app/country-selector";
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

type VerifyPhoneNumberFormProps = {
  verificationId: string;
  onSuccess: (credential: UserCredential) => void;
};

function VerifyPhoneNumberForm(props: VerifyPhoneNumberFormProps) {
  const ui = useUI();
  const schema = usePhoneAuthVerifyFormSchema();
  const action = useVerifyPhoneNumberFormAction();

  const form = useForm<PhoneAuthVerifyFormSchema>({
    resolver: standardSchemaResolver(schema),
    mode: "onChange",
    defaultValues: {
      verificationId: props.verificationId,
      verificationCode: "",
    },
  });

  async function onSubmit(values: PhoneAuthVerifyFormSchema) {
    try {
      const credential = await action(values);
      if (credential) props.onSuccess(credential);
    } catch (error) {
      const message =
        error instanceof FirebaseUIError ? error.message : String(error);
      form.setError("root", { message });
    }
  }

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

type PhoneNumberFormProps = {
  onSubmit: (verificationId: string) => void;
};

function PhoneNumberForm(props: PhoneNumberFormProps) {
  const ui = useUI();
  const recaptchaContainerRef = useRef<HTMLDivElement>(null);
  const recaptchaVerifier = useRecaptchaVerifier(recaptchaContainerRef);
  const countrySelector = useRef<CountrySelectorRef>(null);
  const defaultCountry = useDefaultCountry();
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
      const formatted = formatPhoneNumber(
        values.phoneNumber,
        countrySelector.current?.getCountry() ?? defaultCountry,
      );
      const verificationId = await action({
        phoneNumber: formatted,
        recaptchaVerifier: recaptchaVerifier!,
      });
      props.onSubmit(verificationId);
    } catch (error) {
      const message =
        error instanceof FirebaseUIError ? error.message : String(error);
      form.setError("root", { message });
    }
  }

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
        <Button type="submit" disabled={ui.state !== "idle"}>
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
