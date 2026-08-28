# workspace-database Specification

## Purpose

Workspace database provides transactional, normalized local persistence for workspace records so large workspaces, migrations, integrity repair, and future sync metadata do not depend on whole-snapshot rewrites.

## Requirements

### Requirement: Transactional workspace repository
Canonical workspace records SHALL persist through a transactional repository with stable ids and indexed lookups.

#### Scenario: Multi-record mutation fails
- **WHEN** a transaction cannot commit every affected canonical/index record
- **THEN** no partial new state SHALL become visible.

### Requirement: Incremental persistence
Normal edits SHALL persist affected aggregates rather than rewrite the entire workspace.

#### Scenario: One block document changes
- **WHEN** one object's document is updated
- **THEN** unrelated Structures and objects SHALL not be rewritten.

### Requirement: Safe legacy migration
Existing valid snapshot data SHALL migrate transactionally with equivalence verification and recoverable interruption.

#### Scenario: Migration is interrupted
- **WHEN** startup closes before the authoritative commit marker
- **THEN** the next startup SHALL safely resume or restart without duplicate records.

### Requirement: Revisions and integrity audit
The repository SHALL expose local revision metadata and deterministic integrity/index rebuild operations.

#### Scenario: Derived index mismatch is detected
- **WHEN** an integrity audit finds stale index records
- **THEN** indexes SHALL be rebuildable from canonical content without changing user data.
