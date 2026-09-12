# ADR-0006: Historical Reference Architecture Synthesis & Baseline Specifications

* **Status**: Accepted
* **Deciders**: Engineering & Product Team
* **Date**: 2026-09-12

## Context and Problem Statement

The repository contains multiple historical reference implementations in read-only worktrees (`.worktrees/old`, `.worktrees/old-2`, `.worktrees/old-3`, `.worktrees/old-4`, and `.worktrees/old-5`). These worktrees contain evolving iterations of four core architectural sub-systems:
1. **Entity Evolution**: Migration from domain-specific study entities (`StudyGoal`, `Question`, `Flashcard`) to generic `WorkspaceStructure` object models and space-scoped multi-tenant entities (`SpaceEntityRecord`).
2. **Capacities Parity Object Models**: Object studio design with typed property definitions, 13 Capacities-native object presets, icon/tone color system, and Datatable/Gallery/List presentation views.
3. **SRS Burndown Schemas**: Mathematical FSRS spaced repetition engine with retrievability decay math and exam goal pacing burndown calculations (`dailyNewCardQuota`).
4. **Sync Protocol Structures**: Offline-first outbox operation queue (`WorkspaceOperation`), sequence-based push/pull replication (`WorkspaceRemoteChange`, `WorkspaceSyncCursor`), optimistic concurrency control (`WorkspaceConflict`), tombstone tracking (`WorkspaceTombstone`), and media binary sync states.

We needed to synthesize these historical findings into authoritative architecture documentation and establish a formal reference spec in `docs/architecture/HISTORICAL_REFERENCE_SYNTHESIS.md` for current and future development.

## Decision Drivers

* **Specification Integrity**: Consolidate dispersed architectural knowledge across historical worktrees into a single, authoritative reference spec.
* **Feature Parity Alignment**: Clarify object studio schemas and Capacities visual parity requirements.
* **Algorithmic Accuracy**: Formally document the exact FSRS memory decay equations and exam goal burndown math.
* **Replication Standards**: Document the offline-first sync outbox pattern, conflict resolution candidates, and tombstone mechanisms.

## Considered Options

1. **Synthesize historical reference findings into `docs/architecture/HISTORICAL_REFERENCE_SYNTHESIS.md` and index via ADR-0006**
2. **Leave historical reference code scattered in `.worktrees/` without centralized architectural documentation**
3. **Re-implement features from scratch without documenting historical specifications**

## Decision Outcome

Chosen option: **Synthesize historical reference findings into `docs/architecture/HISTORICAL_REFERENCE_SYNTHESIS.md` and index via ADR-0006** because establishing an explicit comparative specification prevents reinventing past designs, ensures mathematical consistency in SRS calculations, and provides clear blueprints for space-scoped entities and sync protocols.

### Positive Consequences

* Centralizes entity evolution, Capacities object model parity, FSRS math, and sync protocols in [`docs/architecture/HISTORICAL_REFERENCE_SYNTHESIS.md`](../architecture/HISTORICAL_REFERENCE_SYNTHESIS.md).
* Serves as an unambiguous blueprint for active feature implementation in `src/`.
* Synchronizes architecture specs and decision logs across `DECISIONS.md`, `docs/decisions/README.md`, and `ARCHITECTURE.md`.

### Negative Consequences

* Documentation must be updated if future sync protocol payloads or FSRS default parameters are modified.

## Pros and Cons of the Options

### Synthesize historical reference findings into `docs/architecture/HISTORICAL_REFERENCE_SYNTHESIS.md` and index via ADR-0006

* Good, because it provides clear mathematical and structural specifications derived from empirically validated reference code.
* Good, because it aligns AI agents and developers on established system invariants.
* Bad, because maintaining documentation requires synchronization when schemas change.

### Leave historical reference code scattered in `.worktrees/` without centralized architectural documentation

* Good, requires zero immediate documentation writing.
* Bad, leads to lost context, inconsistent algorithms, and duplicated work across worktrees.
* **Rejected because**: Relying on unindexed worktree code creates friction and risks regressions.

### Re-implement features from scratch without documenting historical specifications

* Good, gives total freedom to redesign models arbitrarily.
* Bad, discards proven FSRS pacing math, offline sync outbox designs, and Capacities parity contracts.
* **Rejected because**: Abandoning validated worktree implementations increases bug risk and breaks visual/functional parity.
