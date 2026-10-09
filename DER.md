# Data Model

> **Status: the "Implemented data" section is current. Everything under
> "Proposed, not stored" is a planning artifact and is not implemented.**

The application defines no database tables of its own yet. All persisted data is
native to Firebase: the Firebase Auth user record, one Firestore profile
document per user, and the user's Spaces. Auth comes from
[ADR 0005](./docs/adr/0005-adopt-firebase-auth-with-local-emulator.md); the
Firestore client, persistent cache, emulator and deny-by-default rules come from
[ADR 0008](./docs/adr/0008-adopt-native-firebase-firestore-with-persistent-local-cache.md);
Spaces come from
[ADR 0010](./docs/adr/0010-adopt-owner-scoped-spaces-in-firestore.md).

## Implemented data (Firebase-native)

```mermaid
erDiagram
    FIREBASE_AUTH_USER ||--o| FIRESTORE_USERS_DOC : "uid"
    FIRESTORE_USERS_DOC ||--o{ FIRESTORE_SPACE_DOC : "owns"

    FIREBASE_AUTH_USER {
        string uid PK "managed by Firebase Auth"
        string email
        string phoneNumber
        json providerData "password, email link, phone, Google"
        json multiFactor "SMS and TOTP enrollments"
    }

    FIRESTORE_USERS_DOC {
        string uid PK "document id equals the Auth uid"
        string locale "en, pt-BR or es"
    }

    FIRESTORE_SPACE_DOC {
        string id PK "UUID v4, equals the document id"
        string ownerId "equals the uid in the path"
        string name "1 to 80 characters"
        string description "optional, up to 500 characters"
        string icon "1 to 40 characters, a-z 0-9 and hyphen"
        number stateVersion "starts at 1, +1 per update"
        timestamp createdAt "server time, immutable"
        timestamp updatedAt "server time"
    }
```

- `FIREBASE_AUTH_USER` is owned and stored by Firebase Auth. The application
  reads it through the Firebase SDKs and does not define its schema.
- `users/{uid}` is written by the server (Admin SDK) when a signed-in user picks
  a language explicitly (`src/lib/i18n/profile-preference.ts`). The owner may
  read it; every client write is denied.
- `users/{uid}/spaces/{spaceId}` holds one Space per document. Only its owner
  (`request.auth.uid == uid`) may read, list, create, update or delete it. The
  schema is closed; `id`, `ownerId` and `createdAt` never change after creation,
  and each update must raise `stateVersion` by exactly one. There is no
  `roles`, `members` or `permissions` field and no sharing. Access is in
  `src/client/space-client.ts`; the rules are in `firestore.rules`.
- Every other Firestore path is denied by `firestore.rules`.

## Proposed, not stored

Nothing in this section is persisted. The earlier entity diagram remains
available in the git history of this file.

Assessment MVP candidates:

- Exam: title, provider, code, passing score percentage, time limit.
- Question: belongs to an Exam; type, prompt, answer definition, explanation,
  order index.
- Attempt: answers a Question; submitted answer, correctness, elapsed time,
  submission timestamp.
- Review: schedules a Question; due date and spaced-repetition state (stability,
  difficulty, reps, lapses).

The product may later include Objects, Object Types, Collections, Tags,
Sources, Highlights, Links, Layouts, Templates, Inbox items, and grounded Chat
sessions. Those concepts remain proposals until approved by product specs and
active ADRs.

Before implementing persistence, reconcile this model with:

- [Domain Glossary](./GLOSSARY.md)
- [Architecture](./ARCHITECTURE.md)
- the active product specification;
- [ADR 0008](./docs/adr/0008-adopt-native-firebase-firestore-with-persistent-local-cache.md)
  and its current implementation state.

## Persistence decision boundary

Do not implement collection paths, indexes, Firebase rules, or a generalized
object graph solely because an older version of this document described them.

Exception: the Space collection (`/users/{uid}/spaces/{spaceId}`) is decided and
implemented; see
[ADR 0010](./docs/adr/0010-adopt-owner-scoped-spaces-in-firestore.md).

Exception: the Object Type path (`/users/{uid}/spaces/{spaceId}/objectTypes/{objectTypeId}`)
and document contract are documented in
[ADR 0011](./docs/adr/0011-adopt-object-type-foundation-in-firestore.md). Rules,
server-side deletion, and pure domain code exist, but no Object Type data or
runtime write path for non-null parents exists.

The persistence design for everything else should be chosen when the assessment MVP requirements
are concrete enough to justify it.
