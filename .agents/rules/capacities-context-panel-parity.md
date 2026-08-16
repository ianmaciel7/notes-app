# Capacities context panel parity

Use this rule for the desktop context-tab rail and right-side context panel in
`src/components/workspace-shell.tsx`. Inspect the authenticated Capacities
reference and localhost separately before changing parity-sensitive behavior.

## Measured desktop contract

- At a `1128x912` viewport with the `288px` sidebar open, the top rail is
  `46px` high and the context grid track is `378px`.
- The visible context card is `368x856` at `x=750, y=46`; the extra `10px` is
  the outer right/bottom spacing. The main card is `442x856` at `x=298, y=46`.
- Keep `scrollWidth === clientWidth`. Do not recover parity with horizontal
  clipping, screenshot-position hacks, `!important`, or duplicated literals.

## Interaction contract

- A single tab fills the available tab strip. Multiple tabs share that strip
  equally and truncate labels without pushing the rail controls off-screen.
- `Explorar` follows the same active-tab treatment as every other tab: selected
  surface, border, medium label, colored icon, and visible close action.
- Inactive tabs stay transparent with regular-weight labels. Their close action
  appears on hover or keyboard focus. Hover, focus-visible, and selected states
  must remain distinct.
- `Nova aba` opens the global search palette, focuses its input, and adds or
  activates one unique `Explorar` tab while preserving the other open tabs.
  Escape closes the palette; arrow keys and Enter operate the filtered results.
- The adjacent menu offers `Chat de IA` and `Buscar`. Choosing graph, internal
  objects, related content, chat, or search replaces only the `Explorar`
  placeholder and preserves every other open tab.
- Closing the last tab closes the entire context panel, expands the workspace,
  and reveals the monthly-calendar auxiliary pane. Reopening the panel restores
  the last closed tab and removes that auxiliary pane.
- The empty graph view remains centered within the full context card and does
  not impose its own shortened height.

## Required evidence

- Keep focused interaction tests in `__tests__/workspace-shell.test.tsx` for the
  palette, menu, equal tab sharing, placeholder replacement, last-tab close,
  and restoration flow.
- Before claiming parity, compare rendered geometry and default, hover, focus,
  menu, close, and reopen states at the reference viewport.
- Prefer Tailwind tokens and existing shadcn/Radix primitives. Source and tests
  remain authoritative if Graphify output disagrees.
- After material changes, run `pnpm graphify:update`, `pnpm graphify:check`, and
  Graphify multigraph diagnostics so the repository graph stays synchronized.
