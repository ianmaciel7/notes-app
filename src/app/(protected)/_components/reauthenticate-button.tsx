"use client";

import { useTranslations } from "next-intl";
import type { ComponentProps } from "react";
import { Button } from "@/components/ui/button";
import { useSignOutButton } from "@/hooks/use-sign-out-button";

/** Firebase asks for a fresh sign-in before sensitive account changes. */
type ReauthenticateButtonProps = ComponentProps<typeof Button>;

export function ReauthenticateButton(props: ReauthenticateButtonProps) {
  const { handleSignOut, pending } = useSignOutButton();
  const translate = useTranslations("auth");

  return (
    <Button
      {...props}
      type="button"
      variant="outline"
      disabled={pending}
      onClick={handleSignOut}
    >
      {translate("reauthenticate")}
    </Button>
  );
}
