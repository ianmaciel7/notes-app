"use client";

import { getTranslation } from "@firebase-oss/ui-core";
import type { ForgotPasswordAuthFormProps } from "@firebase-oss/ui-react";
import Link from "next/link";
import { Controller, FormProvider } from "react-hook-form";
import {
  AuthFieldError,
  AuthRootError,
} from "@/app/_components/auth-field-error";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useForgotPasswordAuthForm } from "@/hooks/use-forgot-password-auth-form";
import { Policies } from "./policies";

export type { ForgotPasswordAuthFormProps };

export function ForgotPasswordAuthForm(props: ForgotPasswordAuthFormProps) {
  const { ui, form, emailSent, onSubmit } = useForgotPasswordAuthForm(props);

  if (emailSent) {
    return (
      <div className="flex flex-col gap-4 text-center">
        <div className="text-success">
          {getTranslation(ui, "messages", "checkEmailForReset")}
        </div>
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
        <Policies />
        <Button type="submit" disabled={ui.state !== "idle"}>
          {getTranslation(ui, "labels", "resetPassword")}
        </Button>
        {form.formState.errors.root && (
          <Field data-invalid="true">
            <FieldError>
              <AuthRootError />
            </FieldError>
          </Field>
        )}
        {props.onBackToSignInClick ? (
          <Button
            type="button"
            variant="link"
            size="sm"
            onClick={props.onBackToSignInClick}
          >
            <span className="text-sm">
              &larr; {getTranslation(ui, "labels", "backToSignIn")}
            </span>
          </Button>
        ) : (
          <Link
            href="/sign-in"
            className="text-primary text-center text-sm font-medium underline-offset-4 hover:underline"
          >
            &larr; {getTranslation(ui, "labels", "backToSignIn")}
          </Link>
        )}
      </form>
    </FormProvider>
  );
}
