"use client";

import { getTranslation } from "@firebase-oss/ui-core";
import type { ForgotPasswordAuthFormProps } from "@firebase-oss/ui-react";
import Link from "next/link";
import { Controller, FormProvider } from "react-hook-form";
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
      <div className="text-center space-y-4">
        <div className="text-green-600 dark:text-green-400">
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
                <FieldError>{fieldState.error.message}</FieldError>
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
            <FieldError>{form.formState.errors.root.message}</FieldError>
          </Field>
        )}
        {props.onBackToSignInClick ? (
          <Button
            type="button"
            variant="link"
            size="sm"
            onClick={props.onBackToSignInClick}
          >
            <span className="text-xs">
              &larr; {getTranslation(ui, "labels", "backToSignIn")}
            </span>
          </Button>
        ) : (
          <Link
            href="/sign-in"
            className="text-primary text-center text-xs font-medium underline-offset-4 hover:underline"
          >
            &larr; {getTranslation(ui, "labels", "backToSignIn")}
          </Link>
        )}
      </form>
    </FormProvider>
  );
}
