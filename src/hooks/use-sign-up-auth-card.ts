import { useOnUserAuthenticated, useUI } from "@firebase-oss/ui-react";
import type { User } from "firebase/auth";
import { useCallback, useRef } from "react";

export function useSignUpAuthCard(
  onSignUp: ((user: User) => void) | undefined,
  hasChildren: boolean,
) {
  const ui = useUI();
  const handledUserIdRef = useRef<string | null>(null);

  const handleSignUp = useCallback(
    (user: User) => {
      if (handledUserIdRef.current === user.uid) {
        return;
      }

      handledUserIdRef.current = user.uid;
      onSignUp?.(user);
    },
    [onSignUp],
  );

  // Mirror the React package behavior: the built-in form reports success from the
  // resolved credential, while auth-state remains the fallback for child actions and MFA.
  useOnUserAuthenticated(
    hasChildren || ui.multiFactorResolver ? handleSignUp : undefined,
  );

  return { ui, handleSignUp };
}
