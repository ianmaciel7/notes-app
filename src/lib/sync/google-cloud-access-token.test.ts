import { describe, expect, it, vi } from "vitest";

import { getGoogleCloudAccessToken } from "@/lib/sync/google-cloud-access-token";

const googleAuthState = vi.hoisted(() => ({
  constructorCalls: [] as unknown[],
  getAccessTokenCalls: 0,
}));

vi.mock("google-auth-library", () => ({
  GoogleAuth: class {
    constructor(options: unknown) {
      googleAuthState.constructorCalls.push(options);
    }

    async getAccessToken() {
      googleAuthState.getAccessTokenCalls += 1;
      return "google-access-token";
    }
  },
}));

describe("Google Cloud access token provider", () => {
  it("requests a Cloud Platform scoped access token for Firestore REST calls", async () => {
    googleAuthState.constructorCalls = [];
    googleAuthState.getAccessTokenCalls = 0;

    await expect(getGoogleCloudAccessToken()).resolves.toBe("google-access-token");
    expect(googleAuthState.constructorCalls).toEqual([
      { scopes: ["https://www.googleapis.com/auth/cloud-platform"] },
    ]);
    expect(googleAuthState.getAccessTokenCalls).toBe(1);
  });
});
