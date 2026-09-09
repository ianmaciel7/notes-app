import { describe, expect, it, vi } from "vitest";

import { POST } from "@/app/api/sync/push/route";

const routeState = vi.hoisted(() => ({
  calls: [] as Array<{
    body: unknown;
    headers: Headers;
    projectId?: string;
    accessToken?: string;
    fallbackAccessToken?: string;
  }>,
  googleAccessTokenCalls: 0,
}));

vi.mock("@/lib/auth/firebase-admin-server", () => ({
  createServerFirebaseAuthVerifier() {
    return { verify: async () => ({ uid: "user-a", emailVerified: true }) };
  },
}));

vi.mock("@/lib/sync/remote-sync-route", () => ({
  async handleAuthenticatedSyncPushRequest(
    body: unknown,
    dependencies: {
      headers: Headers;
      projectId?: string;
      accessToken?: string;
      getAccessToken?: () => Promise<string | null>;
    },
  ) {
    routeState.calls.push({
      body,
      headers: dependencies.headers,
      projectId: dependencies.projectId,
      accessToken: dependencies.accessToken,
      fallbackAccessToken: await dependencies.getAccessToken?.(),
    });
    return { status: 201, body: { accepted: true } };
  },
}));

vi.mock("@/lib/sync/google-cloud-access-token", () => ({
  async getGoogleCloudAccessToken() {
    routeState.googleAccessTokenCalls += 1;
    return "adc-token";
  },
}));

describe("/api/sync/push route", () => {
  it("passes JSON body, request headers, and server sync env to the authenticated sync handler", async () => {
    routeState.calls = [];
    process.env.FIREBASE_PROJECT_ID = "demo-project";
    process.env.FIRESTORE_ACCESS_TOKEN = "server-token";

    const response = await POST(
      new Request("http://localhost/api/sync/push", {
        method: "POST",
        headers: { authorization: "Bearer id-token" },
        body: JSON.stringify({ mutations: [] }),
      }),
    );

    await expect(response.json()).resolves.toEqual({ accepted: true });
    expect(response.status).toBe(201);
    expect(routeState.calls).toHaveLength(1);
    expect(routeState.calls[0]).toMatchObject({
      body: { mutations: [] },
      projectId: "demo-project",
      accessToken: "server-token",
    });
    expect(routeState.calls[0]?.headers.get("authorization")).toBe("Bearer id-token");
  });

  it("falls back to Google Application Default Credentials when no explicit Firestore token is configured", async () => {
    routeState.calls = [];
    routeState.googleAccessTokenCalls = 0;
    process.env.FIREBASE_PROJECT_ID = "demo-project";
    delete process.env.GOOGLE_CLOUD_PROJECT;
    delete process.env.GCLOUD_PROJECT;
    delete process.env.FIRESTORE_ACCESS_TOKEN;

    const response = await POST(
      new Request("http://localhost/api/sync/push", {
        method: "POST",
        headers: { authorization: "Bearer id-token" },
        body: JSON.stringify({ mutations: [] }),
      }),
    );

    await expect(response.json()).resolves.toEqual({ accepted: true });
    expect(response.status).toBe(201);
    expect(routeState.googleAccessTokenCalls).toBe(1);
    expect(routeState.calls[0]).toMatchObject({
      projectId: "demo-project",
      accessToken: undefined,
      fallbackAccessToken: "adc-token",
    });
  });

  it("uses the Google Cloud project id when FIREBASE_PROJECT_ID is not configured", async () => {
    routeState.calls = [];
    routeState.googleAccessTokenCalls = 0;
    delete process.env.FIREBASE_PROJECT_ID;
    process.env.GOOGLE_CLOUD_PROJECT = "hosting-project";
    delete process.env.GCLOUD_PROJECT;
    process.env.FIRESTORE_ACCESS_TOKEN = "server-token";

    const response = await POST(
      new Request("http://localhost/api/sync/push", {
        method: "POST",
        headers: { authorization: "Bearer id-token" },
        body: JSON.stringify({ mutations: [] }),
      }),
    );

    await expect(response.json()).resolves.toEqual({ accepted: true });
    expect(response.status).toBe(201);
    expect(routeState.calls[0]).toMatchObject({
      projectId: "hosting-project",
      accessToken: "server-token",
    });
  });

  it("returns a stable bad request response for malformed JSON", async () => {
    routeState.calls = [];

    const response = await POST(
      new Request("http://localhost/api/sync/push", {
        method: "POST",
        body: "{",
      }),
    );

    await expect(response.json()).resolves.toEqual({ error: "Request JSON is invalid." });
    expect(response.status).toBe(400);
    expect(routeState.calls).toEqual([]);
  });
});
