import { describe, expect, it, vi } from "vitest";

import { POST } from "@/app/api/storage/upload/route";

const routeState = vi.hoisted(() => ({
  calls: [] as Array<{
    body: unknown;
    headers: Headers;
    bucketName?: string;
  }>,
}));

vi.mock("@/lib/auth/firebase-admin-server", () => ({
  createServerFirebaseAuthVerifier() {
    return { verify: async () => ({ uid: "user-a", emailVerified: true }) };
  },
}));

vi.mock("@/lib/storage/firebase-storage-server", () => ({
  createFirebaseStorageUploader(input?: { bucketName?: string }) {
    return async () => ({ bucket: input?.bucketName ?? "default-bucket" });
  },
}));

vi.mock("@/lib/storage/firebase-storage-upload-route", () => ({
  async handleAuthenticatedStorageUploadRequest(
    body: unknown,
    dependencies: {
      headers: Headers;
      uploader: () => Promise<{ bucket: string }>;
    },
  ) {
    const uploaded = await dependencies.uploader();
    routeState.calls.push({
      body,
      headers: dependencies.headers,
      bucketName: uploaded.bucket,
    });
    return { status: 201, body: { accepted: true } };
  },
}));

describe("/api/storage/upload route", () => {
  it("passes JSON body, request headers, and Storage bucket env to the authenticated upload handler", async () => {
    routeState.calls = [];
    process.env.FIREBASE_STORAGE_BUCKET = "demo.appspot.com";

    const response = await POST(
      new Request("http://localhost/api/storage/upload", {
        method: "POST",
        headers: { authorization: "Bearer id-token" },
        body: JSON.stringify({ spaceId: "space-a" }),
      }),
    );

    await expect(response.json()).resolves.toEqual({ accepted: true });
    expect(response.status).toBe(201);
    expect(routeState.calls).toHaveLength(1);
    expect(routeState.calls[0]).toMatchObject({
      body: { spaceId: "space-a" },
      bucketName: "demo.appspot.com",
    });
    expect(routeState.calls[0]?.headers.get("authorization")).toBe("Bearer id-token");
  });

  it("returns a stable bad request response for malformed JSON", async () => {
    routeState.calls = [];

    const response = await POST(
      new Request("http://localhost/api/storage/upload", {
        method: "POST",
        body: "{",
      }),
    );

    await expect(response.json()).resolves.toEqual({ error: "Request JSON is invalid." });
    expect(response.status).toBe(400);
    expect(routeState.calls).toEqual([]);
  });
});
