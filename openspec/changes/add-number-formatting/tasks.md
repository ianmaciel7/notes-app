## 1. Domain Model

- [x] 1.1 Add failing tests for number/percent/currency/progress/table-text configurations, bounds, invalid currency, and non-finite values.
- [x] 1.2 Implement `NumberPresentation`, validation, cloning, serialization, and migration defaults.
- [x] 1.3 Implement raw-value versus display-value formatting/parsing services.

## 2. UI Integration

- [x] 2.1 Add property settings for format, decimals, currency, progress steps, and semantic color.
- [x] 2.2 Reuse one renderer across object pages, small cards, gallery, wall, table views, and Table Blocks.
- [x] 2.3 Add accessible progress semantics and invalid-config fallbacks.

## 3. Query, Export, and Formula Integration

- [x] 3.1 Verify sorting, filtering, grouping, and formulas use raw numeric values.
- [x] 3.2 Define and test raw-versus-displayed output for CSV, Markdown, native export, and API boundaries.
- [x] 3.3 Add migration tests proving existing values are unchanged.

## 4. Acceptance

- [x] 4.1 Run domain, locale, UI, query, export, accessibility, migration, and cross-surface consistency tests.
- [x] 4.2 Run repository verification and `openspec validate add-number-formatting --strict`.
