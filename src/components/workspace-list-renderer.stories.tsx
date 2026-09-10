import type { Story, StoryDefault } from "@ladle/react";

import type { SpaceEntityRecord, SpaceObjectTypeRecord } from "@/lib/spaces/space-types";

import { WorkspaceListRenderer } from "./workspace-object-renderer";

export default {
  title: "Components / Workspace list renderer",
} satisfies StoryDefault;

const now = "2026-09-10T13:00:00.000Z";

function entityFixture(input: Partial<SpaceEntityRecord> = {}): SpaceEntityRecord {
  const objectTypeId = input.objectTypeId ?? "page";

  return {
    id: input.id ?? `entity-${objectTypeId}`,
    spaceId: input.spaceId ?? "personal",
    objectTypeId,
    type: input.type ?? objectTypeId,
    title: input.title ?? "Untitled object",
    createdAt: input.createdAt ?? now,
    updatedAt: input.updatedAt ?? now,
    blocks: input.blocks ?? [],
    tags: input.tags ?? [],
    relations: input.relations ?? [],
    properties: input.properties ?? {},
    _syncStatus: input._syncStatus ?? "pending",
  };
}

function objectTypeFixture(
  input: Partial<SpaceObjectTypeRecord> & Pick<SpaceObjectTypeRecord, "id" | "singularName">,
): SpaceObjectTypeRecord {
  return {
    id: input.id,
    spaceId: input.spaceId ?? "personal",
    ownership: input.ownership ?? "built-in",
    singularName: input.singularName,
    pluralName: input.pluralName ?? `${input.singularName}s`,
    iconName: input.iconName ?? "page",
    tone: input.tone ?? "blue",
    lifecycleKind: input.lifecycleKind ?? "document",
    propertyDefinitions: input.propertyDefinitions ?? [],
    collectionIds: input.collectionIds ?? [],
    presentation: input.presentation ?? {
      availableViews: ["list"],
      defaultView: "list",
    },
  };
}

function ListRendererFrame({ children }: { children: React.ReactNode }) {
  return <div className="h-screen min-h-0 w-full overflow-hidden bg-card">{children}</div>;
}

const objectTypes = [
  objectTypeFixture({
    id: "weblink",
    iconName: "weblink",
    singularName: "Weblink",
    tone: "blue",
  }),
  objectTypeFixture({
    id: "page",
    singularName: "Page",
    tone: "blue",
  }),
  objectTypeFixture({
    id: "flashcard",
    iconName: "flashcard",
    singularName: "Flashcard",
    tone: "violet",
  }),
  objectTypeFixture({
    id: "study_goal",
    iconName: "study-goal",
    singularName: "Study goal",
    tone: "lime",
  }),
];

export const MixedObjectList: Story = () => (
  <ListRendererFrame>
    <WorkspaceListRenderer
      entities={[
        entityFixture({
          id: "entity-weblink",
          objectTypeId: "weblink",
          properties: {
            description: "A saved reference with notes still pending.",
            url: "https://example.com/research/article",
          },
          title: "Research article",
        }),
        entityFixture({
          id: "entity-page",
          objectTypeId: "page",
          title: "Project notes",
        }),
      ]}
      objectTypes={objectTypes}
      tabName="Mixed objects"
    />
  </ListRendererFrame>
);

export const StudyObjectTypesPendingList: Story = () => (
  <ListRendererFrame>
    <WorkspaceListRenderer
      entities={[
        entityFixture({
          id: "entity-flashcard",
          objectTypeId: "flashcard",
          title: "Photosynthesis card",
        }),
        entityFixture({
          id: "entity-study-goal",
          objectTypeId: "study_goal",
          title: "Biology final",
        }),
      ]}
      objectTypes={objectTypes}
      tabName="Study objects"
    />
  </ListRendererFrame>
);

export const EmptyObjectList: Story = () => (
  <ListRendererFrame>
    <WorkspaceListRenderer entities={[]} objectTypes={objectTypes} tabName="Pages" />
  </ListRendererFrame>
);
