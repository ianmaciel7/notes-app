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
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Policies } from "./policies";

export interface SignUpAuthFormProps
  extends Omit<ComponentProps<"form">, "onSubmit">,
    FirebaseSignUpAuthFormProps {}

export function SignUpAuthForm({
  onSignUp,
  onSignInClick,
  className,
  ...props
}: SignUpAuthFormProps) {
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
        className={cn("flex flex-col gap-y-4", className)}
      >
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
        <Button
          type="submit"
          disabled={ui.state !== "idle"}
          className="w-full h-10 font-medium text-sm shadow-xs"
        >
          {getTranslation(ui, "labels", "createAccount")}
        </Button>
        {form.formState.errors.root && (
          <FieldError>{form.formState.errors.root.message}</FieldError>
        )}
        {onSignInClick ? (
          <Button
            type="button"
            variant="link"
            size="sm"
            onClick={onSignInClick}
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
