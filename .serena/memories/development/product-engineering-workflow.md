# Product-to-Engineering Workflow Invariants

## Core Invariant
No feature implementation or ticket generation may begin without explicit grounding in:
1. **Product Intent (`INTENT.md`)**:
   - Must align with active Goals (`G-1` through `G-9`).
   - Must strictly avoid Non-Goals (`NG-1` through `NG-7`).
   - Must verify mapping to success criteria `P1` through `P8` in §8.
2. **Phase Roadmap (`docs/product-specs/knowledge-learning-workspace.md`)**:
   - Features must match the current development phase (Phases 0 through 6).
   - MVP scope is strictly limited to Phases 0 through 2.
3. **Domain Vocabulary & Invariants (`CONTEXT.md`)**:
   - All entities, relations, and naming must follow canonical glossary entries. Avoid prohibited terms.
   - Core decisions (`D-1` Space isolation, `D-2` Highlight as first-class object, `D-3` Concept replaces tag) are binding.

## AI Engineering Execution Flow (Matt Pocock Lifecycle)
When building features, agents must operate through the 4 distinct stages documented in `docs/guide/matt-pocock-workflow.md` and `docs/guide/product-engineering-lifecycle-flow.md`:
- **Stage 1 (Grilling)**: `/grill-me` against product intent and invariants to surface edge cases and define testing seams.
- **Stage 2 (Spec & Slicing)**: `/to-spec` followed by `/to-tickets` creating vertical tracer bullets with explicit dependency graphs (`Blocked by`).
- **Stage 3 (Implementation via TDD)**: Fresh context session per ticket; tests written first at agreed seams; commands via `rtk <command>`.
- **Stage 4 (Dual-Axis Review)**: Review changes against Standards (Biome, types, dependencies) and Spec (`INTENT.md` criteria and user stories).

## Quality Floor Checklist
Before considering any implementation task complete:
- Run `rtk pnpm run check:fast`.
- Keep documentation, architectural records, and Serena memory synchronized.
