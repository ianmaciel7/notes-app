import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, resolve } from "node:path";
import { describe, expect, it } from "vitest";

const sourceRoot = resolve(process.cwd(), "src");

function collectSourceFiles(directory: string): string[] {
  return readdirSync(directory).flatMap((entry) => {
    const path = join(directory, entry);

    if (statSync(path).isDirectory()) {
      return collectSourceFiles(path);
    }

    return /\.(?:ts|tsx)$/.test(entry) ? [path] : [];
  });
}

describe("source architecture", () => {
  it("keeps shared contracts with their owning domain instead of src/types", () => {
    const legacyTypesDirectory = join(sourceRoot, "types");
    const legacyImportPrefix = ["@", "types"].join("/").concat("/");
    const legacyImports = collectSourceFiles(sourceRoot)
      .filter((path) => readFileSync(path, "utf8").includes(legacyImportPrefix))
      .map((path) => relative(sourceRoot, path));

    expect(existsSync(legacyTypesDirectory)).toBe(false);
    expect(legacyImports).toEqual([]);
  });

  it("does not keep the superseded generic note domain", () => {
    expect(existsSync(join(sourceRoot, "domain", "notes", "note.ts"))).toBe(
      false,
    );
  });
});
