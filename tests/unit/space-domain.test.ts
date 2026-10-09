import { describe, expect, it } from "vitest";
import {
  assertValidSpaceDeletionIds,
  assertValidSpaceOwnerId,
  SpaceDeletionError,
} from "@/domain/space";

const SPACE_ID = "0b9d72d1-2ca5-4df2-97f0-30e311eef4cb";
const OBJECT_TYPE_ID = "5b7a3a30-6f5e-4d52-8f62-0c5a8d1d9e11";

describe("Space deletion validation", () => {
  it("accepts lowercase UUID v4 Space and Object Type ids", () => {
    expect(() =>
      assertValidSpaceDeletionIds(SPACE_ID, OBJECT_TYPE_ID),
    ).not.toThrow();
  });

  it.each([
    "not-a-uuid",
    SPACE_ID.toUpperCase(),
    "0b9d72d1-2ca5-1df2-97f0-30e311eef4cb",
  ])("rejects an invalid deletion id", (id) => {
    expect(() => assertValidSpaceDeletionIds(id)).toThrow(
      new SpaceDeletionError("invalid-id"),
    );
  });

  it("rejects unsafe owner ids", () => {
    for (const uid of ["", " ", "alice/bob"]) {
      expect(() => assertValidSpaceOwnerId(uid)).toThrow(
        new SpaceDeletionError("invalid-id"),
      );
    }
  });
});
