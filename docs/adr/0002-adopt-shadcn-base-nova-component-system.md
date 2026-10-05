# ADR 0002: Adopt shadcn Base Nova UI Component System with Pointer Cursors

## Status

Accepted

## Date

2026-10-05

## Context

The notes application requires an accessible, cohesive, and comprehensive UI component foundation to support rich user interactions. Key capabilities include:

1. **Comprehensive Interactive Primitives**: Standardized components for dialogs, modals, popovers, dropdown menus, context menus, tooltips, and sheet drawers.
2. **Form Architecture & Controls**: Form validation, text inputs, textareas, checkboxes, radio groups, switches, selects, comboboxes, and date/calendar pickers.
3. **Application Shell & Navigation**: Sidebars, breadcrumbs, command palettes (`cmdk`), tabs, navigation menus, and resizable layout panels (`react-resizable-panels`).
4. **Data Display & Visualizations**: Charts (`recharts`), data tables, carousels (`embla-carousel-react`), avatars, badges, accordions, and typography helpers.
5. **Accessibility & React 19 Compatibility**: Strict adherence to WAI-ARIA authoring practices, keyboard navigation, screen reader affordances, and zero friction with React 19 and React Compiler concurrency models.

Rather than installing monolithic UI component libraries that add heavy runtime overhead or lock the application into rigid abstractions, the project selected the [shadcn UI](https://ui.shadcn.com/) architecture with the `base-nova` style and `@base-ui/react` primitives. Additionally, the team requires consistent pointer cursor behavior across all clickable interactive controls and buttons.

## Decision

The project adopted the full shadcn UI component library utilizing the `base-nova` design system, configured via `components.json` and hosted directly in-tree at `src/components/ui/`.

Key architectural facets of this adoption include:

1. **Registry & Configuration Architecture (`components.json`)**:
   - Initialized `components.json` targeting the `base-nova` style, React Server Components (`rsc: true`), and TypeScript (`tsx: true`).
   - Configured module aliases (`@/components`, `@/components/ui`, `@/lib/utils`, `@/hooks`).
   - Standardized on `lucide-react` as the primary vector iconography library.
   - Wired Tailwind CSS v4 integration with CSS variable token mapping (`cssVariables: true`, `css: "src/app/globals.css"`).

2. **In-Tree Primitives Installation (`src/components/ui/`)**:
   - Vendorized all 61 standard UI primitives into `src/components/ui/` (e.g., `accordion`, `alert-dialog`, `avatar`, `badge`, `button`, `calendar`, `card`, `carousel`, `chart`, `checkbox`, `collapsible`, `command`, `context-menu`, `dialog`, `dropdown-menu`, `form`, `hover-card`, `input`, `input-otp`, `menubar`, `navigation-menu`, `popover`, `resizable`, `scroll-area`, `select`, `separator`, `sheet`, `sidebar`, `skeleton`, `slider`, `sonner`, `switch`, `table`, `tabs`, `textarea`, `tooltip`, etc.).
   - Relies on headless `@base-ui/react` primitives alongside focused community packages (`cmdk`, `recharts`, `react-day-picker`, `embla-carousel-react`, `react-resizable-panels`, `input-otp`).
   - Shared utility classes and class variance authority (`class-variance-authority`, `clsx`, `tailwind-merge` encapsulated in `src/lib/utils.ts`).

3. **Design Tokens & OKLCH Theme Integration (`src/app/globals.css`)**:
   - Embedded full OKLCH color palettes across light and dark modes covering semantic layers: `--background`, `--foreground`, `--primary`, `--secondary`, `--muted`, `--accent`, `--destructive`, `--border`, `--input`, `--ring`, and dedicated tokens for `--chart-1` through `--chart-5` and `--sidebar`.
   - Mapped semantic tokens into Tailwind v4 inline theme directives (`@theme inline`) alongside `@import "shadcn/tailwind.css"` and `@import "tw-animate-css"`.

4. **Global Pointer Cursor Enforcement**:
   - Established repository-wide standard enforcing `cursor: pointer` on all interactive buttons and ARIA button roles when not disabled:
     ```css
     button:not(:disabled),
     [role="button"]:not(:disabled) {
       cursor: pointer;
     }
     ```
   - Codified this standard in `src/app/globals.css` base layer and explicitly documented governance in `CODING_STANDARDS.md` (§ 5.1).

5. **Toolchain & Biome Harmonization (`biome.json`)**:
   - To maintain stability and prevent churn against upstream shadcn CLI generation, `src/components/ui` was excluded from Biome formatting and linting in `biome.json` (`!src/components/ui`).
   - All application features consuming UI primitives (`src/app/`, `src/features/`, etc.) remain fully subject to strict Biome linting and React 19 Compiler static verification.

## Consequences

### Positive Outcomes

- **In-Tree Ownership & Infinite Flexibility**: Component code lives directly within the repository (`src/components/ui/`). The team possesses full source control to modify markup, accessibility attributes, animations, and Tailwind classes without waiting for third-party library releases.
- **Tailwind CSS v4 & OKLCH Cohesion**: First-class support for CSS variables and modern OKLCH color gamuts ensures high dynamic range color fidelity and effortless dark mode transitions.
- **Robust Accessibility (a11y)**: Primitives built on `@base-ui/react` provide built-in focus management, ARIA roles, portal mounting, and keyboard interaction patterns conforming to WCAG standards.
- **React 19 & Next.js App Router Native**: Primitives operate cleanly across Server Components and Client Component leaves without hydration mismatches or legacy runtime styling bottlenecks.
- **Intuitive User Affordance**: Consistent pointer cursor rules ensure clear interactive feedback across all desktop viewports and platforms.

### Trade-offs and Considerations

- **In-Tree Maintenance Overhead**: Because primitives reside in `src/components/ui/`, updates, bug fixes, and security patches from upstream shadcn registries do not arrive via automatic package version bumps. Future synchronization must be evaluated intentionally.
- **Linter Boundary Isolation**: Excluding `src/components/ui` from Biome avoids cosmetic lint conflicts with upstream generator templates, but requires developers to maintain hygiene manually when directly editing files in that directory.
- **Bundle Footprint Vigilance**: While in-tree components enable tree-shaking, importing complex components (such as `chart` with `recharts` or `calendar` with `date-fns`) in client bundles must be done judiciously to preserve fast initial page loads.
