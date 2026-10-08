import { useOnUserAuthenticated, useUI } from "@firebase-oss/ui-react";
import type { User } from "firebase/auth";
import { useTranslation } from "@/hooks/use-translation";

export function useSignInCard(onSignIn: ((user: User) => void) | undefined) {
  const ui = useUI();
  const translate = useTranslation();

  useOnUserAuthenticated(onSignIn);

  return {
    titleText: translate("labels", "signIn"),
    subtitleText: translate("prompts", "signInToAccount"),
    hasMultiFactorResolver: !!ui.multiFactorResolver,
  };
}
