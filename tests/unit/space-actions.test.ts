import { beforeEach, describe, expect, it, vi } from "vitest";

const deleteSpaceTree = vi.hoisted(() => vi.fn());
const deleteObjectType = vi.hoisted(() => vi.fn());

vi.mock("@/data/space-dal", () => ({ deleteSpaceTree }));
vi.mock("@/data/object-type-dal", () => ({ deleteObjectType }));

import {
  deleteObjectTypeAction,
  deleteSpaceAction,
} from "@/actions/space-actions";
import { SpaceDeletionError } from "@/domain/space";

beforeEach(() => {
  vi.resetAllMocks();
});

describe("space deletion actions", () => {
  it("delegates to the Data Access Layer without passing a uid", async () => {
    deleteSpaceTree.mockResolvedValue(undefined);

    await expect(deleteSpaceAction("space-id")).resolves.toEqual({ ok: true });
    expect(deleteSpaceTree).toHaveBeenCalledWith("space-id");
  });

  it("maps an unauthenticated rejection from the layer to a typed result", async () => {
    deleteSpaceTree.mockRejectedValue(
      new SpaceDeletionError("unauthenticated"),
    );

    await expect(deleteSpaceAction("space-id")).resolves.toEqual({
      ok: false,
      code: "unauthenticated",
    });
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
