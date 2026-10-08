"use client";

import { Button } from "@/components/ui/button";
import { useSignOutButton } from "@/hooks/use-sign-out-button";

export function SignOutButton() {
  const { error, handleSignOut, pending } = useSignOutButton();

  return (
    <div className="flex flex-col gap-2">
      <Button type="button" disabled={pending} onClick={handleSignOut}>
        Sign out
      </Button>
      {error && (
        <p role="alert" className="text-destructive text-sm">
          {error}
        </p>
      )}
    </div>
  );
}
