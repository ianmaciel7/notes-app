## 0. Evidence and dependency gate

- [ ] 0.1 Confirm `add-runtime-object-type-model` and `add-block-editor` are stable before apply.
- [ ] 0.2 Re-confirm the five project reference files and official property/Structure URLs; keep unsupported backend claims `UNKNOWN`.

## 1. Domain and migration

- [ ] 1.1 Add typed value unions, validation, normalization, and pure set/remove commands with failing-first tests.
- [ ] 1.2 Raise the snapshot version and migrate every existing entity family atomically.

## 2. Workspace integration

- [ ] 2.1 Add generic property accessors and reusable `ObjectField`/`ObjectFieldGroup` renderers.
- [ ] 2.2 Migrate custom Structures first, then built-ins, without regressing current lifecycle behavior.

## 3. Acceptance

- [ ] 3.1 Browser-test mixed custom properties, reload, validation, keyboard/mobile focus, locale completeness, and no duplication.
- [ ] 3.2 Run `pnpm verify`, relevant Playwright suites, build, `git diff --check`, and strict OpenSpec validation.

## 4. Completion

- [ ] 4.1 Sync canonical specs and archive only after every requirement has implementation evidence.
