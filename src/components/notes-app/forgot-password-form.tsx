"use client";

import type { ForgotPasswordAuthFormSchema } from "@firebase-oss/ui-core";
import { FirebaseUIError, getTranslation } from "@firebase-oss/ui-core";
import {
  type ForgotPasswordAuthFormProps as FirebaseForgotPasswordAuthFormProps,
  useForgotPasswordAuthFormAction,
  useForgotPasswordAuthFormSchema,
  useUI,
} from "@firebase-oss/ui-react";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { ArrowLeft } from "lucide-react";
import type { ComponentProps } from "react";
import { useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Policies } from "./auth-policies-card";

export interface ForgotPasswordFormProps
  extends Omit<ComponentProps<"form">, "onSubmit">,
    FirebaseForgotPasswordAuthFormProps {}

export function ForgotPasswordForm({
  onPasswordSent,
  onBackToSignInClick,
  className,
  ...props
}: ForgotPasswordFormProps) {
  const ui = useUI();
  const schema = useForgotPasswordAuthFormSchema();
  const action = useForgotPasswordAuthFormAction();
  const [emailSent, setEmailSent] = useState(false);

  const form = useForm<ForgotPasswordAuthFormSchema>({
    resolver: standardSchemaResolver(schema),
    mode: "onChange",
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: ForgotPasswordAuthFormSchema) {
    try {
      await action(values);
      setEmailSent(true);
      onPasswordSent?.();
    } catch (error) {
      const message =
        error instanceof FirebaseUIError ? error.message : String(error);
      form.setError("root", { message });
    }
  }

  if (emailSent) {
    return (
      <Alert>
        <AlertDescription>
          {getTranslation(ui, "messages", "checkEmailForReset")}
        </AlertDescription>
      </Alert>
    );
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
            name="email"
            render={({ field, fieldState }) => (
              <Field data-invalid={!!fieldState.error}>
                <FieldLabel htmlFor="email">
                  {getTranslation(ui, "labels", "emailAddress")}
                </FieldLabel>
                <Input
                  {...field}
                  id="email"
                  type="email"
                  aria-invalid={!!fieldState.error}
                />
                {fieldState.error && (
                  <FieldError>{fieldState.error.message}</FieldError>
                )}
              </Field>
            )}
          />
        </FieldGroup>
        <Policies />
        <Button type="submit" disabled={ui.state !== "idle"}>
          {getTranslation(ui, "labels", "resetPassword")}
        </Button>
        {form.formState.errors.root && (
          <FieldError>{form.formState.errors.root.message}</FieldError>
        )}
        {onBackToSignInClick ? (
          <Button
            type="button"
            variant="link"
            size="sm"
            onClick={onBackToSignInClick}
          >
            <ArrowLeft data-icon="inline-start" aria-hidden="true" />
            {getTranslation(ui, "labels", "backToSignIn")}
          </Button>
        ) : null}
      </form>
    </FormProvider>
  );
}

export {
  ForgotPasswordForm as ForgotPasswordAuthForm,
  type ForgotPasswordFormProps as ForgotPasswordAuthFormProps,
};
