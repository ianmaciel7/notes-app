import { readdirSync } from "node:fs";
import { join, relative } from "node:path";
import { describe, expect, it } from "vitest";
import {
  findMisplacedComponentFiles,
  misplacedComponentFileMessage,
} from "./components-layer-structure-lib";

function componentFiles(): string[] {
  const root = join(process.cwd(), "src", "components");

  return readdirSync(root, { recursive: true, withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) =>
      relative(process.cwd(), join(entry.parentPath, entry.name)),
    );
}

describe("components layer structure guard", () => {
  it("rejects non-components outside reserved component directories", () => {
    const paths = [
      "src/components/notes-app/foo.ts",
      "src/components/ui/x.ts",
      "src/components/firebase/y.ts",
      "src/components/notes-app/z.tsx",
    ];

    expect(findMisplacedComponentFiles(paths)).toEqual([
      "src/components/notes-app/foo.ts",
    ]);
  });

  it("keeps application components to TSX files", () => {
    const misplaced = findMisplacedComponentFiles(componentFiles());

    expect(misplaced, misplacedComponentFileMessage).toEqual([]);
  });
});
