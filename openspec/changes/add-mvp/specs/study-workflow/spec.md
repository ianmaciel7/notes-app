## ADDED Requirements

### Requirement: Packaged Study Object Types
The system SHALL provide Study Goal, Study Topic, Question, Flashcard, and Study Session as configurable starter object types.

#### Scenario: Create a study goal
- **WHEN** the user creates a study goal with a name, target date, target question volume, and study days
- **THEN** the system SHALL store it as a typed object
- **AND** the system SHALL make it available to related topics, questions, flashcards, and sessions

#### Scenario: Relate study objects
- **WHEN** a question or flashcard is assigned to a study topic and goal
- **THEN** the system SHALL preserve those relations as structured object links
- **AND** filters and analytics SHALL be able to use the relations

### Requirement: Immutable Question Attempts
The system SHALL record each completed question answer as an immutable attempt rather than an embedded mutable history array.

#### Scenario: Record an answer result
- **WHEN** the user completes a question attempt
- **THEN** the system SHALL record the question, study goal, selected or self-assessed answer, correctness, and completion time
- **AND** the attempt SHALL contribute to question, topic, goal, and session analytics

#### Scenario: Preserve prior attempts
- **WHEN** the same question is answered again
- **THEN** the system SHALL append a new attempt
- **AND** prior attempts SHALL remain unchanged

### Requirement: Study Filters And Weakness Analytics
The system SHALL derive filters and weakness analytics from object properties, relations, and attempts.

#### Scenario: Filter study objects
- **WHEN** the user filters questions or flashcards by goal, subject, topic, tag, provider, difficulty, answer result, or review state
- **THEN** the system SHALL show only matching objects

#### Scenario: Rank weak topics
- **WHEN** topics in the active goal have at least three completed question attempts
- **THEN** the system SHALL rank weak topics using their error rates
- **AND** the system SHALL show attempt count, correct count, error count, and error rate used by the ranking

### Requirement: Focused Study Session
The system SHALL let the user complete a study session from questions and flashcards selected for the active goal.

#### Scenario: Complete a study session
- **WHEN** the user finishes a session
- **THEN** the system SHALL preserve its start and completion times and included activity records
- **AND** the system SHALL show a summary of questions, correct answers, errors, and flashcard reviews
