"use client";

import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Boxes,
  CalendarCheck,
  CalendarDays,
  ChevronDown,
  CircleUserRound,
  Copy,
  CopyPlus,
  Download,
  FileImage,
  FileText,
  Forward,
  GalleryVerticalEnd,
  GraduationCap,
  Grid2X2,
  HelpCircle,
  ImageIcon,
  Inbox,
  LibraryBig,
  Lightbulb,
  Link2,
  ListFilter,
  Maximize2,
  Megaphone,
  MessageSquareText,
  Moon,
  MoreHorizontal,
  Network,
  PanelLeft,
  PanelRight,
  Pin,
  Plus,
  Presentation,
  Search,
  Settings2,
  Share2,
  Sparkles,
  Square,
  Tag,
  Trash2,
  Upload,
  X,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import {
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Kbd, KbdGroup } from "@/components/ui/kbd";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

type SidebarItem = {
  label: string;
  icon: typeof FileText;
  count?: string;
  tone?: "blue" | "red" | "violet";
  selected?: boolean;
  contextual?: boolean;
  compact?: boolean;
};

const objectItems: SidebarItem[] = [
  {
    label: "Notas Diárias",
    icon: CalendarCheck,
    count: "1",
    tone: "blue",
    compact: true,
  },
  { label: "Áreas", icon: Square, count: "1", tone: "violet", compact: true },
  { label: "Imagens", icon: ImageIcon, count: "1", tone: "red", compact: true },
  { label: "Páginas", icon: FileText, count: "1", tone: "blue", compact: true },
];

const modes = [
  { label: "Objetos internos", icon: Boxes },
  { label: "Conteúdo relacionado", icon: Link2 },
  { label: "Chat de IA", icon: MessageSquareText },
  { label: "Visualização em grafo", icon: Network },
];

function IconButton({
  label,
  icon: Icon,
  className,
  onClick,
}: {
  label: string;
  icon: typeof Plus;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            variant="ghost"
            size="icon-sm"
            className={cn("workspace-icon-button", className)}
            aria-label={label}
            onClick={onClick}
          />
        }
      >
        <Icon aria-hidden="true" />
      </TooltipTrigger>
      <TooltipContent className="workspace-tooltip">{label}</TooltipContent>
    </Tooltip>
  );
}

function BackNavigationButton() {
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            variant="ghost"
            size="icon-sm"
            className="workspace-icon-button"
            aria-label="Navegar para trás"
            aria-keyshortcuts="Control+ArrowLeft Control+["
            onClick={() => window.history.back()}
          />
        }
      >
        <ArrowLeft aria-hidden="true" />
      </TooltipTrigger>
      <TooltipContent
        side="bottom"
        align="start"
        sideOffset={8}
        className="workspace-tooltip workspace-rich-tooltip grid min-w-[210px] justify-items-start gap-2 rounded-lg border-[0.8px] border-[var(--workspace-border)] bg-[var(--workspace-surface)] px-3 py-2.5 text-[12px] leading-4 text-[var(--workspace-text)] shadow-sm"
      >
        <strong>Navegar para trás</strong>
        <KbdGroup>
          <Kbd className="!border-[var(--workspace-border)] !bg-[var(--workspace-bg)] !text-[var(--workspace-text-muted)]">
            Ctrl
          </Kbd>
          <span>+</span>
          <Kbd className="!border-[var(--workspace-border)] !bg-[var(--workspace-bg)] !text-[var(--workspace-text-muted)]">
            ←
          </Kbd>
          <span>/</span>
          <Kbd className="!border-[var(--workspace-border)] !bg-[var(--workspace-bg)] !text-[var(--workspace-text-muted)]">
            Ctrl
          </Kbd>
          <span>+</span>
          <Kbd className="!border-[var(--workspace-border)] !bg-[var(--workspace-bg)] !text-[var(--workspace-text-muted)]">
            [
          </Kbd>
        </KbdGroup>
      </TooltipContent>
    </Tooltip>
  );
}

function ObjectActionMenu({ objectLabel }: { objectLabel: string }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="icon-sm"
            className="workspace-row-action size-[22px]"
            aria-label={`Ações de ${objectLabel}`}
          />
        }
      >
        <MoreHorizontal aria-hidden="true" />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        side="right"
        align="start"
        sideOffset={-88}
        className="workspace-object-menu"
      >
        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="workspace-object-menu-item">
            <ArrowUpRight aria-hidden="true" /> Abrir
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent className="workspace-object-submenu">
            <DropdownMenuItem>Abrir no painel atual</DropdownMenuItem>
            <DropdownMenuItem>Abrir em novo painel</DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="workspace-object-menu-item">
            <Pin aria-hidden="true" /> Fixar na Barra Lateral
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent className="workspace-object-submenu">
            <DropdownMenuItem>Fixar acima</DropdownMenuItem>
            <DropdownMenuItem>Fixar abaixo</DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="workspace-object-menu-item">
          <GalleryVerticalEnd aria-hidden="true" /> Mudar Tipo
        </DropdownMenuItem>
        <DropdownMenuItem className="workspace-object-menu-item">
          <Settings2 aria-hidden="true" /> Configurações do Tipo de Objeto
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="workspace-object-menu-item">
          <Share2 aria-hidden="true" /> Compartilhar
        </DropdownMenuItem>
        <DropdownMenuItem className="workspace-object-menu-item">
          <Presentation aria-hidden="true" /> Apresentar
        </DropdownMenuItem>
        <DropdownMenuItem className="workspace-object-menu-item">
          <Download aria-hidden="true" /> Exportar
        </DropdownMenuItem>
        <DropdownMenuItem className="workspace-object-menu-item">
          <Upload aria-hidden="true" /> Importar
          <DropdownMenuShortcut>Ctrl I</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="workspace-object-menu-item">
            <Copy aria-hidden="true" /> Copiar
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent className="workspace-object-submenu">
            <DropdownMenuItem>Copiar link</DropdownMenuItem>
            <DropdownMenuItem>Copiar conteúdo</DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuItem className="workspace-object-menu-item">
          <CopyPlus aria-hidden="true" /> Duplicar
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant="destructive"
          className="workspace-object-menu-item"
        >
          <Trash2 aria-hidden="true" /> Excluir Objeto
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function SidebarRow({ item }: { item: SidebarItem }) {
  const Icon = item.icon;

  return (
    <div
      className="workspace-sidebar-row-wrap"
      data-selected={item.selected || undefined}
      data-compact={item.compact || undefined}
    >
      <Button
        variant="ghost"
        size={item.compact ? "sm" : "default"}
        className="workspace-sidebar-row justify-start"
        data-selected={item.selected || undefined}
        aria-current={item.selected ? "page" : undefined}
      >
        <span className="workspace-sidebar-icon" data-tone={item.tone}>
          <Icon aria-hidden="true" />
        </span>
        <span className="workspace-sidebar-label">{item.label}</span>
        {item.count && (
          <span className="workspace-sidebar-count">{item.count}</span>
        )}
      </Button>
      {item.contextual && <ObjectActionMenu objectLabel={item.label} />}
    </div>
  );
}

function SidebarPrimary() {
  return (
    <div className="workspace-sidebar-primary">
      <div className="workspace-sidebar-quick">
        <SidebarRow item={{ label: "Novo", icon: Plus }} />
        <span className="workspace-new-action" aria-hidden="true">
          <Sparkles />
        </span>
      </div>
      <SidebarRow item={{ label: "Buscar", icon: Search }} />
      <SidebarRow item={{ label: "Calendário", icon: CalendarDays }} />
    </div>
  );
}

function SidebarSection({
  label,
  icon: Icon,
  count,
  children,
  first = false,
  help = false,
}: {
  label: string;
  icon?: typeof Pin;
  count?: string;
  children: ReactNode;
  first?: boolean;
  help?: boolean;
}) {
  const [open, setOpen] = useState(true);

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger
        render={
          <Button
            variant="ghost"
            className={cn(
              help ? "workspace-help-label" : "workspace-section-row",
              first && "workspace-section-row-first",
            )}
          />
        }
      >
        <span>
          {Icon && <Icon aria-hidden="true" />}
          {label}
        </span>
        {count && <span>{count}</span>}
      </CollapsibleTrigger>
      <CollapsibleContent className="workspace-section-content">
        {children}
      </CollapsibleContent>
    </Collapsible>
  );
}

function SidebarMiddle() {
  return (
    <div className="workspace-sidebar-middle">
      <SidebarSection label="oi" icon={Sparkles} count="1" first>
        <SidebarRow
          item={{
            label: "Sem título",
            icon: Square,
            selected: true,
            contextual: true,
            tone: "violet",
            compact: true,
          }}
        />
      </SidebarSection>

      <SidebarSection label="Fixados" icon={Pin} count="1">
        <SidebarRow
          item={{
            label: "image",
            icon: FileImage,
            tone: "red",
            contextual: true,
            compact: true,
          }}
        />
      </SidebarSection>

      <SidebarSection
        label="Tipos de objeto"
        icon={GalleryVerticalEnd}
        count="4"
      >
        {objectItems.map((item) => (
          <SidebarRow key={item.label} item={item} />
        ))}
      </SidebarSection>
      <Button variant="ghost" size="sm" className="workspace-add-section">
        <Plus aria-hidden="true" /> Adicionar seção
      </Button>
      <div className="workspace-sidebar-lower">
        <SidebarRow item={{ label: "Lixeira", icon: Trash2 }} />
        <SidebarSection label="Ajuda e recursos" help>
          <SidebarRow
            item={{ label: "Primeiros passos", icon: GraduationCap }}
          />
          <SidebarRow
            item={{ label: "Fazer uma pergunta", icon: HelpCircle }}
          />
          <SidebarRow item={{ label: "Documentação", icon: LibraryBig }} />
          <SidebarRow item={{ label: "Novidades", icon: Megaphone }} />
          <SidebarRow item={{ label: "Feedback", icon: Inbox }} />
        </SidebarSection>
      </div>
    </div>
  );
}

function SidebarUtilityFooter({
  onToggleTheme,
}: {
  onToggleTheme: () => void;
}) {
  return (
    <div className="workspace-sidebar-footer">
      <IconButton label="Configurações" icon={Settings2} className="size-8" />
      <IconButton
        label="Tema"
        icon={Moon}
        className="size-8"
        onClick={onToggleTheme}
      />
      <Button
        variant="ghost"
        className="workspace-profile-button"
        aria-label="Perfil e plano Pro"
      >
        <CircleUserRound aria-hidden="true" />
        <span className="workspace-pro">Pro</span>
      </Button>
      <IconButton
        label="Compartilhar"
        icon={Forward}
        className="workspace-share size-8"
      />
    </div>
  );
}

function SidebarContent({ onToggleTheme }: { onToggleTheme: () => void }) {
  return (
    <div className="workspace-sidebar-content">
      <SidebarPrimary />
      <SidebarMiddle />
      <SidebarUtilityFooter onToggleTheme={onToggleTheme} />
    </div>
  );
}

function TypePopover() {
  const [open, setOpen] = useState(false);
  const [selectedType, setSelectedType] = useState("Página");
  const triggerRef = useRef<HTMLButtonElement>(null);
  const resultRef = useRef<HTMLButtonElement>(null);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button
            ref={triggerRef}
            variant="outline"
            className="workspace-type-button h-[25.4px] w-[101.375px] self-start rounded-[6.65px] border-[0.8px] border-[oklch(0.8091_0.0957_251.83)] bg-[oklch(0.9513_0.0235_256.13)] px-2 text-[14px] leading-5 font-normal text-[oklch(0.5035_0.1579_264.41)] hover:bg-[oklch(0.9513_0.0235_256.13)] hover:text-[oklch(0.5035_0.1579_264.41)] active:translate-y-0 active:brightness-[.94]"
          >
            <FileText aria-hidden="true" />
            {selectedType}
            <ChevronDown aria-hidden="true" />
          </Button>
        }
      />
      <PopoverContent
        side="right"
        align="start"
        sideOffset={2}
        className="workspace-type-popover ring-0"
      >
        <label className="workspace-type-search">
          <span className="sr-only">Buscar tipo</span>
          <input
            placeholder="Buscar"
            onKeyDown={(event) => {
              if (event.key === "ArrowDown") {
                event.preventDefault();
                resultRef.current?.focus();
              }
            }}
          />
        </label>
        <Button
          ref={resultRef}
          type="button"
          variant="ghost"
          className="workspace-type-result justify-start"
          onClick={() => {
            setSelectedType("Área");
            setOpen(false);
            triggerRef.current?.focus();
          }}
        >
          <Grid2X2 aria-hidden="true" /> Área
        </Button>
      </PopoverContent>
    </Popover>
  );
}

function GraphPanel() {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [connectionsVisible, setConnectionsVisible] = useState(true);
  const [selectedNode, setSelectedNode] = useState<"page" | "image">("page");
  const drag = useRef<{
    pointerId: number;
    x: number;
    y: number;
    panX: number;
    panY: number;
  } | null>(null);

  const selectNode = (node: "page" | "image") => setSelectedNode(node);
  const selectNodeFromKeyboard = (
    event: ReactKeyboardEvent,
    node: "page" | "image",
  ) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    selectNode(node);
  };

  return (
    <div className="workspace-graph-wrap">
      <div
        className="workspace-graph"
        onPointerDown={(event) => {
          if ((event.target as HTMLElement).closest("button")) return;
          event.currentTarget.setPointerCapture(event.pointerId);
          drag.current = {
            pointerId: event.pointerId,
            x: event.clientX,
            y: event.clientY,
            panX: pan.x,
            panY: pan.y,
          };
        }}
        onPointerMove={(event) => {
          if (!drag.current || drag.current.pointerId !== event.pointerId) {
            return;
          }
          setPan({
            x: drag.current.panX + event.clientX - drag.current.x,
            y: drag.current.panY + event.clientY - drag.current.y,
          });
        }}
        onPointerUp={(event) => {
          if (event.currentTarget.hasPointerCapture(event.pointerId)) {
            event.currentTarget.releasePointerCapture(event.pointerId);
          }
          drag.current = null;
        }}
        onPointerCancel={() => {
          drag.current = null;
        }}
      >
        <div
          className="workspace-graph-stage"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          }}
        >
          <div
            className="workspace-graph-visual"
            role="img"
            aria-label="Grafo do objeto atual"
          >
            {connectionsVisible && <span className="workspace-graph-edge" />}
          </div>
          {connectionsVisible && (
            <Button
              variant="ghost"
              size="icon-sm"
              className="workspace-graph-node workspace-graph-image-node"
              aria-label="Selecionar image no grafo"
              aria-pressed={selectedNode === "image"}
              data-selected={selectedNode === "image" || undefined}
              onClick={() => selectNode("image")}
              onKeyDown={(event) => selectNodeFromKeyboard(event, "image")}
            >
              <ImageIcon aria-hidden="true" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon-sm"
            className="workspace-graph-node workspace-graph-page-node"
            aria-label="Selecionar ADK 2.0: referência rápida de conceitos, ferramentas e comandos no grafo"
            aria-pressed={selectedNode === "page"}
            data-selected={selectedNode === "page" || undefined}
            onClick={() => selectNode("page")}
            onKeyDown={(event) => selectNodeFromKeyboard(event, "page")}
          >
            <span aria-hidden="true">🐺</span>
          </Button>
          <span className="workspace-graph-label">ADK 2.0: referência...</span>
        </div>
      </div>
      <output className="sr-only">
        {selectedNode === "image" ? "image" : "ADK 2.0"} selecionado no grafo
      </output>
      <div className="workspace-graph-toolbar">
        <div className="workspace-graph-density">
          <Button
            variant="ghost"
            className="!px-2 !text-xs !font-normal"
            aria-pressed={!connectionsVisible}
            onClick={() => {
              setConnectionsVisible(false);
              setSelectedNode("page");
            }}
          >
            <Link2 aria-hidden="true" /> Mostrar menos
          </Button>
          <Button
            variant="ghost"
            className="!px-2 !text-xs !font-normal"
            aria-pressed={connectionsVisible}
            onClick={() => setConnectionsVisible(true)}
          >
            <Network aria-hidden="true" /> Mostrar mais
          </Button>
        </div>
        <div className="workspace-graph-actions">
          <IconButton label="Filtros" icon={ListFilter} />
          <IconButton
            label="Ajustar à tela"
            icon={Maximize2}
            onClick={() => {
              setZoom(1);
              setPan({ x: 0, y: 0 });
            }}
          />
          <IconButton
            label="Diminuir zoom"
            icon={ZoomOut}
            onClick={() => setZoom((v) => Math.max(0.8, v - 0.1))}
          />
          <IconButton
            label="Aumentar zoom"
            icon={ZoomIn}
            onClick={() => setZoom((v) => Math.min(1.3, v + 0.1))}
          />
        </div>
      </div>
    </div>
  );
}

function RelatedPanel() {
  return (
    <div className="workspace-related-empty">
      <div className="workspace-related-heading">
        <strong>Conteúdo relacionado</strong>
        <span>0</span>
        <IconButton label="Ordenar" icon={ListFilter} />
      </div>
      <div className="workspace-related-message">
        <Link2 aria-hidden="true" />
        <strong>Nenhum conteúdo relacionado ainda</strong>
        <p>
          Objetos semanticamente relacionados dos seus espaços aparecerão aqui.
        </p>
      </div>
    </div>
  );
}

function ContextPanel({ activeMode }: { activeMode: string }) {
  if (activeMode === "Visualização em grafo") return <GraphPanel />;
  if (activeMode === "Conteúdo relacionado") return <RelatedPanel />;

  return (
    <div className="workspace-context-empty">
      <Network aria-hidden="true" />
      <strong>{activeMode}</strong>
    </div>
  );
}

function DocumentContent({
  scrollTop,
  activeOutline,
}: {
  scrollTop: number;
  activeOutline: number;
}) {
  return (
    <article className="workspace-document">
      <Button
        variant="ghost"
        className="workspace-object-emoji"
        aria-label="Alterar emoji"
      >
        🐺
      </Button>
      <div className="workspace-document-actions">
        <TypePopover />
        <Button variant="ghost" className="workspace-quiet-action">
          <Boxes aria-hidden="true" /> Coleções
        </Button>
        <div className="workspace-action-spacer" />
        <Button
          variant="ghost"
          className="workspace-quiet-action workspace-customize focus-visible:pointer-events-auto focus-visible:opacity-100"
        >
          <Settings2 aria-hidden="true" /> Personalizar{" "}
          <ChevronDown aria-hidden="true" />
        </Button>
        <IconButton
          label="Mais opções"
          icon={MoreHorizontal}
          className="workspace-document-more"
        />
      </div>

      <textarea
        className="workspace-title"
        aria-label="Título"
        placeholder="Título"
        defaultValue="ADK 2.0: referência rápida de conceitos, ferramentas e comandos"
        rows={2}
      />
      <div className="workspace-properties">
        <div className="workspace-alias-row">
          <span className="workspace-alias-chip">asaa</span>
          <label className="workspace-property-field">
            <span>Aliases</span>
            <input aria-label="Aliases" />
          </label>
        </div>
        <textarea
          aria-label="Descrição"
          placeholder="Descrição..."
          defaultValue="aaaaaaaaaaaaaaaa"
          rows={1}
        />
        <label className="workspace-property-field workspace-tags">
          <Tag aria-hidden="true" />
          <span>Etiquetas</span>
          <input aria-label="Etiquetas" />
        </label>
      </div>

      <div className="workspace-editor-body">
        <h2>ADK 2.0 — Ecossistema local de desenvolvimento</h2>
        <p>
          Para desenvolver agentes localmente no ADK 2.0, o fluxo gira em torno
          de duas ferramentas:
        </p>
        <ol>
          <li>
            <strong>Antigravity IDE:</strong> Ambiente para escrever, editar e
            organizar o código do agente.
          </li>
          <li>
            <strong>agents-cli:</strong> usada para criar, testar, avaliar e
            publicar agentes ADK ou seja operar o ciclo de desenvolvimento do
            agente.
          </li>
        </ol>

        <h2>Estrategias de desvolvimento</h2>
        <ol start={3}>
          <li>
            <strong>vibe coding:</strong> facil prototipação delega
            implementação foco na arquitetura regras de roteamento e os
            requisitos de segurança.
          </li>
          <li>
            <strong>Spec-Driven Development (SDD):</strong> A prototipação fica
            mais difícil no início, porque exige uma especificação arquitetural
            bem definida. Mas isso facilita a portabilidade do código e evita
            context fragmentation.
          </li>
        </ol>
        <pre>specs/expense-agent.md</pre>
        <p>
          Assim, o código pode ser regenerado ou restaurado com mais facilidade.
          O código se torna descartável; a especificação vira a bússola
          arquitetural.
        </p>

        <h2>Etapas do Vibe Coding</h2>
        <ol>
          <li>
            <strong>Prompt Arquitetural</strong>
            <br />O primeiro prompt que deve ser usado ao criar o ADK, sendo
            responsável por criar a versão inicial de um agente ou workflow.
          </li>
          <li>
            <strong>Verificação de discrepacia:</strong> peça que ele explique o
            que construiu antes de prosseguir e compare com seu projeto.
          </li>
        </ol>
        <pre>{`Estou criando um agente de aprovação de despesas em tempo real como um workflow gráfico no ADK 2.0.

Um relatório de despesa chega como um evento JSON com os campos: valor, solicitante, categoria, descrição e data.

Aplique uma regra: despesas abaixo de US$ 100 devem ser aprovadas automaticamente e instantaneamente, sem envolvimento do LLM.`}</pre>

        <h2>Etapas do SSD</h2>
        <ol>
          <li>
            <strong>criar especificações:</strong> mapeie funcionalidades do
            sistema e seus cenários observáveis.
          </li>
        </ol>
        <pre>{`Feature: Expense Report Processing

Scenario: Low-value expense auto-approval
Given an expense report with amount: 45
When the agent processes the report
Then it auto-approves with no LLM call`}</pre>

        <h2>Fluxo de trabalho antigravidade</h2>
        <p>
          Conecte a especificação, o código, a avaliação e a revisão humana em
          um fluxo verificável.
        </p>

        <h2>Glosario</h2>
        <ol>
          <li>
            <strong>edge conditions:</strong> casos de borda que podem acontecer
            no fluxo do agente.
          </li>
          <li>
            <strong>human-in-the-loop:</strong> quando o agente pausa o fluxo e
            pede participação humana.
          </li>
          <li>
            <strong>routing outcome:</strong> resultado interno que define para
            qual agente, node, tool ou caminho o fluxo deve seguir.
          </li>
          <li>
            <strong>boundary conditions:</strong> regras de limite que definem
            até onde o agente pode agir sozinho.
          </li>
          <li>architectural prompts</li>
          <li>Gherkin</li>
          <li>LLM-as-judge</li>
          <li>session-start prompt pattern</li>
        </ol>
        <div className="workspace-document-spacer" />
      </div>

      <div
        className="workspace-document-outline"
        aria-hidden="true"
        style={{ transform: `translateY(${scrollTop}px)` }}
      >
        {[0, 1, 2, 3, 4, 5].map((index) => (
          <span
            key={index}
            data-active={index === activeOutline || undefined}
          />
        ))}
      </div>
    </article>
  );
}

export function WorkspaceShell() {
  const [activeMode, setActiveMode] = useState("Visualização em grafo");
  const [rightPanelOpen, setRightPanelOpen] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [darkTheme, setDarkTheme] = useState(false);
  const [editorScrollTop, setEditorScrollTop] = useState(0);
  const [activeOutline, setActiveOutline] = useState(0);
  const editorPanelRef = useRef<HTMLElement>(null);

  const setSidebarWithFocus = (open: boolean) => {
    setSidebarOpen(open);
    requestAnimationFrame(() => {
      const label = open ? "Recolher barra lateral" : "Expandir barra lateral";
      document
        .querySelector<HTMLButtonElement>(`button[aria-label="${label}"]`)
        ?.focus();
    });
  };

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkTheme);
    return () => document.documentElement.classList.remove("dark");
  }, [darkTheme]);

  useEffect(() => {
    const navigateBack = (event: KeyboardEvent) => {
      if (event.defaultPrevented) return;

      const target = event.target;
      if (
        target instanceof HTMLElement &&
        (target.isContentEditable || target.matches("input, textarea, select"))
      ) {
        return;
      }

      const matchesShortcut =
        event.ctrlKey &&
        !event.altKey &&
        !event.metaKey &&
        (event.key === "ArrowLeft" || event.key === "[");
      if (!matchesShortcut) return;

      event.preventDefault();
      window.history.back();
    };
    window.addEventListener("keydown", navigateBack);
    return () => window.removeEventListener("keydown", navigateBack);
  }, []);

  useEffect(() => {
    const editor = editorPanelRef.current;
    if (!editor) return;

    const updateOutline = () => {
      const scrollTop = editor.scrollTop;
      const activeLine = scrollTop + 180;
      const headings = editor.querySelectorAll<HTMLElement>(
        ".workspace-editor-body h2",
      );
      let nextActive = 0;

      headings.forEach((heading, index) => {
        if (heading.offsetTop <= activeLine) {
          nextActive = index;
        }
      });

      setEditorScrollTop(scrollTop);
      setActiveOutline(nextActive);
    };
    editor.addEventListener("scroll", updateOutline, { passive: true });
    return () => editor.removeEventListener("scroll", updateOutline);
  }, []);

  return (
    <TooltipProvider delay={850}>
      <div
        className="workspace-shell"
        data-panel-open={rightPanelOpen}
        data-sidebar-open={sidebarOpen}
      >
        <header className="workspace-topbar">
          <div className="workspace-switch">
            <Button variant="ghost" className="workspace-switch-trigger">
              <Lightbulb aria-hidden="true" />
              <span>Tech</span>
              <ChevronDown aria-hidden="true" />
            </Button>
            <IconButton
              label="Recolher barra lateral"
              icon={PanelLeft}
              onClick={() => setSidebarWithFocus(false)}
            />
          </div>

          <div className="workspace-document-tabbar">
            {!sidebarOpen && (
              <IconButton
                label="Expandir barra lateral"
                icon={PanelLeft}
                onClick={() => setSidebarWithFocus(true)}
              />
            )}
            <Sheet>
              <span className="workspace-mobile-trigger">
                <Tooltip>
                  <TooltipTrigger
                    render={
                      <SheetTrigger
                        render={
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            className="workspace-mobile-nav"
                            aria-label="Abrir navegacao"
                          />
                        }
                      />
                    }
                  >
                    <PanelLeft aria-hidden="true" />
                  </TooltipTrigger>
                  <TooltipContent>Abrir navegação</TooltipContent>
                </Tooltip>
              </span>
              <SheetContent
                side="left"
                showCloseButton={false}
                className="workspace-mobile-sheet max-w-none data-[side=left]:w-[min(288px,calc(100vw-32px))] data-[side=left]:max-w-none"
              >
                <SheetTitle className="sr-only">Navegação</SheetTitle>
                <SheetClose
                  render={
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      className="workspace-sheet-close"
                      aria-label="Fechar navegacao"
                    />
                  }
                >
                  <X aria-hidden="true" />
                </SheetClose>
                <nav aria-label="Navegacao movel">
                  <SidebarContent
                    onToggleTheme={() => setDarkTheme((v) => !v)}
                  />
                </nav>
              </SheetContent>
            </Sheet>
            <BackNavigationButton />
            <IconButton label="Navegar para frente" icon={ArrowRight} />
            <Button variant="ghost" className="workspace-active-document">
              <span aria-hidden="true">🐺</span>
              <span>
                ADK 2.0: referência rápida de conceitos, ferramentas e coman...
              </span>
            </Button>
            <IconButton label="Novo documento" icon={Plus} />
          </div>

          <nav
            className="workspace-context-tabs"
            aria-label="Modos contextuais"
          >
            <span className="workspace-sync" aria-hidden="true" />
            {modes.map(({ label, icon: Icon }) => (
              <Button
                key={label}
                variant="ghost"
                className="workspace-context-tab min-w-0 shrink"
                data-active={activeMode === label || undefined}
                aria-pressed={activeMode === label}
                onClick={() => {
                  setActiveMode(label);
                  setRightPanelOpen(true);
                }}
              >
                <Icon aria-hidden="true" />
                <span>{label}</span>
              </Button>
            ))}
            <IconButton label="Adicionar modo" icon={Plus} />
            <IconButton
              label={rightPanelOpen ? "Fechar painel" : "Abrir painel"}
              icon={PanelRight}
              onClick={() => setRightPanelOpen((v) => !v)}
            />
            <IconButton
              label="Mais opções do painel"
              icon={ChevronDown}
              className="workspace-panel-chevron"
            />
          </nav>
        </header>

        <nav
          className="workspace-sidebar"
          aria-label="Navegacao do workspace"
          aria-hidden={!sidebarOpen}
        >
          <SidebarPrimary />
          <ScrollArea className="workspace-sidebar-scroll">
            <SidebarMiddle />
          </ScrollArea>
          <SidebarUtilityFooter onToggleTheme={() => setDarkTheme((v) => !v)} />
        </nav>

        <main
          ref={editorPanelRef}
          className="workspace-editor-panel"
          aria-label="Documento ativo"
        >
          <DocumentContent
            scrollTop={editorScrollTop}
            activeOutline={activeOutline}
          />
        </main>

        {rightPanelOpen && (
          <aside
            className="workspace-context-panel"
            aria-label="Contexto do objeto"
          >
            <ContextPanel activeMode={activeMode} />
          </aside>
        )}
      </div>
    </TooltipProvider>
  );
}
