## Why

The app has shadcn source components and a CI foundation, but the durable product requirements for a competitive object-centric notes workspace are not yet captured in the current OpenSpec source of truth. Older planning work on `old/plan-shadcn-workspace-redesign` contained useful feature requirements, but it mixed reference-app parity, implementation phases, and superseded shadcn/page-graph proposals.

This change brings forward only the product-relevant OpenSpec requirements and reorganizes them into clearer feature capabilities.

## What Changes

- Define a competitor-informed workspace product baseline without copying a specific competitor's branding, proprietary behavior, source code, private APIs, or undisclosed algorithms.
- Split the broad prior workspace plan into capability-scoped specs that can be implemented, tested, synced, and archived independently.
- Preserve shadcn-first composition as a product requirement for common controls, overlays, forms, navigation, and data display.
- Define the major feature areas required for a mature notes workspace: studio-for-the-mind aesthetics, object model, editor, presentation, collections, search, in-page find, calendar, relations, backlinks, semantic discovery, graph, motion, hover/depth effects, AI, settings, import/export, sharing, offline sync, accessibility, and resilience.
- Keep reference-app audit evidence as its own capability so confirmed behavior, inferred behavior, unknowns, and blocked flows do not get mixed with product requirements.

## Capabilities

### New Capabilities

- `workspace-foundation`: shadcn composition, feature-owned styling boundaries, action contracts, theme support, responsive layout, and canonical design documentation.
- `workspace-visual-experience`: Studio-for-the-mind visual positioning, semantic-object appearance, product color tokens, interaction states, motion, hover affordances, depth/transparency effects, and pointer/keyboard parity.
- `workspace-navigation`: Space selector, object-centric sidebar, tabs, contextual panels, history, focus mode, and responsive navigation.
- `knowledge-object-model`: Typed objects, custom object types, properties, relationships, authorization, revisions, and safe creation.
- `rich-object-editor`: Persisted block editor, metadata editing, keyboard behavior, outline, presentation mode, autosave, and recovery states.
- `collections-and-views`: Object-type pages, saved List, Wall, Kanban, Gallery, Table, and Embed views with filtering, sorting, grouping, and contextual creation.
- `search-and-calendar`: Command palette, in-page find, extended search, date navigation, calendar views, daily notes, and date-based collections.
- `relations-and-graph`: Typed relations, backlinks and incoming-link panels, internal objects, semantic related content, graph panels, and deterministic graph interaction.
- `ai-assistant`: Provider-neutral AI panel, object mentions, retrieval boundaries, streaming, citations, and explicit confirmation for persistent actions.
- `settings-and-portability`: Account/workspace settings, preferences, import, export, sharing, integrations, and API boundaries.
- `offline-sync-and-quality`: Local cache, mutation queue, synchronization, conflicts, accessibility gates, resilience, and tenant-safe observability.
- `competitive-reference-audit`: Safe reference-app audit process, evidence retention, interaction inventory, lifecycle checks, and confidence classification.

### Modified Capabilities

None.

## Non-Goals

- Reintroduce the superseded `transform-workspace-shadcn` or `add-page-graph-workspace` changes as active sources of truth.
- Create a parallel planning or research system outside `openspec/`.
- Claim exact parity for behaviors that have not been confirmed through safe evidence.
- Add dependencies, persistence providers, AI providers, billing flows, cloud credentials, or deployment changes in this spec-only change.
- Implement the entire workspace in one pull request.

## Impact

- Adds an active OpenSpec change that future feature implementation can use as the durable planning source.
- No runtime code changes are expected from this change.
- Later implementation changes should either update these delta specs or sync accepted requirements into `openspec/specs/` before archiving, whenever possible.
