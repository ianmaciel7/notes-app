# I18n Object Type Labels

- Persisted built-in object type records may keep canonical English `singularName` and `pluralName` values.
- User-visible labels for built-in object types must come from `src/messages/*.json`, using `workspace.objectTypeStudio.objectTypes` and `workspace.objectTypeStudio.objectTypePlurals`.
- Sidebar, modal, command palette, tabs, and object type menus must resolve built-in labels through the same i18n source.
- Do not fix locale drift by rewriting Dexie seed data unless the persisted schema itself changes.
- When adding a built-in object type, update all locale files and presenter/message tests that verify sidebar/modal label parity.
