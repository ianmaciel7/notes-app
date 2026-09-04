# Floating interaction reference evidence

Captured/confirmed on 2026-09-04 for explicit tooltips, entity hover previews, and click-driven popups.

## User-provided screenshots

- `sidebar-new-hint-light.webp` — sidebar `Novo` tooltip with keyboard shortcut pills.
- `sidebar-explore-hint-light.webp` — richer sidebar `Explorar` tooltip with explanatory copy and shortcuts.
- `history-forward-hint-light.webp` — compact header/history tooltip for forward navigation.
- `object-preview-light.webp` — light-theme object preview card for an atomic note.
- `collection-and-citation-preview-light.webp` — collection surface with a citation preview visible.
- `object-preview-dark.webp` — dark-theme object preview card.
- `side-tab-hint-dark.webp` — compact dark-theme tooltip for the side-tab action.

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

The captured tooltip contract is explicit: a visual tooltip is instantiated from tooltip content/configuration, not merely because a control has ARIA metadata. Captured defaults include:

- offset: **6 px**
- width: **`max-w-40`**
- open delay: **200 ms**
- close delay: **0 ms**
- default arrow: **disabled**
- default interaction: **non-interactive**
- default mobile display: **disabled**
- when another tooltip is already visible, the next tooltip opens without the normal delay
- tooltip content can include text, shortcuts, images, HTML/Markdown-derived content, and composed arrays

The captured tooltip transition is an opacity fade of about **180 ms**; it does not use popover-style zoom or directional slide motion.

### `https://app.capacities.io/RootEntity59846.js`

The captured `EntityHoverPreview` behavior includes:

- default debounce/open dwell: **330 ms**
- default placement: **top**
- floating main-axis offset: **4 px** with zero cross-axis offset
- close tolerance: `min(debounce, 180)`, therefore **180 ms** with the default dwell
- desktop behavior by default; entity hover previews are suppressed on mobile
- pointer entry into the preview cancels the pending close, preserving an interactive path from trigger to preview
- enter transition: opacity about **150 ms**
- leave transition: opacity about **100 ms**

### `https://app.capacities.io/index59846.css`

The archived stylesheet contains the shared `.base-tooltip` and `.preview-card-core` surfaces used as visual references.

`.base-tooltip` uses a compact translucent surface with a 50%-strength border, 50%-strength front background, `text-xs`, medium weight, restrained shadow, and approximately **8 px backdrop blur**.

`.preview-card-core` uses a larger rounded card, front surface/background, one-pixel border, primary text, and the restrained shadow sequence represented in this project by `floatingInteractionSurfaceClass`.

## Semantic boundary

The archive and the official Capacities navigation documentation support three distinct interaction categories:

- **Tooltip** — an explicit auxiliary explanation for a control. Non-interactive by default and independent from `aria-label`, `aria-description`, and `aria-keyshortcuts`.
- **Entity hover preview** — a sighted preview of the destination/object itself. It uses Preview Card behavior with a longer dwell and interactive pointer path.
- **Popover/menu/dialog** — an explicit interactive surface opened by click/focus/keyboard. It does not inherit hover-tooltip or entity-preview timing.

ARIA remains required for accessibility where appropriate, but ARIA attributes are not a visual-tooltip opt-in mechanism.

## Project mapping

- Explicit control tooltips: `Button.tooltip` -> `src/components/ui/interaction-hint.ts` -> detached Base UI Tooltip handle in `src/components/ui/interaction-provider.tsx`
- Tooltip primitive/surface: `src/components/ui/tooltip.tsx` + `tooltipSurfaceClass`/`tooltipMotionClass` in `src/components/ui/shared-styles.ts`
- Entity/object previews: `src/components/ui/hover-card.tsx` + `previewSurfaceMotionClass`
- Explicit interactive popups: `src/components/ui/popover.tsx`, dialogs, menus, and command palettes
- Shared keycap treatment: `src/components/ui/kbd.tsx`
- Normative rules: `DESIGN.md#7-accessible-interaction-contract`
