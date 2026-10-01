"use client";

import type { SignInAuthFormSchema } from "@firebase-oss/ui-core";
import { FirebaseUIError, getTranslation } from "@firebase-oss/ui-core";
import {
  type SignInAuthFormProps as FirebaseSignInAuthFormProps,
  useSignInAuthFormAction,
  useSignInAuthFormSchema,
  useUI,
} from "@firebase-oss/ui-react";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import type { ComponentProps } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
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

export interface LoginFormProps
  extends Omit<ComponentProps<"form">, "onSubmit">,
    FirebaseSignInAuthFormProps {}

export function LoginForm({
  onSignIn,
  onForgotPasswordClick,
  onSignUpClick,
  className,
  ...props
}: LoginFormProps) {
  const ui = useUI();
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
      if (credential) {
        onSignIn?.(credential);
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
                <div className="flex items-center justify-between gap-2">
                  <FieldLabel htmlFor="password">
                    {getTranslation(ui, "labels", "password")}
                  </FieldLabel>
                  {onForgotPasswordClick ? (
                    <Button
                      type="button"
                      variant="link"
                      size="xs"
                      onClick={onForgotPasswordClick}
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
                />
                {fieldState.error && (
                  <FieldError>{fieldState.error.message}</FieldError>
                )}
              </Field>
            )}
          />
        </FieldGroup>
        {form.formState.errors.root && (
          <FieldError>{form.formState.errors.root.message}</FieldError>
        )}
        <Button
          type="submit"
          disabled={form.formState.isSubmitting}
          className="w-full"
        >
          {getTranslation(ui, "labels", "signIn")}
        </Button>
        <Policies />
        {onSignUpClick ? (
          <div className="text-center">
            <Button
              data-testid="auth-mode-toggle"
              type="button"
              variant="link"
              size="sm"
              onClick={onSignUpClick}
            >
              {getTranslation(ui, "prompts", "noAccount")}{" "}
              {getTranslation(ui, "labels", "signUp")}
            </Button>
          </div>
        ) : null}
      </form>
    </FormProvider>
  );
}

export {
  LoginForm as SignInAuthForm,
  type LoginFormProps as SignInAuthFormProps,
};
