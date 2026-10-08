"use client";

import { useRedirectErrorMessage } from "@/hooks/use-redirect-error-message";

export function RedirectError() {
  const error = useRedirectErrorMessage();

  if (!error) {
    return null;
  }

  return <div className="text-sm text-destructive">{error}</div>;
}
