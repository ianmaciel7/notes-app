## ADDED Requirements

### Requirement: Related Content is a ranked provider projection

Related Content SHALL be produced by a versioned Space-scoped provider that returns bounded ranked canonical object identities with scores, provenance, freshness, and availability metadata.

#### Scenario: Provider returns invalid targets
- **WHEN** results include the source object, duplicates, missing, trashed, unauthorized, or cross-Space objects
- **THEN** invalid targets SHALL be removed before presentation
- **AND** canonical content SHALL not be mutated.

### Requirement: Structural relationships remain distinct

Backlinks, content references, property relations, shared tags, and collections MAY inform a Notes App ranking strategy but SHALL remain separately named structural projections.

#### Scenario: An object is directly linked
- **WHEN** it appears as both a backlink and a Related Content result
- **THEN** the backlink section SHALL preserve its structural meaning
- **AND** Related Content SHALL preserve its ranked-provider meaning.

### Requirement: Private reference ranking remains unknown

The project SHALL NOT claim algorithmic parity with Capacities when only the observable result surface is documented.

#### Scenario: Notes App uses a local ranker
- **WHEN** local lexical and graph signals produce ranked results
- **THEN** the provider/version SHALL identify the ranking as Notes App-owned
- **AND** documentation SHALL not describe its weights as Capacities behavior.

### Requirement: Related results are cacheable and invalidatable

Cached rankings SHALL include source/index revisions and provider version and SHALL be invalidated by relevant canonical mutations.

#### Scenario: Source content changes
- **WHEN** the source object's accepted revision changes
- **THEN** stale cached results SHALL not replace results for the newer revision.
