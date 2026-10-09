import { beforeEach, describe, expect, it, vi } from "vitest";

const getCurrentIdentity = vi.hoisted(() => vi.fn());
const deleteSpaceTree = vi.hoisted(() => vi.fn());
const deleteObjectType = vi.hoisted(() => vi.fn());

vi.mock("@/lib/firebase/identity", () => ({ getCurrentIdentity }));
vi.mock("@/data/space-dal", () => ({ deleteSpaceTree }));
vi.mock("@/data/object-type-dal", () => ({ deleteObjectType }));

import {
  deleteObjectTypeAction,
  deleteSpaceAction,
} from "@/actions/space-actions";
import { SpaceDeletionError } from "@/domain/space";

beforeEach(() => {
  vi.resetAllMocks();
  getCurrentIdentity.mockResolvedValue({ email: null, uid: "alice" });
});

describe("space deletion actions", () => {
  it("uses the verified identity rather than a client uid", async () => {
    deleteSpaceTree.mockResolvedValue(undefined);

    await expect(deleteSpaceAction("space-id")).resolves.toEqual({ ok: true });
    expect(deleteSpaceTree).toHaveBeenCalledWith("alice", "space-id");
  });

  it("rejects an unauthenticated caller without deleting", async () => {
    getCurrentIdentity.mockResolvedValue(null);

    await expect(deleteSpaceAction("space-id")).resolves.toEqual({
      ok: false,
      code: "unauthenticated",
    });
    expect(deleteSpaceTree).not.toHaveBeenCalled();
  });

  it("rejects non-string arguments without deleting", async () => {
    await expect(deleteSpaceAction(null as never)).resolves.toEqual({
      ok: false,
      code: "invalid-id",
    });
    await expect(
      deleteObjectTypeAction("space-id", undefined as never),
    ).resolves.toEqual({ ok: false, code: "invalid-id" });
    expect(deleteSpaceTree).not.toHaveBeenCalled();
    expect(deleteObjectType).not.toHaveBeenCalled();
  });

  it("maps deletion errors to typed results", async () => {
    deleteObjectType.mockRejectedValue(
      new SpaceDeletionError("has-descendants"),
    );

    await expect(
      deleteObjectTypeAction("space-id", "object-type-id"),
    ).resolves.toEqual({ ok: false, code: "has-descendants" });
  });
});
