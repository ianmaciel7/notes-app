# Product Specifications

This directory is the source of truth for planned and implemented product
behavior.

The active product direction is an exam-study platform. Specifications should
focus on assessment, question answering, review, progress, and related study
workflows unless a broader knowledge-management capability is explicitly
approved.

## Current state

There is no implemented product spec committed in this directory yet. The
current `dev` branch is primarily framework/UI/tooling foundation.

Do not claim a feature is implemented because it appears in `GLOSSARY.md` or
`DER.md`.

## Lifecycle

```text
Draft -> Review -> Approved -> Implemented
                    |
                    +-> Superseded / Deprecated
```

## Authoring

Start from [template.md](./template.md).

Every spec should include:

- problem and user outcome;
- goals and non-goals;
- functional requirements with stable IDs;
- relevant user journeys;
- accessibility/security/performance requirements;
- testable acceptance criteria;
- related ADRs and execution plans;
- current implementation status.

## Relationship to other docs

- Product behavior: specs
- Current technical architecture: [../../ARCHITECTURE.md](../../ARCHITECTURE.md)
- Durable architecture decisions: [../adr/](../adr/README.md)
- Delivery plans: [../exec-plans/](../exec-plans/README.md)
- Domain vocabulary: [../../GLOSSARY.md](../../GLOSSARY.md)
- Proposed persistence model: [../../DER.md](../../DER.md)
