## Context

This change originally contained the full competitive workspace requirements. The scope is now intentionally split so implementation can proceed in smaller, independently reviewable changes.

## Decisions

### Use this change as a roadmap only

The detailed requirements now live in focused feature changes. This umbrella records the decomposition and keeps the program structure visible.

### Preserve feature boundaries

Each feature change owns its proposal, design rationale, specs, and tasks. Cross-feature dependencies should be cited in those changes instead of duplicating full requirements here.

### Keep audit evidence separate

Competitive reference observations remain in `define-competitive-reference-audit`. Product requirements can cite confirmed evidence, but should not treat inferred or unknown reference behavior as confirmed.

## Risks / Trade-offs

- Too many changes can create coordination overhead, but the previous single-change structure was too large for disciplined implementation.
- Cross-feature dependencies must be managed explicitly when implementation begins.
