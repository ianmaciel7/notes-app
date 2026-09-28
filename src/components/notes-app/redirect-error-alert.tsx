"use client";

import { useRedirectError } from "@firebase-oss/ui-react";
import type { ComponentProps } from "react";
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
    <div className={cn("text-sm text-destructive", className)} {...props}>
      {error}
    </div>
  );
}

export {
  RedirectErrorAlert as RedirectError,
  type RedirectErrorAlertProps as RedirectErrorProps,
};
