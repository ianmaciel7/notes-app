import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, test } from "vitest";

import {
  buildAntigravityStopResponse,
  buildCursorStopResponse,
  hasRelevantQualityChanges,
  runQualityCommand,
} from "./quality-hooks";

describe("hasRelevantQualityChanges", () => {
  test("ignores documentation-only changes", () => {
    expect(hasRelevantQualityChanges(["README.md", "docs/code-quality.md"])).toBe(false);
  });

  test("treats source, tests, lockfiles, and tool configuration as relevant", () => {
    expect(
      hasRelevantQualityChanges([
        "src/components/app-sidebar.tsx",
        "tests/sidebar.spec.ts",
        "pnpm-lock.yaml",
        ".cursor/hooks.json",
      ]),
    ).toBe(true);
  });
});

describe("Cursor stop responses", () => {
  test("asks the agent to continue with actionable diagnostics when quality fails", () => {
    const response = buildCursorStopResponse({
      command: "pnpm quality:fast",
      exitCode: 1,
      stdout: "lint failed",
      stderr: "",
    });

    expect(response).toEqual({
      followup_message:
        "pnpm quality:fast failed with exit code 1. Fix the reported issues, rerun the relevant checks, and do not declare the implementation complete until the gate passes.\n\nlint failed",
    });
  });

  test("stays silent when quality passes or the loop limit is already reached", () => {
    expect(
      buildCursorStopResponse({
        command: "pnpm quality:fast",
        exitCode: 0,
        stdout: "ok",
        stderr: "",
      }),
    ).toEqual({});
    expect(
      buildCursorStopResponse(
        {
          command: "pnpm quality:fast",
          exitCode: 1,
          stdout: "still failing",
          stderr: "",
        },
        2,
      ),
    ).toEqual({});
  });
});

describe("Antigravity stop responses", () => {
  test("continues only for an idle model stop with remaining attempts", () => {
    const response = buildAntigravityStopResponse(
      { terminationReason: "model_stop", fullyIdle: true, executionNum: 1 },
      {
        command: "pnpm quality:fast",
        exitCode: 1,
        stdout: "",
        stderr: "type error",
      },
    );

    expect(response).toEqual({
      decision: "continue",
      reason:
        "pnpm quality:fast failed with exit code 1. Fix the reported issues, rerun the relevant checks, and do not declare the implementation complete until the gate passes.\n\ntype error",
    });
  });

  test("allows stop on pass, cancellation, busy state, or exhausted attempts", () => {
    const failed = {
      command: "pnpm quality:fast",
      exitCode: 1,
      stdout: "failed",
      stderr: "",
    };

    expect(
      buildAntigravityStopResponse(
        { terminationReason: "model_stop", fullyIdle: true, executionNum: 1 },
        { ...failed, exitCode: 0 },
      ),
    ).toEqual({ decision: "" });
    expect(
      buildAntigravityStopResponse(
        { terminationReason: "user_cancelled", fullyIdle: true, executionNum: 1 },
        failed,
      ),
    ).toEqual({ decision: "" });
    expect(
      buildAntigravityStopResponse(
        { terminationReason: "model_stop", fullyIdle: false, executionNum: 1 },
        failed,
      ),
    ).toEqual({ decision: "" });
    expect(
      buildAntigravityStopResponse(
        { terminationReason: "model_stop", fullyIdle: true, executionNum: 3 },
        failed,
      ),
    ).toEqual({ decision: "" });
  });
});

describe("runQualityCommand", () => {
  test("propagates the command exit code and captures output", async () => {
    const result = await runQualityCommand(
      process.execPath,
      ["-e", "console.error('bad'); process.exit(7)"],
      {
        timeoutMs: 5_000,
      },
    );

    expect(result.exitCode).toBe(7);
    expect(result.stderr).toContain("bad");
  });

  test("fails on timeout without reporting success", async () => {
    const result = await runQualityCommand(
      process.execPath,
      ["-e", "setTimeout(() => {}, 10000)"],
      {
        timeoutMs: 50,
      },
    );

    expect(result.exitCode).toBe(124);
    expect(result.timedOut).toBe(true);
  });

  test("handles paths with spaces", async () => {
    const dir = await mkdtemp(join(tmpdir(), "quality path "));
    const file = join(dir, "fixture file.txt");

    try {
      await writeFile(file, "hello", "utf8");

      const result = await runQualityCommand(
        process.execPath,
        [
          "-e",
          "const fs = require('node:fs'); console.log(fs.readFileSync(process.argv[1], 'utf8'))",
          file,
        ],
        { timeoutMs: 5_000 },
      );

      expect(result.exitCode).toBe(0);
      expect(result.stdout.trim()).toBe("hello");
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });
});
