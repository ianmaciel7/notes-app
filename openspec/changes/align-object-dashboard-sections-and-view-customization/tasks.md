## 1. Section Identity

- [x] 1.1 Add failing tests that distinguish sidebar sections from dashboard sections and reject cross-command use.
- [x] 1.2 Implement dashboard source identities for All, built-in, collection, and query.
- [x] 1.3 Implement ordering, hide/remove, immutable All, and rename-through-source semantics.
- [x] 1.4 Migrate legacy generic dashboard section records with diagnostics.

## 2. Built-in Sections

- [x] 2.1 Add registry and projection tests for recent, untagged, not-in-collection, no-backlinks, collections, and task-provided sections.
- [x] 2.2 Implement only built-ins supported by canonical local data and record unsupported reference entries truthfully.

## 3. Small Cards

- [x] 3.1 Add tests for ordered visible properties and reuse across small card, gallery, wall, and embed.
- [ ] 3.2 Implement configuration UI and property-type-aware direct editing.
- [x] 3.3 Verify gallery empty-value and wall compact-value behavior.

## 4. Table Views

- [x] 4.1 Add tests for column visibility, wrapping, order, width, missing properties, and persistence.
- [ ] 4.2 Implement shared table-view customization and responsive controls.

## 5. Acceptance

- [ ] 5.1 Verify remove-vs-delete safety, keyboard, accessibility, localization, reduced motion, reload, and schema migration.
- [ ] 5.2 Run repository verification and `openspec validate align-object-dashboard-sections-and-view-customization --strict`.
