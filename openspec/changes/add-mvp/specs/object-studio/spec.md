## ADDED Requirements

### Requirement: Configurable Object Types
The system SHALL let the user define object types that are not limited to the packaged study workflow.

#### Scenario: Create a non-study object type
- **WHEN** the user creates an object type with a name and supported property definitions
- **THEN** the system SHALL assign stable identifiers to the object type and its property definitions
- **AND** the user SHALL be able to create objects of that type without an application-code change

#### Scenario: Customize a workflow type safely
- **WHEN** the user changes the display name of a workflow-required property or adds a custom property
- **THEN** the system SHALL preserve the property's stable semantic key and workflow behavior
- **AND** the system SHALL prevent deletion or incompatible type changes for required properties while the workflow is enabled

### Requirement: Generic Object Records
The system SHALL store objects as typed records with validated property values and structured relations.

#### Scenario: Create a generic object
- **WHEN** the user creates an object from a configured object type
- **THEN** the system SHALL validate values against the type's property definitions
- **AND** the system SHALL preserve the object's stable identifier, type, property values, tags, and object links

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
