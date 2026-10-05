# ADR 0003: Install shadcn/typeset Markdown Typography System

## Status

Accepted

## Date

2026-10-05

## Context

The notes application centers on reading, authoring, and rendering structured Markdown content, code snippets, mathematical notation, and rich documentation. Delivering an exceptional reader experience requires a cohesive typography system with carefully proportioned vertical rhythm, typographic hierarchy, responsive scale, and dark mode adaptation.

Traditional approaches in the Tailwind ecosystem rely on `@tailwindcss/typography` (the `prose` plugin). While effective, in Tailwind CSS v4 and modern CSS architectures, relying on a JavaScript-based PostCSS plugin introduces friction, less transparent theme variable inheritance, and rigid styling hooks.

[shadcn/typeset](https://ui.shadcn.com/docs/typeset) offers an elegant, pure-CSS typography system architected specifically for modern web applications. Key requirements for adopting it in the project include:

1. **Native Tailwind CSS v4 Compatibility**: Works seamlessly with `@import "tailwindcss";` and `@theme inline` tokens without legacy plugin overhead.
2. **Design Token Alignment**: Automatically inherits application color tokens (`--background`, `--foreground`, `--color-muted-foreground`, `--color-border`, `--color-ring`, `--radius`) across light and dark modes.
3. **Local Vendor Control**: Direct repository hosting to permit granular customization and prevent third-party runtime package churn.
4. **Isomorphic Font Variable Integration**: Flawless binding with Next.js App Router font optimization (`next/font/google`).
5. **Component Isolation & Opt-out**: Ability to easily opt out nested interactive widgets via `.not-typeset` or `[data-not-typeset]` attributes without breaking surrounding prose rhythm.

## Decision

The `shadcn/typeset` typography system was installed and integrated into the application via the following architectural steps:

1. **Local Style Hosting**:
   The full `shadcn/typeset` stylesheet was downloaded and hosted directly at `src/app/typeset.css`. Placing it under `@layer components` ensures it participates cleanly in the CSS cascade, allowing utility classes and custom overrides to take precedence when needed.

2. **Integration into Global Styles**:
   Imported `src/app/typeset.css` in `src/app/globals.css` immediately following Tailwind CSS:
   ```css
   @import "tailwindcss";
   @import "./typeset.css";
   ```

3. **Preset Configuration (`.typeset-docs`)**:
   Established a dedicated typography preset class (`.typeset-docs`) in `src/app/globals.css` to map font stacks and rhythm metrics to application design tokens:
   ```css
   .typeset-docs {
     --typeset-font-body: var(--font-geist);
     --typeset-font-heading: var(--font-geist);
     --typeset-font-mono: var(--font-geist-mono);
     --typeset-size: 15px;
     --typeset-leading: 1.75;
     --typeset-flow: 1.25em;
   }
   ```

4. **Root Layout Font Harmonization**:
   Updated `src/app/layout.tsx` to define and inject `--font-geist` and `--font-geist-mono` variables through the `Geist` and `Geist_Mono` Google font loaders, establishing consistent font variable names across `layout.tsx`, `globals.css`, and `typeset.css`.

5. **Scoped Application & Opt-out Model**:
   Typography styling is strictly scoped to containers decorated with `.typeset` (or `.typeset-docs`). Embedded components that should not inherit Markdown typographic styling (e.g. interactive note controls, callout action buttons, embedded widgets) can use `.not-typeset` or `[data-not-typeset]`.

## Consequences

### Positive Outcomes

- **Zero Bundle Runtime Overhead**: Pure CSS implementation with no client-side JavaScript execution cost.
- **Seamless Tailwind v4 Integration**: Avoids external Tailwind plugins and functions purely through standard CSS variables and cascade layers.
- **Theme & Dark Mode Synchronization**: Automatically harmonizes with existing OKLCH color palettes and dark mode variants without duplicate rule sets.
- **Fine-Grained Rhythm Control**: Custom properties (`--typeset-size`, `--typeset-leading`, `--typeset-flow`) make it straightforward to create tailored reading presets (e.g., documentation view, compact editor view, preview mode).
- **Safe Widget Nesting**: Native support for `.not-typeset` prevents styling pollution within rich interactive components embedded inside notes.

### Trade-offs and Considerations

- **Vendor Maintenance**: Because `src/app/typeset.css` is maintained in-tree rather than as an npm package, updates from upstream shadcn must be merged manually if new capabilities are introduced.
- **Explicit Scoping Required**: Unstyled prose will not automatically format unless wrapped in a `.typeset` container. This is an intentional architectural boundary to protect non-prose UI components from unexpected inherited styles.
- **Font Variable Synchronization**: Any future alterations to font variable definitions in `src/app/layout.tsx` must remain synchronized with `--font-geist` and `--font-geist-mono` in `src/app/globals.css`.
