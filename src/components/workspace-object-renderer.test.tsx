import { readFileSync } from "node:fs";
import { fileURLToPath, URL } from "node:url";
import { renderToStaticMarkup } from "react-dom/server";
import { expect, it } from "vitest";

import {
  getWorkspaceWeblinkUrl,
  WorkspaceListRenderer,
  WorkspaceObjectRenderer,
  WorkspaceObjectTypeListView,
} from "@/components/workspace-object-renderer";
import type { SpaceEntityRecord, SpaceObjectTypeRecord } from "@/lib/spaces/space-types";

const projectRoot = fileURLToPath(new URL("../../", import.meta.url));

function readProjectSource(relativePath: string) {
  return readFileSync(new URL(relativePath, `file://${projectRoot}/`), "utf8");
}

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

it("renders page objects with their saved blocks instead of a pending placeholder", () => {
  const markup = renderToStaticMarkup(
    <WorkspaceObjectRenderer
      entity={entityFixture({
        objectTypeId: "page",
        title: "Research notes",
        blocks: [
          {
            id: "block-heading",
            type: "heading_2",
            content: "Chapter 1",
          },
          {
            id: "block-body",
            type: "paragraph",
            content: "Cellular respiration summary.",
          },
        ],
        properties: { status: "draft" },
        tags: ["biology"],
      })}
      objectType={objectTypeFixture({
        id: "page",
        singularName: "Page",
        pluralName: "Pages",
        iconName: "page",
        tone: "blue",
      })}
      tabName="Pages"
    />,
  );

  expect(markup).toContain("Research notes");
  expect(markup).toContain("Chapter 1");
  expect(markup).toContain("Cellular respiration summary.");
  expect(markup).toContain("biology");
  expect(markup).toContain("draft");
  expect(markup).not.toContain("Implementation pending");
});

it("renders a workspace object list with each entity using the object renderer", () => {
  const markup = renderToStaticMarkup(
    <WorkspaceListRenderer
      entities={[
        entityFixture({
          id: "entity-weblink",
          objectTypeId: "weblink",
          properties: { url: "https://example.com/article" },
          title: "Example article",
        }),
        entityFixture({
          id: "entity-flashcard",
          objectTypeId: "flashcard",
          title: "Photosynthesis card",
        }),
      ]}
      objectTypes={[
        objectTypeFixture({ id: "weblink", singularName: "Weblink", pluralName: "Weblinks" }),
        objectTypeFixture({
          id: "flashcard",
          singularName: "Flashcard",
          pluralName: "Flashcards",
        }),
      ]}
      tabName="Study objects"
    />,
  );

  expect(markup).toContain("Example article");
  expect(markup).toContain("https://example.com/article");
  expect(markup).toContain("Photosynthesis card");
  expect(markup).toContain("Flashcard");
  expect(markup).not.toContain("Implementation pending");
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

it("renders the object type list in the Capacities-style rounded panel shell", () => {
  const markup = renderToStaticMarkup(
    <WorkspaceObjectTypeListView
      entities={[entityFixture({ objectTypeId: "study_goal", title: "Biology exam" })]}
      objectType={objectTypeFixture()}
      tabName="Study goals"
    />,
  );

  const rootClass = markup.match(
    /<section data-slot="workspace-object-type-list-view" class="([^"]+)"/,
  )?.[1];

  expect(rootClass).toContain("relative");
  expect(rootClass).toContain("h-full");
  expect(rootClass).toContain("w-full");
  expect(rootClass).toContain("flex-col");
  expect(rootClass).toContain("overflow-hidden");
  expect(rootClass).toContain("rounded-xl");
  expect(rootClass).toContain("border");
  expect(rootClass).toContain("border-[var(--app-border-front)]");
  expect(rootClass).toContain("bg-[var(--app-bg-base)]");
  expect(rootClass).toContain("text-[var(--app-text-primary)]");
  expect(rootClass).toContain("shadow-[0_2px_3px_0_rgba(0,0,0,0.004)");
});

it("renders the object type list menus with compact Capacities rows and leading icons", () => {
  const componentSource = readProjectSource("src/components/workspace-object-renderer.tsx");
  const markup = renderToStaticMarkup(
    <WorkspaceObjectTypeListView
      entities={[entityFixture({ objectTypeId: "study_goal", title: "Biology exam" })]}
      objectType={objectTypeFixture()}
      tabName="Study goals"
      onCreateEntity={() => {}}
    />,
  );

  expect(markup).toContain('data-slot="workspace-object-type-new-action"');
  expect(markup).toContain('data-slot="workspace-object-type-new-menu"');
  expect(markup).toContain('data-slot="workspace-object-type-list-item"');
  expect(markup).toContain('data-slot="workspace-object-type-card-preview"');
  expect(markup).toContain("h-8");
  expect(markup).toContain("border-[var(--app-border-front)]");
  expect(componentSource).toContain("sidebarContextMenuContentClass");
  expect(componentSource).toContain("sidebarContextMenuItemClass");
  expect(componentSource).toContain("sidebarContextMenuSeparatorClass");
  expect(componentSource).toContain("CompactMenuIconFrame");
  expect(componentSource).toContain("CompactMenuItemText");
  expect(componentSource).toContain("Novo {singularName}");
});

it("renders the overview tab as a sectioned Capacities overview", () => {
  const markup = renderToStaticMarkup(
    <WorkspaceObjectTypeListView
      entities={[
        entityFixture({
          id: "entity-study-goal-a",
          objectTypeId: "study_goal",
          title: "Biology exam",
        }),
        entityFixture({
          id: "entity-study-goal-b",
          objectTypeId: "study_goal",
          title: "Chemistry exam",
        }),
      ]}
      objectType={objectTypeFixture()}
      tabName="Study goals"
      onCreateEntity={() => {}}
    />,
  );

  expect(markup).toContain("Recentemente aberto");
  expect(markup).toContain("Coleções");
  expect(markup).toContain("Queries");
  expect(markup).toContain("Sem coleções");
  expect(markup).toContain("Sem queries");
  expect(markup).toContain("Biology exam");
  expect(markup).toContain("Chemistry exam");
  expect(markup).not.toContain("Novo Objeto");
});

it("matches the Capacities object-type overview tab chrome and empty section layout", () => {
  const markup = renderToStaticMarkup(
    <WorkspaceObjectTypeListView
      entities={[entityFixture({ objectTypeId: "study_goal", title: "Biology exam" })]}
      objectType={objectTypeFixture()}
      tabName="Study goals"
    />,
  );

  const overviewTabClass = markup.match(
    /<button type="button" aria-pressed="true" class="([^"]+)">[\s\S]*?Visão geral/,
  )?.[1];
  const allTabClass = markup.match(
    /<button type="button" aria-pressed="false" class="([^"]+)">[\s\S]*?Tudo/,
  )?.[1];

  expect(overviewTabClass).toContain("h-8");
  expect(overviewTabClass).toContain("border-[var(--app-border-front)]");
  expect(overviewTabClass).toContain("bg-[var(--app-bg-el)]");
  expect(overviewTabClass).toContain("px-3.5");
  expect(allTabClass).toContain("border-[var(--app-border-el)]");
  expect(allTabClass).toContain("text-[var(--app-text-secondary)]");
  expect(allTabClass).toContain("hover:bg-[var(--app-bg-el-hover)]");
  expect(markup).toContain(
    "py-10 flex w-full flex-col items-center justify-center gap-4 text-center",
  );
  expect(markup).toContain("text-xs text-[var(--app-text-secondary)]");
  expect(markup).not.toContain('data-slot="workspace-object-type-overview-empty-card"');
});

it("matches the Capacities object-type heading treatment", () => {
  const markup = renderToStaticMarkup(
    <WorkspaceObjectTypeListView
      entities={[entityFixture({ objectTypeId: "page", title: "Sem título" })]}
      objectType={objectTypeFixture({
        id: "page",
        iconName: "page",
        pluralName: "Páginas",
        singularName: "Página",
        tone: "blue",
      })}
      tabName="Páginas"
    />,
  );

  expect(markup).toContain('data-slot="workspace-object-type-heading"');
  expect(markup).toContain('data-context-menu-entity-context-key="page:Página"');
  expect(markup).toContain("dataview-heading-icon-container");
  expect(markup).toContain("dataview-heading-icon-fill");
  expect(markup).toContain("bg-[var(--type-label-bg-blue)]");
  expect(markup).toContain("text-[var(--type-label-text-blue)]");
  expect(markup).toContain("opacity-90");
  expect(markup).toContain("dataview-heading max-w-max");
  expect(markup).toContain(">Páginas</h1>");
});

it("keeps data-view cards legible and labels icon-only controls", () => {
  const markup = renderToStaticMarkup(
    <WorkspaceObjectTypeListView
      entities={[entityFixture({ objectTypeId: "study_goal", title: "Biology exam" })]}
      objectType={objectTypeFixture()}
      tabName="Study goals"
    />,
  );

  expect(markup).toContain("!text-[var(--app-text-primary)]");
  expect(markup).toContain("h-[19.25rem]");
  expect(markup).toContain("gap-y-1");
  expect(markup).toContain("grid-cols-2");
  expect(markup).toContain("text-[16px]");
  expect(markup).toContain("text-[13.5px]");
  expect(markup).toContain("hover:shadow-[0_2px_3px_0_rgba(0,0,0,0.008)");
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
