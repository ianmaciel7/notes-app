## ADDED Requirements

### Requirement: Source Registration And Classification
The system SHALL accept supported documents through a browser upload boundary and register a source before extracting text or calling Gemini.

#### Scenario: Register a supported document
- **WHEN** the user uploads a supported PDF or UTF-8 text source
- **THEN** the system SHALL calculate its SHA-256 content hash
- **AND** the system SHALL validate the configured size limit and PDF signature or UTF-8 encoding
- **AND** the system SHALL store the validated content through blob storage using an opaque storage key
- **AND** the system SHALL preserve its original filename, storage key, document role, source classification, organization, provider, year, profile, provenance, and processing status
- **AND** the system SHALL NOT send the document to Gemini during registration

#### Scenario: Register duplicate content
- **WHEN** a source has the same SHA-256 hash as an existing source
- **THEN** the system SHALL reuse or reference the existing source record
- **AND** the system SHALL NOT retain a second binary copy
- **AND** the system SHALL NOT extract or send the duplicate content to Gemini again

#### Scenario: Reject an unsupported upload
- **WHEN** an upload exceeds the configured size limit or fails PDF-signature or UTF-8 validation
- **THEN** the system SHALL reject it with an actionable error
- **AND** the system SHALL NOT register, persist, extract, or send the content to Gemini

#### Scenario: Encounter excluded or unavailable material
- **WHEN** a source is classified as excluded or unavailable
- **THEN** the system SHALL preserve its catalog metadata
- **AND** the system SHALL NOT process it automatically

### Requirement: Page-Aware Document Extraction
The system SHALL extract document text deterministically before AI-assisted structuring.

#### Scenario: Extract a text-based PDF
- **WHEN** the user starts processing a registered text-based PDF
- **THEN** a server-only extractor SHALL preserve text with its source page number
- **AND** the system SHALL create stable chunks identified by source hash and page range
- **AND** the system SHALL preserve enough original excerpt text to audit generated suggestions

#### Scenario: Resume interrupted extraction
- **WHEN** processing stops after one or more chunks have completed
- **THEN** the system SHALL preserve completed chunk results and their statuses
- **AND** retry SHALL continue from incomplete or failed chunks without duplicating completed work

#### Scenario: PDF has no usable text layer
- **WHEN** deterministic extraction returns no usable text for a PDF
- **THEN** the system SHALL mark the source as requiring OCR or manual text input
- **AND** the system SHALL NOT fabricate content or report extraction as complete

#### Scenario: Extract an uploaded text document
- **WHEN** the user starts processing a registered UTF-8 text source
- **THEN** the server-only extractor SHALL preserve its text and provenance
- **AND** the system SHALL create stable chunks identified by source hash, text hash, and chunk position

### Requirement: Role-Specific Structured Extraction
The system SHALL use distinct structured-output schemas and prompts for each supported document role.

#### Scenario: Extract scope from an edital or guide
- **WHEN** the user processes a source classified as an edital, syllabus, guide, or objective list
- **THEN** Gemini SHALL suggest hierarchical subjects, topics, subtopics, requirements, and source page references
- **AND** the suggestions SHALL remain drafts pending review

#### Scenario: Extract questions from a proof
- **WHEN** the user processes a source classified as a proof
- **THEN** Gemini SHALL suggest the source question number, prompt, question type, alternatives, source pages, topic metadata, and confidence or missing-field state
- **AND** the answer status SHALL remain unconfirmed unless the proof explicitly contains an authoritative answer
- **AND** explanation text generated without an authoritative source SHALL be identified as AI-generated

#### Scenario: Extract an answer key
- **WHEN** the user processes a source classified as an answer key
- **THEN** Gemini SHALL suggest answer entries with question number, answer value, source page, and assessment context
- **AND** answer-key entries SHALL remain separate from question objects until matching validation succeeds

#### Scenario: Match an answer to a question
- **WHEN** a reviewed answer-key entry and question share compatible organization, assessment edition, profile, proof version, and question number
- **THEN** the system SHALL propose the answer relationship for review
- **AND** an unmatched, ambiguous, preliminary, or conflicting answer SHALL remain visibly unresolved
- **AND** the system SHALL NOT overwrite a user-approved answer without explicit confirmation

### Requirement: Structured Gemini Suggestions
The system SHALL use Gemini structured output to suggest typed objects from validated source chunks.

#### Scenario: Generate valid suggestions
- **WHEN** the user submits source text and selects a supported generation goal
- **THEN** the system SHALL validate Gemini output against an application-owned schema
- **AND** valid suggestions SHALL include source object, source hash, chunk or page references, model identifier, schema version, and generation-run identifier
- **AND** suggestions SHALL remain drafts until the user approves them

#### Scenario: Handle partially invalid output
- **WHEN** Gemini returns a response containing valid and invalid items
- **THEN** the system SHALL keep valid items available for review
- **AND** the system SHALL identify invalid items and fields with actionable errors
- **AND** invalid items SHALL NOT be saved as objects

#### Scenario: Report generation failure
- **WHEN** Gemini cannot return a valid structured response
- **THEN** the system SHALL preserve the user's source text
- **AND** the system SHALL show a retryable error without creating objects

#### Scenario: Retry a completed generation chunk
- **WHEN** a completed source chunk is submitted again with the same generation goal, model configuration, prompt version, and schema version
- **THEN** the system SHALL reuse the completed generation result
- **AND** the system SHALL NOT create a duplicate generation run or duplicate drafts

### Requirement: Gemini Secret Boundary
The system SHALL keep Gemini credentials and privileged provider calls on the server.

#### Scenario: Configure Gemini
- **WHEN** the Gemini adapter is initialized
- **THEN** it SHALL read its API key from a server-only environment variable
- **AND** the key SHALL NOT enter client bundles, persisted source metadata, prompts, logs, analytics, or error messages
- **AND** missing configuration SHALL produce a clear server-side configuration error before document processing begins

### Requirement: Registered Source Content
The system SHALL provide the registered binary only through the source content boundary.

#### Scenario: Inspect supporting source content
- **WHEN** the user requests content for a registered source
- **THEN** the system SHALL stream it from blob storage with its validated media type and filename
- **AND** UI and feature modules SHALL NOT depend on its physical filesystem path

### Requirement: Review Before Save
The system SHALL require explicit review before AI-generated objects enter the object graph.

#### Scenario: Review generated objects
- **WHEN** Gemini returns generated suggestions
- **THEN** the user SHALL be able to edit, approve, or discard each suggestion
- **AND** the review interface SHALL expose missing or uncertain fields and source context
- **AND** the user SHALL be able to inspect the supporting page reference and source excerpt
- **AND** the system SHALL save only approved suggestions

#### Scenario: Approve the same draft twice
- **WHEN** an already-approved generation draft is submitted again
- **THEN** the system SHALL return the previously created object references
- **AND** the system SHALL NOT create duplicate objects from that approval
