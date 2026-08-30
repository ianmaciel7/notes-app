## Context

Formula cells begin with `=` and reference table coordinates. Stored formulas must survive row/column movement and retain source for editing, while computed values update deterministically.

## Language

The grammar supports numeric literals, parentheses, unary sign, arithmetic operators, A1 cell references, rectangular ranges, function calls, and named constants. Function names are case-insensitive and serialized canonically. Strings, dates, network calls, dynamic code, macros, and arbitrary identifiers are out of scope.

Supported functions/constants are the current documented set: ABS, AVG, CEIL, COUNT, E, FLOOR, LOG, MAX, MEDIAN, MIN, PHI, PI, PRODUCT, RAND, ROUND, SIGN, SQRT, SUM, TAU.

## Identity and References

The parser initially accepts A1 notation, then resolves references to stable row/column IDs in the AST. Rendering reconstructs current A1 labels. Insert/move/delete operations therefore preserve target identity or produce explicit `#REF!` when a referenced row/column is deleted.

## Evaluation

A dependency graph recalculates affected cells in topological order. Cycles produce `#CYCLE!`. Invalid syntax, references, domain errors, division by zero, and nonnumeric inputs have typed error states. Errors propagate by explicit rules.

`RAND` uses an injected seed/revision policy so tests and persisted recalculation are deterministic; it does not change on unrelated renders.

## Storage and Export

Formula source, resolved AST/version, dependencies, result/error, and calculation revision are persisted in native snapshots. CSV defaults to displayed result and can optionally include source through an explicit export mode. Markdown records formulas without pretending interoperable semantics when unsupported.

## Security and Limits

Token count, nesting, range size, dependency fan-out, and recalculation work are bounded. Evaluation is pure, synchronous for bounded local tables, and never uses `eval`, `Function`, DOM, network, or filesystem.

## UI

Typing `=` in an eligible cell enters formula mode with function/reference suggestions. Referenced cells/ranges are highlighted. Errors expose localized explanations while source remains editable. Number formatting applies to successful numeric results.

## Testing

Tokenizer/parser round trips, functions, constants, precedence, ranges, stable identities, structural rewrites, cycles, errors, deterministic RAND, limits, persistence, export, UI, accessibility, and performance are covered.
