# Design System Reference

> **Note**: This reference specification is adapted from [`DESIGN.md`](../../DESIGN.md).

---

## 1. Visual Theme & Atmosphere
The Notes App visual identity is ultra-minimalist, focused, and distraction-free. Built on clean monochromatic typography and spacious layout grids, it uses crisp stark contrasts and smooth dark mode adaptation to provide an effortless reading and note-taking environment.

The design relies on Geist and Geist Mono font pairs to evoke a modern, high-precision developer aesthetic combined with generous vertical whitespace and pill-shaped rounded action controls.

## 2. Color Palette & Roles
### Primary Foundation
- **Pure Canvas White (`#ffffff`)** — Default light mode background.
- **Deep Midnight Black (`#0a0a0a` / `#000000`)** — Dark mode background & high-contrast primary text.

### Typography & Text Hierarchy
- **Primary Ink (`#171717`)** — High-contrast body text in light mode.
- **Off-White Soft (`#ededed`)** — Primary body text in dark mode.
- **Muted Slate Body (`#52525b` / `zinc-600`)** — Secondary description text.
- **Dark Mode Slate (`#a1a1aa` / `zinc-400`)** — Secondary text in dark mode.

### Functional States & Interactive Elements
- **Foreground Action Button (`#171717` / `#ffffff`)** — Main CTA background with pill radius.
- **Border Subtle (`rgba(0,0,0,0.08)`)** — Hairline component borders and subtle dividers.

## 3. Typography Rules
### Hierarchy & Weights
- **Font Sans**: Geist (`var(--font-geist-sans)`), clean geometric sans-serif.
- **Font Mono**: Geist Mono (`var(--font-geist-mono)`), crisp monospace for code inline blocks.
- **H1 Display**: `3xl` (30px), font-weight `600` (semibold), line-height `1.25`, tracking `tight`.
- **Body Large**: `lg` (18px), line-height `1.75` (relaxed), secondary color.
- **Code Snippet**: `font-mono`, size `0.9em`, background pill overlay.

## 4. Component Stylings
### Buttons
- Pill shape (`rounded-full`), height `48px` (`h-12`), horizontal padding `20px` (`px-5`).
- Primary button: Solid black background with white text (inverted in dark mode), subtle hover transition to `#383838`.
- Secondary button: Transparent background with hairline border (`border-black/[.08]`), soft background hover state (`hover:bg-black/[.04]`).
