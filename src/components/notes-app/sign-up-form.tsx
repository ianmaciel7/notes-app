"use client";

import type { SignUpAuthFormSchema } from "@firebase-oss/ui-core";
import { FirebaseUIError, getTranslation } from "@firebase-oss/ui-core";
import {
  type SignUpAuthFormProps as FirebaseSignUpAuthFormProps,
  useRequireDisplayName,
  useSignUpAuthFormAction,
  useSignUpAuthFormSchema,
  useUI,
} from "@firebase-oss/ui-react";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
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
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import { Policies } from "./auth-policies-card";

export interface SignUpFormProps
  extends Omit<ComponentProps<"form">, "onSubmit">,
    FirebaseSignUpAuthFormProps {}

export function SignUpForm({
  onSignUp,
  onSignInClick,
  className,
  ...props
}: SignUpFormProps) {
  const ui = useUI();
  const schema = useSignUpAuthFormSchema();
  const action = useSignUpAuthFormAction();
  const requireDisplayName = useRequireDisplayName();

  const form = useForm<SignUpAuthFormSchema>({
    resolver: standardSchemaResolver(schema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
      displayName: requireDisplayName ? "" : undefined,
    },
  });

  async function onSubmit(values: SignUpAuthFormSchema) {
    try {
      const credential = await action(values);
      if (credential) {
        onSignUp?.(credential);
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
        className={cn(className)}
      >
        <FieldGroup>
          {requireDisplayName ? (
            <Controller
              control={form.control}
              name="displayName"
              render={({ field, fieldState }) => (
                <Field data-invalid={!!fieldState.error}>
                  <FieldLabel htmlFor="displayName">
                    {getTranslation(ui, "labels", "displayName")}
                  </FieldLabel>
                  <Input
                    {...field}
                    id="displayName"
                    aria-invalid={!!fieldState.error}
                  />
                  {fieldState.error && (
                    <FieldError>{fieldState.error.message}</FieldError>
                  )}
                </Field>
              )}
            />
          ) : null}
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
          <Controller
            control={form.control}
            name="password"
            render={({ field, fieldState }) => (
              <Field data-invalid={!!fieldState.error}>
                <FieldLabel htmlFor="password">
                  {getTranslation(ui, "labels", "password")}
                </FieldLabel>
                <Input
                  {...field}
                  id="password"
                  type="password"
                  aria-invalid={!!fieldState.error}
                />
                {fieldState.error && (
                  <FieldError>{fieldState.error.message}</FieldError>
                )}
              </Field>
            )}
          />
          <Policies />
          <Field>
            <Button
              type="submit"
              disabled={ui.state !== "idle"}
              className="w-full"
            >
              {ui.state !== "idle" && <Spinner data-icon="inline-start" />}
              {getTranslation(ui, "labels", "createAccount")}
            </Button>
          </Field>
          {form.formState.errors.root && (
            <Alert variant="destructive">
              <AlertDescription>
                {form.formState.errors.root.message}
              </AlertDescription>
            </Alert>
          )}
          {onSignInClick ? (
            <Field>
              <Button
                data-testid="auth-mode-toggle"
                type="button"
                variant="link"
                size="sm"
                onClick={onSignInClick}
              >
                {getTranslation(ui, "prompts", "haveAccount")}{" "}
                {getTranslation(ui, "labels", "signIn")}
              </Button>
            </Field>
          ) : null}
        </FieldGroup>
      </form>
    </FormProvider>
  );
}

export {
  SignUpForm as SignUpAuthForm,
  type SignUpFormProps as SignUpAuthFormProps,
};
