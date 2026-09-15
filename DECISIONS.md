# Decisions

## URLs and authentication

Use English GUID-backed routes such as `/study/{cardGuid}`. Firebase Google
Auth is the only provider; every Server Action, Route Handler, repository, and
private loader repeats authorization.

## Scheduling and storage

Use `ts-fsrs` and persist authenticated review state in Firestore. Static card
content remains in typed fixtures; IndexedDB, import/export, and generic
knowledge objects are deferred.

## UI conventions

Object types use the shared `ObjectIcon` primitive and typed
`ObjectIconName`; actionable types also use matching split buttons. Use the
existing shadcn/Base UI source components and semantic tokens.

## Environments and agent plugins

Development, Vercel preview, and production use separate Firebase projects.
Agent integrations are workspace plugins under `.agents/plugins`; standalone
repo skills remain tracked in `skills-lock.json`.

## Historical worktrees

Read-only `.worktrees/old*` checkouts are reference material, not merge
sources. Keep the active Next.js App Router, Firebase, DTO, and shadcn/Base UI
architecture authoritative; retain only product-neutral lessons such as
accessible navigation, real actions, space isolation, and responsive panels.

`SpaceShell`, `SpaceProvider`, and `SpaceSidebar` own current study
navigation. Future work is additive: navigation data, saved sections,
preferences, Spaces, then contextual panels. A feature is not adopted merely
because a historical worktree or installed dependency contains it.

## Future data and actions

Preferences must be validated, versioned, migration-tested, and scoped to the
verified user and future `spaceId`; they never authorize access. Once Spaces
exist, repositories, server boundaries, and Firestore rules verify ownership
and scope independently.

Every visible control reaches an authorized, active-scope operation and
reports loading, success, and failure truthfully. Typed objects, views,
reader/highlights, grounded AI, local-first sync, and recovery remain deferred
until they have focused designs, validated data, migrations, and authorization
boundaries. The MVP remains typed study fixtures, Firebase-backed reviews, and
`ts-fsrs`.

The extracted historical architecture also establishes these guardrails for
future work: generic objects use stable typed schemas and `spaceId`; saved
queries are declarative; reader highlights preserve source text; AI cards keep
verified quote provenance; sync requires an outbox/conflict/tombstone design;
and recovery/import/export retain restorable data. None of these contracts
changes the MVP until implemented and tested end to end.
