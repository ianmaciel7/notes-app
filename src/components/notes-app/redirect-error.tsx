"use client";

import type { ComponentProps } from "react";
import { useRedirectErrorMessage } from "@/hooks/use-redirect-error-message";

type RedirectErrorProps = ComponentProps<"div">;

export function RedirectError(props: RedirectErrorProps) {
  const error = useRedirectErrorMessage();

  if (!error) {
    return null;
  }

  return (
    <div {...props} className="text-sm text-destructive">
      {error}
    </div>
  );
}
