## Why

This change preserves the product and architecture foundation. It is not a request to import the former runtime wholesale.

The project direction is a Portuguese-first, object-centric knowledge workspace. The primary platform is a generic object studio with behavior-light records and configurable object types. The immediate personal validation path is structured study for exams, certifications, courses, and other assessment goals, but the foundation must not be designed as only a study app.

The user needs a generic object studio with customizable types, properties, relations, collections, and views. The first packaged workflow should turn study-scope content, past exams, certification objectives, and study text into questions, flashcards, repetition schedules, and weakness analytics.

## What Changes

- Add a personal object-studio foundation with generic object records, configurable object types, stable property definitions, tags, relations, and property-based list views.
- Add a first packaged study workflow centered on generic typed objects and activity records for questions, flashcards, study topics, and study sessions without making study the product boundary.
- Let the user upload PDF and UTF-8 text documents through the browser, preserve them in local filesystem-backed blob storage, and extract page-aware text before Gemini processing.
- Use Gemini to suggest structured study objects from uploaded study material.
- Require a review step before AI-generated objects are saved.
- Add deterministic study planning based on target date, remaining question volume, errors, weak topics, and due flashcards.
- Add a customization foundation for object types, properties, labels, tags, and property-based views while protecting workflow-required semantic fields.
- Add filters and analytics for the study workflow using subject, topic, tags, difficulty, answer result, and review state.
- Preserve an object-centric foundation that can later evolve toward broader Capacities-like object studio, relations, dashboards, queries, and graph behavior.
- Add architecture guardrails for idiomatic Next.js App Router usage, server-only boundaries, replaceable infrastructure, and future storage adapters.

The generic object contract is the platform boundary. Workflow packs may add required properties, validation, derived views, and activity records, but they must not replace the generic object record with a new domain root.

## Supporting Docs

- `docs/product/OBJECT_STUDIO_FOUNDATION.md`
- `docs/product/OBJECT_MODEL.md`
- `docs/product/AI_WORKFLOWS.md`
- `docs/product/VALIDATION_SOURCES.md`
- `docs/references/knowledge-bases/README.md`
- `docs/references/knowledge-bases/KNOWLEDGE_BASE_SUMMARY.md`
- `docs/engineering/ARCHITECTURE.md`
- `docs/engineering/RELEASE_PROCESS.md`

## Capabilities

### New Capabilities

- `object-studio`: Defines configurable object types, objects, properties, relations, tags, and property-based list views.
- `ai-assisted-capture`: Defines structured Gemini suggestions, validation, provenance, and review before save.
- `study-workflow`: Defines the first packaged workflow, question practice, attempt history, and weakness analytics.
- `review-scheduling`: Defines deterministic daily targets and flashcard scheduling.

## Non-Goals

- Add login, sync, collaboration, or multi-user permissions.
- Build a full Capacities clone.
- Build a full Readwise clone.
- Guarantee perfect PDF extraction or provide OCR.
- Build a complex graph visualization.
- Add native mobile behavior.
- Add export/import guarantees.
- Add saved dashboard layouts, advanced grouping, or manual collections in the first two-week slice.
- Provide durable hosted persistence for the local SQLite database or filesystem uploads.

The PDFs checked in under `data/validation-sources` are reference and acceptance fixtures. They are uploaded through the same browser flow as any other supported user document; they are not a versioned runtime store and must not be ingested automatically.
