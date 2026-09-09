import { renderToStaticMarkup } from "react-dom/server";
import { expect, it } from "vitest";

import {
  WorkspaceObjectListRenderer,
  WorkspaceObjectRenderer,
  getWorkspaceWeblinkUrl,
} from "@/components/workspace-object-renderer";
import type { SpaceEntityRecord, SpaceObjectTypeRecord } from "@/lib/spaces/space-types";

function entityFixture(input: Partial<SpaceEntityRecord> = {}): SpaceEntityRecord {
  return {
    id: input.id ?? "entity-a",
    spaceId: input.spaceId ?? "personal",
    objectTypeId: input.objectTypeId ?? "page",
    type: input.type ?? input.objectTypeId ?? "page",
    title: input.title ?? "Untitled object",
    createdAt: input.createdAt ?? "2026-01-01T00:00:00.000Z",
    updatedAt: input.updatedAt ?? "2026-01-01T00:00:00.000Z",
    blocks: input.blocks ?? [],
    tags: input.tags ?? [],
    relations: input.relations ?? [],
    properties: input.properties ?? {},
    _syncStatus: input._syncStatus ?? "pending",
  };
}

function objectTypeFixture(input: Partial<SpaceObjectTypeRecord> = {}): SpaceObjectTypeRecord {
  return {
    id: input.id ?? "study_goal",
    spaceId: input.spaceId ?? "personal",
    ownership: input.ownership ?? "built-in",
    singularName: input.singularName ?? "Study goal",
    pluralName: input.pluralName ?? "Study goals",
    iconName: input.iconName ?? "study-goal",
    tone: input.tone ?? "lime",
    lifecycleKind: input.lifecycleKind ?? "document",
    propertyDefinitions: input.propertyDefinitions ?? [],
    collectionIds: input.collectionIds ?? [],
    presentation: input.presentation ?? { defaultView: "list", availableViews: ["list"] },
  };
}

it("extracts the saved URL from a weblink object", () => {
  expect(
    getWorkspaceWeblinkUrl(
      entityFixture({
        objectTypeId: "weblink",
        properties: { url: "https://example.com/article" },
      }),
    ),
  ).toBe("https://example.com/article");
});

it("renders weblink objects with their URL", () => {
  const markup = renderToStaticMarkup(
    <WorkspaceObjectRenderer
      entity={entityFixture({
        objectTypeId: "weblink",
        properties: {
          description: "A saved article",
          url: "https://example.com/article",
        },
        title: "Example article",
      })}
      tabName="Example article"
    />,
  );

  expect(markup).toContain("Example article");
  expect(markup).toContain("https://example.com/article");
  expect(markup).toContain("A saved article");
});

it("renders unfinished object types through PendingImplementation", () => {
  const markup = renderToStaticMarkup(
    <WorkspaceObjectRenderer entity={entityFixture({ objectTypeId: "page" })} tabName="Pages" />,
  );

  expect(markup).toContain("Page object");
  expect(markup).toContain("Implementation pending");
  expect(markup.match(/data-slot="pending-implementation"/g)).toHaveLength(1);
  expect(markup).toContain('data-variant="workspace"');
  expect(markup).toContain('data-slot="pending-implementation-card"');
});

it("renders object type list tabs with a list-specific pending surface", () => {
  const markup = renderToStaticMarkup(
    <WorkspaceObjectListRenderer
      entities={[entityFixture({ objectTypeId: "study_goal", title: "Biology exam" })]}
      objectType={objectTypeFixture()}
      tabName="Study goals"
    />,
  );

  expect(markup).toContain("Study goals list");
  expect(markup).toContain("Object type list");
  expect(markup.match(/data-slot="pending-implementation"/g)).toHaveLength(1);
  expect(markup).toContain('data-variant="workspace"');
  expect(markup).toContain('data-slot="pending-implementation-card"');
  expect(markup).not.toContain("Study goal object");
  expect(markup).not.toContain("1 object");
  expect(markup).not.toContain("Biology exam");
});
