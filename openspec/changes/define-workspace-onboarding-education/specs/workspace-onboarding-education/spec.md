## ADDED Requirements

### Requirement: Object Methodology Onboarding
The workspace SHALL provide educational onboarding that teaches users to think in objects, types, metadata, relationships, collections, and graph context instead of files and folders.

#### Scenario: New user enters the workspace
- **WHEN** a user opens a workspace without completed onboarding
- **THEN** the system introduces the object-first methodology, explains that ideas are individual connected objects, and offers a guided path without requiring the user to create a folder hierarchy

### Requirement: Guided First Object Journey
The onboarding SHALL guide users through creating or selecting an object type, creating an object, editing metadata, connecting it to another object, and viewing it through a collection or graph surface.

#### Scenario: User follows the guided journey
- **WHEN** the user completes the guided steps
- **THEN** the workspace contains at least one typed object with editable metadata, a visible relationship or backlink context, and a collection or graph view that demonstrates connected-object behavior

### Requirement: Contextual Concept Education
The workspace SHALL provide contextual explanations for object types, properties, collections, backlinks, semantic discovery, graph views, daily notes, and AI context when those concepts first appear.

#### Scenario: User encounters an unfamiliar concept
- **WHEN** a user reaches a concept for the first time or requests help
- **THEN** the system shows concise methodology guidance, links to deeper reference content, and keeps the underlying workspace action accessible

### Requirement: Onboarding Progress and Dismissal
Onboarding SHALL be skippable, resumable, resettable, and tracked per user and workspace without hiding required functionality.

#### Scenario: User skips onboarding
- **WHEN** the user dismisses or skips onboarding
- **THEN** the system records that choice, keeps a visible way to resume education later, and does not block object creation, navigation, search, or editing
