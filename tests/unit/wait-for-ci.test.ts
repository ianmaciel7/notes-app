import { describe, expect, it } from "vitest";
import {
  addedLinesFromDiff,
  checkChanges,
  checkPaths,
  classifyRun,
  currentAttempt,
  DEFAULTS,
  EXIT,
  failedSteps,
  isForbiddenPath,
  overallOutcome,
  parseArgs,
  pollUntil,
  selectRuns,
  tailLines,
  waitForCi,
} from "../../scripts/wait-for-ci-lib.mjs";

describe("parseArgs", () => {
  it("returns defaults in wait mode", () => {
    expect(parseArgs([])).toEqual({
      ...DEFAULTS,
      mode: "wait",
      sha: undefined,
    });
  });

  it("reads flags and the check-paths mode", () => {
    const options = parseArgs([
      "--sha",
      "abc",
      "--max-attempts",
      "3",
      "--check-paths",
    ]);
    expect(options).toMatchObject({
      sha: "abc",
      maxAttempts: 3,
      mode: "check-paths",
    });
  });

  it("rejects unknown flags and invalid numbers", () => {
    expect(() => parseArgs(["--nope"])).toThrow("Unknown argument");
    expect(() => parseArgs(["--max-attempts", "0"])).toThrow("positive");
  });
});

describe("currentAttempt", () => {
  it("is zero without the trailer", () => {
    expect(currentAttempt("fix: thing\n\nCo-Authored-By: x")).toBe(0);
  });

  it("reads the trailer from the commit message", () => {
    expect(currentAttempt("fix(ci): thing\n\nCI-Fix-Attempt: 2\n")).toBe(2);
  });
});

describe("run classification", () => {
  it("keeps only the requested workflow", () => {
    const runs = [{ workflowName: "CI" }, { workflowName: "Claude Code" }];
    expect(selectRuns(runs, "CI")).toEqual([{ workflowName: "CI" }]);
  });

  it("maps status and conclusion", () => {
    expect(classifyRun({ status: "in_progress", conclusion: "" })).toBe(
      "pending",
    );
    expect(classifyRun({ status: "completed", conclusion: "success" })).toBe(
      "success",
    );
    expect(classifyRun({ status: "completed", conclusion: "cancelled" })).toBe(
      "cancelled",
    );
  });

  it("lists only failed steps of failed jobs", () => {
    const jobs = [
      {
        name: "Fast",
        conclusion: "failure",
        steps: [
          { name: "Lint", conclusion: "success" },
          { name: "Knip", conclusion: "failure" },
        ],
      },
      {
        name: "E2E",
        conclusion: "skipped",
        steps: [{ name: "Run", conclusion: "skipped" }],
      },
    ];
    expect(failedSteps(jobs)).toEqual(["Fast > Knip"]);
  });
});

describe("tailLines", () => {
  it("returns short text unchanged", () => {
    expect(tailLines("a\nb", 5)).toBe("a\nb");
  });

  it("keeps the last lines and reports the omitted count", () => {
    expect(tailLines("a\nb\nc\nd", 2)).toBe(
      "... (2 earlier lines omitted)\nc\nd",
    );
  });
});

describe("protected changes", () => {
  it("flags gate configs, workflows and read-only components", () => {
    expect(isForbiddenPath(".github/workflows/ci.yml")).toBe(true);
    expect(isForbiddenPath("knip.json")).toBe(true);
    expect(isForbiddenPath("src/components/firebase/auth.tsx")).toBe(true);
    expect(isForbiddenPath("src/lib/notes.ts")).toBe(false);
  });

  it("accepts a plain source fix", () => {
    const violations = checkChanges({
      changed: ["src/lib/notes.ts"],
      deleted: [],
      addedLines: ["const total = notes.length;"],
    });
    expect(violations).toEqual([]);
  });

  it("rejects deleted tests and added suppressions", () => {
    const violations = checkChanges({
      changed: ["src/lib/notes.test.ts"],
      deleted: ["tests/unit/notes.test.ts"],
      addedLines: ["  it.skip('works', () => {});", "// biome-ignore lint: x"],
    });
    expect(violations).toHaveLength(3);
  });

  it("extracts only added lines from a diff", () => {
    const diff = "+++ b/a.ts\n@@ -1 +1 @@\n-old\n+new\n context";
    expect(addedLinesFromDiff(diff)).toEqual(["new"]);
  });
});

const pass = { status: "completed", conclusion: "success" };
const fail = { status: "completed", conclusion: "failure" };
const running = { status: "in_progress", conclusion: "" };

function run(state: object, id = 1) {
  return { databaseId: id, event: "push", url: `https://gh/${id}`, ...state };
}

function makeDeps(responses: object[][], headMessage = "fix: x") {
  let clock = 0;
  let call = 0;
  const logs: string[] = [];
  const errors: string[] = [];
  return {
    logs,
    errors,
    log: (message: string) => logs.push(message),
    error: (message: string) => errors.push(message),
    sleep: async (ms: number) => {
      clock += ms;
    },
    now: () => clock,
    headSha: () => "abc",
    isPushed: () => true,
    headMessage: () => headMessage,
    listRuns: () => responses[Math.min(call++, responses.length - 1)],
    jobs: () => [
      {
        name: "Fast",
        conclusion: "failure",
        steps: [{ name: "Knip", conclusion: "failure" }],
      },
    ],
    failedLog: () => "knip: unused export",
  };
}

const waitOptions = { ...DEFAULTS, sha: undefined, mode: "wait" };

describe("pollUntil", () => {
  it("stops at the deadline when never done", async () => {
    let clock = 0;
    const result = await pollUntil({
      fetch: async () => "x",
      isDone: () => false,
      sleep: async (ms: number) => {
        clock += ms;
      },
      now: () => clock,
      intervalMs: 10,
      deadline: 25,
    });
    expect(result).toBe("x");
    expect(clock).toBe(30);
  });
});

describe("overallOutcome", () => {
  it("prefers failure over other non-success results", () => {
    expect(overallOutcome([run(pass)])).toBe("success");
    expect(
      overallOutcome([run(fail), run({ ...pass, conclusion: "cancelled" })]),
    ).toBe("failure");
    expect(overallOutcome([run({ ...pass, conclusion: "cancelled" })])).toBe(
      "human",
    );
  });
});

describe("waitForCi", () => {
  it("returns ok once the run succeeds", async () => {
    const deps = makeDeps([[run(running)], [run(pass)]]);
    expect(await waitForCi(waitOptions, deps)).toBe(EXIT.ok);
    expect(deps.logs).toContain("CI passed.");
  });

  it("waits for a run that is not yet registered", async () => {
    const deps = makeDeps([[], [], [run(pass)]]);
    expect(await waitForCi(waitOptions, deps)).toBe(EXIT.ok);
  });

  it("reports a usage error when no run ever appears", async () => {
    const deps = makeDeps([[]]);
    expect(await waitForCi(waitOptions, deps)).toBe(EXIT.usage);
  });

  it("reports a usage error when the commit is not pushed", async () => {
    const deps = { ...makeDeps([[run(pass)]]), isPushed: () => false };
    expect(await waitForCi(waitOptions, deps)).toBe(EXIT.usage);
  });

  it("prints logs and asks for the next attempt trailer on failure", async () => {
    const deps = makeDeps([[run(fail)]]);
    expect(await waitForCi(waitOptions, deps)).toBe(EXIT.failed);
    expect(deps.logs.join("\n")).toContain("Failed step: Fast > Knip");
    expect(deps.logs.join("\n")).toContain("knip: unused export");
    expect(deps.errors.join("\n")).toContain("CI-Fix-Attempt: 1");
  });

  it("stops for a human once the attempt limit is reached", async () => {
    const deps = makeDeps([[run(fail)]], "fix(ci): y\n\nCI-Fix-Attempt: 2");
    expect(await waitForCi(waitOptions, deps)).toBe(EXIT.needsHuman);
  });

  it("needs a human when the run is cancelled", async () => {
    const deps = makeDeps([[run({ ...pass, conclusion: "cancelled" })]]);
    expect(await waitForCi(waitOptions, deps)).toBe(EXIT.needsHuman);
  });

  it("needs a human when CI is still running at the timeout", async () => {
    const deps = makeDeps([[run(running)]]);
    const result = await waitForCi({ ...waitOptions, timeoutMinutes: 1 }, deps);
    expect(result).toBe(EXIT.needsHuman);
  });
});

describe("checkPaths", () => {
  const clean = {
    changed: ["src/a.ts"],
    deleted: [],
    diff: "+const a = 1;",
    untrackedTexts: [] as string[],
  };

  it("fails on suppressions inside untracked files", () => {
    const changes = () => ({
      ...clean,
      changed: ["src/new-fix.ts"],
      untrackedTexts: ["// @ts-ignore\nexport const x = 1;"],
    });
    const deps = { ...makeDeps([]), changes };
    expect(checkPaths(deps)).toBe(EXIT.forbiddenChange);
    expect(deps.errors.join("\n")).toContain("@ts-ignore");
  });

  it("passes a clean change set", () => {
    const deps = { ...makeDeps([]), changes: () => clean };
    expect(checkPaths(deps)).toBe(EXIT.ok);
  });

  it("fails on protected paths", () => {
    const changes = () => ({ ...clean, changed: ["knip.json"] });
    const deps = { ...makeDeps([]), changes };
    expect(checkPaths(deps)).toBe(EXIT.forbiddenChange);
    expect(deps.errors.join("\n")).toContain("knip.json");
  });
});
