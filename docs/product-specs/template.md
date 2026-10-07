# [SPEC-XXXX]: [Feature Title]

| Field | Value |
| --- | --- |
| Spec ID | SPEC-XXXX |
| Status | Draft / Review / Approved / Implemented / Superseded |
| Author | Ian Maciel |
| Created | YYYY-MM-DD |
| Last Updated | YYYY-MM-DD |
| Target | MVP / milestone |
| Related Issues | #... |

## 1. Problem

Describe the user problem and why it matters.

## 2. Goals

- ...

## 3. Non-goals

- ...

## 4. User journeys

### Primary journey

1. Given ...
2. When ...
3. Then ...

## 5. Functional requirements

| ID | Requirement | Priority |
| --- | --- | --- |
| FR-1 | ... | Must |

## 6. Non-functional requirements

### Accessibility

- keyboard and screen-reader behavior;
- semantic controls and focus behavior.

### Performance

- measurable browser/server constraints where relevant.

### Security and privacy

- server-side validation for untrusted input;
- authorization at protected operation boundaries.

## 7. UI states

Document:

- loading;
- empty;
- error;
- success;
- disabled;
- responsive behavior.

Prefer existing shadcn primitives and follow
`docs/guards/SHADCN-GUARD-COVERAGE.md`.

## 8. Acceptance criteria

Use concrete Given/When/Then scenarios.

## 9. Technical alignment

Link only active architecture:

- relevant ADRs;
- execution plan;
- Next.js/shadcn guard coverage when applicable.

Check each ADR's status and Current State before describing implementation.
Accepted-but-not-yet-implemented ADRs describe adopted target design, not
behavior that already exists. Deprecated or superseded ADRs are historical
context only.

## 10. Open questions and risks

| Question/Risk | Owner | Status |
| --- | --- | --- |
| ... | ... | Open |
