"use client";

import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Boxes,
  CalendarDays,
  ChevronDown,
  CircleUserRound,
  Copy,
  CopyPlus,
  Download,
  FileImage,
  FileText,
  GalleryVerticalEnd,
  Grid2X2,
  HelpCircle,
  ImageIcon,
  Lightbulb,
  Link2,
  ListFilter,
  Maximize2,
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
  Tag,
  Trash2,
  Upload,
  X,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
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
};

const objectItems: SidebarItem[] = [
  { label: "Notas Diárias", icon: CalendarDays, count: "1", tone: "blue" },
  { label: "Áreas", icon: Grid2X2, count: "1", tone: "violet" },
  { label: "Imagens", icon: FileImage, count: "1", tone: "red" },
  { label: "Páginas", icon: FileText, count: "1", tone: "blue" },
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

function ObjectActionMenu({ objectLabel }: { objectLabel: string }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="icon-sm"
            className="workspace-row-action"
            aria-label={`Ações de ${objectLabel}`}
          />
        }
      >
        <MoreHorizontal aria-hidden="true" />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        side="right"
        align="start"
        sideOffset={2}
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
    >
      <Button
        variant="ghost"
        className="workspace-sidebar-row"
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

function SidebarContent({ onToggleTheme }: { onToggleTheme: () => void }) {
  return (
    <div className="workspace-sidebar-content">
      <div>
        <div className="workspace-sidebar-quick">
          <SidebarRow item={{ label: "Novo", icon: Plus }} />
          <span className="workspace-new-action" aria-hidden="true">
            <Sparkles />
          </span>
        </div>
        <SidebarRow item={{ label: "Buscar", icon: Search }} />
        <SidebarRow item={{ label: "Calendário", icon: CalendarDays }} />

        <div className="workspace-section-row">
          <span>
            <Sparkles aria-hidden="true" /> oi
          </span>
          <span>1</span>
        </div>
        <SidebarRow
          item={{
            label: "Sem título",
            icon: FileText,
            selected: true,
            contextual: true,
            tone: "blue",
          }}
        />

        <div className="workspace-section-row">
          <span>
            <Pin aria-hidden="true" /> Fixados
          </span>
          <span>1</span>
        </div>
        <SidebarRow
          item={{
            label: "image",
            icon: FileImage,
            tone: "red",
            contextual: true,
          }}
        />

        <div className="workspace-section-row">
          <span>
            <GalleryVerticalEnd aria-hidden="true" /> Tipos de objeto
          </span>
          <span>4</span>
        </div>
        {objectItems.map((item) => (
          <SidebarRow key={item.label} item={item} />
        ))}
        <Button variant="ghost" className="workspace-add-section">
          <Plus aria-hidden="true" /> Adicionar seção
        </Button>
      </div>

      <div className="workspace-sidebar-bottom">
        <SidebarRow item={{ label: "Lixeira", icon: Trash2 }} />
        <div className="workspace-help-label">Ajuda e recursos</div>
        <SidebarRow item={{ label: "Primeiros passos", icon: Sparkles }} />
        <SidebarRow item={{ label: "Fazer uma pergunta", icon: HelpCircle }} />
        <SidebarRow item={{ label: "Documentação", icon: FileText }} />
        <SidebarRow item={{ label: "Novidades", icon: Sparkles }} />
        <SidebarRow item={{ label: "Feedback", icon: MessageSquareText }} />
        <div className="workspace-sidebar-footer">
          <IconButton label="Configurações" icon={Settings2} />
          <IconButton label="Tema" icon={Moon} onClick={onToggleTheme} />
          <IconButton label="Perfil" icon={CircleUserRound} />
          <span className="workspace-pro">
            <Share2 aria-hidden="true" /> Pro
          </span>
          <IconButton
            label="Compartilhar"
            icon={Share2}
            className="workspace-share"
          />
        </div>
      </div>
    </div>
  );
}

function TypePopover() {
  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button variant="outline" className="workspace-type-button">
            <FileText aria-hidden="true" />
            Página
            <ChevronDown aria-hidden="true" />
          </Button>
        }
      />
      <PopoverContent
        side="right"
        align="start"
        sideOffset={2}
        className="workspace-type-popover ring-0"
        style={{
          width: 258,
          height: 84,
          gap: 0,
          borderRadius: 12,
          padding: 6,
          boxShadow:
            "0 3px 5px rgb(0 0 0 / 1%), 0 5px 10px rgb(0 0 0 / 2%), 0 10px 14px rgb(0 0 0 / 1%)",
        }}
      >
        <label className="workspace-type-search">
          <span className="sr-only">Buscar tipo</span>
          <input placeholder="Buscar" />
        </label>
        <button type="button" className="workspace-type-result">
          <Grid2X2 aria-hidden="true" /> Área
        </button>
      </PopoverContent>
    </Popover>
  );
}

function GraphPanel() {
  const [zoom, setZoom] = useState(1);

  return (
    <div className="workspace-graph-wrap">
      <svg
        className="workspace-graph"
        viewBox="0 0 444 644"
        role="img"
        aria-label="Grafo do objeto atual"
      >
        <g
          className="workspace-graph-stage"
          transform={`translate(222 98) scale(${zoom}) translate(-222 -98)`}
        >
          <line
            x1="134"
            y1="54"
            x2="222"
            y2="98"
            className="workspace-graph-edge"
          />
          <g className="workspace-graph-node">
            <rect
              x="120"
              y="40"
              width="28"
              height="28"
              rx="8"
              className="workspace-graph-image-node"
            />
            <foreignObject x="126" y="46" width="16" height="16">
              <ImageIcon aria-hidden="true" />
            </foreignObject>
          </g>
          <g className="workspace-graph-node workspace-graph-node-active">
            <rect x="208" y="84" width="29" height="29" rx="8" />
            <text x="222.5" y="104" textAnchor="middle">
              🐺
            </text>
            <text
              x="222.5"
              y="137"
              textAnchor="middle"
              className="workspace-graph-label"
            >
              ADK 2.0: referência...
            </text>
          </g>
        </g>
      </svg>
      <div className="workspace-graph-toolbar">
        <div className="workspace-graph-density">
          <Button variant="ghost">
            <Link2 aria-hidden="true" /> Mostrar menos
          </Button>
          <Button variant="ghost">
            <Network aria-hidden="true" /> Mostrar mais
          </Button>
        </div>
        <div className="workspace-graph-actions">
          <IconButton label="Filtros" icon={ListFilter} />
          <IconButton label="Ajustar à tela" icon={Maximize2} />
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

function DocumentContent() {
  return (
    <article className="workspace-document">
      <button
        type="button"
        className="workspace-object-emoji"
        aria-label="Alterar emoji"
      >
        🐺
      </button>
      <div className="workspace-document-actions">
        <TypePopover />
        <Button variant="ghost" className="workspace-quiet-action">
          <Boxes aria-hidden="true" /> Coleções
        </Button>
        <div className="workspace-action-spacer" />
        <Button
          variant="ghost"
          className="workspace-quiet-action workspace-customize"
        >
          <Settings2 aria-hidden="true" /> Personalizar{" "}
          <ChevronDown aria-hidden="true" />
        </Button>
        <IconButton label="Mais opções" icon={Settings2} />
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
        <ol>
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

      <div className="workspace-document-outline" aria-hidden="true">
        <span data-active="true" />
        <span />
        <span />
        <span />
        <span />
      </div>
    </article>
  );
}

export function WorkspaceShell() {
  const [activeMode, setActiveMode] = useState("Visualização em grafo");
  const [rightPanelOpen, setRightPanelOpen] = useState(true);
  const [darkTheme, setDarkTheme] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkTheme);
    return () => document.documentElement.classList.remove("dark");
  }, [darkTheme]);

  return (
    <TooltipProvider delay={850}>
      <div className="workspace-shell" data-panel-open={rightPanelOpen}>
        <header className="workspace-topbar">
          <div className="workspace-switch">
            <Button variant="ghost" className="workspace-switch-trigger">
              <Lightbulb aria-hidden="true" />
              <span>Tech</span>
              <ChevronDown aria-hidden="true" />
            </Button>
            <IconButton label="Alternar barra lateral" icon={PanelLeft} />
          </div>

          <div className="workspace-document-tabbar">
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
                className="workspace-mobile-sheet"
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
            <IconButton label="Navegar para trás" icon={ArrowLeft} />
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
                className="workspace-context-tab"
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

        <nav className="workspace-sidebar" aria-label="Navegacao do workspace">
          <ScrollArea className="workspace-sidebar-scroll">
            <SidebarContent onToggleTheme={() => setDarkTheme((v) => !v)} />
          </ScrollArea>
        </nav>

        <main className="workspace-editor-panel" aria-label="Documento ativo">
          <DocumentContent />
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
