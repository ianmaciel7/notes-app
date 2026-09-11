---
trigger: glob
globs:
  - "src/components/**/*.tsx"
  - "src/app/_components/**/*.tsx"
  - "src/app/**/_components/**/*.tsx"
description: >-
  Mandatory shadcn-first standards for all UI components and subcomponents:
  Base UI, base-nova, composition, data-slot, semantic theme tokens,
  accessibility, Lucide icons, state, stories, and tests.
---

# shadcn-first: All UI Components and Subcomponents

This rule applies to **every** new or modified UI component, primitive, block, reusable interface element, and meaningful subcomponent in scope. Follow first-party shadcn/ui conventions across the **entire component catalog**, including future additions and project-specific compositions. No component family is privileged or exempt.

Apply each mechanism where relevant; do not force identical anatomy, dependencies, variants, or state onto different components. Universal coverage does not authorize rewriting unrelated files.

## 1. Project Configuration and Source of Truth

Read project instructions, `components.json`, `package.json`, the lockfile, and affected local components before implementation.

Expected baseline: `base-nova`, `@base-ui/react`, `lucide-react`, `@/components/ui`, and `cn` from `@/lib/utils`. Verify configuration in `components.json` and versions in the lockfile. Report discrepancies; do not silently migrate the project.

For **each affected component and its meaningful parts**, read the local implementation, relevant consumers, stories, tests, and matching official documentation. Verify its actual primitive or HTML foundation, anatomy, props, refs, state, accessibility, styling, and required providers. Follow documentation compatible with the installed base and version; never generalize one component's API to the rest of the catalog.

Find each component in the full official catalog; there is no fixed allowlist. Load affected context only, without rereading the entire registry or claiming coverage of unread files.

Use official shadcn tooling when available. Resolve local/upstream/documentation differences; preserve compatibility without copying accessibility defects.

## 2. Component Selection and Composition

Before writing custom UI, follow this order:

1. Reuse an appropriate component already available under `@/components/ui`.
2. Inspect and add missing official components with `pnpm dlx shadcn@latest add <component>` from the package containing `components.json`.
3. Compose the appropriate existing primitives and named parts. Create a primitive only when available components cannot meet the requirement.

Review generated diffs and dependencies. Preserve customizations and pinned CLI versions. Do not reinstall everything or change base/style outside scope.

Prefer named parts and `children`/supported slots over monolithic APIs. Separate generic UI from business logic. Avoid wrappers that merely rename APIs or add unnecessary DOM.

Do not recreate existing design-system components with ad hoc HTML. Native semantic HTML remains appropriate for layout, document structure, and elements without a suitable component. Not every component needs Base UI.

Prefer configured CLI output or local code over raw registry authoring templates, which may require style, icon, and import transformations.

## 3. Component Implementation Contract

Derive props from the primitive, `React.ComponentProps`, or `React.ComponentPropsWithRef`. Add only wrapper-specific options. Use `VariantProps` with CVA and intentional `Pick`/`Omit` adaptations, not `any`, unsafe casts, or duplicated library types.

Preserve HTML/ARIA attributes, events, refs, form behavior, and controlled/uncontrolled APIs. Forward props to the responsible parts; do not leak visual props to the DOM or narrow supported function-valued props.

Prefer named functions/exports and lowercase kebab-case filenames. Respect framework naming/export requirements and existing formatting.

With React 19, forward refs correctly without introducing `forwardRef` mechanically. Preserve Next.js server/client boundaries; add `"use client"` only at required client entry points.

## 4. Base UI Composition and Prop Merging

Use `render` on primitives that support it, not Radix-style `asChild`. A custom rendered component must forward received props and ref to the correct DOM element, preserve behavior, and avoid nested interactive elements.

Use `useRender` when exposing a custom `render` API is necessary. Combine primitive and consumer props with `mergeProps` or a compatible utility, including inside render callbacks. Preserve handler order and documented cancellation; do not overwrite handlers with spreads.

`mergeProps` does not merge refs. Use `useRender` ref handling or the existing compatible ref-composition utility when both internal and external refs are needed.

Keep the documented root/trigger/content/item hierarchy. Delegate focus management, keyboard navigation, selection, and positioning to the underlying primitive rather than reimplementing them.

## 5. Theme Tokens, Class Names, and Variants

Use semantic theme classes such as `bg-background`, `text-foreground`, `border-border`, `text-muted-foreground`, and `ring-ring`. Use configured semantic tokens for interactive, destructive, sidebar, and chart colors. Do not hardcode hex/RGB/HSL color values or bypass the theme with palette classes such as `bg-blue-500` or arbitrary color literals.

Do not change `globals.css`, theme variables, typography, or style to fix a local component. Keep theme values in the existing token system; theme changes require explicit task scope.

Merge classes with `import { cn } from "@/lib/utils"`, respecting the configured alias. Do not duplicate `cn` or add a utility dependency just because upstream authoring code uses one.

Keep `className` as an extension point. Use CVA for reusable variants and combinations; typed props and data attributes suffice for simple cases. Do not require CVA everywhere or create variants for isolated adjustments.

Promote repeated overrides into defaults or variants. Preserve the class-merge contract. Check which element receives `className`, `style`, and `ref`; it may be an inner element or wrapper.

Prefer CSS, responsive/container queries, and primitive variables to styling-only React state. Use inline styles/CSS variables for dynamic layout. Avoid arbitrary values when tokens suffice and `!important` as a specificity workaround.

## 6. Stable Slots and State Attributes

Preserve existing `data-slot` names. New reusable components owning a DOM root must add stable kebab-case slots to that root and meaningful parts, e.g. `data-slot="settings-panel-header"`.

Do not add wrappers solely for attributes, pass DOM attributes to unsupported providers/non-DOM roots, or replace slots in ways that break primitive selectors.

Preserve the actual state attributes supplied by the installed primitive, such as `data-open`, `data-checked`, or `data-disabled` where applicable. Do not assume Radix `data-state` conventions. Use `data-size`, `data-variant`, or `data-orientation` when they express a real styling contract; avoid redundant React state that mirrors these attributes.

## 7. Icons, Semantics, and Accessibility

Import icons explicitly from `lucide-react`, matching configuration and existing size, stroke, and color conventions. Do not mix libraries, import the entire namespace for static icons, or redraw existing icons as custom SVG. Preserve `data-icon` spacing attributes where used.

Hide decorative icons from assistive technology. Name icon-only controls accessibly on the control itself, not only through a tooltip. Use existing internationalization for visible and accessible text.

Preserve the correct semantics of every control and structure. Use buttons for actions and links for navigation; share styling without inheriting unrelated interaction semantics. Set action/submit types intentionally and avoid nested interactive elements.

Preserve keyboard support, visible focus, ARIA, disabled states, labels, descriptions, and error associations. Keep configured focus styles, including `outline-ring/50` where used; color alone is not a focus indicator. Never remove outlines without an accessible replacement.

Preserve required titles, labels, hidden inputs, and valid HTML. Error, loading, selection, and disabled states must not rely on color alone.

## 8. Overlays, Positioning, and Motion

Preserve the portal, positioner, popup, backdrop, and parts required by each component. Do not impose one tree on tooltips, popovers, dialogs, sheets, and drawers; consult the correct implementation.

Forward `side`, `align`, and offsets to the responsible part. Reuse anchor dimensions, available-space variables, and transform origins. Do not fix incorrect layering with manual positioning or arbitrary `z-index` increases.

Validate opening, dismissal, Escape, outside interaction, focus restoration, scrolling, clipping, and nested overlays according to the component contract. Tooltip content must remain non-interactive; choose an appropriate composition for actionable content. Respect reduced-motion preferences in custom animations.

## 9. State, Providers, and Resizable Layouts

Keep state local unless composition requires sharing. Use context for related parts, not mandatory global wrappers. Preserve required provider boundaries and stable instances; never hide missing-provider errors with artificial fallbacks.

Maintain one source of truth per state. Preserve `value`/`defaultValue`, `open`/`defaultOpen`, and callbacks where supported. Do not duplicate primitive state or indiscriminately synchronize props into local state through effects.

Separate sidebar visibility, panel width, and mobile behavior. Collapsing is not drag resizing. Independent panels need independent state, even within one layout provider. Use the existing resizable-panel solution.

Clean up listeners, timers, subscriptions, and effects. Isolate persistence and make shared managers replaceable/resettable for independent instances, stories, and tests. Avoid hydration mismatches from browser-only state.

## 10. Stories and Tests

Use production components and application CSS, tokens, fonts, and visual providers in stories. Isolate simple APIs; use composed stories with required real providers for integrated behavior. Mock external services/data, not the primitive interaction under test.

Reset scenario state, accounting for cookies, storage, shortcuts, portals, and notification managers. Never change production behavior to hide sandbox errors.

Test relevant variants, sizes, disabled/error/loading states, keyboard, focus, responsive layouts, and supported themes/RTL. Prefer semantic behavior tests; snapshots do not replace interaction tests.

## 11. Verification and Completion

Verify **every affected component and meaningful part**, not a single representative example. Run relevant lint, type-check, and tests; check visual/interactive changes in a browser when available. Review consumers and preserve unrelated work.

Report changes, completed checks, and limitations. Never claim passing tests, visual parity, accessibility compliance, or compatibility without evidence.

**Core principle:** consistent contracts, composition, and visual language for all components, without unnecessary primitives, CVA, providers, or wrappers.

## Official References — Consult on Demand

Configuration: https://ui.shadcn.com/docs/components-json
CLI: https://ui.shadcn.com/docs/cli
All components: https://ui.shadcn.com/docs/components
Theming: https://ui.shadcn.com/docs/theming
Composition: https://base-ui.com/react/handbook/composition
Rendering and refs: https://base-ui.com/react/utils/use-render
Prop merging: https://base-ui.com/react/utils/merge-props
State styling: https://base-ui.com/react/handbook/styling
Lucide: https://lucide.dev/guide/react
Client boundaries: https://nextjs.org/docs/app/api-reference/directives/use-client
Story providers: https://ladle.dev/docs/providers/
