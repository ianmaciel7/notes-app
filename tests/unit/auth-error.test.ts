import { describe, expect, it } from "vitest";
import { classifyAuthFailure } from "@/lib/firebase/auth-error";

describe("classifyAuthFailure", () => {
  it.each([
    ["auth/requires-recent-login", "requiresRecentLogin"],
    ["auth/unverified-email", "unverifiedEmail"],
    ["auth/invalid-verification-code", "generic"],
  ])("maps %s to %s", (code, expected) => {
    expect(classifyAuthFailure({ code })).toBe(expected);
  });

  it.each([
    null,
    undefined,
    "auth/requires-recent-login",
    new Error("x"),
    {},
  ])("treats %s as a generic failure", (error) => {
    expect(classifyAuthFailure(error)).toBe("generic");
  });
});
