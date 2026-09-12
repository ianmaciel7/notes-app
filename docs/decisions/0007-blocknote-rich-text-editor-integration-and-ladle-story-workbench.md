# ADR-0007: BlockNote Rich-Text Editor Integration and Ladle Story Workbench

* **Status**: Accepted
* **Deciders**: Engineering & Product Team
* **Date**: 2026-09-12

## Context and Problem Statement

In `notes-app`, achieving feature parity with modern block-oriented knowledge management tools (specifically Capacities-like object and block interaction models, as synthesized from the historical reference codebase in `.worktrees/old-5`) requires a modular, rich-text block editor. Users require intuitive Notion/Capacities-style block manipulation, including headings, paragraphs, bullet and numbered lists, callouts, block drag-and-drop handles, inline formatting, slash command menus, floating formatting toolbars, and custom object embed blocks.

At the same time, the technical environment imposes explicit architectural constraints:
1. **React 19 & Next.js 16 Compatibility**: The editor must run smoothly inside the Next.js 16 App Router. Rich-text editors rely heavily on browser DOM APIs (`window`, `document`, DOM selection APIs, contentEditable), which fail during Server-Side Rendering (SSR). They require dynamic client-side loading with `ssr: false` or strict client component boundaries (`"use client"`).
2. **Design System & Styling Alignment**: The editor must seamlessly integrate with our shadcn/ui component library, Base UI primitives, and Tailwind CSS v4 design tokens (`@blocknote/shadcn`, `@source "../../node_modules/@blocknote/shadcn"`).
3. **Isolated Workbench & Visual Verification**: Under ADR-0005, all core UI components and documentation are verified in isolation using Ladle without the startup latency or routing constraints of the Next.js server. The editor must be renderable and testable in Ladle stories with mock states, slash menu interactions, and dark/light mode themes.

## Decision Drivers

* **Block-Based Hierarchy**: Native block schema (blocks as first-class JSON entities with IDs, types, content, and props) allowing modular block manipulation, drag-and-drop reordering, and bi-directional serialization compatible with space-scoped entity schemas.
* **ProseMirror Foundation & Reliability**: Powered by ProseMirror/TipTap under the hood, ensuring rock-solid collaborative text editing primitives, robust transaction undo/redo history, and cross-browser selection handling.
* **First-Class shadcn/ui & Tailwind v4 Theme Integration**: Support for `@blocknote/shadcn` providing pre-built, themeable slash menus, formatting toolbars, side menus, and suggestion items that conform directly to the application's CSS design tokens.
* **Isolated Story Workbench (Ladle)**: The ability to develop, stress test, and visually inspect editor states, custom block extensions, and slash commands inside Ladle stories without Next.js server overhead.
* **Clean SSR Isolation**: Predictable client component boundaries using dynamic imports (`next/dynamic` with `ssr: false`) and Next.js 16 / React 19 client lifecycle hooks.

## Considered Options

1. **BlockNote (`@blocknote/core`, `@blocknote/react`, `@blocknote/shadcn`) with Ladle Workbench**
2. **Custom TipTap / Slate / Plate Framework**
3. **Lexical (`@lexical/react`)**

## Decision Outcome

Chosen option: **BlockNote (`@blocknote/core`, `@blocknote/react`, `@blocknote/shadcn`) with Ladle Workbench**.

BlockNote provides an optimal balance between high-level block abstractions and low-level extensibility:
* It abstracts ProseMirror's complex transaction and schema APIs into an intuitive block tree model (`editor.document`, `editor.insertBlocks`, `editor.updateBlock`).
* The `@blocknote/shadcn` package cleanly aligns with our design system tokens and Tailwind CSS v4 configuration (`@source "../../node_modules/@blocknote/shadcn"` in `globals.css`).
* Next.js 16 SSR hazards are resolved cleanly by encapsulating the editor in a client component loaded via dynamic import (`dynamic(() => import('./blocknote-editor'), { ssr: false })`).
* Visual testing and interaction design are accelerated by creating dedicated Ladle stories to verify block manipulation, theme switching, and slash menu interactions independently.

### Positive Consequences

* **Accelerated Development**: Out-of-the-box slash commands (`/heading`, `/bullet`, `/code`, `/table`), floating formatting bars, drag handles, and block nesting eliminate hundreds of hours of custom editor development.
* **Design Consistency**: Standardizes the editor UI on shadcn primitives (menus, dialogs, tooltips, popovers) and Tailwind v4 theme variables in both light and dark modes.
* **Capacities-Like Parity**: Directly addresses the block editing requirements established in historical reference `.worktrees/old-5`, enabling custom blocks (e.g. object mentions, flashcard embeds, database queries) via BlockNote's custom schema API.
* **Zero-Friction Visual Testing**: Ladle stories allow rapid testing of editor variants, readonly states, initial document states, and theme changes with instant Vite HMR.
* **Clean Architectural Boundaries**: Pure client-side dynamic loading protects Next.js 16 Server Components from DOM-dependent ProseMirror/BlockNote crashes during SSR.

### Negative Consequences

* **Bundle Size**: BlockNote packages (`@blocknote/core`, `@blocknote/react`, `@blocknote/shadcn`) bring ProseMirror dependencies into client bundles; dynamic code-splitting is mandatory to avoid increasing initial page load size.
* **Abstraction Constraints**: Customizing core ProseMirror schema rules or lower-level DOM events requires working through BlockNote's plugin and block specification APIs rather than raw ProseMirror transforms.
* **SSR Incompatibility**: The editor cannot render full static HTML directly on the server without headless parser utilities; fallback skeleton or placeholder loaders must be provided during dynamic mounting.

## Pros and Cons of the Options

### BlockNote (`@blocknote/core`, `@blocknote/react`, `@blocknote/shadcn`) with Ladle Workbench

* Good, because it provides a native block model, slash menu, drag-and-drop handles, and block schema out of the box.
* Good, because `@blocknote/shadcn` seamlessly adopts our theme variables and Tailwind CSS v4 styles.
* Good, because it isolates cleanly into Ladle stories for rapid UI iteration without Next.js server overhead.
* Bad, because ProseMirror dependencies contribute significant bundle weight.
* Bad, because advanced custom block layouts must conform to BlockNote's custom block specification API.

### Custom TipTap / Slate / Plate Framework

* Good, because it provides lower-level control over every editor node, command, and schema definition.
* Bad, because building robust block-level Notion-style interactions (side drag handles, multi-block selection, hierarchical nesting, slash command menus) requires large amounts of complex bespoke code.
* Bad, because maintaining custom block selection and drag-drop logic creates a substantial maintenance burden.
* **Rejected because**: Building a block engine from scratch duplicates substantial engineering effort already solved by BlockNote and slows feature delivery for Capacities parity.

### Lexical (`@lexical/react`)

* Good, because it is maintained by Meta with high performance and strong typing.
* Bad, because Lexical is fundamentally a document tree editor rather than an opinionated block editor; turning it into a Capacities/Notion-like block editor requires custom node transforms, decorator blocks, and custom UI for slash commands and side handles.
* Bad, because historical prototyping in `.worktrees/old-5` showed high complexity when attempting to wire Lexical nodes into modular space-scoped entity cards and block menus.
* **Rejected because**: Lexical requires excessive boilerplate and custom plugin engineering to achieve block-based UI parity compared to BlockNote.
