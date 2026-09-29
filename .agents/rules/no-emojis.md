# No Emojis Invariant & Guidelines

This rule establishes a strict repository-wide invariant against emoji usage across all source code, user interfaces, default data, and domain definitions.

## 1. Core Invariant
- **Strict Prohibition**: Never use emojis in code, UI, icons, or default values.
- **Clean Alternatives**: Use Lucide icons (`lucide-react`) or clean semantic identifier strings instead.

## 2. Scope & Enforcement
- **UI Components & Icons**: Do not render emojis as visual icons, status indicators, badges, or buttons. Use the appropriate Lucide icon component with accessible labels.
- **Icon Defaults & Fallbacks**: Fallback avatars, category icons, or note icon pickers must default to semantic identifiers or Lucide icon names, never emoji characters.
- **Domain Entities & Schema**: Database models, Firestore schemas, seed data, and domain types must never store or default to emoji characters for icons or classifications.
- **Code & Identifiers**: Variable names, constants, test fixtures, and comments must remain clean and emoji-free.
