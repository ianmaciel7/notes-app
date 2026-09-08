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
