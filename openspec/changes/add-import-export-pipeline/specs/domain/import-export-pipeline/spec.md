## ADDED Requirements

### Requirement: Staged import jobs
Imports SHALL parse and validate source material into a previewable plan before committing canonical workspace mutations.

#### Scenario: Mapping is ambiguous
- **WHEN** source fields do not uniquely match target property definitions
- **THEN** the job SHALL require explicit mapping and SHALL create no objects during preview.

### Requirement: Stable relation resolution
Bulk import SHALL resolve object/block links, tags, collections, relations, and media through explicit id mappings.

#### Scenario: Two imported objects link each other
- **WHEN** their external identities are known
- **THEN** both resulting references SHALL target the correct allocated local ids.

### Requirement: Lossless native export
A versioned Notes App-native export SHALL round-trip supported canonical records and media references.

#### Scenario: Native export is imported into an empty workspace
- **WHEN** the export version is compatible
- **THEN** supported Structures, objects, values, blocks/ids, identities, links, views/queries, and media SHALL be equivalent.

### Requirement: Explicitly reduced human-readable exports
Markdown/HTML/CSV exports SHALL preserve readable supported content while making non-lossless semantics explicit.

#### Scenario: Unsupported layout detail exists
- **WHEN** an object exports to Markdown
- **THEN** supported readable content/metadata SHALL be preserved without claiming exact round-trip fidelity.
