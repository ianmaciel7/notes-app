## Why

The current baseline is still the default Next.js starter, while earlier branches mix valuable visual decisions with large, difficult-to-review workspace changes. The project needs one accepted minimalist design foundation before individual interface regions are designed or implemented.

## What Changes

- Establish `docs/DESIGN.md` as the canonical visual language for the product.
- Define content-first minimalism, semantic color roles, typography, spacing, shape, component, motion, responsive, and accessibility rules.
- Divide future UI work into small region-owned changes with an explicit review gate between them.
- Make the sidebar the first runtime UI region after this documentation-only foundation is confirmed.

## Capabilities

### New Capabilities

- `minimalist-ui-foundation`: Defines the shared visual language and gated delivery process for workspace UI changes.

### Modified Capabilities

None.

## Dependencies And Sequencing

- This documentation foundation has no dependency on `objectives` or `recurring-commitments`.
- Future sidebar, shell, navigation, object, context, and workflow UI changes depend on this foundation.
- Only the next confirmed region should receive a full OpenSpec change; later regions remain roadmap entries until then.

## Non-Goals

- Implement the sidebar, shell, navigation, editor, graph, or workflow surfaces.
- Select exact sidebar widths, panel ratios, or responsive breakpoints before their owning change is reviewed.
- Reproduce an external product pixel for pixel or import private/proprietary assets.
- Change product-domain behavior defined by `objectives` or `recurring-commitments`.

## Impact

- Adds the canonical `docs/DESIGN.md` guidance.
- Adds planning and acceptance requirements for future UI work.
- Does not change runtime source, dependencies, APIs, persistence, or deployed behavior.
