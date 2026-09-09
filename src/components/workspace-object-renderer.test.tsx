import { renderToStaticMarkup } from "react-dom/server";
import { expect, it } from "vitest";

import {
  getWorkspaceWeblinkUrl,
  WorkspaceObjectRenderer,
  WorkspaceObjectTypeListView,
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

it("renders only objects belonging to the active object type", () => {
  const markup = renderToStaticMarkup(
    <WorkspaceObjectTypeListView
      entities={[
        entityFixture({
          objectTypeId: "study_goal",
          title: "Biology exam",
          blocks: [
            {
              id: "block-a",
              type: "paragraph",
              content: "Review respiratory physiology before Friday.",
            },
          ],
          tags: ["exam"],
        }),
        entityFixture({ id: "page-a", objectTypeId: "page", title: "Research notes" }),
      ]}
      objectType={objectTypeFixture()}
      tabName="Study goals"
    />,
  );

  expect(markup).toContain("Study goals");
  expect(markup).toContain("Visão geral");
  expect(markup).toContain("Tudo");
  expect(markup).toContain('data-slot="workspace-object-data-view"');
  expect(markup).toContain('data-slot="workspace-object-data-view-cards"');
  expect(markup).toContain("Biology exam");
  expect(markup).toContain("Review respiratory physiology before Friday.");
  expect(markup).toContain("exam");
  expect(markup).not.toContain("Research notes");
  expect(markup.match(/data-slot="workspace-object-type-list-item"/g)).toHaveLength(1);
  expect(markup.match(/data-slot="workspace-object-type-card-preview"/g)).toHaveLength(1);
  expect(markup).not.toContain("Implementation pending");
});

it("renders the Capacities-style split new action", () => {
  const markup = renderToStaticMarkup(
    <WorkspaceObjectTypeListView
      entities={[]}
      objectType={objectTypeFixture()}
      tabName="Study goals"
      onCreateEntity={() => {}}
    />,
  );

  expect(markup).toContain('data-slot="workspace-object-type-new-action"');
  expect(markup).toContain('data-slot="workspace-object-type-new-menu"');
  expect(markup).toContain("Novo Study goal");
});

it("keeps data-view cards legible and labels icon-only controls", () => {
  const markup = renderToStaticMarkup(
    <WorkspaceObjectTypeListView
      entities={[entityFixture({ objectTypeId: "study_goal", title: "Biology exam" })]}
      objectType={objectTypeFixture()}
      tabName="Study goals"
    />,
  );

  expect(markup).not.toContain('data-slot="workspace-object-type-list-item" class="min-w-0"><button disabled');
  expect(markup).toContain("!text-[var(--app-text-primary)]");
  expect(markup).toContain('aria-label="Buscar em Study goals"');
  expect(markup).toContain('aria-label="Recolher cabeçalho"');
  expect(markup).toContain('aria-label="Mais ações"');
  expect(markup).toContain('aria-label="Quantidade de objetos: 1 objeto"');
  expect(markup).toContain('aria-label="Filtrar objetos"');
  expect(markup).toContain('aria-label="Classificar objetos"');
  expect(markup).toContain('aria-label="Agrupar objetos"');
  expect(markup).toContain('aria-label="Escolher layout"');
});

it("renders an empty state when the active object type has no objects", () => {
  const markup = renderToStaticMarkup(
    <WorkspaceObjectTypeListView
      entities={[entityFixture({ objectTypeId: "page", title: "Research notes" })]}
      objectType={objectTypeFixture()}
      tabName="Study goals"
    />,
  );

  expect(markup).toContain("Ainda não há Study goals");
  expect(markup).toContain("Crie um(a) Study goal para adicionar aqui.");
  expect(markup).not.toContain("Implementation pending");
});
