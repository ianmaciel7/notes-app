# Domain Glossary

This glossary defines product vocabulary for the planned exam-study platform.
It is a domain-language reference, not proof that every concept is currently
implemented on `dev`.

## Study domain

**Exam**  
A structured assessment definition containing an ordered set of questions.

**Question**  
An assessable prompt with a defined answer model, correctness criteria, and
optional explanation.

**Attempt**  
An immutable record of a submitted answer to a question.

**Assessment View**  
The UI mode used to work through an assessment. Current product planning uses
Continuous and Focus as primary modes.

**Continuous Mode**  
A mode that presents questions in a continuous flow.

**Focus Mode**  
A mode centered on one active question at a time.

**Review**  
A scheduled practice interaction intended to reinforce recall.

**Mock Exam**  
A timed or exam-like assessment session used to evaluate readiness.

**Leech**  
A question repeatedly failed enough to warrant special attention or revision.

## Organization

**Space**  
An isolated, user-scoped context used to organize study content. A user may
have many Spaces; each Space has exactly one Owner.

**Owner**  
The signed-in user a Space belongs to. Only the Owner can read or change the
Space. Ownership cannot be transferred, and Spaces are not shared.

**Collection**  
A manually curated grouping of related entities.

**Tag**  
A non-hierarchical label applied across content.

**Template**  
A reusable structural baseline used when creating an entity.

**Layout**  
A presentation arrangement for a set of entities or content.

## Knowledge/content concepts

These remain part of the broader planned model but are not necessarily part of
the initial assessment MVP.

**Object**  
A generic first-class entity in the broader planned knowledge model.

**Object Type**  
A schema describing the structure of a category of objects.

**Page**  
A free-form content surface.

**Property**  
Structured metadata associated with an entity.

**Link**  
A semantic connection between entities.

**Back Link**  
A derived incoming connection to an entity.

**Source**  
External material used as study/reference input.

**Highlight**  
A captured excerpt from a source.

**Document**  
An uploaded file used as a source.

**Web Link**  
An external URL preserved as a source.

**Inbox**  
A triage area for newly captured material.

**Chat**  
A conversational session grounded in study content.

## Naming rule

Code, specs, tests, and issues should prefer the glossary term when describing
one of these domain concepts. If a concept is still only planned, avoid naming
implementation modules as though the architecture already exists.
