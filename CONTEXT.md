# Knowledge and Study Domain

This context defines the language for private knowledge organization, exam practice, and spaced-repetition study. Terms describe the product domain rather than its implementation.

## Knowledge organization

**Space**:
A private container owned by one user that groups related knowledge objects and organization structures.
_Avoid_: Workspace, account

**Object**:
A stable item of knowledge with a type, identity, lifecycle, and revision history inside one space.
_Avoid_: Record, document, entity

**Collection**:
An object that intentionally groups other objects without owning or duplicating them.
_Avoid_: Folder, category

**Tag**:
A lightweight label applied to objects for cross-cutting organization.
_Avoid_: Collection, type

**Revision**:
An immutable version of an object's authored content.
_Avoid_: Copy, snapshot

**Published Revision**:
A revision selected for use by exams and other user-facing workflows.
_Avoid_: Current version, live draft

## Assessment

**Question**:
A reusable object containing a prompt, answer model, grading definition, and explanation.
_Avoid_: Card, exam item

**Exam**:
A versioned object that defines an ordered assessment from specific question revisions and scoring rules.
_Avoid_: Quiz, deck, test collection

**Exam Attempt**:
One user's resumable execution of one published exam revision.
_Avoid_: Exam session, submission

**Attempt Item**:
The state and result of one question revision inside an exam attempt.
_Avoid_: Answer record, question progress

## Spaced repetition

**Question Memory**:
One user's current FSRS scheduling state for one question in one space.
_Avoid_: Card, progress, question state

**Review Event**:
An append-only record of an answered question, its correctness, an explicit memory rating, and the resulting scheduling transition.
_Avoid_: Attempt, history item

**Memory Rating**:
The user's explicit Again, Hard, Good, or Easy judgment after seeing an answer result.
_Avoid_: Score, correctness

**Study Queue**:
The ordered set of questions currently eligible for spaced-repetition review.
_Avoid_: Exam, deck
