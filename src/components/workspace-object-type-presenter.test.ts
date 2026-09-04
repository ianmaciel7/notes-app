import { expect, it } from "vitest";

import { ObjectPageIcon } from "@/components/object-icons";
import { presentWorkspaceObjectType } from "@/components/workspace-object-type-presenter";

it("maps persisted object type metadata to the existing UI icon and labels", () => {
  const value = presentWorkspaceObjectType(
    {
      id: "page",
      spaceId: "personal",
      ownership: "built-in",
      singularName: "Page",
      pluralName: "Pages",
      iconName: "page",
      tone: "blue",
      lifecycleKind: "document",
      propertyDefinitions: [],
      collectionIds: [],
      presentation: { defaultView: "list", availableViews: ["list"] },
    },
    2,
  );

  expect(value.icon).toBe(ObjectPageIcon);
  expect(value.label).toBe("Pages");
  expect(value.singularLabel).toBe("Page");
  expect(value.count).toBe(2);
});
