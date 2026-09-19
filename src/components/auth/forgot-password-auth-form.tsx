"use client";

import type { ForgotPasswordAuthFormSchema } from "@firebase-oss/ui-core";
import { getTranslation } from "@firebase-oss/ui-core";
import {
  type ForgotPasswordAuthFormProps,
  useForgotPasswordAuthFormAction,
  useForgotPasswordAuthFormSchema,
  useUI,
} from "@firebase-oss/ui-react";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { AlertCircleIcon, CheckCircle2Icon } from "lucide-react";
import { useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useI18n } from "@/hooks/use-i18n";
import { getAuthErrorMessage } from "@/lib/i18n/auth-errors";

export type { ForgotPasswordAuthFormProps };

export function ForgotPasswordAuthForm(props: ForgotPasswordAuthFormProps) {
  const ui = useUI();
  const { t } = useI18n();
  const schema = useForgotPasswordAuthFormSchema();
  const action = useForgotPasswordAuthFormAction();
  const [isSent, setIsSent] = useState(false);

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
      setIsSent(true);
      props.onPasswordSent?.();
    } catch (error) {
      form.setError("root", { message: getAuthErrorMessage(error, t) });
    }
  }

  if (isSent) {
    return (
      <div className="flex flex-col gap-y-4">
        <Alert className="border-primary/20 bg-primary/5 text-foreground">
          <CheckCircle2Icon className="size-4 text-primary" />
          <AlertDescription>
            {getTranslation(ui, "messages", "passwordResetEmailSent")}
          </AlertDescription>
        </Alert>
        {props.onBackToSignInClick ? (
          <Button
            type="button"
            variant="outline"
            onClick={props.onBackToSignInClick}
          >
            {getTranslation(ui, "labels", "signIn")}
          </Button>
        ) : null}
      </div>
    );
  }

  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-y-4"
      >
        <Controller
          control={form.control}
          name="email"
          render={({ field, fieldState }) => {
            const errorId = fieldState.error ? "forgot-email-error" : undefined;
            return (
              <Field data-invalid={!!fieldState.error}>
                <FieldLabel htmlFor="email">
                  {getTranslation(ui, "labels", "emailAddress")}
                </FieldLabel>
                <Input
                  {...field}
                  id="email"
                  type="email"
                  aria-invalid={!!fieldState.error}
                  aria-describedby={errorId}
                  onChange={(e) => {
                    if (form.formState.errors.root) {
                      form.clearErrors("root");
                    }
                    field.onChange(e);
                  }}
                />
                {fieldState.error && (
                  <FieldError id="forgot-email-error">
                    {fieldState.error.message}
                  </FieldError>
                )}
              </Field>
            );
          }}
        />

        {form.formState.errors.root?.message && (
          <Alert variant="destructive" role="alert">
            <AlertCircleIcon className="size-4" />
            <AlertDescription>
              {form.formState.errors.root.message}
            </AlertDescription>
          </Alert>
        )}

        <Button type="submit" disabled={ui.state !== "idle"}>
          {getTranslation(ui, "labels", "resetPassword")}
        </Button>

        {props.onBackToSignInClick ? (
          <Button
            type="button"
            variant="link"
            size="sm"
            onClick={props.onBackToSignInClick}
          >
            <span className="text-xs">
              {getTranslation(ui, "labels", "backToSignIn")}
            </span>
          </Button>
        ) : null}
      </form>
    </FormProvider>
  );
}
