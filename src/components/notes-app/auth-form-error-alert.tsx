"use client";

import type { ComponentProps } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";

type AuthFormErrorAlertProps = Omit<
  ComponentProps<typeof Alert>,
  "children"
> & {
  message?: string;
};

function AuthFormErrorAlert({ message, ...props }: AuthFormErrorAlertProps) {
  if (!message) return null;

  return (
    <Alert variant="destructive" {...props}>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
}

export { AuthFormErrorAlert, type AuthFormErrorAlertProps };
