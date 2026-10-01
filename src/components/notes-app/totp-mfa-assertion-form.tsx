"use client";

import { FirebaseUIError, getTranslation } from "@firebase-oss/ui-core";
import {
  useMultiFactorTotpAuthVerifyFormSchema,
  useTotpMultiFactorAssertionFormAction,
  useUI,
} from "@firebase-oss/ui-react";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import type { MultiFactorInfo, UserCredential } from "firebase/auth";
import type { ComponentProps } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

type TotpMfaAssertionFormProps = ComponentProps<"div"> & {
  hint: MultiFactorInfo;
  onSuccess?: (credential: UserCredential) => void;
};

function TotpMfaAssertionForm({
  hint,
  onSuccess,
  className,
  ...props
}: TotpMfaAssertionFormProps) {
  const ui = useUI();
  const schema = useMultiFactorTotpAuthVerifyFormSchema();
  const action = useTotpMultiFactorAssertionFormAction();

  const form = useForm<{ verificationCode: string }>({
    resolver: standardSchemaResolver(schema),
    mode: "onChange",
    defaultValues: {
      verificationCode: "",
    },
  });

  const onSubmit = async (values: { verificationCode: string }) => {
    try {
      const credential = await action({
        verificationCode: values.verificationCode,
        hint,
      });
      onSuccess?.(credential);
    } catch (error) {
      const message =
        error instanceof FirebaseUIError ? error.message : String(error);
      form.setError("root", { message });
    }
  };

  return (
    <div className={cn(className)} {...props}>
      <FormProvider {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
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
    </div>
  );
}

export {
  TotpMfaAssertionForm,
  TotpMfaAssertionForm as TotpMultiFactorAssertionForm,
  type TotpMfaAssertionFormProps,
  type TotpMfaAssertionFormProps as TotpMultiFactorAssertionFormProps,
};
