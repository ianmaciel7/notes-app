import { useUI } from "@firebase-oss/ui-react";

export function useAuthenticatedUserGuard() {
  const ui = useUI();

  if (!ui.auth.currentUser) {
    throw new Error(
      "User must be authenticated to enroll with multi-factor authentication",
    );
  }
}
