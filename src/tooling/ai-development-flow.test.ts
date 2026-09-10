import { describe, expect, test } from "vitest";

import { classifyDevelopmentWork, summarizeRequiredWorkflow } from "./ai-development-flow";

describe("classifyDevelopmentWork", () => {
  test("keeps documentation-only changes on the lightweight path", () => {
    const result = classifyDevelopmentWork({
      description: "Clarify README setup wording",
      files: ["README.md", "docs/code-quality.md"],
    });

    expect(result.level).toBe("lightweight");
    expect(result.requiresPersistentSpec).toBe(false);
    expect(result.requiredChecks).toEqual(["pnpm format:check"]);
  });

  test("requires a bugfix spec and regression test for a bounded bug", () => {
    const result = classifyDevelopmentWork({
      description: "Fix saved search losing its filter after reload",
      files: ["src/lib/search.ts", "src/lib/search.test.ts"],
      kind: "bugfix",
    });

    expect(result.level).toBe("bounded");
    expect(result.requiredArtifact).toBe("bugfix-spec");
    expect(result.requiredChecks).toContain("focused regression test");
  });

  test("escalates security, sync, storage, parser, AI, and migration work", () => {
    const result = classifyDevelopmentWork({
      description: "Change authenticated sync payload validation",
      files: ["src/lib/sync/remote-sync-route.ts", "firestore.rules"],
    });

    expect(result.level).toBe("complex");
    expect(result.requiresPersistentSpec).toBe(true);
    expect(result.requiredReviews).toEqual(["spec review", "quality review", "security review"]);
  });
});

describe("summarizeRequiredWorkflow", () => {
  test("returns concrete daily instructions for a functional change", () => {
    const summary = summarizeRequiredWorkflow({
      level: "bounded",
      requiredArtifact: "change-spec",
      requiresPersistentSpec: true,
      requiredChecks: ["focused test", "pnpm quality:fast"],
      requiredReviews: ["spec review", "quality review"],
    });

    expect(summary).toEqual([
      "Investigate the current behavior and preserve existing contracts.",
      "Record a change-spec before implementation.",
      "Plan the smallest independently verifiable change.",
      "Implement with a failing focused test before production code when feasible.",
      "Run focused test and pnpm quality:fast.",
      "Review against the spec, then review quality and risk.",
    ]);
  });
});
