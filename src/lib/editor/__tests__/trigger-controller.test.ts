import { describe, expect, it } from "vitest";
import { resolveSuggestionTrigger } from "../trigger-controller";

describe("trigger-controller", () => {
  it("resolves the longest trigger at a whitespace boundary", () => {
    expect(resolveSuggestionTrigger({ textBeforeCursor: "Link [[project" })).toEqual({
      owner: "object-reference",
      query: "project",
      range: { from: 5, to: 14 },
      token: "[[",
    });
  });

  it("ignores trigger-like text inside a word or after whitespace", () => {
    expect(resolveSuggestionTrigger({ textBeforeCursor: "email@example.com" })).toBeNull();
    expect(resolveSuggestionTrigger({ textBeforeCursor: "#tag with-space" })).toBeNull();
  });
});
