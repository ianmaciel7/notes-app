"use client";

import {
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  AudioLines,
  BadgeHelp,
  BookOpen,
  CalendarDays,
  ChevronDown,
  CircleHelp,
  CircleUserRound,
  ClipboardList,
  File,
  FileText,
  Forward,
  Image,
  Lightbulb,
  type LucideIcon,
  Maximize2,
  Menu,
  MessageCircle,
  Mic,
  Minimize2,
  Moon,
  MoreHorizontal,
  Network,
  PanelLeft,
  PanelRight,
  Pin,
  Plus,
  Radio,
  Search,
  Send,
  Settings2,
  Shapes,
  Sparkles,
  Sun,
  Table2,
  Tag,
  Trash2,
  WandSparkles,
  Workflow,
  X,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import styles from "@/components/workspace-shell.module.css";
import { cn } from "@/lib/utils";
import {
  type CreatedObjectFixture,
  workspaceAuditFixture,
} from "@/lib/workspace-audit-fixture";
import {
  isNavigationItemActive,
  type NavigationIcon,
  type NavigationItem,
  navigationGroups,
} from "@/lib/workspace-navigation";

const icons: Record<NavigationIcon, LucideIcon> = {
  add: Plus,
  search: Search,
  calendar: CalendarDays,
  tasks: ClipboardList,
  audit: Sparkles,
  ai: MessageCircle,
  image: Image,
  file: File,
  audio: AudioLines,
  pdf: FileText,
  query: Workflow,
  tag: Tag,
  tweet: Send,
  weblink: Radio,
  table: Table2,
  page: FileText,
  trash: Trash2,
  help: CircleHelp,
  question: BadgeHelp,
  docs: BookOpen,
  news: WandSparkles,
  feedback: MessageCircle,
};

const sectionIcons: Record<string, LucideIcon> = {
  Fixados: Pin,
  "Tipos de objeto": Shapes,
  "Ajuda e recursos": CircleHelp,
};

const navigationToneSurfaceClasses: Record<
  NonNullable<NavigationItem["tone"]>,
  string
> = {
  blue: "bg-blue-50 text-object-blue",
  violet: "bg-violet-50 text-object-violet",
  red: "bg-red-50 text-red-500",
  orange: "bg-orange-50 text-orange-500",
  green: "bg-emerald-50 text-emerald-500",
  cyan: "bg-cyan-50 text-cyan-500",
  indigo: "bg-indigo-50 text-indigo-500",
  sky: "bg-sky-50 text-sky-500",
};

const navigationToneClasses: Record<
  NonNullable<NavigationItem["tone"]>,
  string
> = {
  blue: "text-object-blue",
  violet: "text-object-violet",
  red: "text-red-500",
  orange: "text-orange-500",
  green: "text-emerald-500",
  cyan: "text-cyan-500",
  indigo: "text-indigo-500",
  sky: "text-sky-500",
};

export function WorkspaceShell({ pathname }: { pathname: string }) {
  const [desktopSidebarOpen, setDesktopSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [darkTheme, setDarkTheme] = useState(false);
  const [wideLayout, setWideLayout] = useState(false);
  const mobileTriggerRef = useRef<HTMLButtonElement>(null);
  const mobileCloseRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!mobileSidebarOpen) return;

    mobileCloseRef.current?.focus();
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      setMobileSidebarOpen(false);
      mobileTriggerRef.current?.focus();
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [mobileSidebarOpen]);

  function closeMobileSidebar() {
    setMobileSidebarOpen(false);
    requestAnimationFrame(() => mobileTriggerRef.current?.focus());
  }

  return (
    <TooltipProvider delayDuration={400}>
      <div
        className={cn(
          styles.shell,
          "grid h-dvh w-full overflow-hidden bg-workspace text-workspace-text",
          desktopSidebarOpen
            ? "[--sidebar-width:288px]"
            : "[--sidebar-width:0px]",
        )}
        data-visual-audit="true"
        data-theme={darkTheme ? "dark" : "light"}
      >
        <WorkspaceHeader
          desktopSidebarOpen={desktopSidebarOpen}
          onCollapse={() => setDesktopSidebarOpen(false)}
        />

        <header
          className="flex min-w-0 items-center gap-0.5 px-2 [grid-area:main-header]"
          data-region="topbar-main"
        >
          <IconButton
            buttonRef={mobileTriggerRef}
            className="md:hidden"
            icon={Menu}
            label="Abrir navegação"
            onClick={() => setMobileSidebarOpen(true)}
          />
          {!desktopSidebarOpen ? (
            <IconButton
              className="hidden md:grid"
              icon={PanelLeft}
              label="Expandir barra lateral"
              onClick={() => setDesktopSidebarOpen(true)}
            />
          ) : null}
          <IconButton icon={ArrowLeft} label="Voltar" />
          <IconButton icon={ArrowRight} label="Avançar" />
          <CalendarDays
            aria-hidden="true"
            className="ml-1 size-4 text-workspace-subtle"
          />
          <span className="hidden truncate text-[13px] leading-[16.9px] text-workspace-muted sm:inline">
            11 de agosto de 2026
          </span>
          <IconButton className="ml-1" icon={Plus} label="Adicionar objeto" />
          <div className="min-w-0 flex-1" />
          <IconButton
            icon={wideLayout ? Minimize2 : Maximize2}
            label={wideLayout ? "Layout normal" : "Layout amplo"}
            onClick={() => setWideLayout((current) => !current)}
            pressed={wideLayout}
          />
        </header>

        <header
          className="hidden min-w-0 items-center overflow-hidden px-1 text-sm text-workspace-muted [grid-area:context-header] min-[1100px]:flex"
          data-region="topbar-tabs"
        >
          <TopRailTab icon={Network} label="Visualização em grafo" />
          <TopRailTab icon={Shapes} label="Objetos internos" />
          <TopRailTab icon={PanelRight} label="Conteúdo relacionado" />
          <TopRailTab
            active
            closable
            icon={MessageCircle}
            label="System Audit Response Test"
          />
          <IconButton className="shrink-0" icon={Plus} label="Nova aba" />
          <IconButton
            className="shrink-0"
            icon={PanelRight}
            label="Fechar painel de contexto"
          />
        </header>

        {desktopSidebarOpen ? (
          <nav
            aria-label="Navegação principal"
            className="hidden min-h-0 flex-col [grid-area:sidebar] md:flex"
            data-region="sidebar"
          >
            <SidebarContent
              darkTheme={darkTheme}
              onNavigate={() => undefined}
              onToggleTheme={() => setDarkTheme((current) => !current)}
              pathname={pathname}
            />
          </nav>
        ) : null}

        <main
          aria-label="Área de trabalho"
          className="mx-2 mb-2 min-h-0 min-w-0 rounded-xl border border-workspace-border bg-workspace-surface shadow-workspace-panel [grid-area:main] md:mx-2.5 md:mb-2.5"
          data-region="day-panel"
        >
          <DailyWorkspace wideLayout={wideLayout} />
        </main>

        <aside
          aria-label="Contexto do objeto"
          className="mr-2.5 mb-2.5 hidden min-h-0 min-w-0 rounded-xl border border-workspace-border bg-workspace-surface [grid-area:context] min-[1100px]:block"
          data-region="chat-panel"
        >
          <ContextPanel />
        </aside>

        {mobileSidebarOpen ? (
          <div className="fixed inset-0 z-50 md:hidden">
            <div className="absolute inset-0 bg-black/25" aria-hidden="true" />
            <aside
              aria-label="Navegação móvel"
              aria-modal="true"
              className="relative flex h-dvh w-[min(288px,calc(100vw-32px))] flex-col border-r border-workspace-border bg-workspace shadow-xl"
              role="dialog"
            >
              <header className="flex h-[46px] shrink-0 items-center gap-2 px-2">
                <Lightbulb
                  aria-hidden="true"
                  className="size-[18px] shrink-0"
                />
                <span className="min-w-0 truncate text-[13px] leading-[16.9px] font-medium">
                  Codex Capacities Audit 2026-08-11
                </span>
                <div className="min-w-0 flex-1" />
                <IconButton
                  buttonRef={mobileCloseRef}
                  icon={X}
                  label="Fechar navegação"
                  onClick={closeMobileSidebar}
                />
              </header>
              <nav aria-label="Navegação principal" className="min-h-0 flex-1">
                <SidebarContent
                  darkTheme={darkTheme}
                  onNavigate={closeMobileSidebar}
                  onToggleTheme={() => setDarkTheme((current) => !current)}
                  pathname={pathname}
                />
              </nav>
            </aside>
          </div>
        ) : null}
      </div>
    </TooltipProvider>
  );
}

function DailyWorkspace({ wideLayout }: { wideLayout: boolean }) {
  const fixture = workspaceAuditFixture;

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden">
      <div className="flex h-14 shrink-0 items-center justify-between border-b border-workspace-border px-4 text-sm text-workspace-muted">
        <Button className="px-2" size="sm" type="button">
          Dia
          <ChevronDown aria-hidden="true" className="size-3.5" />
        </Button>
        <div className="flex items-center gap-1">
          <IconButton icon={ArrowLeft} label="Dia anterior" />
          <span className="px-2">Hoje</span>
          <IconButton icon={ArrowRight} label="Próximo dia" />
        </div>
      </div>
      <div
        className="workspace-scrollbar min-h-0 flex-1 overflow-y-auto px-8 pt-12 pb-24 sm:px-10"
        data-scroll-container="day-view"
      >
        <div className={cn("mx-auto", wideLayout ? "max-w-none" : "max-w-2xl")}>
          <p className="text-base leading-6 font-normal tracking-[0.4px] text-object-pink">
            {fixture.weekdayLabel}
          </p>
          <h1 className="mt-1 h-[38px] text-[30px] leading-[33px] font-bold tracking-[0.4px] text-workspace-text">
            {fixture.formattedDate}
          </h1>
          <p className="mt-2 text-sm tracking-[0.4px] text-workspace-subtle">
            Semana {fixture.weekNumber}
          </p>
          <div className="mt-5 flex items-center gap-2">
            <Button
              className="gap-1 px-2 font-normal"
              size="sm"
              variant="outline"
              type="button"
            >
              <Plus aria-hidden="true" className="size-3.5" />
              <span
                aria-hidden="true"
                className="grid size-3.5 place-items-center rounded-full border border-orange-300 text-[8px] text-orange-500"
              >
                ✓
              </span>
              Tarefa
            </Button>
          </div>
          <div className="mt-4 border-b border-workspace-border pb-14">
            <h2 className="text-sm font-medium">Nota diária</h2>
            <Button
              className="mt-5 text-sm font-normal"
              size="sm"
              variant="outline"
              type="button"
            >
              <Plus aria-hidden="true" className="size-3.5" />
              Nota Diária
            </Button>
          </div>
          <section className="border-b border-workspace-border pt-10 pb-7">
            <h2 className="text-sm font-medium">Tarefas</h2>
            <div className="flex min-h-36 items-center justify-center text-center">
              <div>
                <h3 className="text-sm font-medium text-workspace-muted">
                  Nenhuma tarefa neste dia
                </h3>
                <p className="mt-1 text-xs text-workspace-subtle">
                  Você pode mudar isso criando um novo objeto.
                </p>
              </div>
            </div>
          </section>
          <section
            className="w-[calc(100%+8px)] pt-9"
            aria-labelledby="created-today-heading"
          >
            <div className="flex items-center gap-3">
              <h2 className="text-sm font-medium" id="created-today-heading">
                Criado Nesse Dia
              </h2>
              <span className="text-xs tabular-nums text-workspace-subtle">
                {fixture.createdObjects.length}
              </span>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3">
              {fixture.createdObjects.map((object) => (
                <CreatedObjectCard key={object.id} object={object} />
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function ContextPanel() {
  const fixture = workspaceAuditFixture;

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex h-14 shrink-0 items-center gap-2 border-b border-workspace-border px-3">
        <Badge
          className="shrink-0 border-violet-200 bg-violet-50 text-violet-700"
          variant="outline"
        >
          <MessageCircle aria-hidden="true" className="size-3.5" />
          {fixture.chat.type}
        </Badge>
        <span className="min-w-0 truncate text-[13px] text-workspace-muted">
          {fixture.chat.title}
        </span>
        <IconButton
          className="ml-auto shrink-0 rounded-lg border border-workspace-border"
          icon={MoreHorizontal}
          label="Mais opções do contexto"
        />
      </div>
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <div
          className="workspace-scrollbar min-h-0 flex-1 overflow-y-auto px-3 py-2"
          data-scroll-container="chat-history"
        >
          <div className="flex min-h-full flex-col gap-8 text-[13px] leading-[19px]">
            {fixture.chat.messages.map((message) =>
              message.role === "user" ? (
                <div
                  className="ml-auto w-4/5 rounded-xl border border-workspace-border px-3 py-2"
                  data-message-role="user"
                  key={message.id}
                >
                  {message.text}
                </div>
              ) : (
                <p
                  className="text-[13.333px] leading-[22px] text-workspace-text"
                  data-message-role="assistant"
                  key={message.id}
                >
                  {message.text}
                </p>
              ),
            )}
          </div>
        </div>
        <div
          className="shrink-0 bg-workspace-surface px-3 pt-4 pb-3"
          data-region="chat-composer"
        >
          <div className="rounded-xl border border-workspace-border px-2 py-2">
            <input
              aria-label="Mensagem para o Chat de IA"
              className="block h-[26px] w-full min-w-0 bg-transparent px-1 text-xs leading-5 outline-none placeholder:text-workspace-subtle"
              placeholder="Pergunte algo. @ para mencionar qualquer objeto."
              type="text"
            />
            <div className="mt-1 flex items-center gap-1">
              <Button
                className="h-7 min-w-0 gap-1.5 rounded-lg border border-workspace-border px-2 text-xs font-normal"
                type="button"
              >
                <Sparkles
                  aria-hidden="true"
                  className="size-3 text-object-blue"
                />
                <span className="truncate">{fixture.selectedModel}</span>
                <ChevronDown aria-hidden="true" className="size-3 shrink-0" />
              </Button>
              <div className="flex-1" />
              <IconButton
                className="size-7"
                icon={Mic}
                label="Ditar mensagem"
              />
              <Button
                aria-label="Enviar mensagem"
                className="size-7 rounded-lg bg-workspace-selected text-workspace-subtle"
                disabled
                size="icon"
                type="button"
              >
                <ArrowUp aria-hidden="true" className="size-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CreatedObjectCard({ object }: { object: CreatedObjectFixture }) {
  const toneClass = navigationToneSurfaceClasses[object.tone];
  const tablePreview = object.id === "audit-table";

  return (
    <article
      className="min-h-40 overflow-hidden rounded-xl border border-workspace-border bg-workspace-surface p-2.5"
      data-created-object-id={object.id}
    >
      <Badge className={cn("px-1.5 py-0 text-xs font-normal", toneClass)}>
        <FileText aria-hidden="true" className="size-3" />
        {object.type}
      </Badge>
      <h3 className="mt-3 text-base font-semibold leading-[22px]">
        {object.title}
      </h3>
      {tablePreview ? (
        <div className="mt-2 overflow-hidden rounded-lg border border-workspace-border text-xs">
          {object.preview.split("\n").map((row, index) => (
            <div
              className={cn(
                "grid grid-cols-2 px-2 py-1.5",
                index > 0 && "border-t border-workspace-border",
              )}
              key={row}
            >
              {row.split(/\s{2,}/).map((cell) => (
                <span key={cell}>{cell}</span>
              ))}
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-2 whitespace-pre-line rounded-lg border border-workspace-border bg-workspace px-3 py-3 text-sm leading-5">
          {object.preview}
        </p>
      )}
    </article>
  );
}

function WorkspaceHeader({
  desktopSidebarOpen,
  onCollapse,
}: {
  desktopSidebarOpen: boolean;
  onCollapse: () => void;
}) {
  if (!desktopSidebarOpen) return null;

  return (
    <header
      className="hidden items-center gap-1 px-2 [grid-area:sidebar-header] md:flex"
      data-region="workspace-header"
    >
      <WorkspacePicker />
      <IconButton icon={MoreHorizontal} label="Mais opções do workspace" />
      <IconButton
        icon={PanelLeft}
        label="Recolher barra lateral"
        onClick={onCollapse}
      />
    </header>
  );
}

function WorkspacePicker() {
  const [query, setQuery] = useState("");
  const spaces = [
    "Como Estudar ?",
    "Ideias",
    "Tech-5aaa",
    "Tech-3",
    "Tech old",
    "Tech-old-2",
    "Tech",
    "Teste",
  ];
  const filteredSpaces = spaces.filter((space) =>
    space.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <DropdownMenu onOpenChange={(open) => !open && setQuery("")}>
      <DropdownMenuTrigger asChild>
        <Button
          className="min-w-0 flex-1 justify-start rounded-md px-1.5 text-left font-normal"
          type="button"
        >
          <Lightbulb aria-hidden="true" className="size-[18px] shrink-0" />
          <span className="min-w-0 truncate text-[13px] leading-[16.9px] font-medium">
            Codex Capacities Audit 2026-08-11
          </span>
          <ChevronDown aria-hidden="true" className="size-3.5 shrink-0" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-64">
        <input
          aria-label="Buscar"
          className="mb-1 h-8 w-full rounded-sm border border-workspace-border bg-transparent px-2 text-sm outline-none placeholder:text-workspace-subtle focus:border-workspace-focus"
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Buscar"
          value={query}
        />
        <div className="max-h-56 overflow-y-auto">
          {filteredSpaces.map((space) => (
            <DropdownMenuItem key={space}>{space}</DropdownMenuItem>
          ))}
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Criar espaço</DropdownMenuItem>
        <DropdownMenuItem>Configurações do espaço</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function SidebarContent({
  darkTheme,
  onNavigate,
  onToggleTheme,
  pathname,
}: {
  darkTheme: boolean;
  onNavigate: () => void;
  onToggleTheme: () => void;
  pathname: string;
}) {
  return (
    <div className="flex h-full min-h-0 flex-col px-2">
      <ScrollArea className="min-h-0 flex-1">
        <div className="py-1">
          <NavigationGroups onNavigate={onNavigate} pathname={pathname} />
        </div>
      </ScrollArea>

      <Separator />
      <div className="flex h-11 shrink-0 items-center gap-1 pt-1">
        <IconButton icon={Settings2} label="Configurações" />
        <IconButton
          icon={darkTheme ? Sun : Moon}
          label={darkTheme ? "Usar tema claro" : "Usar tema escuro"}
          onClick={onToggleTheme}
        />
        <Button
          aria-label="Perfil pessoal"
          className="size-8"
          size="icon"
          title="Perfil pessoal"
          type="button"
        >
          <CircleUserRound aria-hidden="true" className="size-[18px]" />
        </Button>
        <Zap aria-hidden="true" className="ml-1 size-3.5 text-object-violet" />
        <span className="text-xs text-workspace-subtle">Pro</span>
        <div className="flex-1" />
        <IconButton icon={Forward} label="Compartilhar" />
      </div>
    </div>
  );
}

function NavigationGroups({
  onNavigate,
  pathname,
}: {
  onNavigate: () => void;
  pathname: string;
}) {
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    Fixados: true,
    "Tipos de objeto": true,
    "Ajuda e recursos": true,
  });

  const visibleGroups = navigationGroups.map((group) =>
    group.label === "Ajuda e recursos"
      ? {
          ...group,
          items: group.items.filter((item) =>
            ["/ajuda/primeiros-passos", "/ajuda/perguntas"].includes(item.href),
          ),
        }
      : group,
  );

  return visibleGroups.map((group) => (
    <NavigationGroupView
      group={group}
      key={group.label ?? group.items.map((item) => item.href).join("-")}
      onNavigate={onNavigate}
      open={group.label ? (openGroups[group.label] ?? true) : true}
      onToggle={
        group.label
          ? () =>
              setOpenGroups((current) => ({
                ...current,
                [group.label as string]: !(
                  current[group.label as string] ?? true
                ),
              }))
          : undefined
      }
      pathname={pathname}
    />
  ));
}

function NavigationGroupView({
  group,
  onNavigate,
  onToggle,
  open,
  pathname,
}: {
  group: (typeof navigationGroups)[number];
  onNavigate: () => void;
  onToggle?: () => void;
  open: boolean;
  pathname: string;
}) {
  if (!group.label) {
    return (
      <div
        className={`relative space-y-0.5 ${group.items.some((item) => item.icon === "trash") ? "mt-14" : ""}`}
      >
        {group.items.map((item) => (
          <NavigationLink
            item={item}
            key={item.href}
            onNavigate={onNavigate}
            pathname={pathname}
          />
        ))}
        {group.items[0]?.icon === "add" ? (
          <IconButton
            className="absolute right-2 top-0 size-7 text-object-violet hover:text-object-violet"
            icon={Sparkles}
            label="Assistente de IA"
          />
        ) : null}
      </div>
    );
  }

  const SectionIcon = sectionIcons[group.label];
  return (
    <section className="mt-4">
      <Button
        aria-expanded={open}
        className="h-7 w-full justify-start gap-[3px] px-2 text-xs font-medium text-workspace-subtle"
        onClick={onToggle}
        size="sm"
        type="button"
      >
        {SectionIcon ? (
          <SectionIcon aria-hidden="true" className="size-4" />
        ) : null}
        <span>{group.label}</span>
      </Button>
      {open ? (
        <div className="mt-1 space-y-0">
          {group.items.map((item) => (
            <NavigationLink
              item={item}
              key={item.href}
              objectType={group.label === "Tipos de objeto"}
              onNavigate={onNavigate}
              pathname={pathname}
            />
          ))}
          {group.emptyText ? (
            <p className="px-3 py-1 text-xs italic text-workspace-subtle">
              {group.emptyText}
            </p>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}

function NavigationLink({
  item,
  objectType = false,
  onNavigate,
  pathname,
}: {
  item: NavigationItem;
  objectType?: boolean;
  onNavigate: () => void;
  pathname: string;
}) {
  const Icon = icons[item.icon];
  const active = isNavigationItemActive(pathname, item.href);
  const toneClass = navigationToneClasses[item.tone ?? "blue"];

  return (
    <Button
      asChild
      className={`${objectType ? "h-[29px]" : "h-7"} w-full min-w-0 justify-start gap-[5px] px-2 text-sm leading-[18.2px] font-normal ${
        active
          ? "bg-workspace-selected font-medium text-workspace-text"
          : "text-workspace-muted hover:bg-workspace-hover hover:text-workspace-text"
      }`}
      size="sm"
    >
      <Link
        aria-current={active ? "page" : undefined}
        href={item.href}
        onClick={onNavigate}
      >
        <span
          className={cn(
            "grid shrink-0 place-items-center rounded-md",
            objectType ? "size-5" : "size-[18px]",
            item.icon === "add" && "text-object-blue",
            item.icon !== "add" && !objectType && toneClass,
            objectType && navigationToneSurfaceClasses[item.tone ?? "blue"],
          )}
        >
          <Icon
            aria-hidden="true"
            className={objectType ? "size-3.5" : "size-4"}
          />
        </span>
        <span className="min-w-0 truncate">{item.label}</span>
      </Link>
    </Button>
  );
}

function TopRailTab({
  active = false,
  closable = false,
  icon: Icon,
  label,
}: {
  active?: boolean;
  closable?: boolean;
  icon: LucideIcon;
  label: string;
}) {
  return (
    <Button
      className={cn(
        "h-9 min-w-0 flex-1 justify-start gap-1.5 rounded-none px-2 text-[13px] font-normal",
        active &&
          "rounded-lg border border-workspace-border bg-workspace-surface",
      )}
      type="button"
      variant={active ? "selected" : "ghost"}
    >
      <Icon
        aria-hidden="true"
        className={cn("size-3.5 shrink-0", active && "text-object-violet")}
      />
      <span className="min-w-0 overflow-hidden text-ellipsis whitespace-nowrap">
        {label}
      </span>
      {closable ? <X aria-hidden="true" className="size-3 shrink-0" /> : null}
    </Button>
  );
}

function IconButton({
  buttonRef,
  className = "",
  icon: Icon,
  label,
  onClick,
  pressed,
}: {
  buttonRef?: React.Ref<HTMLButtonElement>;
  className?: string;
  icon: LucideIcon;
  label: string;
  onClick?: () => void;
  pressed?: boolean;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          aria-label={label}
          aria-pressed={pressed}
          className={cn("size-8", className)}
          onClick={onClick}
          ref={buttonRef}
          size="icon"
          type="button"
        >
          <Icon aria-hidden="true" className="size-[18px]" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}
