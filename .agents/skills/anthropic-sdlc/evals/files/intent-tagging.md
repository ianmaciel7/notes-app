# Intent: Note Tagging

**Status:** Approved

## Problem / unmet need
Users with more than a few dozen notes have no way to group or filter them by topic. They resort to prefixing titles with tags like "[work]" or "[recipe]", which is fragile and doesn't support filtering.

## Proposed outcome
Users can attach one or more free-form tags to a note and filter the notes list by tag.

## Affected users
All notes-app users with more than ~20 notes (based on support tickets referencing "organizing notes").

## Affected systems
- Notes data model / storage
- Notes list UI
- Note editor UI

## Constraints
- Must not require a data migration that risks existing note data.
- Should work offline-first, consistent with the rest of the app.

## Non-goals
- Nested tag hierarchies / folders (separate future idea).
- Shared/team tags (this app is single-user).

## Success criteria
- A user can add a tag to a note in under 3 clicks.
- The notes list can be filtered to a single tag.

## Open questions
- Should tag names be case-sensitive?
- Is there a limit on number of tags per note?

Approved by: ianmaciel76@gmail.com
