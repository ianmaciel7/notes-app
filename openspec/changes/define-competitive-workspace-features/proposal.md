## Why

The original competitive workspace plan became too broad to implement, review, test, and archive as one change. It covered foundation, aesthetics, navigation, object modeling, editor behavior, collections, search, graph, AI, portability, offline sync, quality gates, and competitive audit evidence.

This change now serves only as the umbrella roadmap that records the split into focused feature changes.

## What Changes

- Reframe this change as the roadmap/index for the competitive workspace program.
- Move feature-level requirements into dedicated OpenSpec changes.
- Keep reference evidence separate from product requirements.
- Preserve the "Studio for the Mind" direction as its own visual-experience change.

## Split Feature Changes

- `define-workspace-foundation`
- `define-workspace-visual-experience`
- `define-workspace-navigation`
- `define-knowledge-object-model`
- `define-rich-object-editor`
- `define-collections-search-calendar`
- `define-relations-graph-discovery`
- `define-ai-assistant`
- `define-portability-offline-quality`
- `define-competitive-reference-audit`

## Non-Goals

- Implement runtime code in this umbrella change.
- Keep duplicate detailed requirements here after they have been moved into feature changes.
- Archive feature work through this umbrella change.

## Impact

- Future implementation should start from the focused feature changes above.
- This umbrella can be closed or archived once the team accepts the split and no longer needs it as an active planning index.
