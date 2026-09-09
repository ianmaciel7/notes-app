import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath, URL } from "node:url";
import { expect, it } from "vitest";

const sourceRoot = fileURLToPath(new URL("../", import.meta.url));
const componentsRoot = join(sourceRoot, "components");

function listComponentSources(directory: string): string[] {
  return readdirSync(directory).flatMap((entry) => {
    const absolutePath = join(directory, entry);
    const stats = statSync(absolutePath);
    if (stats.isDirectory()) return listComponentSources(absolutePath);
    if (!/\.(tsx|ts)$/.test(entry)) return [];
    if (/\.(test|stories)\.(tsx|ts)$/.test(entry)) return [];
    return [absolutePath];
  });
}

it("keeps component color values in global CSS tokens", () => {
  const disallowedColorPatterns = [
    /oklch\(/,
    /#[0-9a-fA-F]{3,8}/,
    /color-mix\(/,
    /\b(?:bg|text|border|ring)-(?:black|white)\b/,
    /rgb\(/,
    /rgba\(/,
  ];
  const allowedSelectorLiterals = [
    /\[stroke='#[0-9a-fA-F]{3,8}'\]/,
    /shadow-\[/,
    /bg-black\//,
    /bg-white/,
  ];

  const offenders = listComponentSources(componentsRoot).flatMap((filePath) => {
    const relativePath = relative(sourceRoot, filePath).replaceAll("\\", "/");
    return readFileSync(filePath, "utf8")
      .split(/\r?\n/)
      .flatMap((line, index) => {
        if (allowedSelectorLiterals.some((pattern) => pattern.test(line))) return [];
        if (!disallowedColorPatterns.some((pattern) => pattern.test(line))) return [];
        return [`${relativePath}:${index + 1}: ${line.trim()}`];
      });
  });

  expect(offenders).toEqual([]);
});
