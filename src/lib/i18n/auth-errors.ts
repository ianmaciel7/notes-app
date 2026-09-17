import { messages } from "@/lib/i18n/messages";
import type { Locale } from "@/lib/i18n/types";

const errorCodeMap: Record<
  string,
  keyof typeof messages.en.errors.auth | "network"
> = {
  "auth/invalid-credential": "invalidCredentials",
  "auth/wrong-password": "invalidCredentials",
  "auth/user-not-found": "invalidCredentials",
  "auth/invalid-email": "invalidCredentials",
  "auth/email-already-in-use": "emailAlreadyInUse",
  "auth/user-disabled": "accountDisabled",
  "auth/too-many-requests": "tooManyRequests",
  "auth/operation-not-allowed": "operationNotAllowed",
  "auth/requires-recent-login": "requiresRecentLogin",
  "auth/invalid-verification-code": "invalidCredentials",
  "auth/code-expired": "sessionExpired",
  "auth/session-expired": "sessionExpired",
  "auth/network-request-failed": "network",
};

export function getAuthErrorMessage(
  error: unknown,
  locale: Locale = "en",
): string {
  const dictionary = messages[locale] ?? messages.en;

  if (typeof error === "object" && error !== null) {
    const candidateCode =
      "code" in error && typeof (error as { code: unknown }).code === "string"
        ? (error as { code: string }).code
        : undefined;

    if (candidateCode && candidateCode in errorCodeMap) {
      const mappedKey = errorCodeMap[candidateCode];
      if (mappedKey === "network") {
        return dictionary.errors.generic.network;
      }
      return dictionary.errors.auth[mappedKey];
    }
  }

  return dictionary.errors.auth.unknown;
}
