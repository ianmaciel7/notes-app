# Bugfix Spec: Pages data-view parity

## Current Behavior

At a 1207x632 viewport, the live Capacities Pages surface and the local Pages surface use the same broad header/data-view composition, but the local panel renders a 14px outer radius instead of 12px, a 26px heading badge instead of 32px, semibold 24px-line-height heading text instead of bold 20px-line-height text, and a one-row 308px card instead of the live two-property-row card. The local browser was also manually resized to a 384px sidebar while the reference sidebar was 288px; that runtime panel size is not a source-code defect because 288px is already the local default. With the sidebar reset, the local default `64.5/35.5` main/context split still diverges from the measured Capacities `55/45` split.

## Why This Is a Defect

`AGENTS.md` requires Capacities parity work to follow live evidence for component geometry, icon treatment, interaction state, and data presentation. The selected local surface visibly diverges from the selected Capacities surface even though the underlying view controls already exist.

## Expected Behavior

- The object-type panel shell resolves to a 12px radius.
- The object-type heading uses the live 32px framed badge and 20px bold heading line.
- Gallery cards expose separate collection and tag property rows, retain the 192px preview well, and grow to the live 336px all-view geometry.
- The preview well includes the subtle inset shadow visible in the reference.
- The desktop workspace starts with the measured `55/45` main/context split while remaining resizable.
- `Visão geral` and `Tudo` remain independently selectable and persisted; the implementation does not force the current browser state of either product.

## Preserved Behavior

- Real Dexie-backed entities remain the data source.
- Search, filter, sort, group, layout, create, open, header collapse, and preference persistence keep their current contracts.
- Overview sections and empty states remain available.
- The workspace sidebar and context panel remain resizable, with the sidebar's existing 288px default.

## Regression Test

- Failing test before fix: static component markup requires the 12px shell, 32px framed heading badge, 20px bold heading, two semantic metadata rows, 336px card, and inset preview shadow.
- Expected failure: current markup still contains `rounded-xl`, `size-[26px]`, `font-semibold leading-6`, one metadata row, `h-[19.25rem]`, and no inset preview shadow.
- Passing evidence after fix: 13 focused unit tests and the desktop pane geometry Playwright test.

## Root Cause

The initial parity implementation approximated shared app tokens and collapsed collection/tag metadata into a single tag row. Live computed-style evidence shows those approximations do not match the current Capacities DOM.

## Verification

- [x] Focused regression: `pnpm test:unit src/components/workspace-object-renderer.test.tsx` (13 passed)
- [x] Preservation check: live browser measurements at 1207x632 and `pnpm exec playwright test tests/workspace-pane-geometry-parity.spec.ts` (1 passed)
- [ ] Required quality command: `pnpm lint` and `pnpm metrics` (both ran and remain blocked by 44 pre-existing repository-wide Biome errors and 14 warnings)
- [ ] Type check: `pnpm typecheck` (ran; blocked by the existing missing `@axe-core/playwright` dependency and an implicit-any callback in `tests/accessibility-smoke.spec.ts`)
