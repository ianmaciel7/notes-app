import { readFileSync } from "node:fs";
import { fileURLToPath, URL } from "node:url";
import { expect, it } from "vitest";

const sourceRoot = fileURLToPath(new URL("../", import.meta.url));

function readSource(relativePath: string) {
  return readFileSync(new URL(relativePath, `file://${sourceRoot}/`), "utf8");
}

it("renders sidebar action menus with Capacities compact rows and framed icons", () => {
  const componentSource = readSource("components/app-sidebar-overview.tsx");
  const compactMenuSource = readSource("components/ui/compact-menu.tsx");

  expect(compactMenuSource).toContain("sidebarContextMenuItemClass");
  expect(compactMenuSource).toContain("sidebarContextMenuSeparatorClass");
  expect(componentSource).toContain("function CollectionMenuIcon");
  expect(componentSource).toContain('<CompactMenuIconFrame variant="ghost">');
  expect(componentSource).toContain("sidebarContextMenuItemClass");
  expect(componentSource).toContain("sidebarContextMenuSeparatorClass");
  expect(componentSource).not.toContain("collectionMenuItemClass");
});

it("keeps collection context menu actions aligned with the captured Capacities click options", () => {
  const componentSource = readSource("components/app-sidebar-overview.tsx");

  expect(componentSource).toContain('| "change-type"');
  expect(componentSource).toContain('| "present"');
  expect(componentSource).toContain('| "export"');
  expect(componentSource).toContain('| "copy"');
  expect(componentSource).toContain('t("documentMenu.unpinSidebar")');
  expect(componentSource).toContain('t("documentMenu.changeType")');
  expect(componentSource).toContain('t("documentMenu.present")');
  expect(componentSource).toContain('t("documentMenu.export")');
  expect(componentSource).toContain('t("documentMenu.copy")');
  expect(componentSource).toContain('t("documentMenu.duplicate")');
  expect(componentSource).toContain('t("documentMenu.deleteObject")');
  expect(componentSource).not.toContain('t("sidebarCollections.createObject"');
  expect(componentSource).not.toContain('t("objectTypeOverview.newFromTemplate")');
  expect(componentSource).not.toContain('t("sidebarCollections.deleteCollection")');
  expect(componentSource).not.toContain("<DropdownMenuSub>");
});

it("keeps pinned item menus on the same Capacities object action set", () => {
  const componentSource = readSource("components/app-sidebar-overview.tsx");

  const pinnedMenuSource = componentSource.slice(
    componentSource.indexOf("function AppSidebarPinnedMenu"),
    componentSource.indexOf("function AppSidebarPinnedRow"),
  );

  expect(pinnedMenuSource).toContain('t("lifecycle.task.open")');
  expect(pinnedMenuSource).toContain('t("documentMenu.unpinSidebar")');
  expect(pinnedMenuSource).toContain('t("documentMenu.changeType")');
  expect(pinnedMenuSource).toContain('t("documentMenu.typeSettings")');
  expect(pinnedMenuSource).toContain('t("documentMenu.share")');
  expect(pinnedMenuSource).toContain('t("documentMenu.present")');
  expect(pinnedMenuSource).toContain('t("documentMenu.export")');
  expect(pinnedMenuSource).toContain('t("documentMenu.import")');
  expect(pinnedMenuSource).toContain('t("documentMenu.copy")');
  expect(pinnedMenuSource).toContain('t("documentMenu.duplicate")');
  expect(pinnedMenuSource).toContain('t("documentMenu.deleteObject")');
  expect(pinnedMenuSource).not.toContain('t("sidebarPinned.openInSidePanel")');
  expect(pinnedMenuSource).not.toContain('t("sidebarPinned.openInNewTab")');
});
