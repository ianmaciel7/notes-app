# No Emojis In Code, UI, or Icons

## Rule
Never use emojis in source code, UI components, icon defaults, fallbacks, or domain entities.

## Rationale
- Emojis render inconsistently across operating systems and platforms (Windows, macOS, Linux, iOS, Android).
- Emojis violate WCAG accessibility standards (screen readers announce varying or unexpected labels).
- Emojis violate the restrained design system specified in DESIGN.md.

## Enforcement
- Use Lucide icons (from lucide-react) for visual indicators and buttons.
- Use semantic icon string identifiers (e.g. 'folder', 'file', 'book') rather than emoji literals.
- Validate incoming user input (e.g. in useSpaces and input validators) to reject emojis.
- Run static checks and guards to forbid emoji character literals in src/.