import { describe, expect, it } from "vitest";
import { getAssessmentViewMode } from "./preferences";

describe("assessment preferences", () => {
  it("accepts only supported view modes", () => {
    expect(getAssessmentViewMode("continuous")).toBe("continuous");
    expect(getAssessmentViewMode("focus")).toBe("focus");
    expect(getAssessmentViewMode("grid")).toBe("continuous");
    expect(getAssessmentViewMode(undefined)).toBe("continuous");
  });
});
