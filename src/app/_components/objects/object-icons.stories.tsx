import type { Story, StoryDefault } from "@ladle/react";
import * as React from "react";

import { AppSidebarChevronRightIcon } from "@/app/_components/workspace/app-sidebar-icons";
import { ObjectIconBadge, ObjectTypeLabelChip, objectTypeDefinitions } from "./object-icons";
import {
  CompactMenuItemText,
  compactMenuItemClass,
  compactMenuSearchClass,
  compactMenuSurfaceClass,
} from "@/components/ui/compact-menu";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const portugueseObjectTypeLabels: Record<string, string> = {
  "ai-chat": "Chat de IA",
  "atomic-note": "Nota atômica",
  archive: "Arquivo morto",
  area: "Área",
  audio: "Áudio",
  book: "Livro",
  definition: "Definição",
  file: "Arquivo",
  flashcard: "Flashcard",
  idea: "Ideia",
  image: "Imagem",
  media: "Mídia",
  meeting: "Reunião",
  organization: "Organização",
  page: "Página",
  pdf: "PDF",
  person: "Pessoa",
  place: "Lugar",
  project: "Projeto",
  query: "Query",
  quote: "Citação",
  "study-goal": "Meta de estudo",
  table: "Tabela",
  tag: "Etiqueta",
  task: "Tarefa",
  travel: "Viagem",
  tweet: "Tweet",
  weblink: "Weblink",
};

function getPortugueseObjectTypeLabel(id: string, fallback: string) {
  return portugueseObjectTypeLabels[id] ?? fallback;
}

export default {
  title: "Components / Objects / Icons",
} satisfies StoryDefault;

export const Badges: Story = () => (
  <div className="grid grid-cols-2 gap-4 p-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
    {objectTypeDefinitions.map(({ id, label, icon: Icon, tone }) => (
      <div
        key={id}
        className="flex flex-col items-center justify-center gap-2 rounded-lg border p-3 text-center hover:bg-muted"
      >
        <ObjectIconBadge icon={Icon} tone={tone} variant="default" />
        <span className="text-xs font-medium text-foreground">{label}</span>
        <span className="font-mono text-[10px] text-muted-foreground">{tone}</span>
      </div>
    ))}
  </div>
);

export const Variants: Story = () => {
  const sample = objectTypeDefinitions[0];
  if (!sample) return null;
  const Icon = sample.icon;

  return (
    <div className="flex items-center gap-6 p-6">
      <div className="flex flex-col items-center gap-2">
        <ObjectIconBadge icon={Icon} tone={sample.tone} variant="default" />
        <span className="text-xs text-muted-foreground">Default</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <ObjectIconBadge icon={Icon} tone={sample.tone} variant="menu" />
        <span className="text-xs text-muted-foreground">Menu</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <ObjectIconBadge icon={Icon} tone={sample.tone} variant="sidebar" />
        <span className="text-xs text-muted-foreground">Sidebar</span>
      </div>
    </div>
  );
};

type ObjectTypeLabelChipMenuExampleProps = {
  id: string;
  label: string;
  selected: boolean;
  selectedId: string;
  setSelectedId: (id: string) => void;
  tone: (typeof objectTypeDefinitions)[number]["tone"];
  variant: "compact" | "default";
};

type ObjectTypeSelectorItem = (typeof objectTypeDefinitions)[number] & {
  localizedLabel: string;
};

type ObjectTypeSelectorPopoverContentProps = {
  activeIndex: number;
  id: string;
  items: ObjectTypeSelectorItem[];
  onActiveIndexChange: (index: number) => void;
  onInputKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  onQueryChange: (query: string) => void;
  onSelect: (id: string) => void;
  open: boolean;
  query: string;
  selectedId: string;
  variant: "compact" | "default";
};

function ObjectTypeSelectorFooter() {
  return (
    <div className="mx-1 flex h-[29px] shrink-0 items-center gap-x-3 border-t border-border px-1 py-1.5 text-xs leading-4 text-muted-foreground">
      <span className="whitespace-nowrap">
        <span className="font-medium text-muted-foreground">↑↓</span> para navegar
      </span>
      <span className="whitespace-nowrap">
        <span className="font-medium text-muted-foreground">Esc</span> para abortar
      </span>
      <span className="whitespace-nowrap">
        <span className="font-medium text-muted-foreground">↵</span> para selecionar
      </span>
    </div>
  );
}

function ObjectTypeSelectorRow({
  active,
  definition,
  onActive,
  onSelect,
  selected,
  variant,
}: {
  active: boolean;
  definition: ObjectTypeSelectorItem;
  onActive: () => void;
  onSelect: () => void;
  selected: boolean;
  variant: "compact" | "default";
}) {
  return (
    <button
      aria-selected={selected}
      className={[
        compactMenuItemClass,
        "flex h-8 min-h-8 items-center justify-between gap-2 rounded-[8px] border border-transparent px-1 text-left text-sm font-normal outline-none hover:bg-muted focus-visible:border-ring focus-visible:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50 data-[active=true]:bg-muted",
      ].join(" ")}
      data-active={active || undefined}
      id={`object-type-label-chip-option-${variant}-${definition.id}`}
      onClick={onSelect}
      onPointerMove={onActive}
      role="option"
      tabIndex={-1}
      type="button"
    >
      <ObjectIconBadge
        icon={definition.icon}
        iconClassName="size-3.5"
        tone={definition.tone}
        variant="menu"
      />
      <CompactMenuItemText>{definition.localizedLabel}</CompactMenuItemText>
      <AppSidebarChevronRightIcon className="ml-auto size-3.5 text-muted-foreground" />
    </button>
  );
}

function ObjectTypeSelectorPopoverContent({
  activeIndex,
  id,
  items,
  onActiveIndexChange,
  onInputKeyDown,
  onQueryChange,
  onSelect,
  open,
  query,
  selectedId,
  variant,
}: ObjectTypeSelectorPopoverContentProps) {
  return (
    <PopoverContent
      align="start"
      alignOffset={0}
      className={[
        compactMenuSurfaceClass,
        "box-content w-[min(22rem,calc(100vw-1.75rem))] min-w-44 max-h-[min(18rem,calc(100dvh-8rem))] max-w-[calc(100vw-1rem)] gap-0 rounded-[12px] border-border shadow-[var(--app-shadow-popover)] ring-0",
      ].join(" ")}
      data-slot="object-type-label-chip-menu"
      side="bottom"
      sideOffset={6}
    >
      <div className="h-11 shrink-0 p-1.5">
        <div
          className={[
            compactMenuSearchClass,
            "flex h-8 items-center rounded-[8px] border border-transparent bg-muted transition-[border-color,box-shadow] focus-within:border-ring focus-within:bg-muted focus-within:ring-3 focus-within:ring-ring/50",
          ].join(" ")}
        >
          <Input
            aria-activedescendant={
              items[activeIndex]
                ? `object-type-label-chip-option-${variant}-${items[activeIndex].id}`
                : undefined
            }
            aria-autocomplete="list"
            aria-controls={`object-type-label-chip-listbox-${variant}-${id}`}
            aria-expanded={open}
            aria-label="Buscar tipo de objeto"
            autoFocus
            className="h-full border-0 bg-transparent p-0 text-sm text-foreground shadow-none placeholder:text-muted-foreground placeholder:opacity-100 focus-visible:ring-0"
            onChange={(event) => {
              onQueryChange(event.target.value);
              onActiveIndexChange(0);
            }}
            onKeyDown={onInputKeyDown}
            placeholder="Buscar"
            role="combobox"
            value={query}
          />
        </div>
      </div>
      <div
        aria-label="Tipos de objeto"
        className="min-h-0 max-h-[min(12.5rem,calc(100dvh-15rem))] flex-1 overflow-y-auto px-1.5 pb-1.5"
        id={`object-type-label-chip-listbox-${variant}-${id}`}
        role="listbox"
      >
        {items.map((definition, index) => (
          <ObjectTypeSelectorRow
            active={index === activeIndex}
            definition={definition}
            key={definition.id}
            onActive={() => onActiveIndexChange(index)}
            onSelect={() => onSelect(definition.id)}
            selected={definition.id === selectedId}
            variant={variant}
          />
        ))}
      </div>
      <ObjectTypeSelectorFooter />
    </PopoverContent>
  );
}

function ObjectTypeLabelChipMenuExample({
  id,
  label,
  selected,
  selectedId,
  setSelectedId,
  tone,
  variant,
}: ObjectTypeLabelChipMenuExampleProps) {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [activeIndex, setActiveIndex] = React.useState(0);
  const normalizedQuery = query.trim().toLocaleLowerCase("pt-BR");
  const items = React.useMemo(
    () =>
      objectTypeDefinitions
        .map((definition) => ({
          ...definition,
          localizedLabel: getPortugueseObjectTypeLabel(definition.id, definition.label),
        }))
        .filter(
          (definition) =>
            normalizedQuery.length === 0 ||
            definition.localizedLabel.toLocaleLowerCase("pt-BR").includes(normalizedQuery) ||
            definition.id.toLocaleLowerCase("pt-BR").includes(normalizedQuery),
        ),
    [normalizedQuery],
  );

  React.useEffect(() => {
    setActiveIndex((current) => Math.min(current, Math.max(items.length - 1, 0)));
  }, [items.length]);

  function selectObjectType(nextId: string) {
    setSelectedId(nextId);
    setOpen(false);
    setQuery("");
    setActiveIndex(0);
  }

  function handleInputKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Escape") {
      event.preventDefault();
      setOpen(false);
      return;
    }

    if (items.length === 0) return;

    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      const direction = event.key === "ArrowDown" ? 1 : -1;
      setActiveIndex((current) => (current + direction + items.length) % items.length);
      return;
    }

    if (event.key === "Enter") {
      event.preventDefault();
      const activeItem = items[activeIndex];
      if (activeItem) selectObjectType(activeItem.id);
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <ObjectTypeLabelChip
            aria-pressed={selected}
            className={
              selected && variant === "default"
                ? "shadow-[0_0_0_2px_var(--app-border-focus)]"
                : undefined
            }
            id={id}
            label={label}
            showMenuIndicator
            tone={tone}
            variant={variant}
          />
        }
      />
      <ObjectTypeSelectorPopoverContent
        activeIndex={activeIndex}
        id={id}
        items={items}
        onActiveIndexChange={setActiveIndex}
        onInputKeyDown={handleInputKeyDown}
        onQueryChange={setQuery}
        onSelect={selectObjectType}
        open={open}
        query={query}
        selectedId={selectedId}
        variant={variant}
      />
    </Popover>
  );
}

export const TypeLabels: Story = () => {
  const [selectedId, setSelectedId] = React.useState(objectTypeDefinitions[0]?.id ?? "");

  return (
    <div className="min-h-screen bg-[var(--app-bg-front)] p-6 text-[var(--app-text-primary)]">
      <div className="grid max-w-5xl grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {objectTypeDefinitions.map(({ id, label, tone }) => {
          const localizedLabel = getPortugueseObjectTypeLabel(id, label);
          const selected = selectedId === id;

          return (
            <div
              key={id}
              className="relative flex min-w-0 items-center justify-between gap-3 rounded-[8px] border border-[var(--app-border-el)] bg-[var(--app-bg-base)] p-3"
            >
              <ObjectTypeLabelChipMenuExample
                id={id}
                label={localizedLabel}
                selected={selected}
                selectedId={selectedId}
                setSelectedId={setSelectedId}
                tone={tone}
                variant="default"
              />
              <ObjectTypeLabelChipMenuExample
                id={id}
                label={localizedLabel}
                selected={selected}
                selectedId={selectedId}
                setSelectedId={setSelectedId}
                tone={tone}
                variant="compact"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};
