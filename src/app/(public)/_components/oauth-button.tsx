"use client";

import type { OAuthButtonProps } from "@firebase-oss/ui-react";
import { Button } from "@/components/ui/button";
import { useOAuthButton } from "@/hooks/use-oauth-button";

export type { OAuthButtonProps };

export function OAuthButton({
  provider,
  children,
  themed,
  onSignIn,
}: OAuthButtonProps) {
  const { disabled, error, callback } = useOAuthButton(provider, onSignIn);

  return (
    <div>
      <Button
        type="button"
        disabled={disabled}
        onClick={callback}
        data-provider={provider.providerId}
        data-themed={themed}
        className="w-full"
        variant={themed ? "default" : "outline"}
      >
        {children}
      </Button>
      {error && (
        <div className="text-destructive text-left text-sm">{error}</div>
      )}
    </div>
  );
}
