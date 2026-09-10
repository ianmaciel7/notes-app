import { expect, it } from "vitest";

import { ObjectPageIcon, ObjectStudyGoalIcon } from "@/components/object-icons";
import { presentWorkspaceObjectType } from "@/components/space-object-type-presenter";

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

it("maps the persisted study goal icon name to its UI icon", () => {
  const value = presentWorkspaceObjectType(
    {
      id: "study_goal",
      spaceId: "personal",
      ownership: "built-in",
      singularName: "Study goal",
      pluralName: "Study goals",
      iconName: "study-goal",
      tone: "lime",
      lifecycleKind: "document",
      propertyDefinitions: [],
      collectionIds: [],
      presentation: { defaultView: "list", availableViews: ["list"] },
    },
    1,
  );

  expect(value.iconName).toBe("study-goal");
  expect(value.icon).toBe(ObjectStudyGoalIcon);
  expect(value.label).toBe("Study goals");
  expect(value.tone).toBe("lime");
});

it("keeps built-in study goal visuals canonical when persisted metadata drifts", () => {
  const value = presentWorkspaceObjectType(
    {
      id: "study_goal",
      spaceId: "personal",
      ownership: "built-in",
      singularName: "Study goal",
      pluralName: "Study goals",
      iconName: "project",
      tone: "green",
      lifecycleKind: "document",
      propertyDefinitions: [],
      collectionIds: [],
      presentation: { defaultView: "list", availableViews: ["list"] },
    },
    1,
  );

  expect(value.iconName).toBe("study-goal");
  expect(value.icon).toBe(ObjectStudyGoalIcon);
  expect(value.tone).toBe("lime");
});

it("uses localized built-in object type labels for presentation without changing persisted metadata", () => {
  const value = presentWorkspaceObjectType(
    {
      id: "study_goal",
      spaceId: "personal",
      ownership: "built-in",
      singularName: "Study goal",
      pluralName: "Study goals",
      iconName: "study-goal",
      tone: "lime",
      lifecycleKind: "document",
      propertyDefinitions: [],
      collectionIds: [],
      presentation: { defaultView: "list", availableViews: ["list"] },
    },
    1,
    {
      plurals: { study_goal: "Metas de estudo" },
      singulars: { study_goal: "Meta de estudo" },
    },
  );

  expect(value.label).toBe("Metas de estudo");
  expect(value.singularLabel).toBe("Meta de estudo");
  expect(value.iconName).toBe("study-goal");
});
