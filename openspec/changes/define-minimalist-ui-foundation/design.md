## Context

The active branch contains a default Next.js starter rather than an accepted product workspace. The `old` branch demonstrates a detailed Capacities-inspired shell, while `mvp` demonstrates a more functional object-and-study workflow. Neither should be imported wholesale: the old visual change is too broad for incremental review, and the MVP surface should not define the product as a dashboard or study-only application.

The user wants to review and confirm small visual stages in this order: design foundation, sidebar, remaining shell layout, then progressively smaller component groups.

## Goals / Non-Goals

**Goals:**

- Create a durable minimalist visual language before runtime UI work.
- Preserve the object-centric product identity while reducing visual noise.
- Define stable token roles and component rules without prematurely fixing region geometry.
- Make each future visual change small enough for browser review and explicit confirmation.

**Non-Goals:**

- Implement or restyle runtime components in this change.
- Carry the old branch's full visual checklist into one new change.
- Define exact geometry for regions that have not reached their review stage.
- Combine domain changes and visual changes into one delivery unit.

## Decisions

### Documentation precedes component implementation

`docs/DESIGN.md` is accepted first so future component changes share the same vocabulary. Alternative: design the sidebar immediately and infer a system from it. Rejected because it would make the first component an accidental design system.

### Minimalism is content-first, not feature removal

The interface keeps object type, properties, relations, context, and state visible when useful, but removes decorative competition. Alternative: maximize empty space and hide most controls. Rejected because repeated knowledge work needs density and discoverability.

### Tokens express semantic roles

Components consume shared roles such as background, surface, border, primary, danger, and relation. Alternative: choose colors per component. Rejected because it creates drift and makes dark mode and accessibility harder to verify.

### One visible region per change

The sidebar, shell, top rail, object surfaces, context, and workflows are separate checkpoints. Alternative: rebuild the full workspace shell in one change. Rejected because visual feedback would arrive after too many coupled decisions.

### Existing primitives remain the default

Future UI uses Tailwind utilities, semantic tokens, shadcn primitives, and Lucide icons. Alternative: custom primitives for each surface. Rejected because it duplicates interaction and accessibility contracts.

### Evidence gates advancement

Strict specs, focused tests, browser screenshots, keyboard review, and user confirmation complete a stage. Artifact completion alone does not advance the roadmap.

## Risks / Trade-offs

- **The foundation becomes too abstract** -> Keep every rule observable and test it in the next sidebar change.
- **Future stages silently revise accepted rules** -> Update `docs/DESIGN.md` explicitly in the change that needs the revision.
- **Small changes create integration churn** -> Keep stable component boundaries and validate the assembled shell after each region.
- **External inspiration becomes imitation** -> Preserve product-specific object workflows and use references only for observable patterns.

## Migration Plan

1. Accept the foundation and canonical design document.
2. Create and review `implement-workspace-sidebar` only after user confirmation.
3. Continue through the recorded region sequence, creating one change at a time.
4. Keep the starter runtime untouched until the first implementation change.

Rollback is documentation-only: revert this change without migrating runtime data or code.

## Open Questions

- Which sidebar geometry and collapse behavior should be accepted in the next stage?
- Which object types and pinned items should be used as the sidebar review fixture?
- Should dark mode be implemented with the sidebar or after the complete shell exists?
