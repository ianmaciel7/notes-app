## ADDED Requirements

### Requirement: Default per-file media policy is 100 decimal megabytes

The default product media policy SHALL accept files up to and including 100,000,000 bytes and SHALL reject a file of 100,000,001 bytes before canonical success is committed.

#### Scenario: File is exactly at the limit
- **WHEN** a compatible file has byte length 100,000,000 and operational storage permits it
- **THEN** the size policy SHALL accept it.

#### Scenario: File exceeds the limit by one byte
- **WHEN** a file has byte length 100,000,001
- **THEN** validation SHALL return a file-size-policy error
- **AND** no asset record, hash, or durable blob SHALL be committed.

### Requirement: Every media ingestion path uses one effective limit

Direct creation, file picker, drag/drop, clipboard, import, retry, and resume SHALL consume the same effective size policy.

#### Scenario: Deployment imposes a lower limit
- **WHEN** an operational configuration is lower than the product policy
- **THEN** the lower effective limit SHALL be enforced
- **AND** the error SHALL identify it as a Notes App operational constraint.

### Requirement: Existing assets remain readable after limit expansion

Changing the default ingestion limit SHALL NOT invalidate or rewrite previously stored compatible media assets.

#### Scenario: Existing asset exceeds the former 50 MiB default
- **WHEN** it is reopened after this change
- **THEN** the asset SHALL remain readable if its durable bytes are available.
