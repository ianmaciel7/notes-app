import type { OAuthButtonProps } from "@firebase-oss/ui-react";
import { useSignInWithProvider, useUI } from "@firebase-oss/ui-react";

export function useOAuthButton(
  provider: OAuthButtonProps["provider"],
  onSignIn: OAuthButtonProps["onSignIn"],
) {
  const ui = useUI();
  const { error, callback } = useSignInWithProvider(provider, onSignIn);

  return { disabled: ui.state !== "idle", error, callback };
}
