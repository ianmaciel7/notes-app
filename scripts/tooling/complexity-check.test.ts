import { execFile } from "node:child_process";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { promisify } from "node:util";
import { describe, expect, test } from "vitest";

const execFileAsync = promisify(execFile);
const SCRIPT_PATH = join(process.cwd(), "scripts/quality/check-complexity.mjs");

describe("cyclomatic complexity gate", () => {
  test("passes TS and TSX fixtures within the configured limit", async () => {
    const fixtureRoot = await mkdtemp(join(tmpdir(), "complexity-pass "));

    try {
      await writeFile(
        join(fixtureRoot, "simple.ts"),
        "export function simple(value?: string) { return value ?? 'fallback'; }\n",
      );
      await writeFile(
        join(fixtureRoot, "component.tsx"),
        "export function Badge({ ok }: { ok: boolean }) { return <span>{ok ? 'Yes' : 'No'}</span>; }\n",
      );

      const { stdout } = await execFileAsync(process.execPath, [
        SCRIPT_PATH,
        "--root",
        fixtureRoot,
        "--max",
        "10",
      ]);

      expect(stdout).toContain("PASS");
      expect(stdout).toContain("2 files");
    } finally {
      await rm(fixtureRoot, { recursive: true, force: true });
    }
  }, 10_000);

  test("fails with file, function, location, and value when the limit is exceeded", async () => {
    const fixtureRoot = await mkdtemp(join(tmpdir(), "complexity-fail "));

    try {
      await writeFile(
        join(fixtureRoot, "too-complex.ts"),
        `export function tooComplex(value: number) {
  if (value === 1) return 1;
  if (value === 2) return 2;
  if (value === 3) return 3;
  if (value === 4) return 4;
  if (value === 5) return 5;
  if (value === 6) return 6;
  if (value === 7) return 7;
  if (value === 8) return 8;
  if (value === 9) return 9;
  if (value === 10) return 10;
  return 0;
}
`,
      );

      await expect(
        execFileAsync(process.execPath, [SCRIPT_PATH, "--root", fixtureRoot, "--max", "10"]),
      ).rejects.toMatchObject({
        code: 1,
        stdout: expect.stringContaining("tooComplex"),
      });
    } finally {
      await rm(fixtureRoot, { recursive: true, force: true });
    }
  }, 10_000);

  test("fails when no source files are analyzed", async () => {
    const fixtureRoot = await mkdtemp(join(tmpdir(), "complexity-empty "));

    try {
      await expect(
        execFileAsync(process.execPath, [SCRIPT_PATH, "--root", fixtureRoot, "--max", "10"]),
      ).rejects.toMatchObject({
        code: 1,
        stdout: expect.stringContaining("No source files"),
      });
    } finally {
      await rm(fixtureRoot, { recursive: true, force: true });
    }
  });
});

test("reports malformed TypeScript rather than silently accepting it", async () => {
  const root = await mkdtemp(join(tmpdir(), "complexity-syntax "));
  try {
    await writeFile(join(root, "invalid.ts"), "export function broken( {");
    await expect(
      execFileAsync(process.execPath, [SCRIPT_PATH, "--root", root]),
    ).rejects.toMatchObject({ code: 1, stdout: expect.stringContaining("could not be analyzed") });
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("counts nested callbacks independently using their original source locations", async () => {
  const root = await mkdtemp(join(tmpdir(), "complexity-nested "));
  try {
    await writeFile(
      join(root, "nested.ts"),
      `export function outer() {
  return (value: number) => { if (value > 0) return 1; if (value < 0) return -1; return 0; };
}`,
    );
    await expect(
      execFileAsync(process.execPath, [SCRIPT_PATH, "--root", root, "--max", "2"]),
    ).rejects.toMatchObject({
      code: 1,
      stdout: expect.stringContaining("nested.ts:2 <anonymous> cyclomatic=3"),
    });
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
