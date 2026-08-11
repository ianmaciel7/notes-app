## Context

Navigation should support object-centric work: spaces, recent and pinned objects, object types, tabs, contextual panels, history, and focus mode.

## Decisions

### Keep document context stable

Opening contextual tools should not cause the active object to lose scroll position or editing context.

### Separate search from persistent panel tabs

Search can open results into tabs or side panels, but the command palette itself is not a permanent panel tab.

## Risks / Trade-offs

- Too many persistent surfaces can crowd the document.
- Mobile navigation needs compact controls without hiding required actions.
