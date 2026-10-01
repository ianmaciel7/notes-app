"use client";

import { getTranslation } from "@firebase-oss/ui-core";
import { GoogleLogo, useUI } from "@firebase-oss/ui-react";
import { useTranslations } from "next-intl";
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
  const t = useTranslations("auth");
  const label =
    customLabel ||
    getTranslation(ui, "labels", "signInWithGoogle") ||
    t("signInWithGoogle");

  return (
    <Button
      data-testid="google-sign-in-btn"
      type="button"
      variant="outline"
      size="lg"
      className={cn("w-full", className)}
      {...props}
    >
      <GoogleLogo data-icon="inline-start" />
      {label}
    </Button>
  );
}
