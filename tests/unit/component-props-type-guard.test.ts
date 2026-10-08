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

const guard = "component-props-type";

// One declaration per line so the diagnostic line number identifies the case.
const cases = [
  { valid: true, code: "type A1Props = PropsWithChildren<{ a: string }>;" },
  {
    valid: true,
    code: 'type A2Props = React.ComponentProps<"div"> & { a: string };',
  },
  {
    valid: true,
    code: 'type A3Props = Omit<ComponentProps<"select">, "size"> & { a: string };',
  },
  {
    valid: true,
    code: "interface A4Props extends HTMLAttributes<HTMLDivElement> { a: string }",
  },
  {
    valid: true,
    code: "type A5Props = VariantProps<typeof v> & { a: string };",
  },
  { valid: true, code: "type A6Props = SomeUpstreamProps;" },
  { valid: true, code: "type NotAComponentShape = { a: string };" },
  { valid: true, code: "type A7Props = { children: ReactNode; a: string };" },
  {
    valid: true,
    code: "type A8Props = DetailedHTMLProps<A, B> & { a: string };",
  },
  {
    valid: true,
    code: "type A9Props = ButtonHTMLAttributes<HTMLButtonElement> & { a: string };",
  },
  {
    valid: true,
    code: 'type A10Props = JSX.IntrinsicElements["div"] & { a: string };',
  },
  { valid: true, code: 'type A11Props = PageProps<"/blog/[slug]">;' },
  {
    valid: true,
    code: "export function ValidNamedProps(props: A1Props) { return null; }",
  },
  {
    valid: true,
    code: 'export function ValidComponentProps(props: ComponentProps<"div">) { return null; }',
  },
  { valid: true, code: "export function helper() { return null; }" },
  { valid: true, code: "export function useHelper() { return null; }" },
  { valid: false, code: "type B1Props = { a: string };" },
  { valid: false, code: "export type B2Props = { onClose: () => void };" },
  { valid: false, code: "interface B3Props { a: string }" },
  { valid: false, code: "export interface B4Props { a: string }" },
  {
    valid: false,
    code: "export function InlineProps({ a }: { a: string }) { return a; }",
  },
  { valid: false, code: "export function NoProps() { return null; }" },
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
  const location = new RegExp(`${file}:([0-9]+):[0-9]+ plugin`, "g");
  const lines = new Set<number>();
  for (const match of `${result.stdout}${result.stderr}`.matchAll(location)) {
    lines.add(Number(match[1]));
  }
  return [...lines].sort((a, b) => a - b);
}

describe("component props type guard", () => {
  beforeAll(() => {
    workDir = mkdtempSync(join(tmpdir(), "props-type-guard-"));
    mkdirSync(join(workDir, "grit"));
    copyFileSync(
      join("grit", "shadcn", `${guard}.grit`),
      join(workDir, "grit", `${guard}.grit`),
    );
    writeFileSync(
      join(workDir, "biome.json"),
      JSON.stringify({
        linter: { enabled: true, rules: { recommended: false } },
        plugins: [`./grit/${guard}.grit`],
      }),
    );
    const body = cases.map((c) => c.code).join("\n");
    writeFileSync(join(workDir, "props.tsx"), `${body}\n`);
    writeFileSync(join(workDir, "props.ts"), `${body}\n`);
    writeFileSync(
      join(workDir, "page.tsx"),
      "export default function Page() { return null; }\n",
    );
  });

  afterAll(() => {
    rmSync(workDir, { recursive: true, force: true });
  });

  it("flags only bare object-literal *Props types in .tsx files", () => {
    const invalidLines = cases
      .map((c, i) => (c.valid ? 0 : i + 1))
      .filter(Boolean);
    expect(flaggedLines("props.tsx")).toEqual(invalidLines);
  }, 60_000);

  it("ignores non-component .ts files", () => {
    expect(flaggedLines("props.ts")).toEqual([]);
  }, 60_000);

  it("ignores Next route special files", () => {
    expect(flaggedLines("page.tsx")).toEqual([]);
  }, 60_000);
});
