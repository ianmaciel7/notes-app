# AI Workflows

## Role Of Gemini

Gemini is a core product capability. It should convert study material into structured objects while keeping the user in control of what gets saved.

The initial product foundation should treat AI output as suggestions, not truth. Gemini must return structured output validated against application-owned schemas, and generated objects must pass through a review step before they become part of the object graph.

## Supported Inputs

- User-uploaded PDFs with a usable text layer.
- User-uploaded UTF-8 text containing a syllabus, exam guide, certification objective, course outline, proof, lesson, summary, or custom study scope.
- Versioned validation PDFs only when the user explicitly uploads them through the browser acceptance flow.

Perfect PDF parsing and OCR are not first-release requirements. The first implementation should validate and store uploads locally, extract text from PDFs with a usable text layer, preserve page boundaries, and mark image-only or malformed documents for OCR or manual input.

## Document Processing Pipeline

1. Validate the uploaded PDF signature or UTF-8 encoding and configured size limit, then calculate its SHA-256 hash.
2. Register the source and store one binary through blob storage using an opaque key.
3. Preserve original filename, original provenance, document role, source classification, organization, provider, year, profile, and status.
4. Stop automatic processing for duplicate, excluded, or unavailable sources.
5. Extract text on the server while preserving page numbers for PDFs.
6. Create stable chunks from source hash, page range or text position, and text hash.
7. Select the structured-output schema and prompt from the document role.
8. Send only the required chunks and metadata to Gemini.
9. Validate every response against the application schema.
10. Show drafts with source page or text context, excerpt, missing fields, and uncertainty.
11. Save only approved objects and preserve their source relations.

Completed chunks and generation runs should be reusable. Retrying the same source hash, chunk, generation goal, prompt version, schema version, and model configuration must not create duplicate processing or drafts.

## Study Scope Extraction

Input:

- syllabus, exam-guide, certification-objective, course-outline, or custom study-scope text
- study goal context

Output suggestions:

- subjects
- topics
- subtopics
- estimated importance
- tags
- source excerpts

User review:

- merge duplicate topics
- rename subjects or topics
- discard irrelevant sections
- approve before save

## Question Extraction

Input:

- proof text with page and question-number context
- related study text
- optional study-scope context

Output suggestions:

- prompt
- alternatives
- answer status, initially unconfirmed unless authoritative in the proof
- optional AI-generated explanation clearly identified as generated
- subject
- topic
- provider
- year
- difficulty
- tags
- source excerpt
- source page and source question number

User review:

- correct answer validation
- topic assignment
- explanation edits
- discard malformed questions
- approve before save

## Answer-Key Extraction And Matching

Answer-key entries are extracted separately with question number, answer, page, assessment edition, profile, proof version, and status such as preliminary or definitive.

The system proposes a relationship only when the question and answer entry have compatible assessment metadata and question number. Ambiguous, conflicting, preliminary, or unmatched entries remain visible for review. An answer key never silently overwrites a user-approved answer.

## Flashcard Generation

Input:

- question
- wrong answer
- explanation
- study topic
- approved uploaded source text

Output suggestions:

- front
- back
- subject
- topic
- tags
- source relationship

User review:

- simplify wording
- split overloaded cards
- discard weak cards
- approve before save

## Guardrails

- Do not silently save AI-generated objects.
- Validate structured output before presenting or saving suggestions.
- Preserve valid suggestions when another generated item is invalid, and show actionable field errors.
- Preserve source context when possible.
- Preserve generation metadata needed to trace an approved suggestion.
- Preserve prompt version, schema version, model identifier, generation run, source hash, chunk, and page references.
- Show low-confidence or missing fields before save.
- Allow generated objects to be edited before approval.
- Make approval idempotent so retrying a request does not create duplicates.
- Preserve input text and offer retry when generation fails.
- Keep deterministic study scheduling separate from AI suggestions.
- Do not let AI overwrite user-corrected answers without explicit confirmation.
- Keep `GEMINI_API_KEY` and provider calls server-only and out of prompts, logs, persisted metadata, analytics, and client bundles.

## Scheduling Boundary

Gemini may explain or suggest study priorities, but the core scheduling logic should remain deterministic:

- errors increase priority;
- overdue flashcards increase priority;
- uncovered study topics increase priority;
- exam date and remaining volume determine daily targets;
- recent performance adjusts what appears next.

Flashcard scheduling uses an established FSRS implementation with Again, Hard, Good, and Easy ratings. Gemini does not calculate due dates.
