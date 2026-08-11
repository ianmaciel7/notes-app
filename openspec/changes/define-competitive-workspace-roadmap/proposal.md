## Why

The original competitive workspace plan became too broad to implement, review, test, and archive as one change. It covered foundation, aesthetics, navigation, object modeling, editor behavior, collections, search, graph, AI, portability, offline sync, quality gates, and competitive audit evidence.

This change now serves only as the umbrella roadmap that records the split into focused feature changes.

## What Changes

- Reframe this change as the roadmap/index for the competitive workspace program.
- Move feature-level requirements into dedicated OpenSpec changes.
- Keep reference evidence separate from product requirements.
- Preserve the "Studio for the Mind" direction as its own visual-experience change.
- Define the recommended implementation order for all active workspace-related OpenSpec changes.

## Split Feature Changes

- `define-nextjs-server-architecture`
- `define-workspace-foundation`
- `define-workspace-visual-experience`
- `define-workspace-spaces`
- `define-workspace-navigation`
- `define-knowledge-object-model`
- `define-rich-object-editor`
- `define-collections-search-calendar`
- `define-relations-graph-discovery`
- `define-workspace-onboarding-education`
- `define-support-feedback-knowledge-base`
- `define-ai-assistant`
- `define-data-portability-offline-quality`
- `define-competitive-reference-audit`

## Recommended Implementation Order

### Phase 0: Architecture and evidence guardrails

1. `define-nextjs-server-architecture`
2. `define-competitive-reference-audit`

Rationale: establish the Next.js-native server architecture and evidence rules before implementing protected data, auth, APIs, or competitor-informed behavior.

### Phase 1: Shared UI foundation

3. `define-workspace-foundation`
4. `define-workspace-visual-experience`

Rationale: shared shadcn composition, action contracts, theme/responsive behavior, and "Studio for the Mind" visual language should exist before feature surfaces multiply.

### Phase 2: Core domain boundaries

5. `define-workspace-spaces`
6. `define-knowledge-object-model`

Rationale: spaces and object identity/type schemas are the data boundary for navigation, editor, collections, graph, AI, export, and sync.

### Phase 3: Primary workspace surfaces

7. `define-workspace-navigation`
8. `define-rich-object-editor`

Rationale: once the domain boundary exists, users need the shell, sidebar, tabs, panels, object page, metadata, and editor.

### Phase 4: Organization and discovery

9. `define-collections-search-calendar`
10. `define-relations-graph-discovery`

Rationale: collections/search/calendar depend on object/type/space data; graph/backlinks depend on stable objects, relations, and authorization-aware indexes.

### Phase 5: Learning and support layer

11. `define-workspace-onboarding-education`
12. `define-support-feedback-knowledge-base`

Rationale: onboarding and help are most useful after the core concepts and surfaces are stable enough to teach accurately.

### Phase 6: Intelligence and portability

13. `define-ai-assistant`
14. `define-data-portability-offline-quality`

Rationale: AI depends on authorization-aware object/search/relation context. Full export, API, offline sync, and observability should close the product loop after the core data model and workflows are stable.

## Non-Goals

- Implement runtime code in this umbrella change.
- Keep duplicate detailed requirements here after they have been moved into feature changes.
- Archive feature work through this umbrella change.

## Impact

- Future implementation should start from the focused feature changes above.
- Implementation planning should follow the recommended phase order unless a specific PR records why a narrower prerequisite can be safely skipped.
- This umbrella can be closed or archived once the team accepts the split and no longer needs it as an active planning index.
