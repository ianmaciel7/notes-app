import { execFile } from "node:child_process";
import { resolve } from "node:path";
import { promisify } from "node:util";
import {
  buildAntigravityStopResponse,
  buildCursorStopResponse,
  hasRelevantQualityChanges,
  type QualityCommandResult,
  runQualityCommand,
} from "../../src/tooling/quality-hooks.ts";

const execFileAsync = promisify(execFile);
const QUALITY_TIMEOUT_MS = 120_000;
const INSTALLED_CHECKS = [
  ["@biomejs/biome/bin/biome", "format", "."],
  ["@biomejs/biome/bin/biome", "lint", "."],
  ["next/dist/bin/next", "typegen"],
  ["typescript/bin/tsc", "--noEmit"],
];

async function runInstalledChecks(): Promise<QualityCommandResult> {
  const deadline = Date.now() + QUALITY_TIMEOUT_MS;
  let result: QualityCommandResult | undefined;
  for (const [path, ...args] of INSTALLED_CHECKS) {
    result = await runQualityCommand(process.execPath, [resolve("node_modules", path), ...args], {
      cwd: process.cwd(),
      timeoutMs: Math.max(1, deadline - Date.now()),
    });
    if (result.exitCode !== 0) return result;
  }
  if (!result) throw new Error("No quality checks are configured.");
  return result;
}

async function collectChangedFiles(): Promise<string[]> {
  const commands = [
    ["diff", "--name-only", "--cached", "-z"],
    ["diff", "--name-only", "-z"],
    ["ls-files", "--others", "--exclude-standard", "-z"],
  ];
  const results = await Promise.all(
    commands.map(async (args) => {
      const { stdout } = await execFileAsync("git", args, { cwd: process.cwd() });
      return stdout.split("\0").filter(Boolean);
    }),
  );
  return [...new Set(results.flat())];
}

async function readInput(): Promise<Record<string, unknown>> {
  const chunks: Buffer[] = [];
  for await (const chunk of process.stdin) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  const text = Buffer.concat(chunks).toString("utf8").trim();
  const input: unknown = text ? JSON.parse(text) : {};
  if (typeof input !== "object" || input === null || Array.isArray(input)) {
    throw new Error("Quality hook input must be a JSON object.");
  }
  return input as Record<string, unknown>;
}

function printJson(value: unknown): void {
  process.stdout.write(`${JSON.stringify(value)}\n`);
}

async function handleStop(mode: "cursor-stop" | "antigravity-stop", input: Record<string, unknown>) {
  const changedFiles = await collectChangedFiles();
  if (!hasRelevantQualityChanges(changedFiles)) {
    printJson(mode === "antigravity-stop" ? { decision: "" } : {});
    return;
  }
  const result = await runInstalledChecks();
  printJson(
    mode === "cursor-stop"
      ? buildCursorStopResponse(result, Number(input.loop_count ?? 0))
      : buildAntigravityStopResponse(
          {
            terminationReason: String(input.terminationReason ?? ""),
            fullyIdle: input.fullyIdle === true,
            executionNum: Number(input.executionNum ?? 1),
          },
          result,
        ),
  );
}

async function main() {
  const mode = process.argv[2];
  const input = await readInput();
  if (mode === "cursor-after-file-edit") {
    const path = String(input.file_path ?? "")
      .replaceAll("\\", "/")
      .replace(`${process.cwd().replaceAll("\\", "/")}/`, "");
    printJson(
      hasRelevantQualityChanges([path])
        ? {
            additional_context:
              "A quality-relevant file changed. Follow docs/code-quality.md and the selected workflow in docs/ai-development-flow.md. Report actual check results before declaring completion.",
          }
        : {},
    );
    return;
  }
  if (mode === "antigravity-post-tool-use") {
    printJson({});
    return;
  }
  if (mode === "cursor-stop" || mode === "antigravity-stop") {
    await handleStop(mode, input);
    return;
  }
  throw new Error(`Unknown quality hook mode: ${String(mode)}`);
}

main().catch((error: unknown) => {
  printJson({ error: error instanceof Error ? error.message : "Unknown hook failure" });
  process.exitCode = 1;
});
