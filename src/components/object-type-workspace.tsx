import {
  ChevronDown,
  ChevronUp,
  Grid2X2,
  List,
  ListFilter,
  MoreHorizontal,
  PackageOpen,
  Plus,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import {
  CapacitiesSidebarIcon,
  type CapacitiesSidebarIconName,
} from "@/components/capacities-sidebar-icon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { WorkspaceAuditData } from "@/lib/workspace-audit-data";
import {
  type CreatedObjectFixture,
  workspaceObjectTypeFixture,
} from "@/lib/workspace-audit-fixture";
import type {
  NavigationIcon,
  ObjectTypeNavigationItem,
} from "@/lib/workspace-navigation";

const typeToneClasses = {
  blue: "bg-[var(--type-label-bg-blue)] text-[var(--type-label-text-blue)]",
  cyan: "bg-[var(--type-label-bg-blue)] text-[var(--type-label-text-blue)]",
  green: "bg-[var(--type-label-bg-green)] text-[var(--type-label-text-green)]",
  indigo: "bg-[var(--type-label-bg-blue)] text-[var(--type-label-text-blue)]",
  orange:
    "bg-[var(--type-label-bg-orange)] text-[var(--type-label-text-orange)]",
  red: "bg-[var(--type-label-bg-red)] text-[var(--type-label-text-red)]",
  sky: "bg-[var(--type-label-bg-blue)] text-[var(--type-label-text-blue)]",
  violet:
    "bg-[var(--type-label-bg-purple)] text-[var(--type-label-text-purple)]",
} as const;

const iconNames: Record<NavigationIcon, CapacitiesSidebarIconName> = {
  add: "add",
  ai: "chat",
  audio: "audio",
  audit: "write",
  calendar: "calendar",
  docs: "documentation",
  feedback: "feedback",
  file: "file",
  help: "graduation",
  image: "image",
  news: "news",
  page: "page",
  pdf: "pdf",
  query: "query",
  question: "help",
  search: "search",
  table: "table",
  tag: "tag",
  tasks: "tasks",
  trash: "trash",
  tweet: "tweet",
  weblink: "weblink",
};

export function ObjectTypeWorkspace({
  data,
  error,
  objectType,
}: {
  data: WorkspaceAuditData | null;
  error: string | null;
  objectType: ObjectTypeNavigationItem;
}) {
  const objects =
    !data || objectType.count === 0
      ? []
      : workspaceObjectTypeFixture.filter(
          (object) => object.type === objectType.singularLabel,
        );
  const count = data ? objects.length : (objectType.count ?? 0);
  const iconTone = objectType.tone ?? "blue";

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden">
      <header className="flex h-[58px] shrink-0 items-center gap-2 px-3">
        <span
          className={cn(
            "grid size-9 shrink-0 place-items-center rounded-lg",
            typeToneClasses[iconTone],
          )}
        >
          <CapacitiesSidebarIcon
            aria-hidden="true"
            className="size-[19px]"
            name={iconNames[objectType.icon]}
          />
        </span>
        <h1 className="min-w-0 flex-1 truncate text-xl leading-7 font-bold text-workspace-text">
          {objectType.label}
        </h1>
        <Button aria-label={`Buscar em ${objectType.label}`} size="icon">
          <Search aria-hidden="true" className="size-4" />
        </Button>
        <Button aria-label="Recolher cabeçalho" size="icon">
          <ChevronUp aria-hidden="true" className="size-4" />
        </Button>
        <Button aria-label="Mais opções do tipo" size="icon">
          <MoreHorizontal aria-hidden="true" className="size-4" />
        </Button>
        {objectType.allowCreate ? (
          <div className="ml-1 flex h-8 overflow-hidden rounded-lg bg-workspace-text text-workspace-surface">
            <Button
              className="h-8 gap-1 rounded-r-none bg-transparent px-3 text-workspace-surface hover:bg-white/10 hover:text-workspace-surface"
              type="button"
            >
              <Plus aria-hidden="true" className="size-4" />
              Novo
            </Button>
            <Button
              aria-label={`Opções para criar ${objectType.singularLabel}`}
              className="h-8 w-8 rounded-l-none border-l border-white/20 bg-transparent px-0 text-workspace-surface hover:bg-white/10 hover:text-workspace-surface"
              type="button"
            >
              <ChevronDown aria-hidden="true" className="size-3.5" />
            </Button>
          </div>
        ) : null}
      </header>

      <div className="flex h-[43px] shrink-0 items-center justify-between border-t border-workspace-border px-3 text-xs text-workspace-muted">
        <div className="flex items-center gap-2">
          <Button
            className="h-8 gap-1.5 px-2 text-xs font-normal"
            type="button"
          >
            <Grid2X2 aria-hidden="true" className="size-3.5" />
            Visão geral
          </Button>
          <Button
            aria-pressed="true"
            className="h-8 gap-1.5 rounded-full bg-workspace-hover px-3 text-xs font-medium text-workspace-text hover:bg-workspace-selected"
            type="button"
          >
            <List aria-hidden="true" className="size-3.5" />
            Tudo
          </Button>
        </div>
        <div className="flex items-center gap-1">
          <span className="mr-1 tabular-nums">#&nbsp; {count}</span>
          <Button aria-label="Adicionar filtro" size="icon">
            <ListFilter aria-hidden="true" className="size-4" />
          </Button>
          <Button aria-label="Ordenar objetos" size="icon">
            <SlidersHorizontal aria-hidden="true" className="size-4" />
          </Button>
          <Button aria-label="Visualização em lista" size="icon">
            <List aria-hidden="true" className="size-4" />
          </Button>
          <Button aria-label="Visualização em grade" size="icon">
            <Grid2X2 aria-hidden="true" className="size-4" />
          </Button>
          <Button aria-label="Opções de visualização" size="icon">
            <ChevronDown aria-hidden="true" className="size-3.5" />
          </Button>
        </div>
      </div>

      {!data ? (
        <div
          aria-busy={error ? undefined : "true"}
          className="grid min-h-0 flex-1 place-items-center text-sm text-workspace-subtle"
          role={error ? "alert" : "status"}
        >
          {error ??
            `Preparando ${objectType.label.toLocaleLowerCase("pt-BR")}...`}
        </div>
      ) : objects.length === 0 ? (
        <div className="grid min-h-0 flex-1 place-items-center px-8 pb-16 text-center">
          <div>
            <PackageOpen
              aria-hidden="true"
              className="mx-auto size-28 stroke-[1.1] text-workspace-border"
            />
            <h2 className="mt-2 text-base font-semibold text-workspace-text">
              Não há nada aqui (por enquanto).
            </h2>
            <p className="mt-2 text-sm text-workspace-subtle">
              Você pode mudar isso criando um novo objeto.
            </p>
          </div>
        </div>
      ) : (
        <div className="workspace-scrollbar min-h-0 flex-1 overflow-y-auto p-3">
          <div className="grid grid-cols-[repeat(auto-fill,minmax(188px,202px))] content-start gap-2">
            {objects.map((object) => (
              <ObjectTypeCard
                iconName={iconNames[objectType.icon]}
                key={object.id}
                object={object}
              />
            ))}
            {objectType.allowCreate ? (
              <Button
                className="h-10 w-fit gap-1 px-3 text-sm font-normal text-workspace-subtle"
                type="button"
              >
                <Plus aria-hidden="true" className="size-4" />
                Novo Objeto
              </Button>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}

function ObjectTypeCard({
  iconName,
  object,
}: {
  iconName: CapacitiesSidebarIconName;
  object: CreatedObjectFixture;
}) {
  const tone = typeToneClasses[object.tone];

  return (
    <article
      className={cn(
        "min-h-[196px] overflow-hidden rounded-xl border border-workspace-border bg-workspace-surface p-2.5",
        object.tableRows && "min-h-[322px]",
      )}
      data-object-type-card={object.id}
    >
      <Badge className={cn("px-1.5 py-0 text-xs font-normal", tone)}>
        <CapacitiesSidebarIcon
          aria-hidden="true"
          className="size-3"
          name={iconName}
        />
        {object.type}
      </Badge>
      <h2 className="mt-2 ml-0.5 text-base leading-[22px] font-semibold text-workspace-text">
        {object.title}
      </h2>
      {object.tableRows ? (
        <div className="mt-2 overflow-hidden rounded-lg border border-workspace-border text-xs">
          <table className="w-full table-fixed border-collapse text-left">
            <tbody>
              {object.tableRows.flatMap((row, rowIndex) =>
                row.map((cell, cellIndex) => (
                  <tr
                    className="border-b border-workspace-border last:border-b-0"
                    key={`${rowIndex}-${cellIndex}-${cell}`}
                  >
                    <td className="truncate px-2 py-1.5">{cell}</td>
                  </tr>
                )),
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="mt-2 line-clamp-5 whitespace-pre-line rounded-lg border border-workspace-border p-2 text-xs leading-5 text-workspace-muted">
          {object.preview}
        </p>
      )}
      <p className="mt-2 text-xs italic text-workspace-subtle">Etiquetas</p>
    </article>
  );
}
