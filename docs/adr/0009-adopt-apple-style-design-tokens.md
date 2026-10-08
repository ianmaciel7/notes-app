# ADR 0009: Adopt Apple-Style Design Tokens

<!-- cspell:ignore scroller -->

## Status

Accepted

## Implementation

Implemented

## Date

2026-10-08

## Current State (2026-10-08)

**Implementation: Implemented (source-confirmed).** Color, type, radius scale,
flat elevation, floating-layer blur, motion, and chart tokens are in
`globals.css`.
`button`, `input`, `textarea`, `label`, `tabs`, `select`, `native-select`,
`input-group`, `badge`, and `tooltip` have variant edits (44px controls, pill
shapes, 14px caption text, `transition-press` on buttons). `font-medium`
resolves to weight 600 through `--font-weight-medium`. Remaining primitives
inherit through tokens; all `shadow-*` utilities resolve to nothing. Provider
OAuth buttons keep brand colors. `--product-shadow` was removed because nothing
uses it. The motion rules were extracted from DESIGN.md into
[MOTION.md](../../MOTION.md); DESIGN.md links to it.

The 2026-10-08 static audit of `src/app`, `src/components/ui`, and
`src/components/notes-app` found 44 occurrences (4 high, 22 medium, 18 low),
mainly: nonexistent classes (`text-text-muted` in `policies.tsx`,
`easing-[ease]` in `navigation-menu.tsx`, `shimmer` and `scroll-fade-x` in
`attachment.tsx`); `shadow-*` still present in several UI primitives;
hardcoded durations and easings outside the MOTION.md tokens (dialog,
alert-dialog, drawer, sheet, navigation-menu, toast, message-scroller,
input-otp); non-semantic colors (`bg-black/10`, `text-red-600`,
`text-green-600`, `bg-white`, fixed oklch/color-mix values); recurring
`text-xs` and `space-y-*`; and arbitrary radii and values.

The 2026-10-08 audit corrections have been applied: nonexistent classes,
hardcoded component colors, overlay colors, audited durations/easings, toast
direction, semantic auth colors, arbitrary audited radii, spacing utilities,
and audited caption sizes now follow the documented tokens. This pass also
removed duplicate theme tokens, added exit easing, restored the base typeset
highlight token, and raised the calendar caption and questionnaire shortcut to
14px. `shadow-*` utilities remain in UI primitives as no-ops pending the
existing upgrade-path decision; compact badge/status labels and
component-specific dimensions remain where they are part of control geometry.
The toggle remains `rounded-lg` because the Shape table does not specify
toggles as pills. Manual visual verification in a browser remains pending.

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
- **Shape:** three radius categories plus a 5px inner-item radius: pill
  (actions), 8px (fields, menus), 18px (containers), and 5px for inner items.
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

## Components in scope

Every component below inherits the tokens and is subject to the DESIGN.md and
MOTION.md checks; none is exempt.

### `src/components/ui`

- `accordion`
- `alert`
- `alert-dialog`
- `aspect-ratio`
- `attachment`
- `avatar`
- `badge`
- `breadcrumb`
- `bubble`
- `button`
- `button-group`
- `calendar`
- `card`
- `carousel`
- `chart`
- `checkbox`
- `collapsible`
- `combobox`
- `command`
- `context-menu`
- `dialog`
- `direction`
- `drawer`
- `dropdown-menu`
- `empty`
- `field`
- `hover-card`
- `input`
- `input-group`
- `input-otp`
- `item`
- `kbd`
- `label`
- `marker`
- `menubar`
- `message`
- `message-scroller`
- `native-select`
- `navigation-menu`
- `pagination`
- `popover`
- `progress`
- `questionnaire`
- `radio-group`
- `resizable`
- `scroll-area`
- `select`
- `separator`
- `sheet`
- `sidebar`
- `skeleton`
- `slider`
- `spinner`
- `switch`
- `table`
- `tabs`
- `textarea`
- `toast`
- `toggle`
- `toggle-group`
- `tooltip`

### `src/components/notes-app`

- `apple-sign-in-button`
- `auth-field-error`
- `auth-page-heading`
- `auth-provider`
- `country-selector`
- `email-link-auth-card`
- `email-link-auth-form`
- `facebook-sign-in-button`
- `forgot-password-auth-card`
- `forgot-password-auth-form`
- `github-sign-in-button`
- `google-sign-in-button`
- `intl-provider`
- `locale-lang-script`
- `locale-picker`
- `microsoft-sign-in-button`
- `multi-factor-auth-assertion-card`
- `multi-factor-auth-assertion-form`
- `multi-factor-auth-enrollment-card`
- `multi-factor-auth-enrollment-form`
- `oauth-button`
- `oauth-card`
- `phone-auth-card`
- `phone-auth-form`
- `policies`
- `reauthenticate-button`
- `redirect-error`
- `second-factor-panel`
- `sign-in-auth-card`
- `sign-in-auth-form`
- `sign-out-button`
- `sign-up-auth-card`
- `sign-up-auth-form`
- `sms-multi-factor-assertion-form`
- `sms-multi-factor-enrollment-form`
- `theme`
- `theme-script`
- `theme-toggle`
- `totp-multi-factor-assertion-form`
- `totp-multi-factor-enrollment-form`
- `twitter-sign-in-button`
- `yahoo-sign-in-button`

## Verification

Source confirmed against `globals.css`, `src/components/ui/**`, DESIGN.md and
MOTION.md on 2026-10-08. `pnpm run test` (20 files, 125 tests),
`pnpm run check:deps`, `pnpm run check:types`, `pnpm run build`, and
`pnpm exec biome check` on this ADR's files passed. Playwright E2E (8 tests,
including the axe accessibility checks in `tests/e2e/home.spec.ts`) passed with
`--workers=1` against the local emulators. On a first parallel run, 5 tests
failed due to timing/load and passed when run serially; run E2E with few workers
locally. Computed contrast ratios for the chart palette were light
8.42/6.38/5.57/4.14/3.29 against `#ffffff` and dark
3.42/4.21/4.94/6.40/8.17 against `#272729`.

STILL PENDING: a manual browser pass covering visual contrast, motion (the
`linear()` spring approximations, the reduced-motion override, the ease-in
exit on dialog/drawer/navigation-menu/toast) and both color schemes.

## Follow-ups

- `--chart-1` to `--chart-5` now use five-step monochromatic blue ramps derived
  from the light and dark accents; charts with more than five series need
  labels or patterns, not new hues.
- `shadow-*` utilities remain in `src/components/ui/**` as no-ops; leave them to
  keep the shadcn upgrade path (ADR 0002).
- The audited nonexistent classes and durations/easings outside the documented
  tokens were fixed on 2026-10-08; this pass also completed the exit easing,
  duplicate-token, typeset-highlight, calendar-caption, and questionnaire
  shortcut corrections.
- `shadow-*` remains a no-op in `src/components/ui/**` pending the existing
  shadcn upgrade-path decision; no shadow utilities were changed in this pass.
- The toggle remains `rounded-lg`: the Shape table does not assign toggles to
  the pill category, so no compact variant adjustment was needed.

## Alternatives considered

- Adopt the full spec including tiles: rejected, it targets marketing pages.
- Rewrite primitives with spec-named components: rejected, it breaks the shadcn
  upgrade path (ADR 0002).
- Light mode only: rejected, the spec's dark tokens exist and the app needs both.
- Keep Geist: rejected, `-apple-system` plus Inter is closer to the spec's
  SF Pro feel off Apple platforms.
