// @vitest-environment node
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  getCurrentIdentity: vi.fn(async (): Promise<{ uid: string } | null> => null),
  get: vi.fn(),
}));

vi.mock("server-only", () => ({}));
vi.mock("@/lib/firebase/identity", () => ({
  getCurrentIdentity: mocks.getCurrentIdentity,
}));
vi.mock("@/lib/firebase/admin", () => ({
  getFirebaseAdminFirestore: () => ({
    collection: () => ({
      doc: () => ({
        collection: () => ({ doc: () => ({ get: mocks.get }) }),
      }),
    }),
  }),
}));

type CurrentIdentityDal = typeof import("@/data/current-identity-dal");

let requireOwnedSpaceRef: CurrentIdentityDal["requireOwnedSpaceRef"];

beforeAll(async () => {
  ({ requireOwnedSpaceRef } = await import("@/data/current-identity-dal"));
});

describe("current identity Data Access Layer", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.getCurrentIdentity.mockResolvedValue({ uid: "alice" });
  });

  it("rejects an unauthenticated caller before touching Firestore", async () => {
    mocks.getCurrentIdentity.mockResolvedValue(null);

    await expect(
      requireOwnedSpaceRef("0b9d72d1-2ca5-4df2-97f0-30e311eef4cb"),
    ).rejects.toMatchObject({ code: "unauthenticated" });
    expect(mocks.get).not.toHaveBeenCalled();
  });

  it("rejects a missing Space", async () => {
    mocks.get.mockResolvedValue({ exists: false });

    await expect(
      requireOwnedSpaceRef("0b9d72d1-2ca5-4df2-97f0-30e311eef4cb"),
    ).rejects.toMatchObject({ code: "not-found" });
  });

  it("rejects a Space owned by another identity", async () => {
    mocks.get.mockResolvedValue({
      exists: true,
      data: () => ({ ownerId: "bob" }),
    });

    await expect(
      requireOwnedSpaceRef("0b9d72d1-2ca5-4df2-97f0-30e311eef4cb"),
    ).rejects.toMatchObject({ code: "forbidden" });
  });

  it("returns an owned Space reference", async () => {
    mocks.get.mockResolvedValue({
      exists: true,
      data: () => ({ ownerId: "alice" }),
    });

    await expect(
      requireOwnedSpaceRef("0b9d72d1-2ca5-4df2-97f0-30e311eef4cb"),
    ).resolves.toBeDefined();
  });
});
