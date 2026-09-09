import { readFileSync } from "node:fs";
import { fileURLToPath, URL } from "node:url";
import { expect, it } from "vitest";

const sourceRoot = fileURLToPath(new URL("../", import.meta.url));

function readSource(relativePath: string) {
  return readFileSync(new URL(relativePath, `file://${sourceRoot}/`), "utf8");
}

it("renders collection action menus with Capacities compact rows and framed icons", () => {
  const componentSource = readSource("components/app-sidebar-overview.tsx");

  expect(componentSource).toContain("collectionMenuItemClass");
  expect(componentSource).toContain("function CollectionMenuIcon");
  expect(componentSource).toContain('<CompactMenuIconFrame variant="ghost">');
  expect(componentSource).toContain("workspaceOverflowMenuItemClass");
  expect(componentSource).toContain("h-base");
  expect(componentSource).toContain('cn(sidebarContextMenuContentClass, "p-1.5")');
  expect(componentSource).toContain("border-b-[0.5px]");
});
