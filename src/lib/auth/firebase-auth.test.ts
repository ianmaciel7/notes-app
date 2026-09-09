import { describe, expect, it } from "vitest";

import {
  createFirebaseAdminAuthAdapter,
  createFirebaseAuthVerifier,
  extractBearerToken,
  requireAuthenticatedUser,
} from "@/lib/auth/firebase-auth";

describe("Firebase auth boundary", () => {
  it("extracts Bearer tokens from authorization headers", () => {
    expect(extractBearerToken(new Headers({ authorization: "Bearer id-token" }))).toBe(
      "id-token",
    );
    expect(extractBearerToken(new Headers({ authorization: "Basic nope" }))).toBeNull();
    expect(extractBearerToken(new Headers())).toBeNull();
  });

  it("returns authenticated user claims from a verified token", async () => {
    const verifier = createFirebaseAuthVerifier({
      async verifyIdToken(token) {
        expect(token).toBe("id-token");
        return {
          uid: "user-a",
          email: "user@example.com",
          email_verified: true,
          name: "User A",
          picture: "https://example.com/user.png",
        };
      },
    });

    await expect(
      requireAuthenticatedUser(new Headers({ authorization: "Bearer id-token" }), verifier),
    ).resolves.toEqual({
      uid: "user-a",
      email: "user@example.com",
      emailVerified: true,
      displayName: "User A",
      photoURL: "https://example.com/user.png",
    });
  });

  it("rejects missing tokens before calling the verifier", async () => {
    let called = false;
    const verifier = createFirebaseAuthVerifier({
      async verifyIdToken() {
        called = true;
        throw new Error("should not be called");
      },
    });

    await expect(requireAuthenticatedUser(new Headers(), verifier)).rejects.toThrow(
      "Authentication token is required",
    );
    expect(called).toBe(false);
  });

  it("wraps invalid token errors in a stable auth error", async () => {
    const verifier = createFirebaseAuthVerifier({
      async verifyIdToken() {
        throw new Error("raw firebase failure");
      },
    });

    await expect(
      requireAuthenticatedUser(new Headers({ authorization: "Bearer bad-token" }), verifier),
    ).rejects.toThrow("Authentication token is invalid");
  });

  it("adapts Firebase Admin Auth verifyIdToken into the auth verifier boundary", async () => {
    const adapter = createFirebaseAdminAuthAdapter({
      async verifyIdToken(token) {
        expect(token).toBe("admin-token");
        return {
          uid: "admin-user",
          email: "admin@example.com",
          email_verified: true,
          name: "Admin User",
          picture: "https://example.com/admin.png",
          firebase: {
            sign_in_provider: "google.com",
          },
        };
      },
    });
    const verifier = createFirebaseAuthVerifier(adapter);

    await expect(
      requireAuthenticatedUser(new Headers({ authorization: "Bearer admin-token" }), verifier),
    ).resolves.toEqual({
      uid: "admin-user",
      email: "admin@example.com",
      emailVerified: true,
      displayName: "Admin User",
      photoURL: "https://example.com/admin.png",
    });
  });
});
