## ADDED Requirements

### Requirement: Split Competitive Workspace Roadmap
The competitive workspace program SHALL be represented as focused OpenSpec changes instead of one broad implementation change.

#### Scenario: Team selects implementation work
- **WHEN** implementation planning starts for the competitive workspace
- **THEN** the team selects a focused feature change such as foundation, visual experience, navigation, object model, editor, collections/search/calendar, relations/graph, AI, portability/offline/quality, or reference audit instead of implementing this umbrella change directly

### Requirement: No Duplicated Feature Specs In Umbrella
The umbrella change SHALL not duplicate detailed feature requirements that are owned by focused feature changes.

#### Scenario: A feature requirement changes
- **WHEN** a requirement for a specific feature area is revised
- **THEN** the owning feature change is updated and the umbrella remains an index unless the feature split itself changes
