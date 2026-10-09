// @vitest-environment node

import { readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";
import { describe, expect, it } from "vitest";
import {
  type ComponentFile,
  componentFileNameMessage,
  findComponentFileNameViolations,
} from "./component-file-name-guard-lib";

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

describe("component file name guard", () => {
  it("reports a component file with a mismatched provider export", () => {
    expect(
      findComponentFileNameViolations([
        source(
          "src/app/_components/theme.tsx",
          "export function ThemeProvider() {}\nexport function useTheme() {}",
        ),
      ]),
    ).toEqual([
      {
        path: "src/app/_components/theme.tsx",
        exportedComponents: ["ThemeProvider"],
        expectedFileName: "theme-provider.tsx",
      },
    ]);
  });

  it("reports a mismatched single export and export-list form", () => {
    expect(
      findComponentFileNameViolations([
        source(
          "src/app/_components/wrong.tsx",
          "export const RightName = () => null;",
        ),
        source(
          "src/app/_components/wrong-list.tsx",
          "export { Foo, Bar as WrongName };",
        ),
      ]),
    ).toEqual([
      {
        path: "src/app/_components/wrong.tsx",
        exportedComponents: ["RightName"],
        expectedFileName: "right-name.tsx",
      },
      {
        path: "src/app/_components/wrong-list.tsx",
        exportedComponents: ["Foo", "WrongName"],
        expectedFileName: "foo.tsx",
      },
    ]);
  });

  it("accepts matching names, aliases, extra exports, and default exports", () => {
    expect(
      findComponentFileNameViolations([
        source(
          "src/app/_components/theme-provider.tsx",
          "export function ThemeProvider() {}",
        ),
        source(
          "src/app/_components/github-sign-in-button.tsx",
          "export function GitHubSignInButton() {}",
        ),
        source(
          "src/app/_components/card.tsx",
          "export function Card() {}\nexport function CardTitle() {}\nexport const cardValue = 1;",
        ),
        source(
          "src/app/_components/fallback.tsx",
          "export default function Fallback() {}",
        ),
        source(
          "src/app/_components/alias.tsx",
          "const Alias = () => null; export { Alias };",
        ),
      ]),
    ).toEqual([]);
  });

  it("ignores special files, reserved directories, and files without components", () => {
    expect(
      findComponentFileNameViolations([
        source("src/app/page.tsx", "export function Page() {}"),
        source("src/app/layout.tsx", "export function RootLayout() {}"),
        source(
          "src/components/ui/button.tsx",
          "export function WrongName() {}",
        ),
        source(
          "src/components/firebase/provider.tsx",
          "export function WrongName() {}",
        ),
        source(
          "src/app/_components/use-theme.tsx",
          "export function useTheme() {}\nexport type Theme = string;",
        ),
      ]),
    ).toEqual([]);
  });

  it("passes for every component file in the real source tree", () => {
    expect(
      findComponentFileNameViolations(sourceFiles()),
      componentFileNameMessage,
    ).toEqual([]);
  });
});
