"use client";

import { getTranslation } from "@firebase-oss/ui-core";
import { GoogleLogo, useUI } from "@firebase-oss/ui-react";
import type { ComponentProps } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface GoogleSignInButtonProps
  extends Omit<ComponentProps<typeof Button>, "children"> {
  label?: string;
}

export function GoogleSignInButton({
  label: customLabel,
  className,
  ...props
}: GoogleSignInButtonProps) {
  const ui = useUI();
  const label =
    customLabel ||
    getTranslation(ui, "labels", "signInWithGoogle") ||
    "Sign in with Google";

  return (
    <Button
      data-testid="google-sign-in-btn"
      type="button"
      variant="outline"
      className={cn(
        "w-full flex items-center justify-center gap-3 font-medium h-10 border-input bg-background hover:bg-accent hover:text-accent-foreground shadow-xs",
        className,
      )}
      {...props}
    >
      <GoogleLogo data-icon="inline-start" />
      {label}
    </Button>
  );
}
