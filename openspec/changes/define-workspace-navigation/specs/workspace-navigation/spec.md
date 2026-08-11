## ADDED Requirements

### Requirement: Persistent Workspace Shell
The system SHALL provide a space selector, persistent object-centric sidebar, compact tab bar, history navigation, contextual actions, and account utilities.

#### Scenario: User opens a workspace
- **WHEN** an authenticated workspace loads
- **THEN** the active space, recent and pinned objects, object types, custom sections, trash, help, and account controls are available

#### Scenario: User scans the navigation shell
- **WHEN** the workspace shell is visible on desktop
- **THEN** the space selector appears as the top-level context, the sidebar is organized by object-centric sections such as recent, pinned, object types, trash, and help, and compact tabs keep multiple objects open without dominating the document

### Requirement: Tabs and Contextual Panels
The system SHALL let users open objects in tabs and open Graph, Internal Objects, Related Content, and AI in optional right-side panels. Search results SHALL be able to target the current tab, a new tab, or a side panel without turning the Search palette itself into a persistent panel tab.

#### Scenario: User opens a contextual tool
- **WHEN** a contextual command is selected
- **THEN** the document remains available, the tool receives an identifiable tab, and the panel can be activated or closed without losing document position

#### Scenario: Context panel appears
- **WHEN** a graph, backlinks, internal objects, related content, search target, or AI panel opens beside the document
- **THEN** the panel slides or appears as a secondary layer, preserves the main document scroll position, and can be dismissed without changing the active object

### Requirement: Focus and Responsive Navigation
The system SHALL provide focus mode and replace the desktop sidebar/panel arrangement with accessible compact navigation when space is insufficient.

#### Scenario: User enters focus mode
- **WHEN** focus mode is activated
- **THEN** non-document chrome is removed, a labelled exit control remains, and document content and scroll position are preserved
