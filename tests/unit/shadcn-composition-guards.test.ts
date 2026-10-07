import { spawnSync } from "node:child_process";
import {
  copyFileSync,
  mkdirSync,
  mkdtempSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { createRequire } from "node:module";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

const guards = [
  "compound-component-anatomy",
  "overlay-composition",
  "group-composition",
];

const pairs: { owner: string; part: string; wrap?: string }[] = [
  { owner: "Alert", part: "AlertDescription" },
  { owner: "Field", part: "FieldLabel" },
  { owner: "Dialog", part: "DialogTrigger" },
  // DialogContent is itself a part that must sit under Dialog.
  { owner: "DialogContent", part: "DialogHeader", wrap: "Dialog" },
  { owner: "SelectGroup", part: "SelectItem" },
];

// One fixture per line so the diagnostic line number identifies the case.
const cases = [
  { valid: true, jsx: (o: string, p: string) => `<${o}><${p}>x</${p}></${o}>` },
  {
    valid: true,
    jsx: (o: string, p: string) => `<${o}><div><${p}>x</${p}></div></${o}>`,
  },
  {
    valid: true,
    jsx: (o: string, p: string) =>
      `<section><${o}><${p}>x</${p}></${o}></section>`,
  },
  {
    valid: true,
    jsx: (o: string, p: string) => `<${o}><${o}>i</${o}><${p}>x</${p}></${o}>`,
  },
  { valid: false, jsx: (_: string, p: string) => `<div><${p}>x</${p}></div>` },
  {
    valid: false,
    jsx: (o: string, p: string) => `<div><${o} /><${p}>x</${p}></div>`,
  },
  {
    valid: false,
    jsx: (o: string, p: string) =>
      `<div><${o}><p>t</p></${o}><${p}>x</${p}></div>`,
  },
];

const biomeBin = createRequire(import.meta.url).resolve(
  "@biomejs/biome/bin/biome",
);
let workDir = "";

function flaggedLines(file: string) {
  const result = spawnSync(
    process.execPath,
    [biomeBin, "lint", `--config-path=${workDir}`, file],
    { cwd: workDir, encoding: "utf8" },
  );
  const escapedName = file.replace(/[\\/]/g, "[\\\\/]");
  const location = new RegExp(`${escapedName}:(\\d+):\\d+ plugin`, "g");
  const lines = new Set<number>();
  for (const match of `${result.stdout}${result.stderr}`.matchAll(location)) {
    lines.add(Number(match[1]));
  }
  return [...lines].sort((a, b) => a - b);
}

describe("shadcn composition guards", () => {
  beforeAll(() => {
    workDir = mkdtempSync(join(tmpdir(), "shadcn-guards-"));
    mkdirSync(join(workDir, "grit"));
    for (const guard of guards) {
      copyFileSync(
        join("grit", "shadcn", `${guard}.grit`),
        join(workDir, "grit", `${guard}.grit`),
      );
    }
    writeFileSync(
      join(workDir, "biome.json"),
      JSON.stringify({
        linter: { enabled: true, rules: { recommended: false } },
        plugins: guards.map((guard) => `./grit/${guard}.grit`),
      }),
    );
    for (const { owner, part, wrap } of pairs) {
      const body = cases
        .map((c, i) => {
          const jsx = c.jsx(owner, part);
          const wrapped = wrap ? `<${wrap}>${jsx}</${wrap}>` : jsx;
          return `export const C${i} = () => ${wrapped};`;
        })
        .join("\n");
      writeFileSync(join(workDir, `${part}.tsx`), `${body}\n`);
    }
  });

  afterAll(() => {
    rmSync(workDir, { recursive: true, force: true });
  });

  for (const { owner, part } of pairs) {
    it(`${part} is accepted only inside its own ${owner}`, () => {
      const invalidLines = cases
        .map((c, i) => (c.valid ? 0 : i + 1))
        .filter(Boolean);
      expect(flaggedLines(`${part}.tsx`)).toEqual(invalidLines);
    }, 60_000);
  }
});
