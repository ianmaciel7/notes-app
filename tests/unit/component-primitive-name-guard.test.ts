// @vitest-environment node

import { readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";
import { describe, expect, it } from "vitest";
import {
  type ComponentFile,
  componentPrimitiveNameMessage,
  findComponentPrimitiveNameViolations,
} from "./component-primitive-name-guard-lib";

function source(path: string, value: string): ComponentFile {
  return { path, source: value };
}
function sourceFiles(): ComponentFile[] {
  const root = join(process.cwd(), "src");
  return readdirSync(root, { recursive: true, withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith(".tsx"))
    .map((entry) => {
      const filePath = join(entry.parentPath, entry.name);
      return {
        path: relative(process.cwd(), filePath),
        source: readFileSync(filePath, "utf8"),
      };
    });
}

describe("component primitive name guard", () => {
  it("reports a root DropdownMenu with a mismatched component name", () => {
    expect(
      findComponentPrimitiveNameViolations([
        source(
          "src/app/_components/theme-toggle.tsx",
          'import { DropdownMenu } from "@/components/ui/dropdown-menu";\nexport function ThemeToggle() { return <DropdownMenu />; }',
        ),
      ]),
    ).toEqual([
      {
        path: "src/app/_components/theme-toggle.tsx",
        exportedComponents: ["ThemeToggle"],
        primitive: "DropdownMenu",
        expectedNameHint:
          "include `DropdownMenu` in the component name (e.g. ThemeToggle -> ThemeToggleDropdownMenu)",
      },
    ]);
  });
  it("accepts a named DropdownMenu root", () => {
    expect(
      findComponentPrimitiveNameViolations([
        source(
          "src/app/_components/theme-dropdown-menu.tsx",
          'import { DropdownMenu } from "@/components/ui/dropdown-menu";\nexport function ThemeDropdownMenu() { return <DropdownMenu />; }',
        ),
      ]),
    ).toEqual([]);
  });
  it("requires the full AlertDialog name", () => {
    expect(
      findComponentPrimitiveNameViolations([
        source(
          "src/app/_components/confirm-dialog.tsx",
          'import { AlertDialog } from "@/components/ui/alert-dialog";\nexport function ConfirmDialog() { return <AlertDialog />; }',
        ),
      ]),
    ).toEqual([
      expect.objectContaining({
        primitive: "AlertDialog",
        exportedComponents: ["ConfirmDialog"],
      }),
    ]);
  });
  it("ignores nested primitives and imports from another path", () => {
    expect(
      findComponentPrimitiveNameViolations([
        source(
          "src/app/_components/card.tsx",
          'import { Card } from "@/components/ui/card";\nimport { DropdownMenu } from "@/components/ui/dropdown-menu";\nexport function CardShell() { return <Card><DropdownMenu /></Card>; }',
        ),
        source(
          "src/app/_components/custom.tsx",
          'import { DropdownMenu } from "@/other/dropdown-menu";\nexport function Custom() { return <DropdownMenu />; }',
        ),
      ]),
    ).toEqual([]);
  });
  it("ignores special files and reserved directories", () => {
    expect(
      findComponentPrimitiveNameViolations([
        source(
          "src/app/page.tsx",
          'import { Dialog } from "@/components/ui/dialog";\nexport function Page() { return <Dialog />; }',
        ),
        source(
          "src/components/ui/dialog.tsx",
          'import { Dialog } from "@/components/ui/dialog";\nexport function WrongName() { return <Dialog />; }',
        ),
        source(
          "src/components/firebase/provider.tsx",
          'import { Dialog } from "@/components/ui/dialog";\nexport function WrongName() { return <Dialog />; }',
        ),
      ]),
    ).toEqual([]);
  });
  it("passes for every component file in the real source tree", () => {
    expect(
      findComponentPrimitiveNameViolations(sourceFiles()),
      componentPrimitiveNameMessage,
    ).toEqual([]);
  });
});
