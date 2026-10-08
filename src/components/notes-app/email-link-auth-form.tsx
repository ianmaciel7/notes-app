"use client";

import { getTranslation } from "@firebase-oss/ui-core";
import type { EmailLinkAuthFormProps } from "@firebase-oss/ui-react";
import { Controller, FormProvider } from "react-hook-form";

import {
  AuthFieldError,
  AuthRootError,
} from "@/components/notes-app/auth-field-error";
import { Policies } from "@/components/notes-app/policies";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useEmailLinkAuthForm } from "@/hooks/use-email-link-auth-form";

export type { EmailLinkAuthFormProps };

export function EmailLinkAuthForm(props: EmailLinkAuthFormProps) {
  const { ui, form, emailSent, onSubmit } = useEmailLinkAuthForm(props);

  if (emailSent) {
    return (
      <Alert>
        <AlertDescription>
          {getTranslation(ui, "messages", "signInLinkSent")}
        </AlertDescription>
      </Alert>
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
          {getTranslation(ui, "labels", "sendSignInLink")}
        </Button>
        {form.formState.errors.root && (
          <Field data-invalid="true">
            <FieldError>
              <AuthRootError />
            </FieldError>
          </Field>
        )}
      </form>
    </FormProvider>
  );
}
