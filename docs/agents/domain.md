# Domain Documentation Guide

Use this guide when an engineering task touches product/domain concepts.

## Read order

1. `GLOSSARY.md` for canonical vocabulary.
2. Active ADRs in `docs/adr/` for technical decisions.
3. Product specs in `docs/product-specs/` for approved behavior.
4. `DER.md` only when persistence/data modeling is relevant.

## Current-state rule

The glossary and DER may contain planned concepts that are not implemented on
`dev`.

Before assuming a concept exists in code:

- verify the source tree;
- check whether a product spec is implemented;
- check ADR status;
- prefer `ARCHITECTURE.md` for current implementation truth.

ADRs marked **Deprecated** are historical context only.

## Vocabulary

Use the glossary's canonical term in:

- issue titles;
- tests;
- specs;
- refactor proposals;
- implementation names.

If a term is missing, either avoid inventing a synonym or resolve the gap
through domain modeling.

## ADR conflicts

If a proposal contradicts an Accepted ADR, surface the conflict explicitly.

If it contradicts a Deprecated ADR, note the history but do not treat the old
decision as a blocker.

## Context growth

Create additional context-specific glossaries only when the repository truly
has multiple bounded contexts. Do not introduce a glossary map speculatively.
