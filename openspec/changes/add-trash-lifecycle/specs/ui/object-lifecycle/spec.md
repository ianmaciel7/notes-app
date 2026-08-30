## ADDED Requirements

### Requirement: Trash exposes accessible recovery and purge actions

The application SHALL provide a localized Trash surface with item age, purge date, type identity, restore, individual permanent delete, Empty Trash, and truthful loading/empty/error states.

#### Scenario: User permanently deletes an item
- **WHEN** the user confirms permanent deletion from Trash
- **THEN** the UI SHALL state that the action is irreversible
- **AND** focus SHALL recover to a stable remaining item or the Trash heading.

#### Scenario: User restores an item
- **WHEN** restore succeeds
- **THEN** the same canonical object SHALL become available in normal navigation
- **AND** the Trash list SHALL update without a duplicate item.
