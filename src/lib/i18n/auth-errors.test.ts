import { describe, expect, it } from "vitest";

import { getAuthErrorMessage, getAuthErrorMessageKey } from "./auth-errors";
import type { MessageKey } from "./types";

describe("auth-errors", () => {
  describe("getAuthErrorMessageKey", () => {
    it("maps known auth error codes to their MessageKeys", () => {
      const testCases: Array<{ code: string; expected: MessageKey }> = [
        {
          code: "auth/invalid-credential",
          expected: "errors.auth.invalidCredentials",
        },
        {
          code: "auth/popup-closed-by-user",
          expected: "errors.auth.popupClosedByUser",
        },
        {
          code: "auth/cancelled-popup-request",
          expected: "errors.auth.popupClosedByUser",
        },
        {
          code: "auth/popup-blocked",
          expected: "errors.auth.popupBlocked",
        },
        {
          code: "auth/user-not-found",
          expected: "errors.auth.userNotFound",
        },
        {
          code: "auth/wrong-password",
          expected: "errors.auth.wrongPassword",
        },
        {
          code: "auth/weak-password",
          expected: "errors.auth.weakPassword",
        },
        {
          code: "auth/invalid-email",
          expected: "errors.auth.invalidEmail",
        },
        {
          code: "auth/email-already-in-use",
          expected: "errors.auth.emailAlreadyInUse",
        },
        {
          code: "auth/user-disabled",
          expected: "errors.auth.accountDisabled",
        },
        {
          code: "auth/too-many-requests",
          expected: "errors.auth.tooManyRequests",
        },
        {
          code: "auth/operation-not-allowed",
          expected: "errors.auth.operationNotAllowed",
        },
        {
          code: "auth/requires-recent-login",
          expected: "errors.auth.requiresRecentLogin",
        },
        {
          code: "auth/invalid-verification-code",
          expected: "errors.auth.invalidCredentials",
        },
        {
          code: "auth/code-expired",
          expected: "errors.auth.sessionExpired",
        },
        {
          code: "auth/session-expired",
          expected: "errors.auth.sessionExpired",
        },
        {
          code: "auth/network-request-failed",
          expected: "errors.generic.network",
        },
        {
          code: "auth/account-exists-with-different-credential",
          expected: "errors.auth.accountExistsWithDifferentCredential",
        },
        {
          code: "auth/unauthorized-domain",
          expected: "errors.auth.unauthorizedDomain",
        },
      ];

      for (const { code, expected } of testCases) {
        expect(getAuthErrorMessageKey({ code })).toBe(expected);
      }
    });

    it("falls back to generic unknown auth error for unrecognized codes", () => {
      const error = { code: "auth/something-random" };
      expect(getAuthErrorMessageKey(error)).toBe("errors.auth.unknown");
    });

    it("safely handles non-object and null errors without throwing", () => {
      expect(getAuthErrorMessageKey(null)).toBe("errors.auth.unknown");
      expect(getAuthErrorMessageKey("raw string")).toBe("errors.auth.unknown");
      expect(getAuthErrorMessageKey(undefined)).toBe("errors.auth.unknown");
      expect(getAuthErrorMessageKey({})).toBe("errors.auth.unknown");
    });
  });

  describe("getAuthErrorMessage", () => {
    it("translates error using provided t function", () => {
      const mockT = (key: MessageKey) => `translated:${key}`;
      expect(
        getAuthErrorMessage({ code: "auth/invalid-credential" }, mockT),
      ).toBe("translated:errors.auth.invalidCredentials");
      expect(
        getAuthErrorMessage({ code: "auth/network-request-failed" }, mockT),
      ).toBe("translated:errors.generic.network");
      expect(
        getAuthErrorMessage({ code: "auth/something-random" }, mockT),
      ).toBe("translated:errors.auth.unknown");
    });
  });
});
