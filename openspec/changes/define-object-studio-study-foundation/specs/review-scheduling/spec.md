## ADDED Requirements

### Requirement: Deterministic Daily Question Target
The system SHALL calculate a suggested daily question target without depending on generative AI.

#### Scenario: Calculate the target
- **WHEN** an active study goal has a target question volume, completed unique question count, target date, and configured study days
- **THEN** the system SHALL divide the remaining volume across the remaining configured study days and round up
- **AND** the calculation SHALL never return a negative target

#### Scenario: Override the target
- **WHEN** the user configures a daily question target override
- **THEN** the Today view SHALL use the override
- **AND** the system SHALL continue to expose the calculated suggestion

### Requirement: FSRS Flashcard Scheduling
The system SHALL schedule flashcard reviews with an established FSRS implementation.

#### Scenario: Rate a flashcard review
- **WHEN** the user rates a flashcard Again, Hard, Good, or Easy
- **THEN** the system SHALL append an immutable review record
- **AND** FSRS SHALL calculate and persist the card's next due state from the rating and prior scheduling state

#### Scenario: Show due reviews
- **WHEN** flashcards are due or overdue for the active goal
- **THEN** the system SHALL include them in the Today view
- **AND** overdue reviews SHALL appear before future reviews

### Requirement: Today View
The system SHALL provide a focused Today view for the active study goal.

#### Scenario: Open the Today view
- **WHEN** the user opens the Today view
- **THEN** the system SHALL show the effective daily question target, due flashcards, weak topics with sufficient attempt data, and target-date progress
- **AND** the user SHALL be able to start a study session from the displayed work
