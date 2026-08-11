## ADDED Requirements

### Requirement: Space Data Segregation
Each space SHALL behave as a distinct knowledge environment with isolated objects, object types, metadata schemas, collections, relationships, search indexes, graph data, AI retrieval scope, sync queues, exports, and access control.

#### Scenario: User switches spaces
- **WHEN** the user switches from Personal to Work or another space
- **THEN** navigation, object types, collections, search, graph, AI context, settings, and recent objects update to the selected space without exposing data from the prior space

### Requirement: Space-Scoped Object Type Schemas
Object type schemas SHALL be owned by a space by default, while optional global templates MAY seed new spaces without creating silent cross-space coupling.

#### Scenario: User edits an object type in one space
- **WHEN** the user changes properties, validation, icon, color, or behavior for an object type in the active space
- **THEN** only compatible objects in that space are affected unless the user explicitly applies a template update to another space

### Requirement: Cross-Space Object Transfer
Moving or copying objects between spaces SHALL require explicit user confirmation and SHALL report how object type, metadata, content, relationships, attachments, permissions, backlinks, and collection membership will be handled.

#### Scenario: User copies an object to another space
- **WHEN** the destination space lacks a compatible object type or property schema
- **THEN** the system presents mapping, conversion, omission, or cancellation choices before creating the destination object

### Requirement: Space-Scoped Search Graph AI and Export
Search, graph, AI retrieval, exports, and offline sync SHALL enforce active-space scope unless a user invokes an authorized cross-space operation.

#### Scenario: User searches in a space
- **WHEN** the user searches, opens graph, asks AI, exports, or reconnects queued offline edits in one space
- **THEN** results and operations include only authorized data from that space unless cross-space scope is explicitly selected and authorized
