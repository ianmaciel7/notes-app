import { spawn } from "node:child_process";

export type QualityCommandResult = {
  command: string;
  exitCode: number;
  stdout: string;
  stderr: string;
  timedOut?: boolean;
};

export type StopInput = {
  terminationReason?: string;
  fullyIdle?: boolean;
  executionNum?: number;
};

const RELEVANT_EXTENSIONS = new Set([
  ".cjs",
  ".css",
  ".cts",
  ".js",
  ".json",
  ".jsx",
  ".mjs",
  ".mts",
  ".ts",
  ".tsx",
  ".yaml",
  ".yml",
]);

const RELEVANT_BASENAMES = new Set([
  "biome.json",
  "components.json",
  "dependency-cruiser.config.cjs",
  "knip.json",
  "next.config.ts",
  "package.json",
  "playwright.config.ts",
  "pnpm-lock.yaml",
  "pnpm-workspace.yaml",
  "tsconfig.json",
  "vitest.config.ts",
]);

const RELEVANT_PREFIXES = [
  ".agents/hooks",
  ".agents/hooks.json",
  ".agents/rules",
  ".cursor/hooks",
  ".cursor/hooks.json",
  ".cursor/rules",
  ".github/workflows",
  "scripts/",
  "src/",
  "tests/",
];

export function hasRelevantQualityChanges(paths: string[]): boolean {
  return paths.some((path) => {
    const normalized = path.replaceAll("\\", "/");
    const basename = normalized.split("/").at(-1) ?? normalized;
    const extension = basename.includes(".") ? `.${basename.split(".").at(-1)}` : "";

    return (
      RELEVANT_BASENAMES.has(basename) ||
      RELEVANT_EXTENSIONS.has(extension) ||
      RELEVANT_PREFIXES.some((prefix) => normalized.startsWith(prefix))
    );
  });
}

export function buildCursorStopResponse(
  result: QualityCommandResult,
  loopCount = 0,
): {
  followup_message?: string;
} {
  if (result.exitCode === 0 || loopCount >= 2) {
    return {};
  }

  return { followup_message: buildFailureMessage(result) };
}

export function buildAntigravityStopResponse(
  input: StopInput,
  result: QualityCommandResult,
): { decision: "" | "continue"; reason?: string } {
  const canContinue =
    result.exitCode !== 0 &&
    input.terminationReason === "model_stop" &&
    input.fullyIdle === true &&
    (input.executionNum ?? 1) < 3;

  if (!canContinue) {
    return { decision: "" };
  }

  return {
    decision: "continue",
    reason: buildFailureMessage(result),
  };
}

export function runQualityCommand(
  command: string,
  args: string[],
  options: { timeoutMs: number; cwd?: string },
): Promise<QualityCommandResult> {
  return new Promise((resolve) => {
    const child = spawn(command, args, {
      cwd: options.cwd,
      shell: false,
      windowsHide: true,
    });
    const chunks = { stdout: "", stderr: "" };
    let settled = false;
    const timer = setTimeout(() => {
      settled = true;
      child.kill("SIGTERM");
      resolve({
        command: [command, ...args].join(" "),
        exitCode: 124,
        stdout: chunks.stdout,
        stderr: chunks.stderr,
        timedOut: true,
      });
    }, options.timeoutMs);

    child.stdout.on("data", (chunk: Buffer) => {
      chunks.stdout += chunk.toString("utf8");
    });
    child.stderr.on("data", (chunk: Buffer) => {
      chunks.stderr += chunk.toString("utf8");
    });
    child.on("error", (error) => {
      if (settled) {
        return;
      }
      settled = true;
      clearTimeout(timer);
      resolve({
        command: [command, ...args].join(" "),
        exitCode: 1,
        stdout: chunks.stdout,
        stderr: error.message,
      });
    });
    child.on("close", (code) => {
      if (settled) {
        return;
      }
      settled = true;
      clearTimeout(timer);
      resolve({
        command: [command, ...args].join(" "),
        exitCode: code ?? 1,
        stdout: chunks.stdout,
        stderr: chunks.stderr,
      });
    });
  });
}

function buildFailureMessage(result: QualityCommandResult): string {
  const output = [result.stdout.trim(), result.stderr.trim()].filter(Boolean).join("\n\n");

  return `${result.command} failed with exit code ${result.exitCode}. Fix the reported issues, rerun the relevant checks, and do not declare the implementation complete until the gate passes.${
    output ? `\n\n${truncate(output, 4000)}` : ""
  }`;
}

function truncate(value: string, maxLength: number): string {
  if (value.length <= maxLength) {
    return value;
  }

  return `${value.slice(0, maxLength - 15)}\n[output truncated]`;
}
