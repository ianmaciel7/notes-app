export type AuthFailure = "generic" | "requiresRecentLogin" | "unverifiedEmail";

const FAILURES_BY_CODE: Record<string, AuthFailure> = {
  "auth/requires-recent-login": "requiresRecentLogin",
  "auth/unverified-email": "unverifiedEmail",
};

/**
 * Classifies the Firebase Auth failures that second-factor changes can raise
 * and that the user can act on. FirebaseUI errors keep the original `code`.
 */
export function classifyAuthFailure(error: unknown): AuthFailure {
  if (typeof error === "object" && error !== null && "code" in error) {
    return FAILURES_BY_CODE[String(error.code)] ?? "generic";
  }

  return "generic";
}
