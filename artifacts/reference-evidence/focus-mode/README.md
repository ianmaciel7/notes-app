# Focus mode reference evidence

Confirmed on 2026-09-04 against the user-provided archived Capacities source bundle before implementing focus-mode parity.

## Sources checked

- `capacities-wacz-complete-source(1).jsonl`
- `capacities-wacz-completeness-audit(1).json`
- `my-archiving-session (1)(1).wacz`
- `my-archiving-session(2).wacz`
- `capacities-urls.txt.txt`
- `reference-urls.json`

## Capacities behavior used as the reference

### `https://app.capacities.io/LocationManager59846.js`

The normal header action uses the translated `ComponentHeader.focusMode.enterLabel`, a subtle small control, the `ph-circle-dashed-bold` icon, bottom tooltip placement, and the `global.toggleFocusMode` shortcut command. Activating it sets the shared focus-mode state to true.

While focus mode is active, the regular header chrome is replaced by a fixed, pointer-events-transparent control layer at the top of the viewport. Its visible control group remains pointer-interactive. The group contains:

- Back and Forward as secondary small floating controls with bold caret icons.
- Leave Focus Mode as the default small floating control with the bold X icon.
- A 200 ms linear transition on the fixed focus-mode layer.

The generic desktop object path uses `top-0`, `z-50`, full width, `items-start`, and horizontal padding without adding a generic top inset.

### `https://app.capacities.io/RootEntity59846.js`

The focus controls use `MultiInteractable` with `isCompensatingSpace` and `position="left"`.

The interaction geometry is important:

- secondary controls start in a zero-column grid and expand to one fractional column on hover;
- expansion uses a 300 ms ease-out transition with a 50 ms hover delay;
- the separator starts at zero width/height and fades/expands with the same timing;
- the secondary controls' natural width is measured and an invisible spacer reserves that width plus 1 px, so the group expansion preserves the intended centered geometry.

### `https://app.capacities.io/storing59846.js`

`global.toggleFocusMode` toggles the same shared focus-mode state used by the header and floating exit control.

## Copy confirmed in the archive

- English: `Enter Focus Mode` / `Leave Focus Mode`
- Portuguese: `Entrar no Modo Foco` / `Sair do Modo Foco`

## Project mapping

- Focus state + shell collapse/restore: `src/components/focus-mode-provider.tsx`
- Enter/active floating controls: `src/components/app-header.tsx`
- Provider placement: `src/app/page.tsx`
- Runtime parity coverage: `tests/focus-mode-parity.spec.ts`
