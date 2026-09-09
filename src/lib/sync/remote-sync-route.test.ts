import { describe, expect, it } from "vitest";

import { createFirebaseAuthVerifier } from "@/lib/auth/firebase-auth";
import { handleAuthenticatedSyncPushRequest } from "@/lib/sync/remote-sync-route";
import type { SyncMutationRecord } from "@/lib/spaces/space-types";

function mutationFixture(input: Partial<SyncMutationRecord> = {}): SyncMutationRecord {
  return {
    id: input.id ?? "sync-a",
    spaceId: input.spaceId ?? "space-a",
    entityId: input.entityId ?? "entity-a",
    entityType: input.entityType ?? "page",
    operation: input.operation ?? "set",
    status: input.status ?? "pending",
    payload:
      input.payload ??
      {
        id: "entity-a",
        spaceId: "space-a",
        objectTypeId: "page",
        type: "page",
        title: "Synced page",
        createdAt: "2026-01-01T00:00:00.000Z",
        updatedAt: "2026-01-02T00:00:00.000Z",
        blocks: [],
        tags: [],
        relations: [],
        properties: {},
      },
    createdAt: input.createdAt ?? "2026-01-03T00:00:00.000Z",
    updatedAt: input.updatedAt ?? "2026-01-03T00:00:00.000Z",
  };
}

function verifier() {
  return createFirebaseAuthVerifier({
    async verifyIdToken(token) {
      if (token !== "id-token") throw new Error("bad token");
      return { uid: "user-a", email: "user@example.com", email_verified: true };
    },
  });
}

describe("Authenticated remote sync push route handler", () => {
  it("requires Firebase authentication before writing mutations to Firestore", async () => {
    const calls: string[] = [];

    const result = await handleAuthenticatedSyncPushRequest(
      { mutations: [mutationFixture()] },
      {
        headers: new Headers(),
        verifier: verifier(),
        projectId: "demo-project",
        accessToken: "service-token",
        fetcher: async () => {
          calls.push("firestore");
          return new Response("should not be called", { status: 200 });
        },
      },
    );

    expect(result).toEqual({
      status: 401,
      body: { error: "Authentication token is required." },
    });
    expect(calls).toEqual([]);
  });

  it("pushes authenticated mutations with the server Firestore access token", async () => {
    const calls: Array<{ authorization?: string; body: unknown }> = [];

    const result = await handleAuthenticatedSyncPushRequest(
      { mutations: [mutationFixture(), mutationFixture({ id: "sync-b", operation: "delete" })] },
      {
        headers: new Headers({ authorization: "Bearer id-token" }),
        verifier: verifier(),
        projectId: "demo-project",
        accessToken: "service-token",
        fetcher: async (_url, init) => {
          calls.push({
            authorization: new Headers(init?.headers).get("authorization") ?? undefined,
            body: JSON.parse(String(init?.body)),
          });
          return new Response(JSON.stringify({ writeResults: [{}, {}] }), { status: 200 });
        },
      },
    );

    expect(result).toEqual({
      status: 200,
      body: { attempted: 2, synced: 2, userId: "user-a" },
    });
    expect(calls).toHaveLength(1);
    expect(calls[0]?.authorization).toBe("Bearer service-token");
    expect(calls[0]?.body).toMatchObject({
      writes: [
        {
          update: {
            name: "projects/demo-project/databases/(default)/documents/users/user-a/spaces/space-a/entities/entity-a",
          },
        },
        {
          delete:
            "projects/demo-project/databases/(default)/documents/users/user-a/spaces/space-a/entities/entity-a",
        },
      ],
    });
  });

  it("rejects malformed mutation payloads before contacting Firestore", async () => {
    const calls: string[] = [];
    let accessTokenCalls = 0;

    const result = await handleAuthenticatedSyncPushRequest(
      { mutations: [{ id: "sync-a", operation: "patch" }] },
      {
        headers: new Headers({ authorization: "Bearer id-token" }),
        verifier: verifier(),
        projectId: "demo-project",
        getAccessToken: async () => {
          accessTokenCalls += 1;
          return "service-token";
        },
        fetcher: async () => {
          calls.push("firestore");
          return new Response("should not be called", { status: 200 });
        },
      },
    );

    expect(result).toEqual({
      status: 400,
      body: { error: "Sync mutations payload is invalid." },
    });
    expect(calls).toEqual([]);
    expect(accessTokenCalls).toBe(0);
  });

  it("resolves the fallback Firestore access token only after authentication and payload validation", async () => {
    let accessTokenCalls = 0;
    const calls: Array<{ authorization?: string }> = [];

    const result = await handleAuthenticatedSyncPushRequest(
      { mutations: [mutationFixture()] },
      {
        headers: new Headers({ authorization: "Bearer id-token" }),
        verifier: verifier(),
        projectId: "demo-project",
        getAccessToken: async () => {
          accessTokenCalls += 1;
          return "service-token";
        },
        fetcher: async (_url, init) => {
          calls.push({
            authorization: new Headers(init?.headers).get("authorization") ?? undefined,
          });
          return new Response(JSON.stringify({ writeResults: [{}] }), { status: 200 });
        },
      },
    );

    expect(result).toEqual({
      status: 200,
      body: { attempted: 1, synced: 1, userId: "user-a" },
    });
    expect(accessTokenCalls).toBe(1);
    expect(calls).toEqual([{ authorization: "Bearer service-token" }]);
  });

  it("does not resolve fallback credentials when the request is unauthenticated", async () => {
    let accessTokenCalls = 0;

    const result = await handleAuthenticatedSyncPushRequest(
      { mutations: [mutationFixture()] },
      {
        headers: new Headers(),
        verifier: verifier(),
        projectId: "demo-project",
        getAccessToken: async () => {
          accessTokenCalls += 1;
          return "service-token";
        },
        fetcher: async () => new Response("should not be called", { status: 200 }),
      },
    );

    expect(result).toEqual({
      status: 401,
      body: { error: "Authentication token is required." },
    });
    expect(accessTokenCalls).toBe(0);
  });

  it("does not leak Firestore access tokens when remote sync fails", async () => {
    const result = await handleAuthenticatedSyncPushRequest(
      { mutations: [mutationFixture()] },
      {
        headers: new Headers({ authorization: "Bearer id-token" }),
        verifier: verifier(),
        projectId: "demo-project",
        accessToken: "secret-service-token",
        fetcher: async () => new Response("secret-service-token denied", { status: 403 }),
      },
    );

    expect(result).toEqual({
      status: 502,
      body: { error: "Remote sync failed." },
    });
  });
});
