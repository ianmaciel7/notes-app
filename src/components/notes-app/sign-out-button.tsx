"use client";

import { useTranslations } from "next-intl";
import type { ComponentProps } from "react";
import { Button } from "@/components/ui/button";
import { useSignOutButton } from "@/hooks/use-sign-out-button";

type SignOutButtonProps = ComponentProps<"div">;

export function SignOutButton(props: SignOutButtonProps) {
  const { error, handleSignOut, pending } = useSignOutButton();
  const translate = useTranslations("common");

  return (
    <div {...props} className="flex flex-col gap-2">
      <Button type="button" disabled={pending} onClick={handleSignOut}>
        {translate("signOut")}
      </Button>
      {error && (
        <p role="alert" className="text-destructive text-sm">
          {error}
        </p>
      )}
    </div>
  );
}
