import type { Story, StoryDefault } from "@ladle/react";

import type { SpaceEntityRecord, SpaceObjectTypeRecord } from "@/lib/spaces/space-types";

import { WorkspaceObjectRenderer } from "./workspace-object-renderer";

export default {
  title: "Components / Workspace object renderer",
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

function ObjectRendererFrame({ children }: { children: React.ReactNode }) {
  return <div className="h-screen min-h-0 w-full overflow-hidden bg-card">{children}</div>;
}

const pageType = objectTypeFixture({
  id: "page",
  singularName: "Page",
  tone: "blue",
});

export const WeblinkWithUrl: Story = () => (
  <ObjectRendererFrame>
    <WorkspaceObjectRenderer
      entity={entityFixture({
        id: "entity-weblink",
        objectTypeId: "weblink",
        properties: {
          description: "A saved reference with notes still pending.",
          url: "https://example.com/research/article",
        },
        title: "Research article",
      })}
      tabName="Research article"
    />
  </ObjectRendererFrame>
);

export const WeblinkMissingUrl: Story = () => (
  <ObjectRendererFrame>
    <WorkspaceObjectRenderer
      entity={entityFixture({
        id: "entity-weblink-missing-url",
        objectTypeId: "weblink",
        title: "Saved link without URL",
      })}
      tabName="Saved link without URL"
    />
  </ObjectRendererFrame>
);

export const PagePending: Story = () => (
  <ObjectRendererFrame>
    <WorkspaceObjectRenderer
      entity={entityFixture({
        id: "entity-page",
        objectTypeId: "page",
        title: "Project notes",
      })}
      objectType={pageType}
      tabName="Project notes"
    />
  </ObjectRendererFrame>
);
