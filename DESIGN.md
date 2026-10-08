# Design System

Visual language for the app UI. It adopts the **token layer** of an Apple-style
design system (quiet chrome, one blue accent, tight type) and deliberately
leaves out the marketing layer (product tiles, photography, store components).
Decision record: [ADR 0009](./docs/adr/0009-adopt-apple-style-design-tokens.md).

Source of truth for values is `src/app/globals.css`. This file explains intent
and rules; if they disagree, fix the one that is wrong in the same change.

## Principles

- One accent. Every interactive signal is Action Blue. No second accent.
- Chrome recedes. Separation comes from surface change and hairlines, not shadows.
- Three shapes only: pill (actions), 8px (fields and menus), 18px (containers).
- Body copy is 17px, not 16px.
- Both color schemes ship together and follow `prefers-color-scheme`.

## Color

| Role | Light | Dark | Token |
| --- | --- | --- | --- |
| Interactive / link | `#0066cc` | `#2997ff` | `--primary` |
| Text on interactive | `#ffffff` | `#1d1d1f` | `--primary-foreground` |
| Focus ring | `#0071e3` | `#2997ff` | `--ring` |
| Page canvas | `#ffffff` | `#252527` | `--background` |
| Text | `#1d1d1f` | `#ffffff` | `--foreground` |
| Container | `#ffffff` | `#272729` | `--card` |
| Parchment / muted surface | `#f5f5f7` | `#2a2a2c` | `--muted`, `--secondary`, `--accent` |
| Floating layer | `#f5f5f7` | `#2a2a2c` | `--popover` |
| Secondary text | `#6e6e73` | `#cccccc` | `--muted-foreground` |
| Hairline | `#e0e0e0` | `rgb(255 255 255 / 0.14)` | `--border` |
| Pearl capsule | `#fafafc` | `#2a2a2c` | `--pearl` |

Rules:

- Values are written as hex in `globals.css`. Do not inline hex in components.
- `#7a7a7a` is for disabled controls only (about 4.3:1 on white, below AA).
- Pure black is not used for page surfaces.

### Exception: provider buttons

OAuth buttons keep each provider's brand color, scoped by
`button[data-provider]` in `globals.css`. Nothing else may introduce a color.

## Typography

- Stack: `-apple-system, BlinkMacSystemFont, Inter, system-ui, sans-serif`
  (Inter via `next/font`, `ss03` enabled). Geist Mono for code and `kbd`.
- Body `text-body`: 17px / 1.47 / -0.374px. Applied to `body`, inputs, labels, buttons.
- Caption 14px: menus, badges, tooltips, helper text, small buttons.
- Headings: weight 600, tracking -0.02em. Weight 500 is not used.
- Root `rem` stays 16px so spacing math is unchanged.

## Shape

| Radius | Use |
| --- | --- |
| Pill | buttons, badges, tabs, switches |
| 8px (`rounded-md`, `rounded-lg`) | text fields, selects, menus, popovers, tooltips |
| 18px (`rounded-xl` to `rounded-3xl`) | cards, dialogs, drawers |
| 5px (`rounded-xs`, `rounded-sm`) | inner items only |

## Elevation

- No box shadows anywhere in the UI; `--shadow-*` tokens resolve to nothing.
- Cards and dialogs use a 1px hairline ring.
- Floating layers (popover, menus, select, hover card, combobox) use the popover
  surface at 80% with `saturate(180%) blur(20px)`, falling back to an opaque
  surface under `prefers-reduced-transparency`.

## Interaction

- Press: `scale(0.95)` on buttons, only under `motion-safe`.
- Focus: 2px outline in `--ring`, offset 2px.
- Hover: one subtle background shift per component; no movement.
- Touch target: 44px minimum (default button and input height is 44px).

## Motion

Durations, easing, springs, enter/exit and reduced-motion rules live in
[MOTION.md](./MOTION.md). Values are in `globals.css`.

## Not adopted

Recorded so they are not rebuilt by accident: full-bleed alternating product
tiles, the product drop shadow on UI, store/utility cards, option-picker chips,
sticky price bar, environment quote card, hero photography, weight-300 buttons.

## Deviations from the source spec

- `--muted-foreground` is `#6e6e73`, not `#7a7a7a`, to pass WCAG AA.
- Dark `--primary-foreground` is `#1d1d1f`, not white, to pass AA on `#2997ff`.
- Large buttons use weight 400, not 300.

## Checks

- Any new color outside the table above fails review.
- Any `shadow-` utility other than a ring or inset hairline fails review.
- Any radius outside the shape table fails review.
- Text and controls pass WCAG AA in both color schemes.
