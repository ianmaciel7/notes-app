## ADDED Requirements

### Requirement: Configurable Object Types
The system SHALL treat object types as configuration over a generic object record, not as separate hard-coded domain entities.

#### Scenario: Create a non-study object type
- **WHEN** the user creates an object type with a name and supported property definitions
- **THEN** the system SHALL assign stable identifiers to the object type and its property definitions
- **AND** the user SHALL be able to create objects of that type without an application-code change
- **AND** the object type SHALL be available through the same object, property, relation, and view contracts as packaged workflow types

#### Scenario: Customize a workflow type safely
- **WHEN** the user changes the display name of a workflow-required property or adds a custom property
- **THEN** the system SHALL preserve the property's stable semantic key and workflow behavior
- **AND** the system SHALL prevent deletion or incompatible type changes for required properties while the workflow is enabled

### Requirement: Generic Object Records
The system SHALL store behavior-light generic objects with a stable identifier, object type, title, validated property values, optional body content, tags, and structured relations.

#### Scenario: Create a generic object
- **WHEN** the user creates an object from a configured object type
- **THEN** the system SHALL validate values against the type's property definitions
- **AND** the system SHALL preserve the object's stable identifier, type, title, body content, property values, tags, and object links
- **AND** the object record SHALL NOT require study-specific, objective-specific, or commitment-specific fields to exist

#### Scenario: Reject an incompatible property value
- **WHEN** a value does not conform to its property's configured type or cardinality
- **THEN** the system SHALL reject the invalid value with an actionable validation error
- **AND** the system SHALL preserve the previously valid object state

### Requirement: Property-Based Object View
The system SHALL provide an object-type list view driven by configured properties.

#### Scenario: Filter and sort objects
- **WHEN** the user filters or sorts an object-type view by a supported property
- **THEN** the system SHALL show objects matching the filter in the selected order
- **AND** filtering SHALL use stored property values rather than presentation-only text

### Requirement: Structured Object Relations
The system SHALL preserve object links as structured relations between stable object identifiers.

#### Scenario: Link objects of configured types
- **WHEN** the user links one object to another through an object-link property
- **THEN** the system SHALL preserve the source object, target object, and property definition
- **AND** the linked object SHALL be available for related-object navigation and filtering

### Requirement: Workflow Behavior Over Generic Objects

The system MUST implement domain workflows as behavior over generic objects and activity records rather than introducing a parallel root entity for each workflow.

#### Scenario: Add a workflow preset

- **WHEN** the product adds a workflow such as study, objectives, or recurring commitments
- **THEN** the workflow MUST declare its required object types, semantic properties, relations, and activity records
- **AND** those types MUST remain configurable object types
- **AND** the workflow MUST NOT make unrelated object types depend on its fields or persistence model

#### Scenario: Create an unrelated type

- **WHEN** a user creates a type such as Book, Person, Project, Meeting, Source, or Note
- **THEN** the user MUST be able to create and relate objects of that type through the generic object contract
- **AND** the system MUST NOT require study, objective, or commitment behavior for that type

### Requirement: Cross-Type Organization

The system MUST distinguish type-local labels from cross-type tags and object links.

#### Scenario: Tag across object types

- **WHEN** a user applies a theme such as `decision-making` to objects of different types
- **THEN** the tag MUST be usable across those object types
- **AND** filtering by the tag MUST not require a duplicated type-specific property

#### Scenario: Link configured object types

- **WHEN** a property links a Book object to a Person object or a Question object to a Study Topic object
- **THEN** the link MUST reference stable object identifiers and configured object types
- **AND** the relation MUST be available for navigation and filtering without embedding one type inside another
