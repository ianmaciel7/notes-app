import { execFile } from "node:child_process";
import { promisify } from "node:util";
import {
  buildAntigravityStopResponse,
  buildCursorStopResponse,
  hasRelevantQualityChanges,
  runQualityCommand,
  type QualityCommandResult,
} from "../../src/tooling/quality-hooks";

const execFileAsync = promisify(execFile);
const QUALITY_FAST_TIMEOUT_MS = 120_000;

type HookMode =
  | "cursor-after-file-edit"
  | "cursor-stop"
  | "antigravity-post-tool-use"
  | "antigravity-stop";

async function main() {
  const mode = process.argv[2] as HookMode | undefined;
  const input = await readJsonFromStdin();

  if (mode === "cursor-after-file-edit") {
    handleCursorAfterFileEdit(input);
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

  printJson({ error: `Unknown quality hook mode: ${String(mode)}` });
  process.exitCode = 1;
}

function handleCursorAfterFileEdit(input: Record<string, unknown>) {
  const filePath = String(input.file_path ?? "");
  printJson(
    hasRelevantQualityChanges([toRepositoryPath(filePath)])
      ? {
          additional_context:
            "A quality-relevant file changed. Run the relevant checks after the edit sequence and pnpm verify before declaring the implementation complete.",
        }
      : {},
  );
}

async function handleStop(
  mode: "cursor-stop" | "antigravity-stop",
  input: Record<string, unknown>,
) {
  const changedFiles = await collectChangedFiles();
  if (!hasRelevantQualityChanges(changedFiles)) {
    printJson(mode === "antigravity-stop" ? { decision: "" } : {});
    return;
  }

  const result = await runQualityFast();
  printJson(
    mode === "cursor-stop"
      ? buildCursorOutput(result, input)
      : buildAntigravityOutput(result, input),
  );
}

function buildCursorOutput(result: QualityCommandResult, input: Record<string, unknown>) {
  return buildCursorStopResponse(result, Number(input.loop_count ?? 0));
}

function buildAntigravityOutput(result: QualityCommandResult, input: Record<string, unknown>) {
  return buildAntigravityStopResponse(
    {
      terminationReason: String(input.terminationReason ?? ""),
      fullyIdle: input.fullyIdle === true,
      executionNum: Number(input.executionNum ?? 1),
    },
    result,
  );
}

async function runQualityFast(): Promise<QualityCommandResult> {
  const pnpm = process.platform === "win32" ? "pnpm.cmd" : "pnpm";

  return runQualityCommand(pnpm, ["quality:fast"], {
    cwd: process.cwd(),
    timeoutMs: QUALITY_FAST_TIMEOUT_MS,
  });
}

async function collectChangedFiles(): Promise<string[]> {
  const commands = [
    ["diff", "--name-only", "--cached"],
    ["diff", "--name-only"],
    ["ls-files", "--others", "--exclude-standard"],
  ];
  const results = await Promise.all(
    commands.map(async (args) => {
      try {
        const { stdout } = await execFileAsync("git", args, { cwd: process.cwd() });
        return stdout.split(/\r?\n/).filter(Boolean);
      } catch {
        return [];
      }
    }),
  );

  return [...new Set(results.flat())];
}

async function readJsonFromStdin(): Promise<Record<string, unknown>> {
  const chunks: Buffer[] = [];
  for await (const chunk of process.stdin) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  const text = Buffer.concat(chunks).toString("utf8").trim();
  if (!text) {
    return {};
  }

  try {
    return JSON.parse(text) as Record<string, unknown>;
  } catch (error) {
    return { parseError: error instanceof Error ? error.message : "Invalid JSON" };
  }
}

function toRepositoryPath(path: string): string {
  return path.replaceAll("\\", "/").replace(`${process.cwd().replaceAll("\\", "/")}/`, "");
}

function printJson(value: unknown): void {
  process.stdout.write(`${JSON.stringify(value)}\n`);
}

main().catch((error: unknown) => {
  printJson({ error: error instanceof Error ? error.message : "Unknown hook failure" });
  process.exitCode = 1;
});
