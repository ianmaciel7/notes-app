import { describe, expect, it } from "vitest";
import { validateCreateSpaceInput } from "./space";

describe("validateCreateSpaceInput", () => {
  it("validates valid input correctly", () => {
    const result = validateCreateSpaceInput({
      name: "My Space",
      icon: "book",
    });

    expect(result.success).toBe(true);
    expect(result.data?.name).toBe("My Space");
    expect(result.data?.icon).toBe("book");
  });

  it("fails when name is missing", () => {
    const result = validateCreateSpaceInput({
      name: "   ",
    });

    expect(result.success).toBe(false);
    expect(result.fieldErrors?.name).toBe("Space name is required");
  });

  it("fails when icon is invalid", () => {
    const result = validateCreateSpaceInput({
      name: "Space",
      icon: "invalid-icon",
    });

    expect(result.success).toBe(false);
    expect(result.fieldErrors?.icon).toBeDefined();
  });
});
