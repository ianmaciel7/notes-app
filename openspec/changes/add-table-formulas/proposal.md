## Why

Table formulas introduce parsing, references, dependency evaluation, recalculation, errors, and deterministic behavior beyond basic Table Block editing. They should be isolated from the table interaction change and consume the number-formatting contract.

## What Changes

- Add a Notes App-owned formula tokenizer, parser, typed AST, validator, dependency graph, and evaluator.
- Support A1 cell/range references and documented functions/constants: ABS, AVG, CEIL, COUNT, E, FLOOR, LOG, MAX, MEDIAN, MIN, PHI, PI, PRODUCT, RAND, ROUND, SIGN, SQRT, SUM, and TAU.
- Add deterministic recalculation, cycle/error states, reference rewrite on table structural operations, and display through number formatting.
- Preserve formula source separately from computed value.
- Add security and complexity limits; do not execute JavaScript or arbitrary functions.

## Capabilities

### New Capabilities

- `domain/table-formulas`: Formula language, dependencies, recalculation, errors, structural rewrites, and number-format integration.

### Modified Capabilities

None.

## Impact

- Depends on `add-table-block-editor` and `add-number-formatting`.
- Formula parser/evaluator, table operations, UI suggestions, persistence, export, tests, and documentation.
