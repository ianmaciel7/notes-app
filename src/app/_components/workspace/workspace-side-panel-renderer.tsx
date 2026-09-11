"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { WorkspaceLocalGraph } from "@/app/_components/workspace/workspace-local-graph";
import { getInspectorEntities } from "@/app/_components/workspace/workspace-side-panel-model";
import { searchWorkspaceEntities } from "@/lib/spaces/entity-search";
import { buildLocalEntityGraph } from "@/lib/spaces/space-graph";
import type { SpaceEntityRecord, SpaceRelationRecord } from "@/lib/spaces/space-types";

type WorkspaceSidePanelRendererProps = {
  activeMainObjectTitle?: string;
  activeTabLabel: string;
  sideValue: string;
  activeEntityId?: string;
  spaceId?: string;
  entities?: readonly SpaceEntityRecord[];
  relations?: readonly SpaceRelationRecord[];
  onOpenEntity?: (id: string) => void;
};

function InspectorResults({
  entities,
  onOpenEntity,
}: {
  entities: readonly SpaceEntityRecord[];
  onOpenEntity?: (id: string) => void;
}) {
  if (entities.length === 0)
    return <p className="text-sm text-muted-foreground">Nenhum objeto encontrado.</p>;
  return (
    <ul className="space-y-1">
      {entities.map((entity) => (
        <li key={entity.id}>
          <Button
            variant="ghost"
            className="h-auto w-full justify-start whitespace-normal text-left"
            disabled={!onOpenEntity}
            onClick={() => onOpenEntity?.(entity.id)}
          >
            {entity.title || "Sem título"}
          </Button>
        </li>
      ))}
    </ul>
  );
}

function InspectorBody({
  activeTabLabel,
  sideValue,
  activeEntityId,
  spaceId,
  entities = [],
  relations = [],
  onOpenEntity,
}: WorkspaceSidePanelRendererProps) {
  const [query, setQuery] = useState("");
  const scoped = entities.filter((entity) => entity.spaceId === spaceId);
  const active = scoped.find((entity) => entity.id === activeEntityId);
  if (sideValue === "aiAssistantChat") {
    return (
      <p role="status" className="text-sm text-muted-foreground">
        Chat de IA ainda não está integrado. Nenhuma resposta simulada será gerada.
      </p>
    );
  }
  if (sideValue === "localSpaceQuery" || activeTabLabel === "Search") {
    return (
      <>
        <Input
          aria-label="Pesquisar neste espaço"
          placeholder="Pesquisar neste espaço"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <InspectorResults
          entities={searchWorkspaceEntities(scoped, query)}
          onOpenEntity={onOpenEntity}
        />
      </>
    );
  }
  if (!active)
    return (
      <p className="text-sm text-muted-foreground">
        Selecione um objeto para explorar suas conexões.
      </p>
    );
  if (sideValue === "graphView" || activeTabLabel === "Graph view") {
    const graph = buildLocalEntityGraph({
      centerEntityId: active.id,
      spaceId: active.spaceId,
      entities: scoped,
      relations,
    });
    return <WorkspaceLocalGraph graph={graph} onOpenEntity={onOpenEntity} />;
  }
  const isExplore = ["side-1", "explore"].includes(sideValue) || activeTabLabel === "Explore";
  const mode = isExplore ? "backlinks" : sideValue;
  return (
    <>
      {isExplore && <h3 className="text-sm font-medium">Backlinks</h3>}
      {mode === "relatedContent" && (
        <p className="text-xs text-muted-foreground">Objetos com tags em comum.</p>
      )}
      <InspectorResults
        entities={getInspectorEntities({
          entities: scoped,
          relations,
          activeEntityId: active.id,
          spaceId,
          mode,
        })}
        onOpenEntity={onOpenEntity}
      />
    </>
  );
}

export function WorkspaceSidePanelRenderer(props: WorkspaceSidePanelRendererProps) {
  const active = props.entities?.find(
    (entity) => entity.id === props.activeEntityId && entity.spaceId === props.spaceId,
  );
  const title = active?.title ?? props.activeMainObjectTitle;
  return (
    <section data-slot="workspace-inspector" className="h-full space-y-4 overflow-auto p-4">
      <header className="space-y-1">
        <h2 className="font-semibold">{props.activeTabLabel}</h2>
        {title && <p className="text-sm text-muted-foreground">{title}</p>}
      </header>
      <InspectorBody {...props} />
    </section>
  );
}
