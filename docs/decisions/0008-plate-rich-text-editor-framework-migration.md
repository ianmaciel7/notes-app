# ADR-0008: Plate Rich-Text Editor Framework Migration

* **Status**: Accepted
* **Deciders**: Engineering & Product Team
* **Date**: 2026-09-12

## Context and Problem Statement

In [ADR-0007](0007-blocknote-rich-text-editor-integration-and-ladle-story-workbench.md), BlockNote was initially adopted to provide block-based rich-text editing with slash commands, formatting toolbars, and ProseMirror-based document modeling. However, as the application architecture evolved toward deep integration with Next.js 16 (App Router), React 19 Server Components, Base UI primitives, and the shadcn/ui registry model, several architectural friction points and constraints emerged with BlockNote:

1. **Closed Component Boundaries vs. Copyable Source Registry**: BlockNote encapsulates its UI elements inside pre-compiled packages (`@blocknote/shadcn`, `@blocknote/react`). Customizing interaction behaviors, DOM nodes, keyboard shortcuts, or styling requires overriding internal hooks or theme CSS variables rather than owning and tailoring the component source code. In contrast, our UI architecture is built around shadcn/ui's philosophy of copyable, locally-owned UI primitives.
2. **Next.js 16 Static SSR & Headless Server Rendering**: BlockNote relies heavily on browser DOM environments (`window`, `document`, DOM selection APIs), preventing static document rendering on the server without dynamic client imports (`ssr: false`) and placeholder skeletons. For read-only document rendering, fast initial page loads, and SEO/preview performance, an editor architecture capable of headless static rendering (`platejs/static` via `EditorStatic`) on the server without DOM emulation is required.
3. **Design System & Base UI Primitive Alignment**: Our design system is transitioning to Base UI primitives (`@base-ui/react`) and Tailwind CSS v4 design tokens managed through `components.json`. Integrating external editor widgets that dictate their own internal markup creates maintenance overhead and styling discrepancies across dark and light modes.
4. **React 19 Compatibility**: BlockNote's ProseMirror wrapper dependencies required complex client mounting lifecycles to avoid hydration mismatches and ref timing errors under React 19 concurrent features.

To resolve these challenges and establish a long-term editor foundation, we decided to migrate from BlockNote to **Plate** (`platejs` v53, `@platejs/basic-nodes`, Slate) combined with Plate UI source components sourced from the `@plate` registry (`https://platejs.org/r/{name}.json`) configured in `components.json`, synchronized via the `sync-plate-ui` skill.

## Decision Drivers

* **Native shadcn/ui & Base UI Alignment**: Complete visual and architectural parity with our existing design system tokens and Base UI primitives, eliminating foreign markup and third-party theme wrappers.
* **Copyable Source Component Registry (`@plate`)**: Adopting the shadcn pattern for editor components, where UI elements (toolbars, menus, dialogs, block handles) live directly in `src/components/ui/` as copyable, auditable, and fully customizable source files rather than opaque npm dependencies.
* **Headless Static SSR Capabilities in Next.js 16**: The ability to render static document states on the server using `platejs/static` (`EditorStatic`), streaming pre-rendered HTML to the client and hydrating interactively without layout shift or SSR crashes.
* **Full React 19 Compatibility**: First-class support for React 19 concurrency, modern refs, and seamless integration with Server and Client Component boundaries.
* **Slate Foundation & Granular Plugin Architecture**: A clean, data-first document model (JSON trees with typed nodes and marks) with an unopinionated plugin architecture (`BasicBlocksPlugin`, `BasicMarksPlugin`, custom object embed plugins) tailored for Capacities-style modular object structures.
* **Isolated Ladle Workbench Testing**: Rapid visual verification, state modeling, and interaction testing in Ladle (`src/components/editor/editor.stories.tsx`) without Next.js server overhead.

## Considered Options

1. **Plate (`platejs` v53 / `@plate` registry with `sync-plate-ui`)** [Selected]
2. **BlockNote (`@blocknote/core`, `@blocknote/react`, `@blocknote/shadcn`)** [Superseded]
3. **Lexical (`@lexical/react`)**

## Decision Outcome

Chosen option: **Plate (`platejs` v53 / `@plate` registry with `sync-plate-ui`)**.

Plate addresses all core limitations of BlockNote while retaining rich-text block editing, extensible plugins, and intuitive editing ergonomics:

* **Source Code Ownership**: Configured the `@plate` registry in `components.json` (`"registries": { "@plate": "https://platejs.org/r/{name}.json" }`). Editor primitives (`Editor`, `EditorContainer`, `EditorStatic`, and future plugins) are installed directly into `src/components/ui/`, giving full control over markup, accessibility, and styling.
* **Static SSR via `platejs/static`**: With `EditorStatic`, notes and documents can be rendered server-side as pure HTML without requiring a browser window or dynamic client boundary fallbacks, improving Time to First Contentful Paint (FCP) and reader experiences.
* **Slate-Powered State & Extensibility**: Plate v53 offers a modular plugin pipeline (`usePlateEditor`, `Plate`, `PlateContainer`, `PlateContent`) that operates on plain JSON Slate trees. Custom Capacities-style blocks (object references, inline math, callouts, flashcards) are straightforward to implement as custom Plate plugins.
* **Maintenance Automation**: The `sync-plate-ui` skill ensures automated synchronization of Plate UI components from upstream registries while preserving local customizations.
* **Ladle Story Integration**: The editor is demonstrated and verified in `src/components/editor/editor.stories.tsx`, validating block editing, inline marks, and theme switching in an isolated Vite workbench.

### Positive Consequences

* **Unified UI Stack**: Editor components use the exact same Tailwind CSS v4 variables, Base UI primitives, and `cn()` utility conventions as the rest of the application.
* **Zero Hydration Mismatches**: Clear separation between `EditorStatic` for Server Component rendering and `Editor` for interactive client editing.
* **Modular Custom Plugins**: Custom object chips, tag embeds, and bidirectional link blocks can be added as isolated Plate plugins without fighting an opinionated block container.
* **Reduced Dependency Friction**: Eliminates ProseMirror wrapper constraints and aligns directly with React 19.
* **Continuous Registry Updates**: The `@plate` registry enables incremental installation of specialized features (tables, mentions, slash commands, media) on demand.

### Negative Consequences

* **Migration Effort**: Existing note content stored in BlockNote's document JSON format requires serialization mapping to Plate/Slate value trees (`Array<{ type: string, children: Array<{ text: string }> }>`).
* **Source Maintenance**: Owning component source code in `src/components/ui/` means upstream bug fixes or enhancements must be pulled and reviewed using `sync-plate-ui`.
* **Learning Curve**: Slate's transformation and selection APIs require developers to understand Slate path and point primitives when building complex block mutations.

## Pros and Cons of the Options

### Plate (`platejs` v53 / `@plate` registry with `sync-plate-ui`)

* Good, because it delivers the shadcn component model for rich-text editing, placing component source code in `src/components/ui/`.
* Good, because it provides `platejs/static` for server-side HTML rendering in Next.js 16 without DOM mocks.
* Good, because it natively supports React 19 and aligns with Base UI primitives.
* Good, because the `@plate` registry in `components.json` allows easy scaffolding and automated updates via `sync-plate-ui`.
* Good, because it runs cleanly in isolated Ladle stories (`src/components/editor/editor.stories.tsx`).
* Bad, because managing source components increases repository line count and requires disciplined registry synchronization.
* Bad, because Slate transforms require familiarity with Slate cursor and node operations.

### BlockNote (`@blocknote/core`, `@blocknote/react`, `@blocknote/shadcn`)

* Good, because it provided out-of-the-box Notion-style slash commands and drag handles.
* Bad, because UI components are bundled npm packages rather than copyable source, limiting customization to CSS variables.
* Bad, because it lacks a headless static SSR rendering package, forcing all editor instances to load dynamically on the client (`ssr: false`).
* Bad, because ProseMirror integration introduced hydration friction and lifecycle timing constraints under React 19.
* **Rejected / Superseded because**: It conflicted with our architectural mandate for copyable shadcn/Base UI components, server-side static rendering in Next.js 16, and full source code ownership.

### Lexical (`@lexical/react`)

* Good, because it is actively maintained by Meta with high performance and strong typing.
* Bad, because it lacks an official shadcn-aligned component registry, requiring all toolbar, menu, and dialog primitives to be built from scratch.
* Bad, because building block-based interfaces with slash menus, side handles, and static SSR requires substantial custom plugin boilerplate compared to Plate.
* **Rejected because**: Plate offers superior out-of-the-box shadcn/ui integration, a dedicated `@plate` registry, and first-class static SSR capabilities for Next.js 16.
