import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const globalsCss = readFileSync(join(process.cwd(), "src/app/globals.css"), "utf8");

describe("global appearance stylesheet", () => {
  it("keeps the editor and floating UI appearance contracts from the reference worktrees", () => {
    expect(globalsCss).toContain('@source "../../node_modules/@blocknote/shadcn"');
    expect(globalsCss).toContain(".notes-block-editor");
    expect(globalsCss).toContain(".preview-card-core");
    expect(globalsCss).toContain("--app-dropdown-shortcut-text");
    expect(globalsCss).toContain("--app-object-type-control-bg");
    expect(globalsCss).toContain("--type-label-bg-blue");
  });
});
