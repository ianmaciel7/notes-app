"use client";

import { FirebaseUIError, getTranslation } from "@firebase-oss/ui-core";
import {
  useMultiFactorPhoneAuthVerifyFormSchema,
  useRecaptchaVerifier,
  useSmsMultiFactorAssertionPhoneFormAction,
  useSmsMultiFactorAssertionVerifyFormAction,
  useUI,
} from "@firebase-oss/ui-react";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import type { MultiFactorInfo, UserCredential } from "firebase/auth";
import { useRef, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { cn } from "@/lib/utils";

type PhoneMultiFactorInfo = MultiFactorInfo & {
  phoneNumber?: string;
};

export type SmsMultiFactorAssertionPhoneFormProps = Omit<
  React.ComponentProps<"div">,
  "onSubmit"
> & {
  hint: MultiFactorInfo;
  onSubmit: (verificationId: string) => void;
};

function SmsMultiFactorAssertionPhoneForm({
  hint,
  onSubmit: onSubmitProp,
  className,
  ...props
}: SmsMultiFactorAssertionPhoneFormProps) {
  const ui = useUI();
  const recaptchaContainerRef = useRef<HTMLDivElement>(null);
  const recaptchaVerifier = useRecaptchaVerifier(recaptchaContainerRef);
  const action = useSmsMultiFactorAssertionPhoneFormAction();
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async () => {
    try {
      setError(null);
      const verifier = recaptchaVerifier;
      if (!verifier) {
        setError(getTranslation(ui, "errors", "unknownError"));
        return;
      }
      const verificationId = await action({
        hint,
        recaptchaVerifier: verifier,
      });
      onSubmitProp(verificationId);
    } catch (error) {
      const message =
        error instanceof FirebaseUIError ? error.message : String(error);
      setError(message);
    }
  };

  return (
    <div className={cn("flex flex-col gap-4", className)} {...props}>
      <Field>
        <FieldLabel>{getTranslation(ui, "labels", "phoneNumber")}</FieldLabel>
        <FieldDescription>
          {getTranslation(ui, "messages", "mfaSmsAssertionPrompt", {
            phoneNumber: (hint as PhoneMultiFactorInfo).phoneNumber || "",
          })}
        </FieldDescription>
      </Field>
      <div className="fui-recaptcha-container" ref={recaptchaContainerRef} />
      <Button onClick={onSubmit} disabled={ui.state !== "idle"}>
        {getTranslation(ui, "labels", "sendCode")}
      </Button>
      {error && <FieldError>{error}</FieldError>}
    </div>
  );
}

export type SmsMultiFactorAssertionVerifyFormProps = Omit<
  React.ComponentProps<"form">,
  "onSubmit"
> & {
  verificationId: string;
  onSuccess: (credential: UserCredential) => void;
};

function SmsMultiFactorAssertionVerifyForm({
  verificationId,
  onSuccess,
  className,
  ...props
}: SmsMultiFactorAssertionVerifyFormProps) {
  const ui = useUI();
  const schema = useMultiFactorPhoneAuthVerifyFormSchema();
  const action = useSmsMultiFactorAssertionVerifyFormAction();

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
      const credential = await action({
        verificationId: values.verificationId,
        verificationCode: values.verificationCode,
      });
      onSuccess(credential);
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
            {getTranslation(ui, "labels", "verifyCode")}
          </Button>
          {form.formState.errors.root && (
            <FieldError>{form.formState.errors.root.message}</FieldError>
          )}
        </FieldGroup>
      </form>
    </FormProvider>
  );
}

export type SmsMfaAssertionFormProps = React.ComponentProps<"div"> & {
  hint: MultiFactorInfo;
  onSuccess?: (credential: UserCredential) => void;
};

export function SmsMfaAssertionForm({
  hint,
  onSuccess,
  className,
  ...props
}: SmsMfaAssertionFormProps) {
  const [verification, setVerification] = useState<{
    verificationId: string;
  } | null>(null);

  return (
    <div className={cn(className)} {...props}>
      {!verification ? (
        <SmsMultiFactorAssertionPhoneForm
          hint={hint}
          onSubmit={(verificationId) => setVerification({ verificationId })}
        />
      ) : (
        <SmsMultiFactorAssertionVerifyForm
          verificationId={verification.verificationId}
          onSuccess={(credential) => {
            onSuccess?.(credential);
          }}
        />
      )}
    </div>
  );
}

export {
  SmsMfaAssertionForm as SmsMultiFactorAssertionForm,
  type SmsMfaAssertionFormProps as SmsMultiFactorAssertionFormProps,
};
