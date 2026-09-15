# Design

## Direction

Editorial minimalism meets calm product UI: content leads, chrome stays quiet,
and generous spacing gives study cards room to breathe. The first surface uses
neutral semantic tokens, serif display text, restrained borders, and small
accent washes for deck identity.

## Interaction principles

- Visitors can browse static cards without an account.
- Review is an intentional transition: reveal, rate, then save.
- Google sign-in is requested at the save boundary, not at the front door.
- Progress and future editing belong to the authenticated space.
- No import/export or anonymous persistence is exposed in this MVP.

## Responsive behavior

The desktop space has a study rail, content column, and progress rail.
Small screens collapse the rails and keep the deck/card content as the primary
flow. The URL remains stable across viewport changes.
