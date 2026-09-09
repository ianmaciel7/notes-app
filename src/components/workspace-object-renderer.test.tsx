import { renderToStaticMarkup } from "react-dom/server";
import { expect, it } from "vitest";

import {
  WorkspaceObjectRenderer,
  getWorkspaceWeblinkUrl,
} from "@/components/workspace-object-renderer";
import type { SpaceEntityRecord } from "@/lib/spaces/space-types";

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
});
