import { beforeEach, describe, expect, it, vi } from "vitest";
import { DomainError } from "@/domain/shared/domain-error";
import {
  createSpaceAction,
  listSpacesAction,
  renameSpaceAction,
} from "./space-actions";

vi.mock("@/data/action-auth", () => ({
  requireActionUser: vi.fn(),
}));

vi.mock("@/data/spaces", () => ({
  createPrivateSpace: vi.fn(),
  renameOwnedSpace: vi.fn(),
  listOwnedSpaces: vi.fn(),
}));

import { requireActionUser } from "@/data/action-auth";
import {
  createPrivateSpace,
  listOwnedSpaces,
  renameOwnedSpace,
} from "@/data/spaces";

describe("space actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns unauthenticated when user is not logged in", async () => {
    vi.mocked(requireActionUser).mockRejectedValue(
      new DomainError("unauthenticated"),
    );

    const result = await createSpaceAction({ name: "My Space" });
    expect(result).toEqual({
      ok: false,
      error: { code: "unauthenticated" },
    });
  });

  it("creates a space successfully", async () => {
    vi.mocked(requireActionUser).mockResolvedValue({
      uid: "user-1",
      email: "u1@test.com",
    });
    vi.mocked(createPrivateSpace).mockResolvedValue({
      id: "s-1",
      ownerId: "user-1",
      name: "My Space",
      visibility: "private",
      schemaVersion: 1,
      createdAt: "2026-09-18T00:00:00.000Z",
      updatedAt: "2026-09-18T00:00:00.000Z",
    });

    const result = await createSpaceAction({ name: "My Space" });
    expect(result).toEqual({
      ok: true,
      data: { id: "s-1", name: "My Space" },
    });
  });

  it("rejects renaming a space when not authorized", async () => {
    vi.mocked(requireActionUser).mockResolvedValue({
      uid: "user-1",
      email: "u1@test.com",
    });
    vi.mocked(renameOwnedSpace).mockRejectedValue(new DomainError("forbidden"));

    const result = await renameSpaceAction({
      spaceId: "s-other",
      name: "Renamed",
    });

    expect(result).toEqual({
      ok: false,
      error: { code: "forbidden" },
    });
  });

  it("lists spaces successfully", async () => {
    vi.mocked(requireActionUser).mockResolvedValue({
      uid: "user-1",
      email: "u1@test.com",
    });
    vi.mocked(listOwnedSpaces).mockResolvedValue([
      {
        id: "s-1",
        ownerId: "user-1",
        name: "My Space",
        visibility: "private",
        schemaVersion: 1,
        createdAt: "2026-09-18T00:00:00.000Z",
        updatedAt: "2026-09-18T00:00:00.000Z",
      },
    ]);

    const result = await listSpacesAction();
    expect(result).toEqual({
      ok: true,
      data: [{ id: "s-1", name: "My Space" }],
    });
  });
});
