import en from "@/lib/i18n/dictionaries/en.json";
import ptBR from "@/lib/i18n/dictionaries/pt-BR.json";
import {
  type AppMessages,
  hasLocale,
  type Locale,
  type MessageKey,
} from "@/lib/i18n/types";

const dictionaries: Record<Locale, AppMessages> = {
  en,
  "pt-BR": ptBR,
};

function getMessageFromDictionary(
  dictionary: AppMessages,
  key: MessageKey,
): string {
  const parts = key.split(".");
  let current: unknown = dictionary;
  for (const part of parts) {
    if (current && typeof current === "object" && part in current) {
      current = (current as Record<string, unknown>)[part];
    } else {
      return key;
    }
  }
  return typeof current === "string" ? current : key;
}

const errorCodeMap: Record<string, MessageKey> = {
  "auth/invalid-credential": "errors.auth.invalidCredentials",
  "auth/wrong-password": "errors.auth.wrongPassword",
  "auth/user-not-found": "errors.auth.userNotFound",
  "auth/invalid-email": "errors.auth.invalidEmail",
  "auth/email-already-in-use": "errors.auth.emailAlreadyInUse",
  "auth/user-disabled": "errors.auth.accountDisabled",
  "auth/too-many-requests": "errors.auth.tooManyRequests",
  "auth/operation-not-allowed": "errors.auth.operationNotAllowed",
  "auth/requires-recent-login": "errors.auth.requiresRecentLogin",
  "auth/invalid-verification-code": "errors.auth.invalidCredentials",
  "auth/code-expired": "errors.auth.sessionExpired",
  "auth/session-expired": "errors.auth.sessionExpired",
  "auth/network-request-failed": "errors.generic.network",
  "auth/popup-closed-by-user": "errors.auth.popupClosedByUser",
  "auth/cancelled-popup-request": "errors.auth.popupClosedByUser",
  "auth/popup-blocked": "errors.auth.popupBlocked",
  "auth/weak-password": "errors.auth.weakPassword",
  "auth/account-exists-with-different-credential":
    "errors.auth.accountExistsWithDifferentCredential",
  "auth/unauthorized-domain": "errors.auth.unauthorizedDomain",
};

export function getAuthErrorMessageKey(error: unknown): MessageKey {
  if (typeof error === "object" && error !== null) {
    const candidateCode =
      "code" in error && typeof (error as { code: unknown }).code === "string"
        ? (error as { code: string }).code
        : undefined;

    if (candidateCode && candidateCode in errorCodeMap) {
      return errorCodeMap[candidateCode];
    }
  }

  return "errors.auth.unknown";
}

export function getAuthErrorMessage(
  error: unknown,
  localeOrT: string | ((key: MessageKey) => string) = "en",
): string {
  const key = getAuthErrorMessageKey(error);
  if (typeof localeOrT === "function") {
    return localeOrT(key);
  }
  const dict =
    (hasLocale(localeOrT) ? dictionaries[localeOrT] : undefined) ??
    dictionaries.en;
  return getMessageFromDictionary(dict, key);
}
