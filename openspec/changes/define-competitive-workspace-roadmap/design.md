## Context

This change originally contained the full competitive workspace requirements. The scope is now intentionally split so implementation can proceed in smaller, independently reviewable changes.

## Decisions

### Use this change as a roadmap only

The detailed requirements now live in focused feature changes. This umbrella records the decomposition and keeps the program structure visible.

### Use phased implementation order

The roadmap uses phases to preserve dependency order without blocking safe parallel review. Architecture and reference-evidence guardrails come first, followed by shared UI foundation, domain boundaries, primary workspace surfaces, organization/discovery, learning/support, and finally AI plus portability/offline quality.

The order is intentionally not alphabetical or last-modified order. It reflects dependency risk: protected server architecture and evidence classification should exist before data access; spaces and object identity should exist before editor/search/graph; AI and export should wait until authorization-aware context is stable.

### Preserve feature boundaries

Each feature change owns its proposal, design rationale, specs, and tasks. Cross-feature dependencies should be cited in those changes instead of duplicating full requirements here.

### Keep audit evidence separate

Competitive reference observations remain in `define-competitive-reference-audit`. Product requirements can cite confirmed evidence, but should not treat inferred or unknown reference behavior as confirmed.

## Risks / Trade-offs

- Too many changes can create coordination overhead, but the previous single-change structure was too large for disciplined implementation.
- Cross-feature dependencies must be managed explicitly when implementation begins.
- A strict linear sequence could slow independent planning, so the order is a default implementation order rather than a ban on parallel review or spec refinement.
