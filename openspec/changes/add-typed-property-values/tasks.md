## 0. Evidence and dependency gate

- [ ] 0.1 Confirm runtime Structures and block-editor storage are stable before apply.
- [ ] 0.2 Re-confirm the project reference files and official Properties/Structures sources; keep private backend claims `UNKNOWN`.

## 1. Domain and migration

- [ ] 1.1 Extend PropertyDefinition with explicit default/system-vs-normal ownership and supported metadata/constraints.
- [ ] 1.2 Add typed value unions, validation, normalization, and pure set/remove commands with failing-first tests.
- [ ] 1.3 Define canonical ownership/adapters for title, aliases, description, icon/cover, created/updated, tags, and other default/system values used by the app.
- [ ] 1.4 Add a non-destructive property conversion planner for unsafe type/schema changes.
- [ ] 1.5 Raise the snapshot version and migrate every existing entity family atomically.

## 2. Workspace integration

- [ ] 2.1 Add generic property accessors and reusable property field/group renderers.
- [ ] 2.2 Migrate custom Structures first, then built-ins, without regressing lifecycle behavior.

## 3. Acceptance

- [ ] 3.1 Browser-test mixed property families, metadata/default-property protections, reload, conversion rollback, validation, keyboard/mobile focus, locales, and no duplication/data loss.
- [ ] 3.2 Run `pnpm verify`, relevant Playwright suites, build, `git diff --check`, and strict OpenSpec validation.

## 4. Completion

- [ ] 4.1 Sync canonical specs and archive only after every requirement has evidence.
