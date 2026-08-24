## Why

Structures already own typed property definitions, but object instances still persist family-specific fields. Runtime custom Structures need one canonical typed property-value model before relations, queries, views, dates, API, and sync can be implemented safely.

## What Changes

- Add a property-value map keyed by stable property-definition id.
- Support title, text, number, boolean, date, label, entity, rich text, URL, created-at, and last-updated-at values with definition-aware validation.
- Migrate existing objects atomically and render schema-driven fields through reusable lifecycle components.

## Capabilities

### New Capabilities

- `domain/typed-property-values`: Canonical Structure-owned schema values, validation, migration, and generic editing contracts.

### Modified Capabilities

- None.

## Impact

- Priority: **P1**.
- Depends on `add-runtime-object-type-model` and the stable document contract from `add-block-editor`.
- Affects object domain types, snapshot migration, generic fields, locale copy, and tests; tag/collection identity and backlinks remain later changes.
