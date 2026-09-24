# DESIGN.md Template

## Document Purpose
`DESIGN.md` documents the design system specification: color tokens and theme roles, typography, spacing/radius scales, elevation, UI primitive language, and interaction semantics.

**This is a real, external, tooling-enforced spec** — [design.md](https://github.com/google-labs-code/design.md) by Google Labs (context7 ID `/google-labs-code/design.md`), with an npm linter package (`@google/design.md`) that validates structure, WCAG contrast, and token references. Before writing or auditing `DESIGN.md`, pull its docs via context7/ctx7 rather than relying on this template alone — the spec is versioned (`alpha` at time of writing) and may have evolved.

**Key facts from the spec, since they change how this file should be written:**
- **The YAML frontmatter is the normative source of values; the Markdown body is rationale.** This inverts a naive reading of "don't duplicate data" — the body is *supposed* to reference frontmatter tokens (via `{group.key}` curly-brace syntax) and add human context, not just restate raw values. Only avoid duplication that isn't a token reference (e.g. a stray literal OKLCH value typed by hand instead of `{colors.foreground}`).
- **8 canonical H2 sections, in this exact order, with aliases**: Overview (alias: Brand & Style) → Colors → Typography → Layout (alias: Layout & Spacing) → Elevation & Depth (alias: Elevation) → Shapes → Components → Do's and Don'ts. Sections may be omitted if irrelevant, but included ones must stay in this order. Non-canonical, repo-specific sections (e.g. a Ladle/Storybook workflow note) can be appended *after* all canonical sections.
- **Frontmatter schema** (top-level keys): `version`, `name`, `description` (optional), `omitted` (optional — suppresses linter warnings for a whole missing category, with an optional reason), `colors`, `typography`, `rounded`, `spacing`, `components`. Token references inside `components` use `{group.key}` pointing into the other top-level groups.
- **`colors` is a flat map.** Keep theme variants inside that documented group
  using explicit flat token names (for example `dark-background`) or explain them in
  prose. Do not add unknown top-level groups such as `colors-dark` merely to model a
  second theme.
- **`components` in the frontmatter is for a handful of representative primitives, not every component.** Full-catalog detail belongs in the "Components" body section, grouped by category, referencing but not exhaustively duplicating source `.tsx` files.

---

## Canonical Structure

```markdown
---
version: alpha
name: project-design-system
description: One-sentence description. State here that this YAML is the normative source and the body references it.

colors:
  background: <value>
  foreground: <value>
  primary: <value>
  primary-foreground: <value>
  dark-background: <value> # optional project naming for a paired dark token
  # ...only real design tokens

omitted:
  - section: spacing
    reason: "No project-level spacing token scale."

typography:
  heading:
    fontFamily: <value>
    fontWeight: <value>
  body:
    fontFamily: <value>
    fontWeight: <value>
  mono:
    fontFamily: <value>
    fontWeight: <value>

rounded:
  sm: 4px
  md: 8px
  lg: 12px
  # Dimensions must use values accepted by the current schema.

# Define spacing only when the project has a real shared spacing-token scale.
# Otherwise omit it and record the omission in `omitted`.

components:
  <component-name>:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-foreground}"
    rounded: "{rounded.lg}"
  # 2-4 representative entries, not all components
---

# Design System Specification

## Overview
- Foundational design philosophy and technology choice.
- State plainly that the frontmatter is normative and `globals.css` (or equivalent) wins if they disagree.
- A **"Not yet established"** callout listing which canonical sections below have no real system yet (most young projects won't have a formal elevation scale or a grid system — say so, don't invent one; see this skill's Operating Principle #1).

## Colors
- Role grouping (surface / interactive / semantic) — orientation only.
- A table restating frontmatter values for human readability, explicitly noting the frontmatter is authoritative if they ever diverge.

## Typography
- Font families and roles, referencing `{typography.*}` tokens.
- A **Principles** note: only what would surprise someone reading the token names.

## Layout
- Spacing: real local/global spacing patterns, or "no formal scale, framework defaults only."
- Responsive behavior: real breakpoint usage, or "framework defaults only."
- Grid/container: only if it actually exists.

## Elevation & Depth
- Real ad hoc shadow/ring usage per component, cited by file — or a real formal `--shadow-*` scale if one exists. Never invent a tier system that isn't there.

## Shapes
- Radius scale as a table, referencing `{rounded.*}` tokens with their `calc()`/formula if derived from a base variable.

## Components
- 2-4 representative examples referencing `{components.*}` tokens (the pattern, not a full mirror of every component file).
- The full primitive catalog, grouped by real functional category (not alphabetical).

## Do's and Don'ts
- Concrete rules and anti-patterns, including at least one that follows from what the Elevation section found.

<!-- Testing/Storybook/Ladle procedures belong to TESTING.md, not DESIGN.md. -->
```

---

## Governance Rules

1. **Frontmatter Is Normative, Body Is Rationale — Not "Duplication to Avoid"**:
   Per the design.md spec, the YAML tokens are the source of truth and the Markdown body is meant to explain and reference them (via `{group.key}` syntax), not avoid mentioning them. Don't strip the frontmatter down to bare metadata — that was the wrong call before this skill knew the real spec existed. The thing to avoid is a hand-typed literal value in prose that isn't a token reference and can drift from the frontmatter; a `{colors.primary}` reference can't drift, since it's a pointer, not a copy.
2. **Ground Every Token in `globals.css` (or equivalent)**:
   Before writing or auditing the frontmatter, read the actual CSS variable file. A documented token with no corresponding CSS variable (or vice versa) is drift — flag and fix it in the same pass, per this skill's Operating Principle #1.
3. **Follow the Real Canonical Section Order**:
   Overview → Colors → Typography → Layout → Elevation & Depth → Shapes → Components → Do's and Don'ts (aliases apply — "Layout & Spacing" and "Elevation" are accepted alternate headings for "Layout" and "Elevation & Depth"). Omit a section if it's genuinely irrelevant; don't reorder the ones you keep. Repo-specific extras go after, not interleaved.
4. **Say "Not Yet Established," Don't Fabricate a System**:
   A young or component-library-stage repo usually has no formal elevation scale, spacing scale, or grid system yet. Document what's real (even "ad hoc, no formal system, see file X") rather than inventing a fuller-looking spec than the codebase implements.
5. **Representative Components, Not a Source Mirror**:
   Frontmatter and body examples should show design patterns and component families,
   not duplicate every file, variant, or class string. Source remains authoritative
   for exact inventory and implementation.
6. **A Marketing-Site Design System and a Component-Library DESIGN.md Are Different Documents**:
   A brand-analysis example (gradient tokens, hero/pricing/nav catalogs, photography geometry) describes a live marketing site's design.md instance. A pre-product component library has none of those surfaces yet — don't import that structure wholesale. Match the canonical sections to what the repo actually is.
7. **Stay Inside the Machine-Readable Schema**:
   Do not add unknown top-level YAML groups to solve a project-specific modeling gap.
   Use valid token names inside documented groups or explain unsupported relationships
   in prose/source-of-truth code. Re-check the current upstream spec before changing
   schema assumptions.
