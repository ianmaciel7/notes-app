# Local Object Page Baseline - 2026-08-31

## Scope

Change: `align-object-page-complete-parity`

Task: `1.1 Inspect branch, worktree, active dev server, selected routes, viewport, semantic Page state, sidebar state, and contextual-panel state before implementation; verify the comparison record identifies the exact checkout and scrollWidth === clientWidth baseline without touching unrelated dirty files.`

## Checkout And Worktree

- Branch: `dev`
- HEAD: `e051c16`
- Dirty files observed before implementation:
  - `graphify-out/GRAPH_REPORT.md`
  - `graphify-out/graph.json`
  - `graphify-out/manifest.json`
  - `.playwright-mcp/`
  - `layout-current.png`
  - `openspec/changes/add-keyboard-command-system/`
  - `openspec/changes/align-object-page-complete-parity/`
- Boundary: unrelated Graphify/browser artifacts were not edited for this baseline.

## Active Server

- URL checked: `http://localhost:3000/pt-BR/4d0215ae-79d6-46bd-840f-8144ec5a84fb/df5fb424-5e86-44ef-8f9b-3c0ecf3f0bb9`
- HTTP status: `200`
- Port check: `0.0.0.0:3000` listening, PID `12184`
- Process command line: unavailable because Windows denied process inspection.

## Route And State

The supplied object URL was first checked in a fresh headless context. Because that context did not have the user's saved object state, the app redirected to:

`http://localhost:3000/pt-BR/4d0215ae-79d6-46bd-840f-8144ec5a84fb`

For a valid object-page baseline, an isolated Playwright context then created a local Page through the app's normal `Novo -> Pagina` flow and set the title to `Object page parity baseline`.

- Final object route: `http://localhost:3000/pt-BR/4d0215ae-79d6-46bd-840f-8144ec5a84fb/df5fb424-5e86-44ef-8f9b-3c0ecf3f0bb9`
- Viewport: `1294x912`
- Semantic Page state: one active local Page object, object type `page`, title `Object page parity baseline`
- Structures: `13`
- Entities: `1`
- Main surface: x `288`, y `0`, width `1006`, height `912`
- App shell surface: x `298`, y `46`, width `986`, height `856`, radius `12px`, border `1px solid lab(90.2907 0.219017 0.59849)`
- Object page surface: x `299`, y `47`, width `984`, height `854`, overflow `auto`
- Sidebar state: expanded desktop sidebar, x `0`, y `0`, width `288`, height `912`
- Contextual panel state: hidden/collapsed; side panel x `1294`, width `0`, height `912`

## Scroll And Console

- `document.documentElement.scrollWidth`: `1294`
- `document.documentElement.clientWidth`: `1294`
- `document.body.scrollWidth`: `1294`
- `document.body.clientWidth`: `1294`
- Verdict: `scrollWidth === clientWidth` passed for the measured desktop object-page baseline.

Baseline console failures were observed and must remain separate from object-page parity claims:

- `IntlError: MISSING_MESSAGE: Could not resolve workspace.sidebarSections.description in messages for locale pt-BR.`
- `IntlError: MISSING_MESSAGE: Could not resolve workspace.footer.shareWorkspace in messages for locale pt-BR.`
- `IntlError: MISSING_MESSAGE: Could not resolve workspace.footer.copyWorkspaceLink in messages for locale pt-BR.`

## Object-Page Affordance Inventory Snapshot

Visible object-page targets observed in the baseline:

- Type chip primary: `Pagina`, rect x `432`, y `80`, width `72.765625`, height `24`
- Type disclosure: `Alterar tipo de objeto`, rect x `504.765625`, y `80`, width `27.03125`, height `24`
- Collections selector/input: `Colecoes`, rect x `538.796875`, y `79.09375`, width `98.109375`, height `25.796875`
- Customize trigger: `Personalizar`, rect x `991.125`, y `79`, width `135.875`, height `26`
- Overflow trigger: `Mais opcoes`, rect x `1133`, y `79`, width `26`, height `26`
- Title input: `Titulo`, rect x `431`, y `121`, width `728`, height `39`
- Tags selector/input: `Etiquetas`, rect x `431`, y `168`, width `114.109375`, height `25.796875`
- Two optional property text inputs remain visible at y `213.796875` and y `249.796875`; these correspond to the known unconditional `Icon` and `Cover` placeholder mismatch.
- Editor textbox: accessible name `Text`, rect x `431`, y `297.796875`, width `728`, height `24`
- Block insert control: `Inserir bloco`, rect x `431`, y `298.796875`, width `18`, height `22`
- Block options/grip control: `Opcoes do bloco`, rect x `449`, y `298.796875`, width `18`, height `22`
- Editor tools trigger: `Abrir ferramentas do editor`, rect x `1243`, y `474`, width `28`, height `28`

## Verdict

Task 1.1 baseline record exists for the current checkout and local server. It confirms object-page containment at `1294x912`, records the sidebar and contextual-panel states, and identifies two blockers for later parity claims: no claimable in-app browser tab for the user's saved object route, and unrelated `pt-BR` missing-message console errors.
