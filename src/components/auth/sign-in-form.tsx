"use client";

import type { SignInAuthFormSchema } from "@firebase-oss/ui-core";
import { getTranslation } from "@firebase-oss/ui-core";
import {
  type SignInAuthFormProps,
  useSignInAuthFormAction,
  useSignInAuthFormSchema,
  useUI,
} from "@firebase-oss/ui-react";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { AlertCircleIcon } from "lucide-react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useI18n } from "@/hooks/use-i18n";
import { getAuthErrorMessage } from "@/lib/i18n/auth-errors";
import { Policies } from "./policies";

export type SignInFormProps = SignInAuthFormProps;

export function SignInForm(props: SignInFormProps) {
  const ui = useUI();
  const { t } = useI18n();
  const schema = useSignInAuthFormSchema();
  const action = useSignInAuthFormAction();

  const form = useForm<SignInAuthFormSchema>({
    resolver: standardSchemaResolver(schema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: SignInAuthFormSchema) {
    try {
      const credential = await action(values);
      if (credential) props.onSignIn?.(credential);
    } catch (error) {
      form.setError("root", { message: getAuthErrorMessage(error, t) });
    }
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
            const errorId = fieldState.error ? "email-error" : undefined;
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
                  <FieldError id="email-error">
                    {fieldState.error.message}
                  </FieldError>
                )}
              </Field>
            );
          }}
        />
        <Controller
          control={form.control}
          name="password"
          render={({ field, fieldState }) => {
            const errorId = fieldState.error ? "password-error" : undefined;
            return (
              <Field data-invalid={!!fieldState.error}>
                <div className="flex items-center justify-between">
                  <FieldLabel htmlFor="password">
                    {getTranslation(ui, "labels", "password")}
                  </FieldLabel>
                  {props.onForgotPasswordClick ? (
                    <Button
                      type="button"
                      variant="link"
                      onClick={props.onForgotPasswordClick}
                      size="sm"
                      className="h-auto p-0 text-xs font-normal"
                    >
                      {getTranslation(ui, "labels", "forgotPassword")}
                    </Button>
                  ) : null}
                </div>
                <Input
                  {...field}
                  id="password"
                  type="password"
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
                  <FieldError id="password-error">
                    {fieldState.error.message}
                  </FieldError>
                )}
              </Field>
            );
          }}
        />
        <Policies />
        {form.formState.errors.root?.message && (
          <Alert variant="destructive" role="alert">
            <AlertCircleIcon className="size-4" />
            <AlertDescription>
              {form.formState.errors.root.message}
            </AlertDescription>
          </Alert>
        )}
        <Button type="submit" disabled={ui.state !== "idle"}>
          {getTranslation(ui, "labels", "signIn")}
        </Button>
        {props.onSignUpClick ? (
          <Button
            type="button"
            variant="link"
            size="sm"
            onClick={props.onSignUpClick}
          >
            <span className="text-xs">
              {getTranslation(ui, "prompts", "noAccount")}{" "}
              {getTranslation(ui, "labels", "signUp")}
            </span>
          </Button>
        ) : null}
      </form>
    </FormProvider>
  );
}
