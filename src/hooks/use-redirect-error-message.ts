import { useRedirectError } from "@firebase-oss/ui-react";
import { useTranslations } from "next-intl";

export function useRedirectErrorMessage() {
  const error = useRedirectError();
  const translate = useTranslations("auth");

  // The provider error is never rendered verbatim; application-owned
  // feedback comes from the currently selected message catalog.
  return error ? translate("redirectFailed") : null;
}
