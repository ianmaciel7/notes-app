## Context

Reference apps such as Capacities can inform feature planning, but observed evidence and product requirements are different things. This change owns the evidence method.

## Decisions

### Classify evidence explicitly

Every observed behavior is CONFIRMED, INFERRED, UNKNOWN, or BLOCKED. Only direct repeatable observation qualifies as CONFIRMED.

### Stop before consequential actions

Billing, credentials, OAuth authorization, public publishing, invitations, and destructive actions require explicit human authorization and remain BLOCKED without it.

### Use repository-relative evidence links

Audit artifacts cite screenshots, traces, fixtures, and research using relative repository paths.

## Risks / Trade-offs

- Treating inferred behavior as confirmed creates false product requirements.
- Exercising consequential reference-app actions can affect accounts or data.
