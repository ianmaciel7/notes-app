## ADDED Requirements

### Requirement: Object suggestion triggers share canonical lookup and identity
`@` and `[[` editor triggers SHALL search eligible objects by normalized title and aliases through one object lookup contract, distinguish ambiguous visible labels with runtime Structure context, and persist only stable canonical object identity.

#### Scenario: At and wiki triggers find the same target
- **WHEN** identical queries follow `@` and `[[` in equivalent editor contexts
- **THEN** both suggestion surfaces SHALL resolve the same ordered eligible object identities from the shared index.

#### Scenario: Alias matches the target more than once
- **WHEN** the title or multiple aliases of one object match a query
- **THEN** exactly one selectable result SHALL represent that canonical target.

#### Scenario: Object reference is selected
- **WHEN** a user selects an object result from either trigger
- **THEN** exactly the active trigger range SHALL be replaced by one structured object reference
- **AND** rename-safe backlinks, reference counts, graph projections, undo/redo, focus, and buffered persistence SHALL observe that single transaction.

### Requirement: Block suggestions resolve stable block targets
The `((` trigger SHALL search referenceable blocks and present block content with owning-object context while persisting the owning object id and stable block id rather than displayed text.

#### Scenario: User selects a block with duplicate visible text
- **WHEN** two blocks share displayed text and the user selects one result using its owning-object context
- **THEN** the inserted reference SHALL target the selected stable block id and owning object id only.

#### Scenario: Referenced block moves or its text changes
- **WHEN** the target block is reordered or edited without changing its stable id
- **THEN** the reference SHALL continue resolving to that block and render current target context.

### Requirement: Reference insertion is atomic and cancellable
Object and block reference suggestion flows SHALL either commit one valid structured reference transaction or leave the document, link index, selection, and persistence state unchanged.

#### Scenario: Suggestion is cancelled
- **WHEN** the user presses Escape, dismisses the surface, deletes the trigger, or continues composition without selecting a target
- **THEN** no reference, backlink, graph edge, duplicate object, or persistence commit SHALL be created.

#### Scenario: Target becomes invalid before selection
- **WHEN** a suggested object or block is removed or becomes ineligible before commit
- **THEN** insertion SHALL be rejected atomically and the surrounding editor content SHALL be preserved.
