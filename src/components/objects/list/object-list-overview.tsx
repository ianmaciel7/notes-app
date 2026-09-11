import type { ObjectListView } from "@/components/objects/list/use-object-list";
import { WorkspaceObjectDataView } from "@/components/workspace-object-data-view";

function OverviewEmptySection({ title, description }: { title: string; description: string }) {
  return (
    <div className="py-10 flex w-full flex-col items-center justify-center gap-4 text-center">
      <div className="flex flex-col items-center gap-1.5">
        <h3 className="text-sm font-medium text-[var(--app-text-secondary)]">{title}</h3>
        <p className="max-w-md px-4 text-xs text-[var(--app-text-secondary)]">{description}</p>
      </div>
    </div>
  );
}

export function ObjectListOverview({ view }: { view: ObjectListView }) {
  return (
    <div data-slot="workspace-object-type-overview" className="w-full space-y-6">
      <section data-slot="workspace-object-type-overview-recent">
        <h2 className="mb-2 px-0.5 text-sm font-medium text-[var(--app-text-secondary)]">
          Recentemente aberto
        </h2>
        <WorkspaceObjectDataView
          entities={view.items}
          collectionNamesById={view.collectionNamesById}
          layout="cards"
          groupBy="none"
          objectType={view.objectType}
          onOpenEntity={view.onOpenEntity}
        />
      </section>
      <section data-slot="workspace-object-type-overview-collections">
        <h2 className="mb-2 px-0.5 text-sm font-medium text-[var(--app-text-secondary)]">
          Coleções
        </h2>
        <OverviewEmptySection
          title="Sem coleções"
          description="Você pode mudar isso criando uma nova coleção."
        />
      </section>
      <section data-slot="workspace-object-type-overview-queries">
        <h2 className="mb-2 px-0.5 text-sm font-medium text-[var(--app-text-secondary)]">
          Queries
        </h2>
        <OverviewEmptySection
          title="Sem queries"
          description="As Queries que você criar neste banco de dados aparecerão aqui."
        />
      </section>
    </div>
  );
}
