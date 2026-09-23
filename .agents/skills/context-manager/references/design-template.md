# DESIGN.md Template

## Document Purpose
`DESIGN.md` documents the design system specifications, color tokens (light & dark mode), typography hierarchy, spacing/radius scales, UI primitive catalogs, and visual testing workflows.

---

## Canonical Structure

```markdown
---
version: 1.0.0
name: project-design-system
description: Design system and component specification.
tokens:
  base-style: base-nova
  base-color: neutral
  css-framework: tailwindcss-v4
  primitives-library: "@base-ui/react"
  icons: lucide-react
---

# Design System Specification

## 1. Overview & Architectural Foundation
- Foundational design philosophy and technology choice (e.g., shadcn/ui base-nova, Base UI unstyled primitives, Tailwind CSS v4).
- Dark/light mode switching architecture.

## 2. Color Palette & Theming
- Light mode vs. Dark mode color tokens (preferably in OKLCH or semantic CSS variables).
- Semantic roles:
  - `--background`, `--foreground`
  - `--primary`, `--primary-foreground`
  - `--secondary`, `--secondary-foreground`
  - `--muted`, `--muted-foreground`
  - `--accent`, `--accent-foreground`
  - `--destructive`
  - `--border`, `--input`, `--ring`

## 3. Typography Scale & Hierarchy
- Font families for Sans, Mono, and Headings.
- Size, weight, and line-height scale for Display, Heading, Body, and Caption.

## 4. Shapes, Spacing & Elevation
- Radius scale (`--radius` base, `--radius-sm`, `--radius-md`, `--radius-lg`, etc.).
- Elevation / shadow layering strategies.

## 5. UI Primitives Catalog
- Inventory of available components in `components/ui/`.
- Usage patterns, variants, and data attributes (e.g. `data-slot`, CVA variants).

## 6. Storybook / Visual Verification
- Storybook or Ladle story setup (`*.stories.tsx`).
- Commands to preview and build the component catalog.

## 7. Do's and Don'ts
- Clear design principles and anti-patterns (e.g. no arbitrary hex codes, always use semantic tokens).
```
