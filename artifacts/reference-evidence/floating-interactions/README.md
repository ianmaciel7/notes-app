# Floating interaction reference evidence

Captured/confirmed on 2026-09-04 for the ARIA-first hint, preview, and popup standardization.

## User-provided screenshots

- `sidebar-new-hint-light.webp` — sidebar `Novo` hint with keyboard shortcut pills.
- `sidebar-explore-hint-light.webp` — richer sidebar `Explorar` hint with explanatory copy and shortcuts.
- `history-forward-hint-light.webp` — compact header/history hint for forward navigation.
- `object-preview-light.webp` — light-theme object preview card for an atomic note.
- `collection-and-citation-preview-light.webp` — collection surface with a citation preview visible.
- `object-preview-dark.webp` — dark-theme object preview card.
- `side-tab-hint-dark.webp` — compact dark-theme hint for the side-tab action.

SHA-256:

```text
ca9406e7e2fec67410f997341ea158fd76cc6aaf866f53a76b279fdf5822b0a3  sidebar-new-hint-light.webp
aeda6b04da5c55a7cac07ee1e4ddbaaf497b50cad2c97238c91241d7661db6a4  sidebar-explore-hint-light.webp
aaabde290ef8953792a194651449f55b02d8eea44768d78d94a339fb7779d998  history-forward-hint-light.webp
dd5036df0c5ad575c953929a8e33c1e0896f17d6c6e904f783fb5a0b26c60e59  object-preview-light.webp
9f9a5de9f47cc05287df7e7081cc6cf26246051a671ffa56d3d2d7dce6ec60f4  collection-and-citation-preview-light.webp
461c4d2a64d08c38c5b0985172bfe0b6de266e122012595e97d1f385a0665187  object-preview-dark.webp
2016b65ede3f5ac3d832f95737c21280719018e7ffc07b370d2206fe0f79b3c4  side-tab-hint-dark.webp
```

## Archived Capacities source confirmation

The implementation is grounded in the user-provided Capacities archive sources, not inferred from screenshots alone. Source bundle checked:

- `capacities-wacz-complete-source(1).jsonl`
- `capacities-wacz-completeness-audit(1).json`
- `my-archiving-session (1)(1).wacz`
- `my-archiving-session(2).wacz`
- `capacities-urls.txt.txt`
- `reference-urls.json`

Relevant archived application resources:

### `https://app.capacities.io/Interactable59846.js`

The captured tooltip defaults include:

- offset: **6 px**
- open delay: **200 ms**
- close delay: **0 ms**
- default arrow: **disabled**
- default interaction: **non-interactive**
- default mobile display: **disabled**
- when another tooltip is already visible, the next tooltip opens without the normal delay

### `https://app.capacities.io/RootEntity59846.js`

The captured entity hover-preview behavior includes:

- default debounce/open dwell: **330 ms**
- floating main-axis offset: **4 px**
- close tolerance: `min(debounce, 180)`, therefore **180 ms** with the default dwell
- pointer entry into the preview cancels the pending close, preserving an interactive path from trigger to preview

### `https://app.capacities.io/index59846.css`

The archived stylesheet contains the shared `.base-tooltip` and `.preview-card-core` surfaces used as visual references for borders, radii, translucent backgrounds, blur, and restrained shadows.

## Project mapping

- Standard control hints: `src/components/ui/interaction-provider.tsx` + detached Base UI Tooltip handle + `tooltipSurfaceClass` in `shared-styles.ts`
- Legacy/composed Base UI tooltips: `src/components/ui/tooltip.tsx`
- Object previews: `src/components/ui/hover-card.tsx`
- Explicit interactive popups: `src/components/ui/popover.tsx`
- Shared keycap treatment: `src/components/ui/kbd.tsx`
- Normative rules: `DESIGN.md#7-accessible-interaction-contract`
