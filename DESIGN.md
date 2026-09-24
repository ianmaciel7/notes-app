---
version: alpha
name: notes-app-shadcn-design-system
description: Design system and component specification for Notes App based on shadcn/ui base-nova style with Base UI primitives, Tailwind CSS v4, and OKLCH color variables. This YAML frontmatter contains machine-readable tokens; the Markdown body provides rationale and usage guidance.

omitted:
  - section: spacing
    reason: "No project-level spacing token scale exists; Tailwind defaults and component-local values remain implementation details."

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
  dark-background: "oklch(0.145 0 0)"
  dark-foreground: "oklch(0.985 0 0)"
  dark-card: "oklch(0.205 0 0)"
  dark-card-foreground: "oklch(0.985 0 0)"
  dark-popover: "oklch(0.205 0 0)"
  dark-popover-foreground: "oklch(0.985 0 0)"
  dark-primary: "oklch(0.922 0 0)"
  dark-primary-foreground: "oklch(0.205 0 0)"
  dark-secondary: "oklch(0.269 0 0)"
  dark-secondary-foreground: "oklch(0.985 0 0)"
  dark-muted: "oklch(0.269 0 0)"
  dark-muted-foreground: "oklch(0.708 0 0)"
  dark-accent: "oklch(0.269 0 0)"
  dark-accent-foreground: "oklch(0.985 0 0)"
  dark-destructive: "oklch(0.704 0.191 22.216)"
  dark-border: "oklch(1 0 0 / 10%)"
  dark-input: "oklch(1 0 0 / 15%)"
  dark-ring: "oklch(0.556 0 0)"
  dark-sidebar: "oklch(0.205 0 0)"
  dark-sidebar-foreground: "oklch(0.985 0 0)"
  dark-sidebar-primary: "oklch(0.488 0.243 264.376)"
  dark-sidebar-primary-foreground: "oklch(0.985 0 0)"
  dark-sidebar-accent: "oklch(0.269 0 0)"
  dark-sidebar-accent-foreground: "oklch(0.985 0 0)"
  dark-sidebar-border: "oklch(1 0 0 / 10%)"
  dark-sidebar-ring: "oklch(0.556 0 0)"

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
  sm: "6px"
  md: "8px"
  lg: "10px"
  xl: "14px"
  2xl: "18px"
  3xl: "22px"
  4xl: "26px"

components:
  button-default:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-foreground}"
    rounded: "{rounded.lg}"
  card:
    backgroundColor: "{colors.card}"
    textColor: "{colors.card-foreground}"
    rounded: "{rounded.xl}"
  popover:
    backgroundColor: "{colors.popover}"
    textColor: "{colors.popover-foreground}"
    rounded: "{rounded.lg}"
---

# Design System Specification

This file owns the **visual and interaction language**. Exact implementation details
belong to source code and code-writing rules to `CONVENTIONS.md`. The frontmatter
mirrors the design tokens implemented in `src/app/globals.css`; if they diverge,
the stylesheet is ground truth and this document is stale.

## Overview

The system uses shadcn/ui's `base-nova` preset on Base UI with Tailwind CSS v4.
The visual language is deliberately restrained:

- neutral, high-contrast OKLCH surfaces and text;
- semantic color roles instead of raw color selection;
- light/dark themes driven by CSS variables;
- modest depth, usually rings or restrained shadows;
- accessible focus and interaction states.

Not yet established: a product-specific grid/container system, custom breakpoint
scale, or formal elevation hierarchy.

## Colors

The `colors` token map is intentionally flat. Default-theme roles use names such as
`{colors.background}`; dark-theme counterparts use project naming such as
`{colors.dark-background}`. This keeps all machine-readable colors inside the
schema's `colors` group instead of introducing unsupported top-level theme groups.

Roles are:

- **Surface:** background, card, popover, sidebar.
- **Text:** foreground and role-specific foreground tokens.
- **Interactive:** primary, secondary, accent, ring.
- **Semantic:** destructive.
- **Structure:** border and input.

Dark/light pairing is a project naming convention; the runtime pairing itself is
implemented by the CSS variable blocks in `src/app/globals.css`.

## Typography

- `{typography.heading}`: headings and emphasized structural labels.
- `{typography.body}`: default application copy.
- `{typography.mono}`: code and technical identifiers only.

Heading/body currently share Inter Variable with different weight intent; mono uses
Geist Mono. There is no product-specific type scale beyond configured Tailwind
utilities.

## Layout

The project has no shared spacing token scale, so the frontmatter deliberately marks
`spacing` as omitted. Layout spacing uses Tailwind defaults plus occasional
component-local implementation values.

No custom breakpoint scale or product grid/container system is defined. Promote a
layout rule to a design token only when a genuinely shared product pattern exists.

## Elevation & Depth

There is no formal elevation token scale.

- Simple surfaces generally prefer a subtle ring/hairline.
- Floating overlays may combine a restrained shadow with a ring.
- Match the nearest established surface role instead of inventing a new elevation
  value.
- Introduce named elevation tokens only when repeated product patterns justify a
  real hierarchy.

## Shapes

Radii derive from the shared `--radius` implementation and are represented in the
frontmatter as concrete dimension tokens. Change the shared radius system rather than
hardcoding one-off component radii.

## Components

The `components` frontmatter entries are representative examples of token
composition, not a source-file inventory.

Current shared UI families include actions/triggers, navigation/layout, overlays,
forms/input, data display/feedback, and conversational extensions.

`src/components/ui/` is authoritative for exact component inventory and
implementation. `CONVENTIONS.md` owns component API/anatomy rules.
`TESTING.md` owns Ladle and visual-verification policy.

## Do's and Don'ts

**Do**

- use semantic color roles and token references;
- preserve light/dark behavior through shared CSS variables;
- choose surface depth and radius from the nearest established role;
- reuse existing primitives and visual states before introducing a new idiom;
- keep keyboard/focus interaction states visible.

**Don't**

- add unknown top-level frontmatter groups to model theme variants;
- hardcode component-specific colors when a semantic token owns the role;
- invent a spacing, breakpoint, radius, or elevation system for one component;
- use color alone to communicate selected, error, disabled, or loading state;
- put testing commands or React implementation patterns in this document.
