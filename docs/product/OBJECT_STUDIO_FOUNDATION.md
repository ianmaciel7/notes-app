# Object Studio Foundation

## Product Promise

The foundation is a personal object studio whose primary unit is a generic, behavior-light object. It starts with a study workflow, but is not limited to study. It should let the user create customizable object types, properties, relations, tags, and filtered views, then use those objects for the first real workflow: turning syllabi, exam guides, past exams, certification objectives, course material, and study notes into structured study objects.

The platform promise is:

```text
Create object types and properties, connect them through structured relations, then use a ready-made study workflow to turn material into topics, questions, flashcards, reviews, and a daily plan.
```

Study Goal, Question, Objective, and Recurring Commitment are configured object types or workflow presets. They are not separate root entities that replace the generic object contract.

The product direction is a Portuguese-first, object-centric knowledge studio inspired by Capacities and Readwise. The study workflow validates that direction through one useful workflow, but the product must not be framed or implemented as only a study app.

## Initial User

The initial user is the project owner building a personal knowledge/workflow system. The first real use case is preparation for a defined assessment goal, such as an exam, certification, course test, interview loop, or other structured study target.

The primary pain is not generic note organization. The primary pain is knowing what to study each day, practicing from questions, retaining knowledge through spaced repetition, and seeing where errors are concentrated before the exam date.

## Core Workflow

1. Create or use object types with custom properties.
2. Create objects and connect them through relationships.
3. Use property-based lists, filters, sorting, tags, and relations to navigate objects.
4. Use the first packaged workflow for study: Study Goal, Study Topic, Question, Flashcard, and Study Session.
5. Upload a PDF or UTF-8 text document containing a syllabus, exam guide, past exam, certification objectives, or related study material.
6. Use Gemini to suggest topics, questions, and flashcards.
7. Review and approve generated objects before saving them.
8. Study through questions and flashcards.
9. Track errors, correct answers, overdue reviews, and weak topics.

## Foundation Scope

- Generic object studio foundation with configurable object types, stable property definitions, tags, relations, and property-based list views.
- First workflow pack for Study Goal, Study Topic, Question, Flashcard, and Study Session.
- Study goal setup with target date and daily target configuration.
- Manual creation/editing for questions and flashcards.
- Browser upload for supported PDF and UTF-8 text documents, with local file storage, deduplication, and page-aware extraction when the PDF has a usable text layer.
- Gemini-assisted extraction from uploaded material using validated structured output.
- Review screen before AI-generated objects are saved.
- Question practice mode with answer recording.
- Flashcard review mode with simple spaced repetition.
- Focused Today view for daily target, correct answers, errors, weak topics, and overdue reviews.
- Filters by study goal, subject, topic, tag, provider, difficulty, status, answer result, and review state.
- Custom property foundation so the user can add fields such as provider, source, score, priority, collection, status, or any future workflow-specific metadata.
- Object-type list views that can filter and sort objects by their properties.
- Lightweight object relationships so the product can evolve toward a Capacities-like graph.

## Non-Goals

- User accounts, login, sync, or collaboration.
- Perfect PDF parsing, OCR, or automatic document cleanup.
- Full Capacities clone.
- Full Readwise clone.
- Native mobile app.
- Complex graph visualization.
- Export/import guarantees.
- Advanced rich-text editing.
- Multi-user permissions.
- Saved dashboard layouts, advanced grouping, and manual collections.
- Durable hosted persistence for the local database or uploaded files.

## Success Criteria

The foundation is successful when the owner can use it as a generic object workspace and also complete the first study workflow for at least one assessment goal:

- create and edit object types with custom properties;
- create a useful non-study object type without changing application code;
- create objects, connect them, and browse them through property-based list views;
- create or approve a usable set of questions and flashcards;
- complete daily question practice and flashcard reviews;
- see which topics produce the most errors;
- see how many questions are needed per day until the target date;
- trust that the next study session is driven by errors, due reviews, and study-scope coverage;
- return to the app across multiple days without needing a separate spreadsheet or Anki deck for the same study loop.

## Product Boundaries

The foundation should feel fast, clear, and focused. It should not look like a folder/file notes app, a narrow flashcard app, or a KPI dashboard. The interface should foreground objects, properties, relationships, filters, views, and next actions.

The foundation should not postpone the object model. It can ship with a limited starter set of object types, but those types should already behave like configurable object types with stable properties, relationships, tags, and property-based views. Workflow-required properties use stable semantic keys so visual customization cannot silently break behavior.

The study workflow is the first validation path, not the product boundary. Future object-studio behavior belongs in the roadmap when it is broad, visual, or advanced, but the generic object foundation belongs in this foundation.

The concrete documents selected for the first real validation are recorded in `docs/product/VALIDATION_SOURCES.md`. They are versioned reference and acceptance fixtures, not a product boundary or runtime document store. Acceptance testing uploads them through the same browser flow used for arbitrary supported user documents.
