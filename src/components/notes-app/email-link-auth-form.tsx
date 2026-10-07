"use client";

import type { EmailLinkAuthFormSchema } from "@firebase-oss/ui-core";
import { FirebaseUIError, getTranslation } from "@firebase-oss/ui-core";
import {
  type EmailLinkAuthFormProps,
  useEmailLinkAuthFormAction,
  useEmailLinkAuthFormCompleteSignIn,
  useEmailLinkAuthFormSchema,
  useUI,
} from "@firebase-oss/ui-react";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";

import { Policies } from "@/components/notes-app/policies";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export type { EmailLinkAuthFormProps };

export function EmailLinkAuthForm(props: EmailLinkAuthFormProps) {
  const { onEmailSent, onSignIn } = props;
  const ui = useUI();
  const schema = useEmailLinkAuthFormSchema();
  const action = useEmailLinkAuthFormAction();
  const [emailSent, setEmailSent] = useState(false);

  const form = useForm<EmailLinkAuthFormSchema>({
    resolver: standardSchemaResolver(schema),
    mode: "onChange",
    defaultValues: {
      email: "",
    },
  });

  useEmailLinkAuthFormCompleteSignIn(onSignIn);

  async function onSubmit(values: EmailLinkAuthFormSchema) {
    try {
      await action(values);
      setEmailSent(true);
      onEmailSent?.();
    } catch (error) {
      const message =
        error instanceof FirebaseUIError ? error.message : String(error);
      form.setError("root", { message });
    }
  }

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
                <FieldError>{fieldState.error.message}</FieldError>
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
            <FieldError>{form.formState.errors.root.message}</FieldError>
          </Field>
        )}
      </form>
    </FormProvider>
  );
}
