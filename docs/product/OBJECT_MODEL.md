# Object Model

## Principles

- Every meaningful item should be an object, not a loose file.
- Objects should have typed properties, tags, views, and relationships.
- Object types should be customizable. Study Goal, Study Topic, Question, Flashcard, and Study Session are the first workflow pack, not the product boundary.
- The initial product foundation should support a generic object studio first and validate it through a study workflow.
- Filters must work from object properties, not from presentation-only labels.
- Tags connect themes across object types. Saved views, manual collections, and advanced queries follow after the first two-week slice.
- Object types, property definitions, and objects have immutable identifiers. Editable names are presentation, not identity.
- Workflow-required properties have stable semantic keys and cannot be deleted or changed to incompatible types while their workflow is enabled.

## Customization Model

The product should be an object studio where each object type can define its own structure.

initial product foundation-supported customization should include:

- custom text, number, date, boolean, single-select, multi-select, and object-link properties;
- relationship properties that link one object type to another;
- property-based filtering and sorting on object-type list views;
- safe defaults and starter object types so the user can start quickly without designing a schema first.

Future customization can add manual collections, saved views, grouping, page layouts, card layouts, templates, type conversion, advanced queries, embedded views, and richer graph controls.

## Starter Objects

These are the first starter object types for the initial study workflow. They should be user-visible as configurable object types, not hard-coded as the only domain the product supports.

### Study Goal

Represents one structured learning or assessment goal.

Suggested properties:

- name
- institution
- provider
- targetDate
- status
- dailyQuestionTarget
- dailyReviewTarget
- notes

Relationships:

- has study topics
- has questions
- has flashcards
- has study sessions

### Study Topic

Represents a subject, topic, or subtopic from a syllabus, exam guide, certification objective list, course outline, or custom study scope.

Suggested properties:

- title
- subject
- parentTopic
- importance
- coverageStatus
- sourceText
- tags

Relationships:

- belongs to study goal
- contains child topics
- has questions
- has flashcards

### Question

Represents a practice question.

Suggested properties:

- prompt
- questionType
- alternatives
- correctAnswer
- explanation
- subject
- topic
- provider
- year
- difficulty
- tags
- source
- reviewStatus
- lastAnsweredAt

Relationships:

- belongs to study goal
- belongs to study topic
- can generate flashcards
- appears in study sessions

### Flashcard

Represents a recall item for spaced repetition.

Suggested properties:

- front
- back
- subject
- topic
- tags
- dueAt
- intervalDays
- ease
- lapses
- reviewState
- source

Relationships:

- belongs to study goal
- belongs to study topic
- can be generated from question or text
- appears in study sessions

### Study Session

Represents a completed study block.

Suggested properties:

- startedAt
- endedAt
- mode
- questionCount
- correctCount
- errorCount
- flashcardCount
- overdueReviewCount
- topicsPracticed

Relationships:

- belongs to study goal
- includes questions
- includes flashcards
- updates topic analytics

## Activity Records

Question attempts and flashcard reviews are immutable internal activity records. They are not arrays stored inside Question or Flashcard properties.

### Question Attempt

- questionId
- studyGoalId
- studySessionId
- selectedAnswer or selfAssessment
- correct
- completedAt

### Flashcard Review

- flashcardId
- studyGoalId
- studySessionId
- rating
- reviewedAt
- previous scheduling state
- resulting scheduling state

Analytics are derived from these records so repeated practice never overwrites history.

## initial product foundation Filters

The first version should support filters for:

- study goal
- subject
- topic
- tag
- provider
- year
- difficulty
- answered correctly
- answered incorrectly
- never answered
- due for review
- overdue
- weak topic

## Future Objects

These are not initial product foundation objects unless a study-critical need appears:

- Note
- Source
- Book
- Article
- Highlight
- Attachment
- Person
- Project
- Collection
- Calendar Event

They should be introduced through OpenSpec changes when they become part of a real workflow or when the generic object studio needs broader defaults.
