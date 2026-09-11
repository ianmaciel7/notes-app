import { cva } from "class-variance-authority";
import { ArrowDownUp, Grid2X2, Hash, List, Rows3, SlidersHorizontal } from "lucide-react";
import type { ObjectListPreferences } from "@/components/objects/list/object-list-model";
import {
  ObjectListChoice,
  type ObjectListChoiceOption,
} from "@/components/objects/list/object-list-choice";
import type { ObjectListView } from "@/components/objects/list/use-object-list";
import { Button } from "@/components/ui/button";

const modeButton = cva(
  "relative flex h-8 shrink-0 items-center rounded-[12px] border-0 px-3.5 py-1 text-xs font-medium",
  {
    variants: {
      selected: {
        true: "bg-[var(--app-bg-el)] text-[var(--app-text-primary)]",
        false: "text-[var(--app-text-subtle)] hover:bg-[var(--app-bg-el-hover)]",
      },
    },
  },
);

const filterOptions = [
  { value: "all", label: "Todos os objetos" },
  { value: "tagged", label: "Com etiquetas" },
  { value: "untagged", label: "Sem etiquetas" },
] satisfies readonly ObjectListChoiceOption<ObjectListPreferences["filter"]>[];

const sortOptions = [
  { value: "updated-desc", label: "Atualização, mais recente" },
  { value: "updated-asc", label: "Atualização, mais antiga" },
  { value: "title-asc", label: "Título, crescente" },
  { value: "title-desc", label: "Título, decrescente" },
] satisfies readonly ObjectListChoiceOption<ObjectListPreferences["sort"]>[];

const groupOptions = [
  { value: "none", label: "Sem agrupamento" },
  { value: "tag", label: "Etiqueta" },
] satisfies readonly ObjectListChoiceOption<ObjectListPreferences["groupBy"]>[];

const layoutOptions = [
  { value: "cards", label: "Cartões" },
  { value: "list", label: "Lista" },
] satisfies readonly ObjectListChoiceOption<ObjectListPreferences["allLayout"]>[];

function ObjectListModes({ view }: { view: ObjectListView }) {
  return (
    <>
      <Button
        type="button"
        variant="ghost"
        aria-pressed={view.preferences.mode === "overview"}
        className={modeButton({ selected: view.preferences.mode === "overview" })}
        onClick={() => view.updatePreferences({ mode: "overview" })}
      >
        <Rows3 className="size-3" aria-hidden="true" />
        Visão geral
      </Button>
      <Button
        type="button"
        variant="ghost"
        aria-pressed={view.preferences.mode === "all"}
        className={modeButton({ selected: view.preferences.mode === "all" })}
        onClick={() => view.updatePreferences({ mode: "all" })}
      >
        <List className="size-3" aria-hidden="true" />
        Tudo
      </Button>
    </>
  );
}

export function ObjectListControls({ view }: { view: ObjectListView }) {
  const { preferences, updatePreferences } = view;
  const countLabel = `${view.items.length} ${view.items.length === 1 ? "objeto" : "objetos"}`;
  return (
    <>
      <ObjectListModes view={view} />
      <span
        role="status"
        aria-label={`Quantidade de objetos: ${countLabel}`}
        className="ml-auto mr-2 flex h-7 shrink-0 items-center gap-1.5 px-1.5 text-xs"
      >
        <Hash className="size-3.5" aria-hidden="true" />{view.items.length}
      </span>
      <ObjectListChoice
        label="Filtrar objetos"
        icon={SlidersHorizontal}
        value={preferences.filter}
        options={filterOptions}
        onChange={(filter) => updatePreferences({ filter })}
      />
      <ObjectListChoice
        label="Classificar objetos"
        icon={ArrowDownUp}
        value={preferences.sort}
        options={sortOptions}
        onChange={(sort) => updatePreferences({ sort })}
      />
      <ObjectListChoice
        label="Agrupar objetos"
        icon={Rows3}
        value={preferences.groupBy}
        options={groupOptions}
        onChange={(groupBy) => updatePreferences({ groupBy })}
      />
      <ObjectListChoice
        label="Escolher layout"
        icon={preferences.allLayout === "cards" ? Grid2X2 : List}
        value={preferences.allLayout}
        options={layoutOptions}
        onChange={(allLayout) => updatePreferences({ allLayout, mode: "all" })}
      />
    </>
  );
}
