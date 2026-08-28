## MODIFIED Requirements

### Requirement: Explicit unlinked mention conversion
For a focused object, the workspace SHALL derive advisory unlinked mentions by finding normalized occurrences of that object's non-empty title or aliases in the plain-text content of other eligible document-like objects. Each candidate SHALL identify the containing source object and the focused target object, SHALL remain distinct from canonical backlinks and property relations, and SHALL NOT mutate source prose until the user explicitly converts the matching occurrence to a stable reference.

#### Scenario: Another object mentions the focused title
- **WHEN** object B contains a plain-text occurrence of object A's title or alias and B does not already link that occurrence to A
- **THEN** A's unlinked-mentions projection SHALL contain B as the source with a deterministic matching excerpt
- **AND** A's own body SHALL NOT need to contain B's title for the candidate to exist.

#### Scenario: Mention matching is normalized and deterministic
- **WHEN** eligible source prose differs from the focused title or alias only by supported case or diacritic normalization
- **THEN** the same source occurrence SHALL produce one deterministic candidate
- **AND** empty labels, the focused object itself, unsupported entity kinds, and duplicate occurrences of the same source range SHALL NOT produce duplicate candidates.

#### Scenario: Source already contains a canonical link
- **WHEN** a source occurrence is already represented by a canonical object or block reference to the focused object
- **THEN** that occurrence SHALL appear through the backlink projection and SHALL NOT also appear as an unlinked mention
- **AND** property relations SHALL remain a distinct projection.

#### Scenario: Candidate mention is reviewed
- **WHEN** the user opens, expands, collapses, or invokes a non-conversion action on an unlinked-mention candidate
- **THEN** the matching source prose SHALL remain plain text and no reference, graph edge, or persisted mutation SHALL be created.

#### Scenario: Candidate mention is explicitly converted
- **WHEN** the user explicitly converts a selected matching source occurrence to the focused object
- **THEN** that exact source range SHALL become one stable canonical reference to the focused object
- **AND** the candidate SHALL leave the Mentions projection, enter the backlink projection, update the reference count and contextual graph exactly once, and preserve the surrounding source prose.

#### Scenario: Mention derivation runs without network or AI
- **WHEN** the workspace is offline and canonical local object content is available
- **THEN** unlinked-mention discovery, exclusion, and refresh SHALL continue locally without sending note content to an AI or remote search service.

#### Scenario: Focused title or source prose changes
- **WHEN** a focused title or alias, source prose, or canonical source link changes
- **THEN** the derived mention projection SHALL refresh from canonical data without persisting stale candidates or silently rewriting prose.
