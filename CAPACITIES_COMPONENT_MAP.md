# Capacities Component Behavior Map

Reference URL: https://app.capacities.io/eb0a4d1e-0567-4348-8ecf-587c417725f4/a961988a-5562-45bf-86d4-2b2375b17544

Purpose: maintain a working mental map between Capacities components and local KnowledgeOS components. Update this file whenever a Capacities-like UI component is compared, implemented, or fixed.

## Required comparison fields

- Capacities surface/component.
- Local component/file.
- Graphify context query used, when the change is architectural or cross-component.
- Visual geometry: width, height, radius, padding, gaps, density.
- Color tokens: background, border, primary text, secondary text, subtle text, hover/active states.
- Icon system: SVG shape, badge size, inner icon size, stroke/fill behavior, color tone.
- Interaction behavior: click, hover, keyboard, focus, close/open rules, scroll behavior.
- Data source: real Dexie/Firebase/state source, never mock unless explicitly documented as fixture/test data.
- Known gaps and decision notes.

## Current map

| Capacities component | Local component/file | Behavior and visual target | Current notes |
| --- | --- | --- | --- |
| Command/Search palette | `src/components/app-sidebar-primary-actions-command-dialog.tsx` | Modal command surface, centered desktop card, white front surface, `12px` radius, `672px` desktop width, compact header, recent items first, command actions after recent results, footer shortcuts fixed at bottom. Pointer selection keeps palette open, keyboard Enter closes. Added `Abrir tarefas` action with `Ctrl+Alt+T` shortcut and dedicated `primary-action:tasks` panel entry; removed duplicated calendar action so only “Abrir painel de hoje” remains for `Ctrl+Alt+H`; keyboard global hotkey mirrors this in `space-controller` and action copy remains explicit (`Abrir painel de hoje`) for clarity. | Recent data comes from real workspace entities. Open-in-new-tab visual pill is hidden to match current reference. |
| Command palette row | `src/components/app-sidebar-primary-actions-command-dialog.tsx` + `src/components/object-icons.tsx` | Row uses compact Capacities density: left object badge, title, optional right label chip or shortcut/cursor affordance. Menu badge target is `22px` outer area with `14px` inner SVG. | Avoid Tailwind `w-sm` / `h-sm` for element tokens; use explicit `w-(--el-w-sm)` / `h-(--el-h-sm)` when matching Capacities element sizes. |
| Object icon badge | `src/components/object-icons.tsx` | Tone-specific badge with rounded `0.475em` corners, `0.5px` border, light colored background, tone-colored SVG. | Icons must be checked by SVG shape, not only by label or color. Some object types may still need exact Capacities icon path parity. |
| Sidebar object type rows | `src/components/app-sidebar-primary-actions.tsx` and object icon definitions | Persistent leading icon, compact `29px`-`32px` rows, hover-only secondary controls, real object counts. | Secondary action visibility must remain hover-reveal, not always visible. |
| Action-side workbench panels | `src/components/workspace-main-content.tsx` | Search, Calendar, Explore, and Tasks action views share a compact header (category/title + return control), per-panel list/empty states, and shared return behavior via `primary-action:*` state markers. Search mantém uma linha ativa com setas `↑/↓`, abre o item ativo por `Enter` (input e lista de resultados), e fecha com `Esc` quando permitido. Explore e Tasks também suportam navegação por teclado (`↑/↓ + Enter`) com destaque da entrada ativa e abertura do item destacado, além de retorno por contexto e foco inicial ajustado. | Return target tracks previous tab, preserving context after action-close interactions. |
| Right inspector panel | `src/components/workspace-main-content.tsx`, `src/app/page.tsx` | Side panel surface renders contextual object metadata instead of an empty card: active object identity, type icon badge, updated date, tag count, outgoing relation count, backlinks, and local graph summary. `backlinks` and `graph-view` side tabs now display meaningful real Dexie-backed projections through `listBacklinks` and `buildGraph`, including a compact SVG local graph preview centered on the active object. | This is the first inspector pass; the graph preview is intentionally compact and not yet a draggable force canvas. |
| Add object type modal | `src/components/app-sidebar-object-type-studio.tsx`, `src/components/object-icons.tsx`, `src/lib/space-object-types.ts` | Modal matches Capacities card grid: desktop dialog width `1128px`, tokenized card surface `--app-bg-el-subtle`, border `--app-border-el`, hover `--app-bg-el-subtle-hover` / `--app-border-el-hover`, label text `--app-text-primary`, `32px` icon badge, and `text-sm font-semibold` labels. Intro guidance is a compact green callout, `max-w-[672px]`, rounded `8px`, on `--app-bg-front` content surface. Details panel opens on object-type card selection; clicking non-interactive backing content closes the panel while card, link, and form-control clicks keep their own behavior. | Current screenshot tone map is enforced by shared `getCapacitiesObjectTypeTone`: colored `Livro`, `Área`, `Definição`, `Flashcard`, `Ideia`, `Projeto`, `Mídia`, `Viagem`, `Nota atômica`, `Página`, `Weblink`, `Tweet`, `Chat de IA`, `Meta de estudo`, `Tabela`, `Query`; gray `Pessoa`, `Reunião`, `Citação`, `Lugar`, `Organização`, `Crie o seu próprio`, `Etiqueta`, `Imagem`, `PDF`, `Áudio`, `Arquivo`, `Tarefa`. Atomic note uses the Capacities `CardsThreeIcon` path and amber label tokens. 2026-09-09 screenshot comparison fixed missing `--app-block-bg-green` / `--app-block-text-green` tokens, replaced the full-width/back-tinted body look with a front-surface modal body, reduced the desktop shell from `1152px` to `1128px`, restored the app-specific built-ins `Flashcard` and `Study goal` to the Basic types picker, and kept cards on theme tokens so dark mode stays aligned. |
| Architecture/dependency graph | `graphify-out/graph.json`, `graphify-out/graph.html`, `graphify-out/GRAPH_REPORT.md` | Graphify is the source for local architecture navigation and impact mapping. Use `graphify query`, `graphify explain`, `graphify path`, and `graphify affected` to understand component relationships before cross-cutting parity edits. | Last updated after this rule was added: `10898` nodes, `21079` edges, `680` communities. Hooks are installed and merge driver is registered for `graphify-out/graph.json`. |

## Working rule

Before changing any Capacities-parity component, update or consult this map. If a screenshot or live reference disagrees with implementation, record the measured difference and fix the local component using explicit tokens/classes instead of ambiguous Tailwind names.

## Graphify workflow

- Ask targeted questions with `graphify query "<question>"`.
- Inspect a module or component with `graphify explain "<node>"`.
- Find relationships with `graphify path "<source>" "<target>"`.
- Check impact with `graphify affected "<node>"`.
- Refresh the graph after meaningful code changes with `graphify update .`.
- Check integration with `graphify hook status`.
- Do not use Graphify output as a replacement for source review when editing a specific file; use it to choose where to inspect and what dependencies may be affected.
