"use client";

import { useRedirectError } from "@firebase-oss/ui-react";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export interface RedirectErrorProps extends ComponentProps<"div"> {}

export function RedirectError({ className, ...props }: RedirectErrorProps) {
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
