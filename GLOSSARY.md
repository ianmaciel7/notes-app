# Notes Application

An object-based knowledge management system designed for capturing, organizing, and synthesizing interconnected thoughts and multimedia content.

## Language

### Core Objects and Spaces

**Space**:
A user-owned, isolated knowledge context encapsulating all objects, collections, and settings.
_Avoid_: workspace, vault, account, project, tenant

**Object**:
First-class entity with an individual identity, typed properties, rich content, and connections.
_Avoid_: item, record, entry, element

**Object Type**:
Structural schema defining the properties, templates, and behavior for a set of objects.
_Avoid_: category, class, database, schema

**Page**:
Fundamental free-form canvas object for long-form writing and media composition.
_Avoid_: note, memo, notebook, document

**Property**:
Structured metadata field defined on an object type and populated on individual objects.
_Avoid_: attribute, column, custom field, variable

**Collection**:
Manually curated grouping of objects belonging to the same object type.
_Avoid_: notebook, folder, directory, list

**Tag**:
Non-hierarchical cross-cutting label applied across objects of any type.
_Avoid_: label, keyword, mark, category

**Daily Note**:
Automatically provisioned calendar-bound object for ephemeral logs and daily reflections.
_Avoid_: journal, daily log, day note

**Trash**:
Temporary retention destination for deleted objects before permanent purging.
_Avoid_: archive, recycle bin, discarded

### Connections and Content

**Link**:
Direct semantic connection from one object to another created inline or via property.
_Avoid_: reference, relation, hyperlink, shortcut

**Back Link**:
Aggregated list on an object displaying all incoming links from other objects.
_Avoid_: incoming link, reverse link, citation list

**Block**:
Atomic addressable content unit within an object canvas, such as a paragraph or media item.
_Avoid_: section, segment, fragment

### Sources and Captures

**Source**:
Raw external reference object, such as a web link or uploaded document, supporting highlights.
_Avoid_: reference material, uploaded document, origin

**Highlight**:
First-class captured excerpt from a source linked to personal notes and commentary.
_Avoid_: clip, annotation, marker, snippet

**Web Link**:
External online reference preserved as a local source snapshot.
_Avoid_: bookmark, URL, site link

**Document**:
Uploaded file source such as a PDF or text document supporting inline extraction.
_Avoid_: attachment, upload, raw file

### Study and Practice

**Exam**:
Structured assessment specification composed of an ordered sequence of questions.
_Avoid_: test, quiz, certification

**Question**:
Evaluated prompt containing candidate choices, correct criteria, and an explanation.
_Avoid_: card, flashcard, exercise

**Attempt**:
Immutable historical record of a submitted response to a question.
_Avoid_: response entry, log, submission

**Review**:
Spaced repetition session scheduling items based on memory retention intervals.
_Avoid_: drill, daily review, practice session

**Mock Exam**:
Timed assessment simulation evaluating readiness across selected questions.
_Avoid_: dry run, practice test, trial

**Leech**:
Question flagged for revision after repeated consecutive recall failures.
_Avoid_: problem card, hard question, pain point

### Organization and Layout

**Layout**:
Structural arrangement and presentation pattern for organizing content components.
_Avoid_: view, canvas mode, presentation skin

**Template**:
Reusable structural baseline and initial content applied when instantiating a new entity.
_Avoid_: model, skeleton, preset, boilerplate


**Search**:
Query interface retrieving objects, sources, and highlights across the space.
_Avoid_: lookup, filter tool, finder

### Triage and AI

**Inbox**:
Central triage repository for newly captured, unprocessed sources and items.
_Avoid_: incoming, queue, backlog

**Chat**:
Conversational session grounded in space objects, sources, and knowledge.
_Avoid_: assistant, copilot, agent
