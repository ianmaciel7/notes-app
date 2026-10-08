# ADR 0009: Adopt Apple-Style Design Tokens

## Status

Accepted

## Implementation

Implemented

## Date

2026-10-08

## Current State (2026-10-08)

**Implementation: Implemented (source-confirmed).** Color, type, radius scale,
flat elevation, floating-layer blur, and motion tokens are in `globals.css`.
`button`, `input`, `textarea`, `label`, `tabs`, `select`, `native-select`,
`input-group`, `badge`, and `tooltip` have variant edits (44px controls, pill
shapes, 14px caption text, `transition-press` on buttons). `font-medium`
resolves to weight 600 through `--font-weight-medium`. Remaining primitives
inherit through tokens; all `shadow-*` utilities resolve to nothing. Provider
OAuth buttons keep brand colors. `--product-shadow` was removed because nothing
uses it. The motion rules were extracted from DESIGN.md into
[MOTION.md](../../MOTION.md); DESIGN.md links to it.

## Context

The app UI used neutral shadcn defaults with a near-black primary. A reference
design system (Apple-style: one blue accent, quiet chrome, tight type) was
supplied for all UI. It is written for a marketing catalog (photo tiles, store
cards), while this product is an exam-study tool used in long sessions: dense
forms, lists and reading, with no photography. Adopting the whole spec would
import components the product has no use for; ignoring it would leave the UI
without a coherent identity.

## Decision

Adopt the token layer only. [DESIGN.md](../../DESIGN.md) is the visual rule
set, [MOTION.md](../../MOTION.md) is the motion rule set, and
`src/app/globals.css` is the source of values for both.

- **Color:** one accent (`#0066cc` light, `#2997ff` dark) for every interactive
  signal. Parchment and near-black surfaces, hairline borders.
- **Type:** 17px body, 14px caption, tight tracking, weight 600 for headings.
  Inter behind `-apple-system` replaces Geist as the cross-platform fallback;
  Geist Mono stays for code.
- **Shape:** three radii only: pill (actions), 8px (fields, menus), 18px
  (containers).
- **Elevation:** no UI shadows. Cards use a hairline ring; floating layers use
  an 80% surface with `saturate(180%) blur(20px)` and an opaque fallback under
  `prefers-reduced-transparency`.
- **Interaction:** `scale(0.95)` press state under `motion-safe`, 2px focus
  ring, 44px minimum target.
- **Mapping:** tokens land on the existing shadcn semantic variables in hex, so
  primitives restyle without rewrites. Edit `src/components/ui/**` variants only
  where tokens cannot express the rule, which keeps the shadcn upgrade path from
  [ADR 0002](./0002-adopt-shadcn-base-nova-component-system.md).
- **Color scheme:** follow `prefers-color-scheme`; `.dark` and `.light` classes
  still override.
- **Not adopted:** product tiles, the product shadow, store cards,
  option-picker chips, sticky price bar, and photography components. The list
  lives in DESIGN.md so they are not rebuilt by accident.
- **Motion:** adopt the token layer of the Apple HIG motion system (DesignMD
  `motion/apple`) in `globals.css`, CSS only (no animation library). The rules
  are documented in [MOTION.md](../../MOTION.md), the counterpart of DESIGN.md.
  - Durations: `--duration-instant|fast|default|slow|slower` = 0 / 150 / 300 /
    400 / 500ms. Hover and color changes use `fast`.
  - Easing: `ease-out`, `ease-in`, `ease-in-out`, `ease-deceleration` with the
    documented curves. `ease-out` is the Tailwind default timing function.
  - Springs: `ease-spring-default|snappy|gentle|tight` are `linear()` samples of
    the documented stiffness/damping (300/30, 500/40, 170/26, 700/60). Buttons
    use `transition-press`: color at `fast` ease-out, press scale on the tight
    spring.
  - Press `scale(0.95)` with no delay; hover shifts background only; focus ring
    appears instantly with no animation; spinner is 0.9s linear.
  - Reduced motion: slides and scales become fades and transitions run at 250ms
    ease-out. Press scale already requires `motion-safe`.
  - Not adopted: stagger (the app has no custom list or grid reveals), push,
    sheet and hero/magic-move transitions (Base UI primitives keep their
    `tw-animate-css` enter and exit), tvOS focus lift, haptics, gesture-velocity
    matching, and shimmer skeletons (existing pulse stays). New custom
    animations must use these tokens; do not animate more than one full-screen
    transition at a time.

## Consequences

- Provider OAuth buttons keep their brand colors. This is the only exception to
  the single-accent rule, scoped by `button[data-provider]`.
- Three values deviate from the source spec for accessibility or legibility:
  secondary text is `#6e6e73` (the spec's `#7a7a7a` is below AA), text on the
  dark-mode blue is `#1d1d1f` (white fails AA on `#2997ff`), and buttons use
  weight 400 instead of 300.
- Default controls grow to 44px, which makes dense screens taller.
- Dark-mode tokens are declared twice in `globals.css` (class and media query)
  because CSS cannot share one block between them. Edit both together.
- `--shadow-*` tokens resolve to nothing, so any `shadow-*` utility is a no-op.
  Review rejects shadows other than ring or inset hairlines.
- Any new color, radius, or off-scale spacing value fails review against the
  checks in DESIGN.md.

## Verification

Source-confirmed against `globals.css`, `src/components/ui/**`, DESIGN.md and
MOTION.md on 2026-10-08. `pnpm run verify:changed` (lint, types, unit tests) passed. No
browser contrast, motion, or visual regression test was run, so the
`linear()` spring approximations, the reduced-motion override, and both color
schemes still need a manual pass. Run `pnpm run verify:changed` and that pass
when tokens change.

## Follow-ups

- `--chart-1` to `--chart-5` are still neutral grays; define a palette that
  respects the single-accent rule before charts ship.
- `shadow-*` utilities remain in `src/components/ui/**` as no-ops; leave them to
  keep the shadcn upgrade path (ADR 0002).

## Alternatives considered

- Adopt the full spec including tiles: rejected, it targets marketing pages.
- Rewrite primitives with spec-named components: rejected, it breaks the shadcn
  upgrade path (ADR 0002).
- Light mode only: rejected, the spec's dark tokens exist and the app needs both.
- Keep Geist: rejected, `-apple-system` plus Inter is closer to the spec's
  SF Pro feel off Apple platforms.
