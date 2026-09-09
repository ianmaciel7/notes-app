import { beforeEach, describe, expect, it, vi } from "vitest";

import { createServerFirebaseAuthVerifier } from "@/lib/auth/firebase-admin-server";

const firebaseAppState = vi.hoisted(() => ({
  apps: [] as unknown[],
  initializeAppCalls: [] as unknown[],
  applicationDefaultCalls: 0,
}));

const firebaseAuthState = vi.hoisted(() => ({
  getAuthCalls: [] as unknown[],
}));

vi.mock("firebase-admin/app", () => ({
  applicationDefault() {
    firebaseAppState.applicationDefaultCalls += 1;
    return { credential: "application-default" };
  },
  getApps() {
    return firebaseAppState.apps;
  },
  initializeApp(options?: unknown) {
    firebaseAppState.initializeAppCalls.push(options);
    const app = { name: "server-app" };
    firebaseAppState.apps.push(app);
    return app;
  },
}));

vi.mock("firebase-admin/auth", () => ({
  getAuth(app?: unknown) {
    firebaseAuthState.getAuthCalls.push(app);
    return {
      async verifyIdToken(token: string) {
        return { uid: token };
      },
    };
  },
}));

describe("Firebase Admin server auth factory", () => {
  beforeEach(() => {
    firebaseAppState.apps = [];
    firebaseAppState.initializeAppCalls = [];
    firebaseAppState.applicationDefaultCalls = 0;
    firebaseAuthState.getAuthCalls = [];
  });

  it("initializes Firebase Admin with application default credentials when no app exists", async () => {
    const verifier = createServerFirebaseAuthVerifier();

    await expect(verifier.verify("user-a")).resolves.toMatchObject({ uid: "user-a" });
    expect(firebaseAppState.applicationDefaultCalls).toBe(1);
    expect(firebaseAppState.initializeAppCalls).toEqual([
      { credential: { credential: "application-default" } },
    ]);
    expect(firebaseAuthState.getAuthCalls).toHaveLength(1);
  });

  it("reuses an existing Firebase Admin app instead of initializing another one", async () => {
    const existingApp = { name: "existing-app" };
    firebaseAppState.apps = [existingApp];

    const verifier = createServerFirebaseAuthVerifier();

    await expect(verifier.verify("user-b")).resolves.toMatchObject({ uid: "user-b" });
    expect(firebaseAppState.applicationDefaultCalls).toBe(0);
    expect(firebaseAppState.initializeAppCalls).toEqual([]);
    expect(firebaseAuthState.getAuthCalls).toEqual([existingApp]);
  });
});
