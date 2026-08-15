## Context

Several real-world pursuits share the same conceptual structure: a desired outcome, requirements, preparation, evidence of progress, assessments, and a result. Modeling each pursuit as an unrelated concept would fragment the workspace and make shared goals, activities, and progress difficult to understand.

Objective should therefore be the stable generic concept. Differences such as certification, competitive exam, technical interview, course, or custom milestone belong to classification and properties rather than separate product foundations.

## Goals / Non-Goals

**Goals:**

- Define Objective as a concrete desired outcome and central context.
- Support built-in and custom Objective classifications without changing the core concept.
- Connect requirements, preparation, supporting goals, activities, assessments, and results coherently.
- Keep lifecycle status, preparation progress, assessment performance, and final result semantically separate.
- Support outcome-oriented pursuits inside and outside study workflows.

**Non-Goals:**

- Define a separate core concept for each certification, exam, competition, interview, or course type.
- Treat Objective as a recurring quantitative commitment or habit.
- Infer probability of success directly from completed activities.
- Require every Objective to have a date, score, ranking, or pass/fail result.
- Prescribe application architecture, persistence, or interface implementation.

## Decisions

### Objective represents the outcome, not the work

An Objective answers what the person ultimately wants to achieve. Goals and activities answer what the person intends to do or has done in support of it. This distinction allows one Objective to have multiple measurable commitments and prevents a weekly target from being mistaken for the outcome itself.

### Variations are classifications

Certification, exam, competitive exam, assessment, mock exam, interview, admission test, course completion, skill milestone, and custom outcome are classifications of Objective. Classifications can provide vocabulary or expected properties, but they do not change the underlying meaning of Objective.

### Lifecycle and result remain separate

Lifecycle status describes where the Objective is in its journey, such as planned, active, paused, or completed. Result describes what happened, such as passed, failed, score, ranking, completed milestone, or another outcome. An assessment result can exist while an Objective remains active, and an Objective can be completed with either an achieved or unachieved outcome.

### Requirements are explicit preparation context

Requirements describe what the outcome demands. They can be satisfied, partially satisfied, unmet, excluded, or not yet evaluated. Topics and areas can organize requirements, but neither requirements nor topics are themselves Objectives.

### Progress is multidimensional

Objective progress can summarize requirement coverage, supporting-goal performance, completed activities, assessment evidence, and weak areas. These dimensions remain distinguishable. A single preparation percentage, when shown, cannot be presented as a probability of achievement.

### Assessments provide evidence; results conclude outcomes

Mock exams, practice assessments, interviews, and other evaluations provide dated evidence about readiness or performance. They may produce scores or findings without concluding the Objective. A final result records the authoritative outcome when known.

### Relationships preserve independent meaning

Goals, activities, questions, reviews, sessions, and assessments retain their own identity when related to an Objective. A supporting item may relate to more than one Objective when appropriate, and removing a relationship does not redefine or erase the related item.

### Custom outcomes remain first-class

A person can define a custom Objective classification and expected outcome. The system does not require a new core capability whenever a new real-world outcome type appears.

## Risks / Trade-offs

- **Objective may become an overloaded container** → Preserve explicit relationship types and keep related concepts independently meaningful.
- **A generic model may lose domain-specific vocabulary** → Allow classifications and descriptive properties without introducing separate foundations.
- **Preparation percentages may imply certainty** → Keep progress dimensions visible and explicitly avoid presenting preparation as success probability.
- **Status and result may be conflated** → Present lifecycle status and outcome result as separate concepts with independent transitions.
- **Supporting goals may be mistaken for Objectives** → Use the outcome-versus-commitment distinction consistently in language and acceptance criteria.

## Open Questions

- Which Objective classifications should be included as initial suggestions?
- Which progress dimensions should appear by default for Objectives with no study context?
- Should an Objective support multiple authoritative result attempts or one current result with preserved history?
