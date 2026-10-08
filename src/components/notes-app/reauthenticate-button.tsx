"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { useSignOutButton } from "@/hooks/use-sign-out-button";

/** Firebase asks for a fresh sign-in before sensitive account changes. */
export function ReauthenticateButton() {
  const { handleSignOut, pending } = useSignOutButton();
  const translate = useTranslations("auth");

  return (
    <Button
      type="button"
      variant="outline"
      disabled={pending}
      onClick={handleSignOut}
    >
      {translate("reauthenticate")}
    </Button>
  );
}
