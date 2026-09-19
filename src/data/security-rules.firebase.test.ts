import { getApps, initializeApp } from "firebase-admin/app";
import { getFirestore as getAdminFirestore } from "firebase-admin/firestore";
import { beforeAll, describe, expect, it } from "vitest";

beforeAll(() => {
  process.env.FIRESTORE_EMULATOR_HOST = "127.0.0.1:8080";
  process.env.FIREBASE_AUTH_EMULATOR_HOST = "127.0.0.1:9099";

  if (getApps().length === 0) {
    initializeApp({ projectId: "demo-notes-app" });
  }
});

describe("security rules", () => {
  it("allows server-side Admin SDK access to spaces and objects", async () => {
    const adminDb = getAdminFirestore();
    const spaceRef = adminDb.collection("spaces").doc("admin-test-space");
    await spaceRef.set({ name: "Admin Space", visibility: "private" });

    const snap = await spaceRef.get();
    expect(snap.exists).toBe(true);
    expect(snap.data()?.name).toBe("Admin Space");
  });

  it("denies unauthenticated client REST access to private spaces", async () => {
    const response = await fetch(
      "http://127.0.0.1:8080/v1/projects/demo-notes-app/databases/(default)/documents/spaces/admin-test-space",
    );
    // Unauthenticated client access should fail with 403 or error
    expect(response.status).toBe(403);
  });
});
