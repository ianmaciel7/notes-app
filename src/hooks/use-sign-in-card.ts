import { useOnUserAuthenticated, useUI } from "@firebase-oss/ui-react";
import type { User } from "firebase/auth";
import { useTranslations } from "next-intl";

export function useSignInCard(onSignIn: ((user: User) => void) | undefined) {
  const ui = useUI();
  const translate = useTranslations("auth");

  useOnUserAuthenticated(onSignIn);

  return {
    titleText: translate("signIn"),
    subtitleText: translate("signInSubtitle"),
    hasMultiFactorResolver: !!ui.multiFactorResolver,
  };
}
