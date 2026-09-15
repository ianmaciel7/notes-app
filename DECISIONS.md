# Decisions

## URL shape

Use English, GUID-backed segments such as `/study/{cardGuid}`. The root and
catch-all `[...space]` route preserve the space pattern used by the
historical reference while allowing future feature areas.

## Authentication

Use Firebase Authentication with Google as the only provider. Browsing is
public; progress mutations verify a Firebase ID token on the server. Login is
not a prerequisite for reading.

## Scheduling and storage

Use `ts-fsrs` for the first scheduler implementation and persist only
authenticated review state in Firestore. Static card content remains in typed
fixtures for now; IndexedDB/import/export are deferred.

## Deployment environments

Development, Vercel preview, and production use distinct Firebase projects and
environment variables. Feature flags can stage product behavior, but cannot be
used as a substitute for isolation or authorization.
