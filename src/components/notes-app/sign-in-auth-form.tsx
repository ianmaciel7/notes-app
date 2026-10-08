"use client";

import { getTranslation } from "@firebase-oss/ui-core";
import type { SignInAuthFormProps } from "@firebase-oss/ui-react";
import Link from "next/link";
import { Controller, FormProvider } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useSignInAuthForm } from "@/hooks/use-sign-in-auth-form";
import { Policies } from "./policies";

export type { SignInAuthFormProps };

export function SignInAuthForm(props: SignInAuthFormProps) {
  const { ui, form, onSubmit } = useSignInAuthForm(props);

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
        <Controller
          control={form.control}
          name="password"
          render={({ field, fieldState }) => (
            <Field data-invalid={!!fieldState.error}>
              <FieldLabel
                htmlFor="password"
                className="flex items-center gap-2"
              >
                <span className="grow">
                  {getTranslation(ui, "labels", "password")}
                </span>
                {props.onForgotPasswordClick ? (
                  <Button
                    type="button"
                    variant="link"
                    onClick={props.onForgotPasswordClick}
                    size="sm"
                  >
                    <span className="text-xs">
                      {getTranslation(ui, "labels", "forgotPassword")}
                    </span>
                  </Button>
                ) : (
                  <Link
                    href="/forgot-password"
                    className="text-primary text-xs font-medium underline-offset-4 hover:underline"
                  >
                    {getTranslation(ui, "labels", "forgotPassword")}
                  </Link>
                )}
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
        <Button type="submit" disabled={ui.state !== "idle"}>
          {getTranslation(ui, "labels", "signIn")}
        </Button>
        {form.formState.errors.root && (
          <Field data-invalid="true">
            <FieldError>{form.formState.errors.root.message}</FieldError>
          </Field>
        )}
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
        ) : (
          <Link
            href="/sign-up"
            className="text-primary text-center text-xs font-medium underline-offset-4 hover:underline"
          >
            {getTranslation(ui, "prompts", "noAccount")}{" "}
            {getTranslation(ui, "labels", "signUp")}
          </Link>
        )}
        <div className="flex justify-center gap-3 text-xs">
          <Link
            href="/email-link"
            className="text-primary font-medium underline-offset-4 hover:underline"
          >
            Sign in with e-mail link
          </Link>
          <Link
            href="/phone"
            className="text-primary font-medium underline-offset-4 hover:underline"
          >
            Sign in with phone
          </Link>
        </div>
      </form>
    </FormProvider>
  );
}
