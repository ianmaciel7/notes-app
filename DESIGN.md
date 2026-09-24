---
version: alpha
name: notes-app-shadcn-design-system
description: Design system and component specification for Notes App based on shadcn/ui base-nova style with Base UI primitives, Tailwind CSS v4, and OKLCH color variables. Conforms to the design.md spec (https://github.com/google-labs-code/design.md) — this YAML block is the normative source of values; the Markdown body below is rationale and application guidance, referencing these tokens via {group.key} syntax rather than restating them.

colors:
  background: "oklch(1 0 0)"
  foreground: "oklch(0.145 0 0)"
  card: "oklch(1 0 0)"
  card-foreground: "oklch(0.145 0 0)"
  popover: "oklch(1 0 0)"
  popover-foreground: "oklch(0.145 0 0)"
  primary: "oklch(0.205 0 0)"
  primary-foreground: "oklch(0.985 0 0)"
  secondary: "oklch(0.97 0 0)"
  secondary-foreground: "oklch(0.205 0 0)"
  muted: "oklch(0.97 0 0)"
  muted-foreground: "oklch(0.556 0 0)"
  accent: "oklch(0.97 0 0)"
  accent-foreground: "oklch(0.205 0 0)"
  destructive: "oklch(0.577 0.245 27.325)"
  border: "oklch(0.922 0 0)"
  input: "oklch(0.922 0 0)"
  ring: "oklch(0.708 0 0)"
  sidebar: "oklch(0.985 0 0)"
  sidebar-foreground: "oklch(0.145 0 0)"
  sidebar-primary: "oklch(0.205 0 0)"
  sidebar-primary-foreground: "oklch(0.985 0 0)"
  sidebar-accent: "oklch(0.97 0 0)"
  sidebar-accent-foreground: "oklch(0.205 0 0)"
  sidebar-border: "oklch(0.922 0 0)"
  sidebar-ring: "oklch(0.708 0 0)"

# The design.md v1(alpha) schema's `colors:` map is flat — it has no native concept of a
# dark-theme pairing yet. Rather than lose real project data, `colors-dark` below is a
# clearly-labeled, non-canonical extension: same keys as `colors`, values from the `.dark`
# block in globals.css. A linter built against strict v1(alpha) may flag these keys as
# unrecognized — that's expected until the spec adds theme-variant support.
colors-dark:
  background: "oklch(0.145 0 0)"
  foreground: "oklch(0.985 0 0)"
  card: "oklch(0.205 0 0)"
  card-foreground: "oklch(0.985 0 0)"
  popover: "oklch(0.205 0 0)"
  popover-foreground: "oklch(0.985 0 0)"
  primary: "oklch(0.922 0 0)"
  primary-foreground: "oklch(0.205 0 0)"
  secondary: "oklch(0.269 0 0)"
  secondary-foreground: "oklch(0.985 0 0)"
  muted: "oklch(0.269 0 0)"
  muted-foreground: "oklch(0.708 0 0)"
  accent: "oklch(0.269 0 0)"
  accent-foreground: "oklch(0.985 0 0)"
  destructive: "oklch(0.704 0.191 22.216)"
  border: "oklch(1 0 0 / 10%)"
  input: "oklch(1 0 0 / 15%)"
  ring: "oklch(0.556 0 0)"
  sidebar: "oklch(0.205 0 0)"
  sidebar-foreground: "oklch(0.985 0 0)"
  sidebar-primary: "oklch(0.488 0.243 264.376)"
  sidebar-primary-foreground: "oklch(0.985 0 0)"
  sidebar-accent: "oklch(0.269 0 0)"
  sidebar-accent-foreground: "oklch(0.985 0 0)"
  sidebar-border: "oklch(1 0 0 / 10%)"
  sidebar-ring: "oklch(0.556 0 0)"

typography:
  heading:
    fontFamily: "Inter Variable, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    fontWeight: 600
  body:
    fontFamily: "Inter Variable, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    fontWeight: 400
  mono:
    fontFamily: "Geist Mono, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace"
    fontWeight: 400

rounded:
  sm: "calc(var(--radius) * 0.6)"   # 6px
  md: "calc(var(--radius) * 0.8)"   # 8px
  lg: "var(--radius)"               # 10px — the base
  xl: "calc(var(--radius) * 1.4)"   # 14px
  2xl: "calc(var(--radius) * 1.8)"  # 18px
  3xl: "calc(var(--radius) * 2.2)"  # 22px
  4xl: "calc(var(--radius) * 2.6)"  # 26px

# No global --spacing-* tokens exist in globals.css. These are the real, component-scoped
# local custom properties in use today (see card.tsx, calendar.tsx) — not a fabricated
# global scale. See "Layout" below for the honest framing.
spacing:
  card: "--spacing(4)"
  card-sm: "--spacing(3)"
  calendar-cell: "--spacing(7)"

# Representative only — four primitives illustrate the composition pattern.
# Exact component inventory and class strings live in source.
components:
  button-default:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-foreground}"
    rounded: "{rounded.lg}"
  button-destructive:
    backgroundColor: "{colors.destructive}/10"
    textColor: "{colors.destructive}"
    rounded: "{rounded.lg}"
  card:
    backgroundColor: "{colors.card}"
    textColor: "{colors.card-foreground}"
    rounded: "{rounded.xl}"
    ringColor: "{colors.foreground}/10"
    padding: "{spacing.card}"
  popover:
    backgroundColor: "{colors.popover}"
    textColor: "{colors.popover-foreground}"
    rounded: "{rounded.lg}"
    ringColor: "{colors.foreground}/10"
---

# Design System Specification

This file owns the **visual and interaction language**. Exact implementation details
belong to source code and code-writing rules to `CONVENTIONS.md`. The YAML
frontmatter above mirrors design tokens from `src/app/globals.css`; if they diverge,
the stylesheet is ground truth and this document is stale.

## Overview

The system uses shadcn/ui's `base-nova` preset on Base UI with Tailwind CSS v4.
The current visual language is deliberately restrained:

- neutral, high-contrast OKLCH surfaces and text;
- semantic color roles instead of raw color selection;
- light/dark themes driven by CSS variables;
- modest depth, usually rings or restrained shadows;
- accessible focus and interaction states.

Not yet established: a product-specific grid/container system, custom breakpoint
scale, or formal elevation hierarchy. Do not invent those systems before real
product surfaces require them.

## Colors

The frontmatter is the normative design-token view; `src/app/globals.css` is the
implementation source of truth.

Color roles:

- **Surface:** background, card, popover, sidebar.
- **Text:** foreground and role-specific foreground tokens.
- **Interactive:** primary, secondary, accent, ring.
- **Semantic:** destructive.
- **Structure:** border and input.

Use semantic roles consistently. Dark mode is represented by the project-specific
`colors-dark` extension because the current frontmatter schema used by this project
does not model paired theme variants.

## Typography

- `{typography.heading}`: headings and emphasized structural labels.
- `{typography.body}`: default application copy.
- `{typography.mono}`: code and technical identifiers only.

Heading/body currently share Inter Variable with different weight intent; mono uses
Geist Mono. There is no product-specific type scale beyond configured Tailwind
utilities.

## Layout

- Spacing uses the standard Tailwind scale unless a component has a justified local
  custom property recorded in frontmatter.
- No custom breakpoint scale is defined; responsive behavior uses configured
  framework defaults.
- No product grid/container system exists yet.
- Promote a repeated local spacing rule to a shared token only after the pattern is
  genuinely shared.

## Elevation & Depth

There is no formal elevation token scale.

- Simple surfaces generally prefer a subtle ring/hairline.
- Floating overlays may combine a restrained shadow with a ring.
- Match the nearest established surface role instead of inventing a new elevation
  value.
- Introduce named elevation tokens only when repeated product patterns justify a
  real hierarchy.

## Shapes

Radii derive from the shared `--radius` base and the `{rounded.*}` frontmatter
tokens. Change the shared token system rather than hardcoding one-off radii.

Use smaller radii for compact controls, the base radius for common interactive
surfaces, and larger radii only where an established component role already uses
them.

## Components

The `components` frontmatter entries are representative examples of token
composition, not a mirror of every source file.

Current shared UI families include:

- actions and triggers;
- layout and navigation;
- overlays and contextual surfaces;
- data input and forms;
- data display and feedback;
- conversational/chat-oriented extensions.

`src/components/ui/` is authoritative for exact inventory and implementation.
`CONVENTIONS.md` owns component API/anatomy rules. `TESTING.md` owns Ladle story
and visual-verification policy.

## Do's and Don'ts

**Do**

- use semantic tokens such as background/foreground/primary/border roles;
- preserve light/dark behavior through shared CSS variables;
- choose surface depth and radius from the nearest established component role;
- reuse existing primitives and visual states before introducing a new visual idiom;
- keep interaction states visible with keyboard/focus use.

**Don't**

- hardcode hex colors or duplicate token values in component-specific styling;
- scatter one-off dark-mode colors when a semantic variable should own the role;
- invent a new spacing, breakpoint, radius, or elevation system for one component;
- use color alone to communicate selected, error, disabled, or loading state;
- treat the design document as the owner of testing commands or React implementation
  patterns.
