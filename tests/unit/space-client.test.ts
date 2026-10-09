import type { DocumentSnapshot } from "firebase/firestore";
import { describe, expect, it, vi } from "vitest";
import { parseSpace } from "@/client/space-client";

vi.mock("@/actions/space-actions", () => ({
  deleteSpaceAction: vi.fn(),
}));

const when = new Date("2026-10-09T10:00:00Z");
const stamp = { toDate: () => when };
const SPACE_ID = "0b9d72d1-2ca5-4df2-97f0-30e311eef4cb";

function snapshot(data: Record<string, unknown> | undefined) {
  return { id: SPACE_ID, data: () => data } as unknown as DocumentSnapshot;
}

const valid = {
  ownerId: "alice",
  name: "Studies",
  icon: "book-open",
  stateVersion: 1,
  createdAt: stamp,
  updatedAt: stamp,
};

describe("parseSpace", () => {
  it("maps a valid document, using the snapshot id", () => {
    expect(parseSpace(snapshot(valid))).toEqual({
      id: SPACE_ID,
      ownerId: "alice",
      name: "Studies",
      icon: "book-open",
      stateVersion: 1,
      createdAt: when,
      updatedAt: when,
    });
  });

  it("keeps an optional description only when it is a string", () => {
    expect(
      parseSpace(snapshot({ ...valid, description: "d" }))?.description,
    ).toBe("d");
    expect(
      parseSpace(snapshot({ ...valid, description: 1 })),
    ).not.toHaveProperty("description");
  });

  it.each([
    ["a missing document", undefined],
    ["a non-string name", { ...valid, name: 1 }],
    ["a missing icon", { ...valid, icon: undefined }],
    ["a non-numeric stateVersion", { ...valid, stateVersion: "1" }],
    ["a missing createdAt", { ...valid, createdAt: undefined }],
    ["a non-timestamp updatedAt", { ...valid, updatedAt: "now" }],
  ])("returns null for %s", (_label, data) => {
    expect(parseSpace(snapshot(data))).toBeNull();
  });
});
