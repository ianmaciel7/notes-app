import { describe, expect, it } from "vitest";
import { validateCreateSpaceInput } from "./space";

describe("validateCreateSpaceInput", () => {
  it("validates and trims a valid space input", () => {
    const result = validateCreateSpaceInput({
      name: "  Engineering Space  ",
      description: "  Architecture and design  ",
      icon: "code",
      color: "emerald",
    });

    expect(result.success).toBe(true);
    expect(result.data).toEqual({
      name: "Engineering Space",
      description: "Architecture and design",
      icon: "code",
      color: "emerald",
    });
  });

  it("applies default icon and color if omitted", () => {
    const result = validateCreateSpaceInput({
      name: "Default Space",
    });

    expect(result.success).toBe(true);
    expect(result.data?.icon).toBe("folder");
    expect(result.data?.color).toBe("blue");
  });

  it("rejects non-object inputs", () => {
    expect(validateCreateSpaceInput(null).success).toBe(false);
    expect(validateCreateSpaceInput("string").success).toBe(false);
    expect(validateCreateSpaceInput(123).success).toBe(false);
  });

  it("rejects empty or whitespace-only names", () => {
    const resultEmpty = validateCreateSpaceInput({ name: "" });
    expect(resultEmpty.success).toBe(false);

    const resultWhitespace = validateCreateSpaceInput({ name: "   " });
    expect(resultWhitespace.success).toBe(false);
  });

  it("rejects names longer than 50 characters", () => {
    const result = validateCreateSpaceInput({ name: "a".repeat(51) });
    expect(result.success).toBe(false);
    expect(result.error).toContain("50 characters");
  });

  it("rejects descriptions longer than 200 characters", () => {
    const result = validateCreateSpaceInput({
      name: "Valid Name",
      description: "a".repeat(201),
    });
    expect(result.success).toBe(false);
    expect(result.error).toContain("200 characters");
  });
});
