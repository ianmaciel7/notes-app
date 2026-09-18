"use client";

import type { SignUpAuthFormSchema } from "@firebase-oss/ui-core";
import { getTranslation } from "@firebase-oss/ui-core";
import {
  type SignUpAuthFormProps,
  useRequireDisplayName,
  useSignUpAuthFormAction,
  useSignUpAuthFormSchema,
  useUI,
} from "@firebase-oss/ui-react";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { AlertCircle } from "lucide-react";
import { Controller, FormProvider, useForm } from "react-hook-form";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useI18n } from "@/hooks/use-i18n";
import { getAuthErrorMessage } from "@/lib/i18n/auth-errors";
import { Policies } from "./policies";

export type { SignUpAuthFormProps };

export function SignUpAuthForm(props: SignUpAuthFormProps) {
  const ui = useUI();
  const { t } = useI18n();
  const schema = useSignUpAuthFormSchema();
  const action = useSignUpAuthFormAction();
  const requireDisplayName = useRequireDisplayName();

  const form = useForm<SignUpAuthFormSchema>({
    resolver: standardSchemaResolver(schema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
      displayName: "",
    },
  });

  async function onSubmit(values: SignUpAuthFormSchema) {
    try {
      const credential = await action(values);
      if (credential) props.onSignUp?.(credential);
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
        {requireDisplayName ? (
          <Controller
            control={form.control}
            name="displayName"
            render={({ field, fieldState }) => {
              const errorId = fieldState.error
                ? "sign-up-displayName-error"
                : undefined;
              return (
                <Field data-invalid={!!fieldState.error}>
                  <FieldLabel htmlFor="displayName">
                    {getTranslation(ui, "labels", "displayName")}
                  </FieldLabel>
                  <Input
                    {...field}
                    id="displayName"
                    type="text"
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
                    <FieldError id="sign-up-displayName-error">
                      {fieldState.error.message}
                    </FieldError>
                  )}
                </Field>
              );
            }}
          />
        ) : null}

        <Controller
          control={form.control}
          name="email"
          render={({ field, fieldState }) => {
            const errorId = fieldState.error
              ? "sign-up-email-error"
              : undefined;
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
                  <FieldError id="sign-up-email-error">
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
            const errorId = fieldState.error
              ? "sign-up-password-error"
              : undefined;
            return (
              <Field data-invalid={!!fieldState.error}>
                <FieldLabel htmlFor="password">
                  {getTranslation(ui, "labels", "password")}
                </FieldLabel>
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
                  <FieldError id="sign-up-password-error">
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
            <AlertCircle className="size-4" />
            <AlertDescription>
              {form.formState.errors.root.message}
            </AlertDescription>
          </Alert>
        )}

        <Button type="submit" disabled={ui.state !== "idle"}>
          {getTranslation(ui, "labels", "signUp")}
        </Button>

        {props.onSignInClick ? (
          <Button
            type="button"
            variant="link"
            size="sm"
            onClick={props.onSignInClick}
          >
            <span className="text-xs">
              {getTranslation(ui, "prompts", "haveAccount")}{" "}
              {getTranslation(ui, "labels", "signIn")}
            </span>
          </Button>
        ) : null}
      </form>
    </FormProvider>
  );
}
