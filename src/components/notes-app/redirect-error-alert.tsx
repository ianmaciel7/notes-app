"use client";

import { useRedirectError } from "@firebase-oss/ui-react";
import type { ComponentProps } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";

export interface RedirectErrorAlertProps extends ComponentProps<"div"> {}

export function RedirectErrorAlert({
  className,
  ...props
}: RedirectErrorAlertProps) {
  const error = useRedirectError();

  if (!error) {
    return null;
  }

  return (
    <Alert
      {...props}
      className={cn(className)}
      role="alert"
      variant="destructive"
    >
      <AlertDescription>{error}</AlertDescription>
    </Alert>
  );
}

export {
  RedirectErrorAlert as RedirectError,
  type RedirectErrorAlertProps as RedirectErrorProps,
};
