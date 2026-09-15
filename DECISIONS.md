# Decisions

## URL shape

Use English, GUID-backed segments such as `/study/{cardGuid}`. The root and
catch-all `[...space]` route preserve the space pattern used by the
historical reference while allowing future feature areas.

## Authentication

Use Firebase Authentication with Google as the only provider. The study space
is private and requires login; all progress mutations still verify a Firebase
ID token on the server.

The visitor/authenticated split is a product rule in `SPEC.md`, while this
document records the architectural consequence: client gates improve clarity,
but Server Actions, Route Handlers, repositories, and private loaders must
repeat the authorization check at their own boundaries.

## Scheduling and storage

Use `ts-fsrs` for the first scheduler implementation and persist only
authenticated review state in Firestore. Static card content remains in typed
fixtures for now; IndexedDB/import/export are deferred.

## Deployment environments

Development, Vercel preview, and production use distinct Firebase projects and
environment variables. Feature flags can stage product behavior, but cannot be
used as a substitute for isolation or authorization.
