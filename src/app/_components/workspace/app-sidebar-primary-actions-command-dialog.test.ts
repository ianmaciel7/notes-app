import { expect, it } from "vitest";
import { ObjectPageIcon } from "@/app/_components/objects/object-icons";
import {
  createNewContentMenuItems,
  createSidebarMainTabUpdate,
  getSidebarNavigationIntent,
  shouldHandlePrimaryActionOnPointerDown,
} from "@/app/_components/workspace/app-sidebar-primary-actions";
import {
  getVisibleCommandPaletteRecentItems,
  shouldCloseCommandPaletteAfterSelect,
  shouldOpenNewContentCommandDialogForEvent,
  shouldRenderCommandPaletteOpenInNewTabToggle,
} from "@/app/_components/workspace/app-sidebar-primary-actions-command-dialog";

it("keeps the compact new-object menu separate from the search command dialog", () => {
  expect(shouldOpenNewContentCommandDialogForEvent("workspace:open-new-palette")).toBe(false);
  expect(shouldOpenNewContentCommandDialogForEvent("workspace:open-command-palette")).toBe(true);
});

it("fires sidebar primary actions from click rather than pointerdown", () => {
  expect(shouldHandlePrimaryActionOnPointerDown()).toBe(false);
});

it("does not render the open-in-new-tab pill in the Capacities-style command palette", () => {
  expect(shouldRenderCommandPaletteOpenInNewTabToggle()).toBe(false);
});

it("closes the command palette after pointer selection", () => {
  expect(shouldCloseCommandPaletteAfterSelect("pointer")).toBe(true);
});

it("keeps keyboard selection as an explicit command submission", () => {
  expect(shouldCloseCommandPaletteAfterSelect("keyboard")).toBe(true);
});

it("keeps all recent command palette items visible like Capacities", () => {
  const items = [
    { id: "recent-1", kind: "recent" as const, title: "Latest", execute: () => {} },
    { id: "recent-2", kind: "recent" as const, title: "Older", execute: () => {} },
    { id: "recent-3", kind: "recent" as const, title: "Oldest", execute: () => {} },
  ];

  expect(getVisibleCommandPaletteRecentItems(items, "")).toEqual(items);
});

it("shows all matching recent command palette items once the user searches", () => {
  const items = [
    { id: "recent-1", kind: "recent" as const, title: "Definitions", execute: () => {} },
    { id: "recent-2", kind: "recent" as const, title: "Pages", execute: () => {} },
  ];

  expect(getVisibleCommandPaletteRecentItems(items, "pag")).toEqual(items);
});

it("offers to create a page from unmatched new-object menu text", () => {
  const items = createNewContentMenuItems(
    [
      {
        id: "page",
        label: "Pages",
        singularLabel: "Page",
        icon: ObjectPageIcon,
        tone: "blue",
        count: 0,
      },
    ],
    "llklk",
  );

  expect(items).toMatchObject([
    {
      id: "__create-page-from-query",
      label: "Criar 'llklk'",
      objectTypeId: "page",
      createTitle: "llklk",
      badgeLabel: "Page",
      isCreateFallback: true,
    },
  ]);
});

it("marks matching object type rows as direct menu actions with chevrons", () => {
  const items = createNewContentMenuItems(
    [
      {
        id: "page",
        label: "Pages",
        singularLabel: "Page",
        icon: ObjectPageIcon,
        tone: "blue",
        count: 0,
      },
    ],
    "pag",
  );

  expect(items).toMatchObject([
    {
      id: "page",
      label: "Page",
      objectTypeId: "page",
      hasChevron: true,
    },
  ]);
});

it("matches content type labels with accent-agnostic query normalization", () => {
  const items = createNewContentMenuItems(
    [
      {
        id: "note",
        label: "Anotações",
        singularLabel: "Nota",
        icon: ObjectPageIcon,
        tone: "blue",
        count: 0,
      },
    ],
    "anotacoes",
  );

  expect(items).toMatchObject([
    {
      id: "note",
      objectTypeId: "note",
      label: "Nota",
    },
  ]);
});

it("keeps create fallback for unmatched query while preserving singular labels", () => {
  const items = createNewContentMenuItems(
    [
      {
        id: "page",
        label: "Páginas",
        singularLabel: "Página",
        icon: ObjectPageIcon,
        tone: "blue",
        count: 0,
      },
    ],
    "novo texto",
  );

  expect(items).toMatchObject([
    {
      id: "__create-page-from-query",
      objectTypeId: "page",
      label: "Criar 'novo texto'",
      createTitle: "novo texto",
      badgeLabel: "Página",
      isCreateFallback: true,
    },
  ]);
});

it("routes sidebar modifier clicks like Capacities", () => {
  expect(getSidebarNavigationIntent()).toBe("current");
  expect(getSidebarNavigationIntent({ ctrlKey: true })).toBe("new-tab");
  expect(getSidebarNavigationIntent({ metaKey: true })).toBe("new-tab");
  expect(getSidebarNavigationIntent({ shiftKey: true })).toBe("side-panel");
  expect(getSidebarNavigationIntent({ ctrlKey: true, shiftKey: true })).toBe("side-panel");
  expect(getSidebarNavigationIntent({ __sidebarNavigationIntent: "new-tab", ctrlKey: false })).toBe(
    "new-tab",
  );
});

it("opens a ctrl-clicked sidebar item in a new tab without replacing the current tab", () => {
  const currentTabs = [
    { id: "page", label: "Pages", draggable: true },
    { id: "image", label: "Images", draggable: true },
  ];

  const result = createSidebarMainTabUpdate({
    currentTabs,
    mainValue: "page",
    intent: "new-tab",
    nextTab: { id: "pdf", label: "PDFs" },
    newTabId: "pdf:fixed",
  });

  expect(result.mainValue).toBe("pdf:fixed");
  expect(result.tabs).toEqual([
    { id: "page", label: "Pages", draggable: true },
    { id: "image", label: "Images", draggable: true },
    { id: "pdf:fixed", label: "PDFs", draggable: true },
  ]);
});

it("opens repeated ctrl-clicks on the same pinned item as separate tab instances", () => {
  const firstOpen = createSidebarMainTabUpdate({
    currentTabs: [{ id: "page", label: "Pages", draggable: true }],
    mainValue: "page",
    intent: "new-tab",
    nextTab: { id: "entity-zzz", label: "Untitled zzz" },
    newTabId: "entity-zzz:one",
  });
  const secondOpen = createSidebarMainTabUpdate({
    currentTabs: firstOpen.tabs,
    mainValue: firstOpen.mainValue,
    intent: "new-tab",
    nextTab: { id: "entity-zzz", label: "Untitled zzz" },
    newTabId: "entity-zzz:two",
  });

  expect(secondOpen.mainValue).toBe("entity-zzz:two");
  expect(secondOpen.tabs.map((tab) => tab.id)).toEqual([
    "page",
    "entity-zzz:one",
    "entity-zzz:two",
  ]);
});

it("preserves a pinned entity tab when opening its base id normally after ctrl-click", () => {
  const result = createSidebarMainTabUpdate({
    currentTabs: [
      { id: "page", label: "Pages", draggable: true },
      { id: "entity-zzz:one", label: "Untitled zzz", draggable: true },
    ],
    mainValue: "entity-zzz:one",
    intent: "current",
    nextTab: { id: "entity-zzz", label: "Untitled zzz" },
  });

  expect(result.mainValue).toBe("entity-zzz");
  expect(result.tabs.map((tab) => tab.id)).toEqual(["page", "entity-zzz"]);
});

it("replaces the active sidebar tab on a normal click", () => {
  const result = createSidebarMainTabUpdate({
    currentTabs: [
      { id: "page", label: "Pages", draggable: true },
      { id: "image", label: "Images", draggable: true },
    ],
    mainValue: "page",
    intent: "current",
    nextTab: { id: "pdf", label: "PDFs" },
  });

  expect(result.mainValue).toBe("pdf");
  expect(result.tabs).toEqual([
    { id: "pdf", label: "PDFs", draggable: true },
    { id: "image", label: "Images", draggable: true },
  ]);
});
