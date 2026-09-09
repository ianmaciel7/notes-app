import { beforeEach, describe, expect, it, vi } from "vitest";

import { createFirebaseStorageUploader } from "@/lib/storage/firebase-storage-server";

const firebaseAppState = vi.hoisted(() => ({
  apps: [] as unknown[],
  initializeAppCalls: [] as unknown[],
  applicationDefaultCalls: 0,
}));

const firebaseStorageState = vi.hoisted(() => ({
  getStorageCalls: [] as unknown[],
  bucketCalls: [] as Array<string | undefined>,
  saved: [] as Array<{ path: string; data: Buffer; options: unknown }>,
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

vi.mock("firebase-admin/storage", () => ({
  getStorage(app?: unknown) {
    firebaseStorageState.getStorageCalls.push(app);
    return {
      bucket(name?: string) {
        firebaseStorageState.bucketCalls.push(name);
        return {
          name: name ?? "default-bucket",
          file(path: string) {
            return {
              async save(data: Buffer, options: unknown) {
                firebaseStorageState.saved.push({ path, data, options });
              },
            };
          },
        };
      },
    };
  },
}));

describe("Firebase Storage server uploader", () => {
  beforeEach(() => {
    firebaseAppState.apps = [];
    firebaseAppState.initializeAppCalls = [];
    firebaseAppState.applicationDefaultCalls = 0;
    firebaseStorageState.getStorageCalls = [];
    firebaseStorageState.bucketCalls = [];
    firebaseStorageState.saved = [];
  });

  it("stores binary data with content type through Firebase Admin Storage", async () => {
    const uploader = createFirebaseStorageUploader({ bucketName: "demo.appspot.com" });

    await expect(
      uploader({
        path: "users/user-a/spaces/space-a/media/blob-a-paper.pdf",
        contentType: "application/pdf",
        data: Buffer.from("pdf bytes"),
      }),
    ).resolves.toEqual({ bucket: "demo.appspot.com" });

    expect(firebaseStorageState.bucketCalls).toEqual(["demo.appspot.com"]);
    expect(firebaseStorageState.saved).toEqual([
      {
        path: "users/user-a/spaces/space-a/media/blob-a-paper.pdf",
        data: Buffer.from("pdf bytes"),
        options: {
          metadata: { contentType: "application/pdf" },
          resumable: false,
        },
      },
    ]);
  });
});
