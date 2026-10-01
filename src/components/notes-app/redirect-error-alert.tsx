"use client";

import { useRedirectError } from "@firebase-oss/ui-react";
import type { ComponentProps } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";

type RedirectErrorAlertProps = ComponentProps<"div">;

function RedirectErrorAlert({ className, ...props }: RedirectErrorAlertProps) {
  const error = useRedirectError();

  if (!error) {
    return null;
  }

  return (
    <Alert {...props} className={className} variant="destructive">
      <AlertDescription>{error}</AlertDescription>
    </Alert>
  );
}

export {
  RedirectErrorAlert,
  type RedirectErrorAlertProps,
  RedirectErrorAlert as RedirectError,
  type RedirectErrorAlertProps as RedirectErrorProps,
};
