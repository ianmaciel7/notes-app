import { expect, it } from "vitest";

import { createNewContentMenuItems } from "@/components/app-sidebar-primary-actions";
import { shouldOpenNewContentCommandDialogForEvent } from "@/components/app-sidebar-primary-actions-command-dialog";
import { ObjectPageIcon } from "@/components/object-icons";

it("keeps the compact new-object menu separate from the search command dialog", () => {
  expect(shouldOpenNewContentCommandDialogForEvent("workspace:open-new-palette")).toBe(false);
  expect(shouldOpenNewContentCommandDialogForEvent("workspace:open-command-palette")).toBe(true);
});

it("offers to create a page from unmatched new-object menu text", () => {
  const items = createNewContentMenuItems(
    [{ id: "page", label: "Pages", singularLabel: "Page", icon: ObjectPageIcon, tone: "blue" }],
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
    [{ id: "page", label: "Pages", singularLabel: "Page", icon: ObjectPageIcon, tone: "blue" }],
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
    [{ id: "note", label: "Anotações", singularLabel: "Nota", icon: ObjectPageIcon, tone: "blue" }],
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
    [{ id: "page", label: "Páginas", singularLabel: "Página", icon: ObjectPageIcon, tone: "blue" }],
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
