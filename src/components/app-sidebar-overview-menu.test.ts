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
  const globalsSource = readSource("app/globals.css");
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
  expect(globalsSource).toContain(
    "0 3px 5px #00000003, 0 5px 10px #00000005, 0 10px 14px #00000003",
  );
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
  expect(componentSource).toContain('| "copy-markdown"');
  expect(componentSource).toContain('| "copy-reference"');
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
  expect(componentSource).toContain('action("copy-markdown")');
  expect(componentSource).toContain('action("copy-reference")');
});

it("keeps object type context menus aligned with the captured Capacities type options", () => {
  const componentSource = readSource("components/app-sidebar-overview.tsx");

  const objectTypeMenuSource = componentSource.slice(
    componentSource.indexOf("function AppSidebarObjectTypeMenu({"),
    componentSource.indexOf("function AppSidebarObjectTypeRow"),
  );

  expect(objectTypeMenuSource).toContain("onOpenObjectType?.()");
  expect(objectTypeMenuSource).toContain("onCreateEntity?.(objectType.id");
  expect(objectTypeMenuSource).toContain('action("new-from-template")');
  expect(objectTypeMenuSource).toContain('action("new-query")');
  expect(objectTypeMenuSource).toContain('action("new-collection")');
  expect(objectTypeMenuSource).toContain('t("objectTypeMenu.open")');
  expect(objectTypeMenuSource).toContain('t("objectTypeMenu.createObject"');
  expect(objectTypeMenuSource).toContain('t("objectTypeMenu.newFromTemplate")');
  expect(objectTypeMenuSource).toContain('t("objectTypeMenu.newQuery")');
  expect(objectTypeMenuSource).toContain('t("objectTypeMenu.newCollection")');
  expect(objectTypeMenuSource).toContain('t("objectTypeMenu.pinSidebar")');
  expect(objectTypeMenuSource).toContain('t("documentMenu.typeSettings")');
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
  expect(pinnedMenuSource).not.toContain("const pendingAction");
  expect(pinnedMenuSource).toContain('action("copy-markdown")');
  expect(pinnedMenuSource).toContain('action("copy-reference")');
});

it("makes pinned and object type rows draggable without adding visible handles", () => {
  const componentSource = readSource("components/app-sidebar-overview.tsx");
  const paritySource = readSource("components/app-sidebar-overview-parity.tsx");

  const pinnedRowSource = componentSource.slice(
    componentSource.indexOf("function AppSidebarPinnedRow"),
    componentSource.indexOf("function AppSidebarObjectTypeMenu({"),
  );
  const objectTypeRowSource = componentSource.slice(
    componentSource.indexOf("function AppSidebarObjectTypeRow"),
    componentSource.indexOf("function AppSidebarAddSection"),
  );

  expect(pinnedRowSource).toContain("draggable={draggable}");
  expect(pinnedRowSource).not.toContain("row-drag-handle");
  expect(objectTypeRowSource).toContain("draggable={draggable}");
  expect(objectTypeRowSource).toContain("onDragStart={onDragStart}");
  expect(objectTypeRowSource).toContain("onDragEnd={onDragEnd}");
  expect(objectTypeRowSource).toContain("data-object-type-id={objectType.id}");
  expect(objectTypeRowSource).toContain("onPointerEnter={handleObjectTypeDragOverTarget}");
  expect(objectTypeRowSource).toContain("onMouseEnter={handleObjectTypeDragOverTarget}");
  expect(objectTypeRowSource).toContain("onDragOverTarget();");
  expect(objectTypeRowSource).not.toContain("row-drag-handle");
  expect(componentSource).toContain('setObjectSort("manual")');
  expect(paritySource).toContain('draggable={objectSort === "manual"}');
  expect(paritySource).toContain(
    'onDragStart={() => setDrag({ kind: "object-type", id: objectType.id })}',
  );
  expect(paritySource).toContain('data-slot="app-sidebar-pinned-region"');
  expect(paritySource).toContain("function handlePinnedDrop");
  expect(paritySource).toContain("setPinned((current) => [");
});

it("persists object type ordering in the active space", () => {
  const controllerSource = readSource("components/space-controller.tsx");
  const dataSource = readSource("hooks/use-space-data.ts");

  expect(controllerSource).toContain("OBJECT_TYPE_ORDER_SETTING_KEY");
  expect(controllerSource).toContain("setSpaceSetting(spaceId, OBJECT_TYPE_ORDER_SETTING_KEY");
  expect(dataSource).toContain("getSpaceSetting(activeSpaceId, OBJECT_TYPE_ORDER_SETTING_KEY)");
});

it("renders delete object menu actions in the destructive color", () => {
  const componentSource = readSource("components/app-sidebar-overview.tsx");
  const compactMenuSource = readSource("components/ui/compact-menu.tsx");
  const globalsSource = readSource("app/globals.css");
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
  expect(globalsSource).toContain("--destructive-menu-action:");
  expect(compactMenuSource).toContain("var(--destructive-menu-action)");
  expect(compactMenuSource).toContain("sidebarContextMenuDestructiveItemClass");
  expect(pinnedMenuSource).toContain("sidebarContextMenuDestructiveItemClass");
  expect(collectionMenuSource).toContain("sidebarContextMenuDestructiveItemClass");
  expect(pinnedMenuSource).toContain('className="text-[var(--destructive-menu-action)]"');
  expect(collectionMenuSource).toContain('className="text-[var(--destructive-menu-action)]"');
  expect(pinnedMenuSource).toContain('className="[&_*]:!text-[var(--destructive-menu-action)]"');
  expect(collectionMenuSource).toContain(
    'className="[&_*]:!text-[var(--destructive-menu-action)]"',
  );
  expect(componentSource).not.toContain("text-red-500 dark:text-red-400");
});

it("uses the captured Capacities popup width and submenu affordances", () => {
  const compactMenuSource = readSource("components/ui/compact-menu.tsx");
  const overflowRowSource = compactMenuSource.slice(
    compactMenuSource.indexOf("const workspaceOverflowMenuItemClass"),
    compactMenuSource.indexOf("const sidebarContextMenuItemClass"),
  );

  expect(compactMenuSource).toContain("w-[255px]");
  expect(compactMenuSource).toContain("rounded-[12px]");
  expect(compactMenuSource).toContain("rounded-[12px] border border-[var(--app-border-front)]");
  expect(compactMenuSource).toContain("border-b-[0.5px] border-[var(--app-border-front)]");
  expect(compactMenuSource).toContain("w-auto min-w-[220px]");
  expect(compactMenuSource).toContain("data-popup-open:bg-[var(--app-bg-el)]");
  expect(overflowRowSource).toContain("leading-5");
  expect(overflowRowSource).not.toContain("leading-normal");
});

it("keeps object type settings as an enabled Capacities context menu item", () => {
  const componentSource = readSource("components/app-sidebar-overview.tsx");
  const objectTypeMenuSource = componentSource.slice(
    componentSource.indexOf("function AppSidebarObjectTypeMenu({"),
    componentSource.indexOf("function AppSidebarObjectTypeRow"),
  );

  expect(objectTypeMenuSource).toContain("<DropdownMenuItem");
  expect(objectTypeMenuSource).toContain("onClick={openSettings}");
  expect(objectTypeMenuSource).toContain("sidebarContextMenuItemClass");
  expect(objectTypeMenuSource).not.toContain("disabled={!editable}");
});

it("keeps object type menus aligned with the captured Capacities option set", () => {
  const componentSource = readSource("components/app-sidebar-overview.tsx");
  const objectTypeMenuSource = componentSource.slice(
    componentSource.indexOf("function AppSidebarObjectTypeMenu({"),
    componentSource.indexOf("function AppSidebarObjectTypeRow"),
  );

  expect(objectTypeMenuSource).toContain('tWorkspace("lifecycle.task.open")');
  expect(objectTypeMenuSource).toContain('tSidebar("createObject"');
  expect(objectTypeMenuSource).toContain('tOverview("newFromTemplate")');
  expect(objectTypeMenuSource).toContain('tOverview("newQuery")');
  expect(objectTypeMenuSource).toContain('tOverview("newCollection")');
  expect(objectTypeMenuSource).toContain('tWorkspace("documentMenu.pinSidebar")');
  expect(objectTypeMenuSource).toContain('tOverview("typeSettings")');
  expect(objectTypeMenuSource).toContain('tWorkspace("documentMenu.import")');
  expect(objectTypeMenuSource).toContain("<DropdownMenuSub>");
  expect(objectTypeMenuSource).toContain("<DropdownMenuSubTrigger");
  expect(objectTypeMenuSource).toContain("<DropdownMenuSubContent");
  expect(objectTypeMenuSource).not.toContain('t("details.delete")');
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
