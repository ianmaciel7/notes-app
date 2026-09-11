import { Plus } from "lucide-react";
import { ObjectListOverview } from "@/components/objects/list/object-list-overview";
import type { ObjectListView } from "@/components/objects/list/use-object-list";
import { WorkspaceEmptyState } from "@/components/space-surface";
import { Button } from "@/components/ui/button";
import { WorkspaceObjectDataView } from "@/components/workspace-object-data-view";

function ObjectListEmpty({ view }: { view: ObjectListView }) {
  const { preferences, listName, singularName, onCreateEntity } = view;
  const filtered = Boolean(preferences.query.trim()) || preferences.filter !== "all";
  const itemName = singularName === listName ? "um objeto" : `um(a) ${singularName}`;
  return (
    <WorkspaceEmptyState
      className="mt-2 border-[var(--app-border-el)] bg-[var(--app-bg-front)]"
      title={filtered ? "Nenhum resultado encontrado" : `Ainda não há ${listName}`}
      description={
        filtered
          ? "Ajuste ou limpe a busca e os filtros para ver outros objetos."
          : `Crie ${itemName} para adicionar aqui.`
      }
      action={
        filtered ? (
          <Button
            type="button"
            size="sm"
            onClick={() => view.updatePreferences({ filter: "all", query: "" })}
          >
            Limpar filtros
          </Button>
        ) : onCreateEntity ? (
          <Button type="button" size="sm" onClick={onCreateEntity}>
            <Plus className="size-3.5" aria-hidden="true" />Novo {singularName}
          </Button>
        ) : undefined
      }
    />
  );
}

export function ObjectListResults({ view }: { view: ObjectListView }) {
  if (!view.items.length) return <ObjectListEmpty view={view} />;
  if (view.preferences.mode === "overview") return <ObjectListOverview view={view} />;
  return (
    <WorkspaceObjectDataView
      entities={view.items}
      collectionNamesById={view.collectionNamesById}
      layout={view.preferences.allLayout}
      groupBy={view.preferences.groupBy}
      objectType={view.objectType}
      onCreateEntity={view.onCreateEntity}
      onOpenEntity={view.onOpenEntity}
    />
  );
}
