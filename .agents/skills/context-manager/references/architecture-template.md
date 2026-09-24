# ARCHITECTURE.md Template

## Document Purpose

`ARCHITECTURE.md` owns system topology, module/service boundaries, dependency
direction, runtime data flow, state/persistence boundaries, cross-cutting
architectural decisions, and ADR links.

It does not own coding style, test commands, visual design rules, or detailed
security procedures.

## Canonical Structure

```markdown
# System Architecture

## 1. System Context & Overview
[Actors, system boundary, external systems, context diagram.]

## 2. Module / Container Boundaries
[Major modules/services, responsibilities, allowed dependency direction.]

## 3. Technology Decisions
[Architecturally meaningful technology choices and rationale. Link to package/config
for exact versions instead of copying volatile pins.]

## 4. Runtime State & Data Flow
[Requests, data flow, persistence, cache/state lifecycle, important runtime boundaries.]

## 5. Cross-Cutting Architecture
[Observability, performance architecture, security-boundary pointers, quality-floor
pointers. Route detailed policies to their canonical owners.]

## 6. Architectural Decision Records
[Links to ADRs.]
```

## Governance Rules

1. Document boundaries and intent, not a directory inventory for its own sake.
2. Avoid volatile counts/versions when package/config files already own them.
3. Put implementation-style rules in `CONVENTIONS.md`.
4. Put security policy in `SECURITY.md`, visual rules in `DESIGN.md`, and numeric
   quality floors in `CONSTRAINTS.md`.
5. Update this file whenever a real system boundary or dependency direction changes.
