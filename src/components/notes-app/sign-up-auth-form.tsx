"use client";

import { getTranslation } from "@firebase-oss/ui-core";
import type { SignUpAuthFormProps } from "@firebase-oss/ui-react";
import Link from "next/link";
import { Controller, FormProvider } from "react-hook-form";
import {
  AuthFieldError,
  AuthRootError,
} from "@/components/notes-app/auth-field-error";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useSignUpAuthForm } from "@/hooks/use-sign-up-auth-form";
import { Policies } from "./policies";

export type { SignUpAuthFormProps };

export function SignUpAuthForm(props: SignUpAuthFormProps) {
  const { ui, form, requireDisplayName, onSubmit } = useSignUpAuthForm(props);

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
                  <FieldError>
                    <AuthFieldError field="displayName" />
                  </FieldError>
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
                <FieldError>
                  <AuthFieldError field="email" />
                </FieldError>
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
                <FieldError>
                  <AuthFieldError field="password" />
                </FieldError>
              )}
            </Field>
          )}
        />
        <Policies />
        <Button type="submit" disabled={ui.state !== "idle"}>
          {getTranslation(ui, "labels", "createAccount")}
        </Button>
        {form.formState.errors.root && (
          <Field data-invalid="true">
            <FieldError>
              <AuthRootError />
            </FieldError>
          </Field>
        )}
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
        ) : (
          <Link
            href="/sign-in"
            className="text-primary text-center text-xs font-medium underline-offset-4 hover:underline"
          >
            {getTranslation(ui, "prompts", "haveAccount")}{" "}
            {getTranslation(ui, "labels", "signIn")}
          </Link>
        )}
      </form>
    </FormProvider>
  );
}
