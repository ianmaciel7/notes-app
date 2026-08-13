## 1. Evidence Baseline

- [x] Capture side-by-side reference and localhost screenshots at the same 1536 px desktop viewport and record the effective CSS viewport height and device scale.
- [x] Preserve the authenticated reference route, inspection date, active object, active graph tab, scroll position, and open-overlay state with each comparison artifact.
- [x] Build a repeatable region checklist covering shell, sidebar, top rail, editor, graph panel, overlays, and bottom controls.
- [x] Record computed geometry and styles for every discrepant region instead of accepting visual estimates.
- [x] Keep unobserved destructive, loading, empty, error, disabled, drag, and dialog states explicitly unverified until they can be reached without mutating reference data.

## 2. App Shell And Panel Geometry

- [x] Match the reference 288 px desktop sidebar width.
- [x] Replace the local two-row header/right-panel layout with the reference single 46 px top rail.
- [x] Position the editor card at the reference desktop x=298 px and y=46 px with approximately 772 px width at the inspected viewport.
- [x] Position the graph card at the reference desktop x=1080 px and y=46 px with approximately 446 px width at the inspected viewport.
- [x] Match the 10 px horizontal gutter between sidebar/editor bounds and the 10 px bottom inset around both cards.
- [x] Match the editor and graph card 12 px radii instead of the local 14 px treatment.
- [x] Match the 0.8 px subtle card border and the editor's very light multi-stop shadow; keep the graph card without an invented heavy shadow.
- [x] Match the shell, editor, and graph heights at the inspected viewport without clipping the top rail or bottom graph toolbar.
- [x] Remove the local panel-width ratio that makes the editor about 678 px and graph about 554 px at 1536 px.

## 3. Sidebar

- [x] Use the exact workspace label `Tech` and match its 32 px trigger, 12 px semibold text, lightbulb icon, chevron, and 8 px radius.
- [x] Match the 28 px sidebar-collapse control and 14 px icon at the reference top-right position.
- [x] Match exact labels, capitalization, and accents: `Novo`, `Buscar`, and `Calendário`.
- [x] Match the reference 32 px primary navigation row height, 8 px horizontal inset, 8 px radius, 14 px text, and 14–16 px icons.
- [ ] Add the purple contextual action beside `Novo` and match its placement and hover behavior.
- [x] Replace local `Exemplo` with the observed `oi` section row and display the observed count `1`.
- [x] Match `Sem título`, its page icon, selected/unselected treatment, count behavior, and exact truncation.
- [x] Match section labels `Fixados` and `Tipos de objeto`, including their icons/counts, 12 px typography, spacing, and collapse affordances.
- [x] Use exact pinned label `image` and show its 22 px trailing ellipsis action only on row hover or keyboard focus.
- [x] Use exact object labels and accents: `Notas Diárias`, `Áreas`, `Imagens`, and `Páginas`.
- [x] Display the observed object-type count `1` on each object row and section count `4` using the reference alignment and muted styling.
- [x] Add the observed `Adicionar seção` action in the correct sidebar position and state treatment.
- [x] Match the reference 29 px object-row height, 3 px left content inset, icon colors, text density, and 8 px radius.
- [x] Match `Lixeira` placement and the reference spacing that separates it from the help section.
- [x] Use exact utility labels `Ajuda e recursos`, `Primeiros passos`, `Fazer uma pergunta`, and `Documentação`.
- [ ] Add the missing `Novidades` and `Feedback` rows and preserve the external-link behavior of `Documentação`.
- [x] Match the footer icon controls, `Pro` treatment, and the far-right share/sync control rather than the local profile-only grouping.
- [x] Give the sidebar its own vertical scroll range while keeping the workspace/footer layout consistent with the reference at short heights.

## 4. Top Rail And Navigation

- [x] Match 28 px back/forward controls with 14 px icons at x≈298/326 and the reference 8 px radius.
- [x] Replace the local `Nota de exemplo` tab with the wolf emoji and exact truncated title `ADK 2.0: referência rápida de conceitos, ferramentas e coman...`.
- [x] Match the active document title's 13 px/16.9 px Inter typography, available width, ellipsis, and non-card background.
- [x] Place the new-document plus at the reference end of the document-title region instead of immediately after a short local label.
- [x] Reproduce the reference loading/sync indicator before the right-panel mode tabs.
- [x] Replace local modes with exact labels `Objetos internos`, `Conteúdo relacionado`, `Chat de IA`, and `Visualização em grafo`.
- [x] Match the reference mode-tab fixed width, truncated labels, 13 px typography, icon sizes, and graph-selected emphasis.
- [x] Remove the local `Explorar` mode and the extra second-row `Visual`, `Objetos`, `Conexões`, and `Chat` composition.
- [x] Match the plus, panel-layout, and chevron controls at the far right, including the split-button radii.
- [x] Keep top-rail controls aligned within 46 px without the local 46 px blank/secondary row.

## 5. Editor Header And Properties

- [x] Replace the local generic glyph tile with the observed wolf emoji at the reference size and top offset without a rounded gray tile.
- [x] Match the editor content width of about 688 px and 40 px horizontal insets inside the reference scroll area.
- [x] Position the object controls at y≈185 px in the inspected state and preserve their relationship to the title.
- [x] Use exact object type label `Página`, its page icon, chevron segment, blue selected surface, border, 28 px height, and 8 px radius.
- [x] Use exact `Coleções` label and reference collection icon, size, gap, muted color, and inline field behavior.
- [x] Match `Personalizar`, its leading icon, conditional visibility, trailing chevron, and position near the right edge.
- [x] Replace the local settings icon with the reference 28 px ellipsis menu trigger.
- [x] Use exact editable title `ADK 2.0: referência rápida de conceitos, ferramentas e comandos` and preserve its two-line wrap.
- [x] Implement the title as the reference-like editable textbox with `Título` placeholder semantics rather than static placeholder copy.
- [x] Add the observed alias chip `asaa`, `Aliases` field/label, and reference spacing.
- [x] Use the exact visible description `aaaaaaaaaaaaaaaa` in an editable `Descrição...` field.
- [x] Match the `Etiquetas` property row, tag icon, editable field semantics, and vertical spacing.
- [x] Match the right-side document outline at the reference x-position, line lengths, colors, active marker, and scroll synchronization.

## 6. Editor Body And Written Content

- [ ] Replace all local sample-note wording with the exact authenticated reference object's visible Portuguese content.
- [x] Begin the editor body with `ADK 2.0 — Ecossistema local de desenvolvimento` and its exact following paragraph and numbered list.
- [ ] Preserve the reference headings, paragraphs, numbered lists, bold spans, punctuation, capitalization, spelling, and line wrapping throughout the object.
- [ ] Reproduce later visible sections including `Estrategias de desvolvimento`, `Etapas do Vibe Coding`, `Etapas do SSD`, `Fluxo de trabalho antigravidade`, and `Glosario` exactly as observed.
- [ ] Reproduce the reference code/text blocks, their internal numbering, borders, padding, and editable behavior.
- [ ] Reproduce the reference embedded image block at its observed width, radius, object-fit, and scroll position.
- [ ] Match reference block-to-block vertical rhythm, list indentation, and content padding across the full approximately 4548 px editor document.
- [ ] Preserve editable selection, caret, hover, focus, and block-action behavior without causing layout shift.

## 7. Typography And Text Rendering

- [x] Replace Geist rendering in the workspace with `Inter, ui-sans-serif, system-ui` to match the reference.
- [x] Match the title at 30 px/33 px, weight 700, normal letter spacing, and 14 px top/4 px bottom margins instead of the local ~38 px title.
- [x] Match editor body text at 16 px/24 px and the reference primary text color.
- [x] Match body section headings at 24 px/32 px, weight 700, and -0.24 px letter spacing where measured.
- [x] Match 14 px/18.2 px property-label typography and 18 px/24.75 px description typography.
- [x] Match the top-rail 13 px/16.9 px label typography and selected 500 weight.
- [x] Match sidebar 12 px section labels and 14 px row text without local font-weight drift.
- [x] Verify every long title, tab, row, and graph-node label uses the reference wrapping, clipping, or ellipsis behavior.

## 8. Colors, Borders, And Surfaces

- [x] Replace the speculative warm token set with the measured shell/sidebar background `oklch(0.9856 0.0016 67)`.
- [x] Use the measured editor/graph surface `oklch(1 0.0001 263.28)`.
- [x] Use measured subtle border `oklch(0.9163 0.0017 67.07)` and strong separator `oklch(0.8643 0.0017 67.13)`.
- [x] Use measured primary, secondary, and muted text values `oklch(0.2191 0.0058 285.84)`, `oklch(0.3887 0.0052 301.05)`, and `oklch(0.5725 0.0051 33.89)`.
- [x] Use measured hover surface `oklch(0.9676 0.0016 67.02)` and verify selected/pressed colors independently.
- [ ] Measure and match the reference blue object-type control, colored object icons, graph node outlines, and graph edge colors before finalizing accent tokens.
- [ ] Remove local surface or border treatments that remain visible side by side but are absent from the reference.

## 9. Icons

- [ ] Audit every local Lucide substitution against the visible reference glyph and choose the closest available project-library icon.
- [x] Match standard top-rail controls at 14 px icons inside 28 px targets.
- [x] Match sidebar icon sizes, stroke weights, baselines, and per-object colors rather than applying one generic 16 px treatment.
- [ ] Match page, collections, personalization, tags, aliases, graph, expand, fit, zoom, and panel-layout icon designs and alignments.
- [x] Use the wolf emoji consistently in the document tab, object header, and graph node with the reference rendering size.

## 10. Hover, Focus, Active, And Selected States

- [x] Match reference row hover background, foreground change, 8 px radius, and approximately 200 ms emphasized-decelerate opacity behavior.
- [x] Reveal each sidebar row's contextual controls only for parent hover, keyboard focus-within, or selection, using reserved/overlay space.
- [x] Match the pinned-row ellipsis action at 22 px and approximately 0.7 visible opacity on hover.
- [ ] Match reference immediate pressed feedback (`brightness` treatment) without the local 1 px translate effect where it is not observed.
- [x] Match selected sidebar item background, text weight, icon color, and count visibility.
- [x] Match selected graph mode typography, border/surface, and icon state without relying only on color.
- [ ] Verify focus-visible rings/outlines for all header, sidebar, editor, menu, graph, and footer controls against the reference.
- [ ] Ensure hover-only actions remain keyboard reachable and expose the same accessible names.
- [ ] Match disabled, loading, empty, and error states only after each can be directly observed in the reference.

## 11. Animations And Transitions

- [x] Match reference control hover opacity transitions around 200 ms with the observed cubic-bezier timing.
- [x] Match hover-only contextual action fades, including the observed slower approximately 500 ms linear reveal where used.
- [x] Match sidebar width collapse/expand duration of approximately 300 ms and verify content clipping during the transition.
- [x] Match object-type menu transform/scale transition at approximately 250 ms with the observed standard easing.
- [ ] Measure and match graph tab, panel open/close, graph zoom, and graph-node selection transitions without adding arbitrary motion.
- [ ] Implement `prefers-reduced-motion` behavior that preserves final states and removes nonessential movement.

## 12. Menus, Popovers, And Tooltips

- [x] Implement the `Página` type dropdown instead of leaving the local button inert.
- [x] Match the observed type dropdown at about 258 x 84 px, x≈442/y≈184, 12 px radius, subtle border/shadow, and z-index layering.
- [x] Match its 32 px inset search field with exact `Buscar` placeholder and the observed `Área` result row.
- [x] Match dropdown keyboard focus, arrow navigation, selection, Escape dismissal, outside-click dismissal, and focus return.
- [ ] Inspect and reproduce the ellipsis, `Coleções`, `Personalizar`, workspace, `Novo`, and graph toolbar menus before marking their triggers complete.
- [x] Reproduce the observed selected-row object menu at about x=176/y=187 and 269 x 401 px with 12 px radius, subtle border/shadow, 6 px inner padding, 32 px items, separators, and exact entries `Abrir`, `Fixar na Barra Lateral`, `Mudar Tipo`, `Configurações do Tipo de Objeto`, `Compartilhar`, `Apresentar`, `Exportar`, `Importar`, `Copiar`, `Duplicar`, and red `Excluir Objeto`, including visible submenus and the `Ctrl I` shortcut.
- [x] Replace the local black one-line `Voltar` tooltip with the reference delayed rich tooltip `Navegar para trás` and its `Ctrl` + arrow / `Ctrl` + `[` shortcut keys.
- [x] Match tooltip delay, white surface, border, shadow, offset, radius, typography, keyboard-key styling, and dismissal.
- [ ] Inspect every icon-only control for a reference tooltip and reproduce only those tooltips that exist.
- [ ] Record dialogs as uninspected unless a non-destructive reference workflow exposes one; do not invent a dialog solely for checklist coverage.

## 13. Graph Panel

- [x] Make `Visualização em grafo` the active desktop right-panel mode in the target state.
- [x] Replace the local Explore/placeholder panel with the observed full-panel graph canvas.
- [x] Match the two observed graph nodes, connecting edge geometry, selected blue node outline, red image node outline, wolf content, and truncated title.
- [x] Match graph node label font sizes, offsets, icon/emoji sizes, and selection/hover treatments.
- [ ] Match graph panning, node selection, drag behavior, background, clipping, and cursor feedback.
- [x] Add exact bottom controls `Mostrar menos` and `Mostrar mais` with their icons, 32 px height, grouped radii, and 12 px typography.
- [x] Add the reference filter/settings, fit-to-view, zoom-out, zoom-in, and related bottom-right controls with correct grouping.
- [ ] Match zoom limits, button pressed feedback, canvas transform transitions, and preservation of the selected node.
- [x] Keep the bottom graph toolbar pinned while the graph canvas remains independently interactive.
- [x] Match the right-panel border, surface, radius, and absence of an invented Explore heading or tile grid.
- [x] Reproduce the observed `Conteúdo relacionado` zero-result state with count `0`, list/sort controls, `Nenhum conteúdo relacionado ainda`, and helper `Objetos semanticamente relacionados dos seus espaços aparecerão aqui.`

## 14. Scrolling And Positioning

- [ ] Give the editor its own approximately 760 x 644 px scroll area at the inspected viewport and preserve the shell position.
- [x] Reproduce the full reference document scroll range of approximately 4548 px for the authenticated object.
- [ ] Match scrollbar width, track/thumb colors, visibility-on-hover behavior, and right inset.
- [x] Keep object header/content and document outline behavior synchronized with editor scrolling as observed.
- [x] Keep the graph toolbar fixed to the graph card bottom and prevent editor scrolling from moving it.
- [x] Match sidebar internal scrolling independently from editor and graph overflow.
- [x] Verify no page-level body scroll appears when the reference confines scrolling to internal regions.

## 15. Responsive Behavior

- [ ] Re-inspect the authenticated reference at tablet and mobile widths using a browser surface that can apply viewport overrides reliably.
- [ ] Record exact breakpoints and the order in which sidebar, graph panel, labels, and contextual controls collapse or move.
- [ ] Replace the local hard-coded 1250 px panel removal and 760 px mobile behavior wherever it differs from measured reference behavior.
- [ ] Match mobile navigation overlay dimensions, backdrop, animation, focus trap, and dismissal only after direct comparison.
- [ ] Verify text, buttons, toolbar groups, graph content, and document blocks do not overlap or reflow differently at each measured breakpoint.

## 16. Final Verification

- [x] Repeat the complete desktop comparison from the initial page state after implementation and inventory every remaining visible difference.
- [ ] Repeat sidebar, header, editor, graph, footer, menu, popover, tooltip, and scroll interactions in the same sequence on both applications.
- [ ] Verify default, hover, focus-visible, active, pressed, selected, expanded, and dismissed states for every reachable control.
- [ ] Verify animation duration, easing, delay, opacity, transform, and reduced-motion results using recorded state transitions.
- [ ] Capture final same-viewport screenshots for the default state, sidebar hover, type menu, rich tooltip, editor scrolled state, and graph interaction state.
- [x] Run focused software checks and `pnpm verify`, keeping that evidence separate from visual parity evidence.
- [x] Run strict OpenSpec validation and confirm every checked task has corresponding browser evidence.
- [ ] Do not claim parity while any reproducible side-by-side difference or unverified reachable interaction remains.
