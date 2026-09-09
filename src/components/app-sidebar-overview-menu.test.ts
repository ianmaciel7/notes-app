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
  const sharedStylesSource = readSource("components/ui/shared-styles.ts");

  expect(compactMenuSource).toContain("sidebarContextMenuItemClass");
  expect(compactMenuSource).toContain("sidebarContextMenuSeparatorClass");
  expect(compactMenuSource).toContain("bg-front");
  expect(compactMenuSource).toContain("border-front");
  expect(compactMenuSource).toContain("preview-card-core");
  expect(compactMenuSource).toContain("shadow-[var(--app-shadow-sidebar-popover)]");
  expect(compactMenuSource).toContain("select-none");
  expect(compactMenuSource).toContain("text-primary");
  expect(compactMenuSource).toContain("text-subtle");
  expect(sharedStylesSource).toContain("bg-front");
  expect(sharedStylesSource).toContain("border-front");
  expect(sharedStylesSource).toContain("text-primary");
  expect(componentSource).toContain("function CollectionMenuIcon");
  expect(componentSource).toContain('variant="ghost"');
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
  expect(componentSource).toContain("<DropdownMenuSub>");
  expect(componentSource).toContain("<DropdownMenuSubTrigger");
  expect(componentSource).toContain("<DropdownMenuSubContent");
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

it("keeps destructive object actions styled like Capacities with only the icon in red", () => {
  const componentSource = readSource("components/app-sidebar-overview.tsx");
  const pinnedMenuSource = componentSource.slice(
    componentSource.indexOf("function AppSidebarPinnedMenu"),
    componentSource.indexOf("function AppSidebarPinnedRow"),
  );
  const collectionMenuSource = componentSource.slice(
    componentSource.indexOf("function AppSidebarCollectionMenu"),
    componentSource.indexOf("function AppSidebarOverview"),
  );

  expect(pinnedMenuSource).not.toContain('variant="destructive"');
  expect(collectionMenuSource).not.toContain('variant="destructive"');
  expect(componentSource).toContain("text-red-500 dark:text-red-400");
});

it("uses the captured Capacities popup width and submenu affordances", () => {
  const compactMenuSource = readSource("components/ui/compact-menu.tsx");

  expect(compactMenuSource).toContain("w-[257px]");
  expect(compactMenuSource).toContain("w-auto min-w-[220px]");
  expect(compactMenuSource).toContain("data-popup-open:bg-[var(--app-bg-el)]");
});

it("keeps context submenu messages available for every locale", () => {
  const localeFiles = ["en.json", "es.json", "pt-BR.json"];

  for (const file of localeFiles) {
    const messages = JSON.parse(readSource(`messages/${file}`));
    expect(messages.workspace.documentMenu.openInView).toBeTruthy();
    expect(messages.workspace.documentMenu.openInViewShortcut).toBeTruthy();
    expect(messages.workspace.documentMenu.copyMarkdown).toBeTruthy();
    expect(messages.workspace.documentMenu.copyObjectReference).toBeTruthy();
  }
});
