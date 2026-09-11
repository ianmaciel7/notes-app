import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { describe, expect, it } from "vitest";

const repoRoot = process.cwd();

function walkSourceFiles(root: string): string[] {
  return readdirSync(root, { withFileTypes: true }).flatMap((entry) => {
    const path = join(root, entry.name);
    if (entry.isDirectory()) return walkSourceFiles(path);
    if (/\.(?:test|stories)\.(?:ts|tsx)$/.test(entry.name)) return [];
    return /\.(?:ts|tsx)$/.test(entry.name) ? [path] : [];
  });
}

describe("component location boundaries", () => {
  it("keeps src/components reserved for the global ui design system", () => {
    const componentsDir = join(repoRoot, "src", "components");
    const entries = readdirSync(componentsDir).filter((name) => !name.startsWith("."));
    const directories = entries
      .filter((name) => statSync(join(componentsDir, name)).isDirectory())
      .sort();
    const files = entries.filter((name) => statSync(join(componentsDir, name)).isFile()).sort();

    expect(directories).toEqual(["ui"]);
    expect(files).toEqual([]);
  });

  it("prevents shared hooks and lib from depending on private app components", () => {
    const roots = [join(repoRoot, "src", "hooks"), join(repoRoot, "src", "lib")];
    const offenders = roots.flatMap((root) =>
      walkSourceFiles(root).flatMap((file) => {
        const source = readFileSync(file, "utf8");
        return source.includes("@/app/_components/") ? [relative(repoRoot, file)] : [];
      }),
    );

    expect(offenders).toEqual([]);
  });
});
