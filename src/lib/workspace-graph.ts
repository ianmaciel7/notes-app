import {
  createWorkspaceObjectLinkIndex,
  selectContextualGraphEdges,
  selectPropertyRelationGraphEdges,
} from "./workspace-object-links.ts";
import type { WorkspaceEntity } from "./workspace-objects.ts";

export type WorkspaceGraphEntity = {
  readonly id: string;
  readonly title: string;
  readonly propertyValues: Readonly<Record<string, unknown>>;
};

export type WorkspaceGraphNode = {
  readonly id: string;
  readonly title: string;
  readonly active: boolean;
};

export type WorkspaceGraphEdge = {
  readonly source: string;
  readonly target: string;
};

export type WorkspaceGraph = {
  readonly nodes: readonly WorkspaceGraphNode[];
  readonly edges: readonly WorkspaceGraphEdge[];
};

type LinkEdge = { from: string; to: string };

function relatedIds(value: unknown): string[] {
  if (!value || typeof value !== "object") return [];
  if (Array.isArray(value)) return value.flatMap(relatedIds);

  const record = value as Record<string, unknown>;
  if (record.type === "entity" && Array.isArray(record.entity)) {
    return record.entity.flatMap((item) => {
      if (!item || typeof item !== "object") return [];
      const id = (item as Record<string, unknown>).id;
      return typeof id === "string" && id.trim() ? [id] : [];
    });
  }

  return Object.values(record).flatMap(relatedIds);
}

export function projectWorkspaceGraph(
  entities: readonly WorkspaceGraphEntity[],
  activeId: string | null,
): WorkspaceGraph {
  if (!activeId) return { nodes: [], edges: [] };
  const byId = new Map(entities.map((entity) => [entity.id, entity]));
  const active = byId.get(activeId);
  if (!active) return { nodes: [], edges: [] };

  const linkIndex = createWorkspaceObjectLinkIndex(
    entities as readonly WorkspaceEntity[],
  );
  const contentEdges: LinkEdge[] = selectContextualGraphEdges(
    linkIndex,
    activeId,
  ).map((edge) => ({ from: edge.from, to: edge.to }));
  const propertyEdges: LinkEdge[] = selectPropertyRelationGraphEdges(
    entities as readonly WorkspaceEntity[],
  ).map((edge) => ({ from: edge.from, to: edge.to }));
  const contextualEdges = [...contentEdges, ...propertyEdges].filter(
    (edge) => edge.from === activeId || edge.to === activeId,
  );
  const edges = Array.from(
    new Map(
      contextualEdges
        .filter((edge) => byId.has(edge.from) && byId.has(edge.to))
        .map((edge) => [
          `${edge.from}->${edge.to}`,
          { source: edge.from, target: edge.to },
        ]),
    ).values(),
  );
  const relatedIds = new Set(
    edges.map((edge) =>
      edge.source === activeId ? edge.target : edge.source,
    ),
  );
  const nodeIds = [
    activeId,
    ...entities
      .filter((entity) => entity.id !== activeId && relatedIds.has(entity.id))
      .map((entity) => entity.id),
  ];

  return {
    nodes: nodeIds.map((id) => {
      const entity = byId.get(id) as WorkspaceGraphEntity;
      return { id, title: entity.title, active: id === activeId };
    }),
    edges,
  };
}
