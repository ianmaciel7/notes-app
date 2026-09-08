# Capacities Runtime Style Guide

Source: `https://app.capacities.io/eb0a4d1e-0567-4348-8ecf-587c417725f4/a961988a-5562-45bf-86d4-2b2375b17544`
Capture date: 2026-09-08

## Visual target

The captured Capacities workspace is a dense, calm, light productivity shell. The UI uses quiet surface separation, compact row geometry, persistent object icons, and hover-revealed secondary actions. It avoids decorative gradients, heavy shadows, large menus, and animated spectacle.

## Tokens observed

- App canvas: `oklch(0.9856 0.0016 67)`
- Main object surface: `oklch(1 0.0001 263.28)`
- Main object border: `oklch(0.9163 0.0017 67.07)`
- Primary text: `oklch(0.2191 0.0058 285.84)`
- Secondary text: `oklch(0.3887 0.0052 301.05)`
- Runtime font stack: `Inter, ui-sans-serif, system-ui`
- Main object radius: `12px`
- Row radius: `8px`
- Sidebar row height: `32px`
- Section header height: `24px`
- Standard UI text: `14px`
- Section label text: `12px`
- Document title: about `30px`, `700`, `33px` line-height

## Component rules

- Sidebar rows use one persistent leading icon, one text label, optional count, and hover-only secondary actions.
- Object type icons are always visible. Do not hide the semantic object icon just because the row is idle.
- Section counters and controls are hidden at rest and revealed on section hover or while their popup is open.
- Menu items always reserve left icon space and use right-aligned checks, chevrons, or shortcuts.
- Floating action surfaces use `8px` radius, hairline border, white background, and restrained shadow.
- Right inspector action cards use compact grid geometry with `8px` gaps.

## Anti-patterns

- Text-only menu rows.
- Permanently visible `...` or `+` controls in idle sidebar sections.
- Oversized default menu widths.
- Popover zoom/slide animation.
- Heavy card shadows for normal workspace surfaces.
