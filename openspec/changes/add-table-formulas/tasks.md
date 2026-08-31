## 1. Language and AST

- [x] 1.1 Add failing tokenizer/parser tests for literals, operators, precedence, functions, constants, A1 references, ranges, invalid syntax, and limits.
- [x] 1.2 Implement the pure tokenizer, parser, canonical serializer, and versioned typed AST.
- [x] 1.3 Resolve A1 references to stable table row/column identities.

## 2. Evaluation

- [x] 2.1 Add failing tests for every supported function/constant and typed error state.
- [x] 2.2 Implement dependency extraction, topological recalculation, propagation, cycle detection, and bounded evaluation.
- [x] 2.3 Implement deterministic injected behavior for RAND.

## 3. Structural Integration

- [x] 3.1 Add tests for insert, move, delete, resize, sort, and conversion effects on formula references.
- [x] 3.2 Implement stable reference preservation and explicit `#REF!` on deleted targets.
- [x] 3.3 Integrate successful results with number formatting and raw numeric semantics.

## 4. UI, Persistence, and Export

- [x] 4.1 Add formula entry, suggestions, reference highlights, error explanations, keyboard behavior, and accessibility.
- [x] 4.2 Persist source/AST/dependencies/result revision in native snapshots.
- [x] 4.3 Define CSV and Markdown source/result export modes and lossiness.

## 5. Acceptance

- [ ] 5.1 Run parser, evaluator, table-operation, persistence, export, UI, security-limit, deterministic, and performance tests.
- [ ] 5.2 Run repository verification and `openspec validate add-table-formulas --strict`.
