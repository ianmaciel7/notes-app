# ADR 0011: Adopt the Object Type Foundation in Firestore

## Status

Accepted

## Implementation

Partially implemented. Firestore Rules permit owner-scoped root Object Type
reads, creates, and updates; server-side deletion is available; and a pure
domain layer validates and resolves Object Type documents. There is no runtime
write path for a non-null parent, so inheritance is not operationally
supported.

## Date

2026-10-09

## Current State (2026-10-09)

Configured and delivered:

- `firestore.rules` defines owner-only `get`, `list`, `create`, and `update`
  access at `/users/{uid}/spaces/{spaceId}/objectTypes/{objectTypeId}`. Create
  requires a lowercase UUID v4 document ID, the closed document shape,
  `parentTypeId == null`, `schemaVersion == 1`, `stateVersion == 1`, and
  server timestamps. The rules limit `propertyDefinitions` to a map of at most
  100 entries but cannot validate its entries. Updates permit only `name`,
  `pluralName`, `description`, `propertyDefinitions`, `stateVersion`, and
  `updatedAt`; `stateVersion` must increase by one. There is no client
  `delete` permission.
- `src/data/space-dal.ts` deletes an owned Space with the Admin SDK's
  `recursiveDelete`, and `src/data/object-type-dal.ts` deletes an Object Type
  only after confirming that it has no direct children. Both are the
  server-only Data Access Layer: `src/data/` contains only `*-dal.ts` files,
  each starting with `import "server-only"` and exporting only async
  operations that verify the current identity themselves and take no
  `uid`, `userId`, or `ownerId` parameter. The Space and Object Type deletion
  functions export only `deleteSpaceTree` and `deleteObjectType`; UUID and
  owner-id validation lives in the pure `src/domain/space.ts`, and the shared
  ownership guard `requireOwnedSpaceRef(spaceId)` lives in
  `src/data/current-identity-dal.ts`. It authenticates through `getCurrentIdentity`, reads
  the owned-Space reference with the Admin SDK, and is used by both deletion
  DALs. These rules are enforced structurally (see Code layout), not
  by runtime behavior. `src/actions/space-actions.ts` only checks
  argument types, delegates, and returns a minimal result DTO. `deleteSpace` in
  `src/client/space-client.ts` calls the Space deletion Server Action, and
  client Space deletion is denied by `firestore.rules`.
- `src/domain/object-type.ts` parses persisted Object Type documents without
  an SDK dependency. `src/domain/object-type-inheritance.ts` provides
  `resolveEffectiveSchema` and `validateParentChange`, including checks for
  missing types and parents, self-parenting, cycles, duplicate keys and
  property IDs, and a maximum inheritance depth. These pure functions are not
  called by a runtime read or write path.
- The rules, deletion, Space client, and pure-domain tests listed in
  Verification cover the delivered behavior. No Object Type data is seeded or
  otherwise persisted by the application.

Planned, not implemented:

- A Server Action, Route Handler, or other write path that creates or updates
  an Object Type with a non-null `parentTypeId`.
- Operational inheritance. A trusted backend must call
  `validateParentChange` and `resolveEffectiveSchema` before it writes a
  non-null parent reference.
- An Objects collection and the corresponding objects-in-use deletion check.
- System Types, their collection, and a convention for cross-path system-type
  references.

## Context

[`DER.md`](../../DER.md) forbids collection paths, rules, or a generalized
object graph without an approved ADR. Object Types, Property Definitions, and
inheritance are planned ([`GLOSSARY.md`](../../GLOSSARY.md)). This ADR fixes
the Object Type path, identity, document contract, access rules, and deletion
boundary without claiming that inherited types are usable. The original brief
placed types at `spaces/{spaceId}/objectTypes`, but Spaces live under
`/users/{uid}` ([ADR 0010](./0010-adopt-owner-scoped-spaces-in-firestore.md)),
so that path was rejected.

## Decision

**Path.** `/users/{uid}/spaces/{spaceId}/objectTypes/{objectTypeId}`. Ownership
comes from the path (`request.auth.uid == uid`), as in ADR 0010: Object Type
documents do not duplicate `ownerId`, `spaceId`, or `id`. A future `objects`
nested collection is anticipated but not designed.

**Identity.** `objectTypeId` is a client-generated UUID v4, the same convention
as Spaces. The rules require its lowercase UUID v4 representation. The
document ID is immutable; names are editable and independent of identity. A
semantic `key` belongs to a Property Definition, never to the Object Type
document ID. No reserved system IDs are defined. The Firestore automatic ID and
UUID v7 were considered: automatic IDs would split the convention from Spaces
and need a generated ID offline; UUID v7 is time-ordered, which the Firestore
best practices advise against for document IDs. Firestore ID limits apply (no
`/`, not `.` or `..`, not `__.*__`, at most 1,500 bytes); a UUID satisfies
them.

**Document contract.** The Rules enforce these fields and constraints for
client-created root types:

| Field | Notes |
| --- | --- |
| `name`, `pluralName` | Required strings, each 1 to 80 characters |
| `description` | Optional string, at most 500 characters |
| `parentTypeId` | Required and currently must be `null` for client writes |
| `schemaVersion` | Required integer; `1` on create and immutable thereafter |
| `stateVersion` | Required integer; `1` on create and exactly `+1` per update |
| `propertyDefinitions` | Required map of own definitions; at most 100 entries in Rules |
| `createdAt`, `updatedAt` | Required server timestamps; `createdAt` is immutable |

The pure parser expects a property definition to contain `key`, `name`,
`valueType`, and `required`, and accepts the logical value types `text`,
`richText`, `number`, `boolean`, `date`, `dateTime`, `select`, `multiSelect`,
`reference`, `relation`, `url`, `file`, and `computed`. Rules cannot iterate
map values, so their entry shapes are deliberately not validated in Rules.

**Logical versus physical types.** `valueType` is a logical application type.
Firestore stores `string`, `number`, `boolean`, `timestamp`, `map`, `array` and
`reference`. Indicative mapping: `text`, `richText`, `url` to `string`; `date`
and `dateTime` to `timestamp`; `multiSelect` to `array`; `number` and
`boolean` to themselves; `reference`, `relation`, `select`, `file` and
`computed` are not mapped yet. No renderer, calculation or specialized
validation exists. Extensions outside the contract: property `description`,
`defaultValue`, `multiple`, `validation`, `readonly`. Policy target of about
100 own properties per type (the Rules enforce this size limit).

**Storing property definitions.** A map inside the type document, keyed by
stable property id (the id is the key and is not repeated in the value). An
array cannot update or address one element by key without rewriting the whole
field; a nested collection multiplies reads, rules and deletion work and is
justified only if properties must be queried individually, which no
requirement says. A document can hold 1 MiB and map or array nesting is
limited to 20 levels; about 100 small definitions are far below both. Fields
are indexed automatically, so indexing exemptions on `propertyDefinitions` are
to be evaluated when real data exists.

**Versions.** Three things are distinguished: the persisted document format
version (`schemaVersion`, the only one that exists, fixed at 1), the Object
Type definition version, and the schema version an instance was written under.
The last two belong to future instances and are not implemented. Migrations
will read `schemaVersion`; none are written.

**Inheritance.** The domain contract is single inheritance through
`parentTypeId`; only own properties are persisted, and an effective schema is
not materialized. `resolveEffectiveSchema` resolves ancestors before descendants
and rejects invalid chains or duplicate property IDs and keys.
`validateParentChange` validates a proposed parent relationship. These helpers
are pure and not wired to a write path. Therefore, inheritance is not
operationally supported: clients can create only root types, and a trusted
backend must call both helpers before writing a non-null parent reference.

Known limitation: if a future trusted backend writes a non-null
`parentTypeId`, the current client update rules reject every subsequent client
update of that document because their shape check requires `parentTypeId ==
null`. That backend must provide the necessary update path or the Rules must be
revised with the inheritance write design.

**Authorization and Rules policy.** Path ownership is the only authorization
model. There are no roles, members, permissions, or Custom Claims. Custom
Claims are set by a trusted server, travel in the ID token and are not a store
for per-Space permissions, so they are not adopted. Authentication identifies
the user; the path decides access. Permission changes propagate through the
path model; sharing needs its own ADR. Google Cloud IAM is unchanged. Rules keep
a closed shape, require server timestamps, and restrict updates with an
affected-fields allowlist. Matches overlap permissively, so no recursive
wildcard may be added under `/users/{uid}`, and Rules are not query filters:
client queries must stay inside the owner's path. Rules must not walk
hierarchies (document access calls per request are limited). Client delete is
intentionally absent for both Object Types and Spaces. The Admin SDK bypasses
Rules, so the Data Access Layer checks both the verified identity and the
Space's stored owner itself.

**System types.** A top-level system-types collection, readable by authenticated
clients and writable only through the Admin SDK, remains planned. No Rules,
collection, or cross-path reference convention is configured. Cross-path
inheritance from a system type remains unresolved.

**Code layout.** Space and Object Type share one domain, and the code is
split by runtime rather than by concept, following the Next.js Data Access
Layer guidance (a `server-only` access layer behind thin Server Actions). The
locale preference (ADR 0007) uses the same layout:

| Folder | Holds | May import |
| --- | --- | --- |
| `src/domain/` | `space.ts`, `object-type.ts`, `object-type-inheritance.ts`: SDK-free types, errors, parsing, inheritance rules | nothing else in `src/` and no Firebase SDK |
| `src/client/` | `space-client.ts`: browser Firestore access | `src/domain/`, `src/lib/`, and the Server Actions in `src/actions/` |
| `src/domain/` (Space validation) | `space.ts` also holds the pure UUID v4 and owner-id validation (`assertValidSpaceDeletionIds`, `assertValidSpaceOwnerId`) | nothing else in `src/` and no Firebase SDK |
| `src/lib/firebase/` | Server-only Firebase adapters such as `admin.ts` and `identity.ts`, shared by server-side modules where needed | `src/domain/` and other `src/lib/` modules |
| `src/data/` | Only `*-dal.ts` files, each `import "server-only"` and exporting only async DAL operations that authenticate and authorize their own caller and take no `uid`, `userId`, or `ownerId`: `space-dal.ts`: `deleteSpaceTree(spaceId)`; `object-type-dal.ts`: `deleteObjectType(spaceId, objectTypeId)`; `current-identity-dal.ts`: `requireOwnedSpaceRef(spaceId)`; `locale-dal.ts`: `readProfileLocale`, `writeProfileLocale`, and `syncProfileLocale(explicitLocale)`. No exported types, constants, classes, non-async functions, re-exports, or default exports | `src/domain/` and `src/lib/` |
| `src/actions/` | `space-actions.ts`, `locale-actions.ts`: `"use server"`, thin: validates argument types, delegates to `src/data/`, returns a DTO | `src/data/`, `src/domain/`, and `src/lib/` |

The `domain/`, `client/`, `data/`, and `actions/` folders and the `-client`,
`-dal`, and `-actions` file suffixes are project conventions, not Next.js,
Firebase, or shadcn requirements. The shadcn `lib` alias is reserved for
generic helpers. The Next.js documentation prescribes no folder for domain
rules or for Server Actions: its examples use `app/actions/`, but any
`"use server"` file works. Actions sit outside `src/app/` because they are not
routes and are imported by `src/client/`, which must not depend on app routing.
The Dependency Cruiser rules `domain-is-pure`,
`client-cannot-import-server-layers`, `data-cannot-import-client-layers`,
`data-not-importable-by-browser-layers` (only `src/app/` and `src/actions/`
may import `src/data/`; `src/components/`, `src/hooks/`, `src/client/`,
`src/domain/`, and `src/lib/` may not), `data-files-must-be-dal` (a partial,
redundant check that `src/data/` files match `*-dal.ts`; it only sees files
with at least one dependency), and
`actions-cannot-import-client-layers` enforce the table. The Vitest suite
`tests/unit/data-layer-structure.test.ts` (with its helper
`tests/unit/data-layer-structure-lib.ts`, which parses each `src/data/` file
with the TypeScript compiler) additionally checks the file structure: the
file name, the `server-only` import, and exports limited to async functions
with no `uid`, `userId`, or `ownerId` parameter. The suffixes keep
files of the same concept distinguishable in tabs, search results, and
imports. The `domain-is-pure` and `client-cannot-import-server-layers` rules
also match Firebase SDK paths resolved through pnpm's virtual store
(`node_modules/.pnpm/<pkg>/node_modules/...`); planted forbidden SDK imports
were reported by Dependency Cruiser.

**Data Access Layer and DTOs.** This follows the Next.js data security guide.
The Data Access Layer holds only `*-dal.ts` files that are `server-only` and
export only async operations; none accepts a uid, so no caller can hand the
Admin SDK an unverified uid. Everything else lives elsewhere: pure UUID and
owner-id validation in `src/domain/space.ts`, and the shared ownership guard
`requireOwnedSpaceRef(spaceId)` in `src/data/current-identity-dal.ts`. The guard
authenticates through `getCurrentIdentity`, validates the owner and Space ID,
checks the stored owner with the Admin SDK, and returns the document reference
only for the verified owner. `deleteSpaceTree(spaceId)` and
`deleteObjectType(spaceId, objectTypeId)` use that guard before deletion, with
their other UUID validation remaining in the pure domain module.
`syncProfileLocale`
authenticates once and internally chooses whether to return a stored locale or
migrate an explicit one; `readProfileLocale` and `writeProfileLocale` also
authenticate their own callers. Server Actions stay thin and are not trusted
for security. What reaches the client is a minimal DTO: `SpaceDeletionResult`
in `src/domain/space.ts` is only `{ ok: true }` or `{ ok: false, code }`, never
a record or an identity. A guest is not an error for the locale preference:
`locale-dal.ts` reads `null` and reports a write as `false`. Reads of Space and
Object Type data do not go through the server: the browser reads
Spaces and Object Types directly through the Firestore SDK under the Rules, so
there is no read DTO yet. A future server read must return a DTO from
`src/data/` rather than a Firestore document.

**Known structure trade-off.** Everything exported from `src/data/` is
importable by `src/actions/` and `src/app/`, so `current-identity-dal.ts` exports a shared
guard that returns an Admin SDK document reference rather than a DTO. The
data-layer structure guard checks file names, imports, and export signatures;
it does not check return types or enforce that this reference stays inside
`src/data/`.

**Indexes.** No index is needed or configured. Listing Object Types, lookup by
ID, and the direct-child `parentTypeId` query use Firestore's automatic
single-field indexes.

**Deletion and integrity.** A client cannot delete a Space or an Object Type.
`deleteSpaceTree` verifies ownership and uses Admin SDK `recursiveDelete` to
remove the Space and every nested document. `deleteObjectType` verifies Space
ownership, rejects a type with direct children, and recursively deletes a leaf
type. The Objects collection does not exist, so an objects-in-use deletion
check is deferred. The deletion boundary does not itself make interrupted
recursive deletion resumable: a run interrupted midway leaves partial data and
must be retried. Firestore does not delete nested collections with their
parent, and its documentation advises deleting collections only from a trusted
server; orphans are invisible to queries but remain stored.

Known limitations of `deleteObjectType`: the direct-child check and the
recursive delete are not atomic, which is harmless while clients can create
only root types, but a future inheritance write path must close that gap, for
example with a transaction. The recursive delete also removes any nested
Objects, so the deferred objects-in-use check must run before it. The
ownership check on the stored `ownerId` is defensive, because the path already
scopes the Space to the verified uid.

## Consequences

- Root Object Types can be read, listed, created, and updated by their Space
  owner under the enforced Rules contract; client deletes are denied.
- Space deletion is server-side, checks identity and ownership, and cascades
  through nested Firestore documents. Object Type deletion is likewise
  server-side and is blocked by direct children.
- Property-definition entry validation and all inheritance invariants remain a
  trusted-backend responsibility for any future inherited write path.
- No Object Type data, system-type collection, cross-path reference convention,
  or Objects collection exists yet.
- The non-null-parent client-update limitation must be addressed when a trusted
  backend begins writing inherited Object Types.

## Verification

- [x] `tests/rules/object-types.rules.test.ts`: 21 cases cover owner and
  non-owner access, root-type creation and update validation, immutable fields,
  denied client delete, and unrelated path isolation against the Firestore
  Emulator.
- [x] `tests/rules/space-deletion.rules.test.ts`: 10 cases cover recursive Space
  deletion, ownership and ID validation, direct-child blocking, and leaf Object
  Type deletion against the Firestore Emulator.
- [x] `tests/rules/spaces.rules.test.ts` (25 cases),
  `tests/rules/spaces-client.rules.test.ts` (8 cases), and
  `tests/rules/spaces-offline.rules.test.ts` (3 cases) cover revoked client Space
  delete and `deleteSpace` delegation alongside the existing Space behavior.
- [x] `tests/unit/object-type-parse.test.ts` (11 cases),
  `tests/unit/object-type-inheritance.test.ts` (12 cases), and
  `tests/unit/space-actions.test.ts` (4 cases) cover the pure domain
  helpers and Server Action delegation and error handling.
- [x] `tests/unit/space-domain.test.ts` (5 cases) covers the pure Space and
  Object Type UUID v4 validation and owner-id checks in `src/domain/space.ts`.
  `tests/unit/data-layer-structure.test.ts` (15 cases, with helper
  `tests/unit/data-layer-structure-lib.ts`) checks that the real `src/data/`
  files are `*-dal.ts` modules importing `server-only` and exporting only async
  operations without uid parameters, and that 13 non-conforming fixtures are
  detected. These tests check structure, not runtime authorization behavior.
- [x] `tests/unit/locale-dal.test.ts` (8 cases),
  `tests/unit/locale-actions-profile.test.ts` (7 cases), and
  `tests/unit/locale-actions.test.ts` (2 cases) cover the locale Data Access
  Layer's own authentication (guest read and write), single-authentication
  synchronization, and the thin locale actions that delegate to it.
- [ ] A runtime write path for non-null `parentTypeId`, including trusted
  inheritance validation and its authorization design.
- [ ] Objects-in-use validation for Object Type deletion, pending an Objects
  collection.

## References

- [Data model](https://firebase.google.com/docs/firestore/data-model)
- [Structure data](https://firebase.google.com/docs/firestore/manage-data/structure-data)
- [Quotas](https://firebase.google.com/docs/firestore/quotas)
- [Best practices](https://firebase.google.com/docs/firestore/best-practices)
- [Rules structure](https://firebase.google.com/docs/firestore/security/rules-structure)
- [Rules conditions](https://firebase.google.com/docs/firestore/security/rules-conditions)
- [Rules fields](https://firebase.google.com/docs/firestore/security/rules-fields)
- [Secure queries](https://firebase.google.com/docs/firestore/security/rules-query)
- [Custom claims](https://firebase.google.com/docs/auth/admin/custom-claims)
- [IAM overview](https://firebase.google.com/docs/projects/iam/overview)
- [Indexing](https://firebase.google.com/docs/firestore/query-data/indexing)
- [Test rules with the emulator](https://firebase.google.com/docs/firestore/security/test-rules-emulator)
- [Delete data](https://firebase.google.com/docs/firestore/manage-data/delete-data)
