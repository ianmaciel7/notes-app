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
import { AuthFormErrorAlert } from "@/components/notes-app/auth-form-error-alert";
import { Policies } from "@/components/notes-app/auth-policies-description";
import { AuthSubmitButton } from "@/components/notes-app/auth-submit-button";
import {
  CountrySelect,
  type CountrySelectorRef,
} from "@/components/notes-app/country-select";
import { VerificationCodeInput } from "@/components/notes-app/verification-code-input";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { cn } from "@/lib/utils";

type VerifyPhoneNumberFormProps = Omit<ComponentProps<"form">, "onSubmit"> & {
  verificationId: string;
  onSuccess: (credential: UserCredential) => void;
};

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
        data-slot="verify-phone-number-form"
        onSubmit={(event) => {
          event.preventDefault();
          void form.handleSubmit(onSubmit)(event);
        }}
        className={cn("flex flex-col gap-4", className)}
        {...props}
      >
        <FieldGroup>
          <VerificationCodeInput
            label={getTranslation(ui, "labels", "verificationCode")}
            description={getTranslation(ui, "prompts", "smsVerificationPrompt")}
          />
          <AuthSubmitButton type="submit" busy={ui.state !== "idle"}>
            {getTranslation(ui, "labels", "verifyCode")}
          </AuthSubmitButton>
          <AuthFormErrorAlert message={form.formState.errors.root?.message} />
        </FieldGroup>
      </form>
    </FormProvider>
  );
}

type PhoneNumberFormProps = Omit<ComponentProps<"form">, "onSubmit"> & {
  onSubmit: (verificationId: string) => void;
};

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
        data-slot="phone-number-form"
        onSubmit={(event) => {
          event.preventDefault();
          void form.handleSubmit(onSubmit)(event);
        }}
        className={cn("flex flex-col gap-4", className)}
        {...props}
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
          <AuthSubmitButton type="submit" busy={ui.state !== "idle"}>
            {getTranslation(ui, "labels", "sendCode")}
          </AuthSubmitButton>
          <AuthFormErrorAlert message={form.formState.errors.root?.message} />
        </FieldGroup>
      </form>
    </FormProvider>
  );
}

type PhoneAuthFormProps = FirebasePhoneAuthFormProps;

function PhoneAuthForm(props: PhoneAuthFormProps) {
  const [verificationId, setVerificationId] = useState<string | null>(null);

  if (!verificationId) {
    return (
      <PhoneNumberForm
        data-slot="phone-auth-form"
        onSubmit={setVerificationId}
      />
    );
  }

  return (
    <VerifyPhoneNumberForm
      data-slot="phone-auth-form"
      verificationId={verificationId}
      onSuccess={(credential) => {
        props.onSignIn?.(credential);
      }}
    />
  );
}

export {
  PhoneAuthForm,
  type PhoneAuthFormProps,
  type PhoneNumberFormProps,
  type VerifyPhoneNumberFormProps,
};
