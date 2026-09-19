import { getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { afterEach, beforeAll, describe, expect, it } from "vitest";
import { DomainError } from "@/domain/shared/domain-error";
import { clearFirestoreCollections } from "@/tests/helpers/clear-firestore";
import {
  createPrivateSpace,
  getOwnedSpace,
  listOwnedSpaces,
  renameOwnedSpace,
} from "./spaces";

// ---------------------------------------------------------------------------
// Bootstrap Firebase Admin pointing at local emulators
// ---------------------------------------------------------------------------
beforeAll(() => {
  process.env.FIRESTORE_EMULATOR_HOST = "127.0.0.1:8080";
  process.env.FIREBASE_AUTH_EMULATOR_HOST = "127.0.0.1:9099";

  if (getApps().length === 0) {
    initializeApp({ projectId: "demo-notes-app" });
  }
});

afterEach(async () => {
  await clearFirestoreCollections("spaces");
});

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const OWNER = "user-alice";
const OTHER = "user-bob";

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("createPrivateSpace", () => {
  it("creates a space document with the expected shape", async () => {
    const space = await createPrivateSpace(OWNER, "Alice's Space");

    expect(space.id).toBeTruthy();
    expect(space.ownerId).toBe(OWNER);
    expect(space.name).toBe("Alice's Space");
    expect(space.visibility).toBe("private");
    expect(space.schemaVersion).toBe(1);
    expect(typeof space.createdAt).toBe("string");
    expect(typeof space.updatedAt).toBe("string");

    // Verify persistence in Firestore
    const doc = await getFirestore().collection("spaces").doc(space.id).get();
    expect(doc.exists).toBe(true);
    expect(doc.data()?.ownerId).toBe(OWNER);
  });

  it("rejects invalid data (empty name)", async () => {
    await expect(createPrivateSpace(OWNER, "")).rejects.toThrow(DomainError);
    await expect(createPrivateSpace(OWNER, "  ")).rejects.toThrow(DomainError);
  });

  it("rejects invalid data (empty ownerId)", async () => {
    await expect(createPrivateSpace("", "Valid Name")).rejects.toThrow(
      DomainError,
    );
  });
});

describe("getOwnedSpace", () => {
  it("returns the space when requester is the owner", async () => {
    const created = await createPrivateSpace(OWNER, "My Space");
    const fetched = await getOwnedSpace(OWNER, created.id);

    expect(fetched.id).toBe(created.id);
    expect(fetched.name).toBe("My Space");
  });

  it("throws DomainError('forbidden') when requester is not the owner", async () => {
    const space = await createPrivateSpace(OWNER, "Owner Only");

    await expect(getOwnedSpace(OTHER, space.id)).rejects.toMatchObject({
      code: "forbidden",
    });
  });

  it("throws DomainError('forbidden') for a non-existent spaceId", async () => {
    await expect(getOwnedSpace(OWNER, "non-existent-id")).rejects.toMatchObject(
      { code: "forbidden" },
    );
  });
});

describe("listOwnedSpaces", () => {
  it("returns only spaces owned by the given user", async () => {
    await createPrivateSpace(OWNER, "Space A");
    await createPrivateSpace(OWNER, "Space B");
    await createPrivateSpace(OTHER, "Bob Space");

    const aliceSpaces = await listOwnedSpaces(OWNER);
    expect(aliceSpaces).toHaveLength(2);
    expect(aliceSpaces.every((s) => s.ownerId === OWNER)).toBe(true);

    const bobSpaces = await listOwnedSpaces(OTHER);
    expect(bobSpaces).toHaveLength(1);
    expect(bobSpaces[0].name).toBe("Bob Space");
  });

  it("returns empty array when user has no spaces", async () => {
    const spaces = await listOwnedSpaces("user-with-no-spaces");
    expect(spaces).toEqual([]);
  });
});

describe("renameOwnedSpace", () => {
  it("renames the space when requester is the owner", async () => {
    const space = await createPrivateSpace(OWNER, "Old Name");
    const renamed = await renameOwnedSpace(OWNER, space.id, "New Name");

    expect(renamed.name).toBe("New Name");
    expect(renamed.id).toBe(space.id);
    expect(renamed.updatedAt >= space.updatedAt).toBe(true);
  });

  it("throws DomainError('forbidden') when requester is not the owner", async () => {
    const space = await createPrivateSpace(OWNER, "My Space");

    await expect(
      renameOwnedSpace(OTHER, space.id, "Hacked Name"),
    ).rejects.toMatchObject({ code: "forbidden" });
  });
});
