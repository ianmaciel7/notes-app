import { describe, expect, it } from "vitest";
import {
  isAllowedOrigin,
  SESSION_COOKIE_NAME,
  sessionCookieOptions,
} from "@/lib/firebase/session";

describe("Firebase session boundary", () => {
  it("accepts only same-origin mutation requests", () => {
    expect(
      isAllowedOrigin("http://localhost:3000", "http://localhost:3000"),
    ).toBe(true);
    expect(
      isAllowedOrigin("https://attacker.example", "http://localhost:3000"),
    ).toBe(false);
    expect(isAllowedOrigin(null, "http://localhost:3000")).toBe(false);
  });

  it("uses an HttpOnly, bounded, local-development-safe cookie", () => {
    expect(SESSION_COOKIE_NAME).toBe("__session");
    expect(sessionCookieOptions(false)).toMatchObject({
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 5,
      path: "/",
      sameSite: "lax",
      secure: false,
    });
    expect(sessionCookieOptions(true).secure).toBe(true);
  });
});
