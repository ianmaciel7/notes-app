# Contributing Guide

Thank you for contributing to the Notes App! This guide outlines our development workflow, standards, and verification expectations.

---

## 1. Getting Started

### Prerequisites

- **Node.js**: v22 or higher
- **pnpm**: v12.x or higher
- **Git**: Configured with user name and email

### Setup Instructions

```bash
# Clone the repository
git clone <repository-url>
cd notes-app

# Install isolated dependencies
pnpm install

# Start the local development server
pnpm dev
```

---

## 2. Commit Message Conventions

This repository enforces **Conventional Commits** validated via `@commitlint` on every commit:

Format: `<type>(<scope>): <short description>`

Common types:
- `feat`: A new user-facing or system feature
- `fix`: A bug fix
- `docs`: Documentation updates or additions
- `refactor`: Code changes that neither fix a bug nor add a feature
- `test`: Adding or modifying test suites
- `chore`: Tooling, build configuration, or dependency updates

---

## 3. Pre-Commit Quality Gates

We use **Husky** and **lint-staged** to ensure clean commits. Before creating a commit, staged files are automatically formatted and checked with Biome.

To run the complete fast verification suite locally:

```bash
pnpm run verify:fast
```

This verifies:
1. `pnpm run lint` (Biome linter and import organizer)
2. `pnpm run check:types` (TypeScript strict typecheck)
3. `pnpm run test` (Vitest unit and integration tests)
4. `pnpm run check:deps` (Dependency cruiser architecture boundaries)
5. `pnpm run lint:spelling` (CSpell dictionary verification)

---

## 4. Code Standards & Architecture

All contributions must follow:
- [Coding Standards](./CODING_STANDARDS.md): Strict TypeScript rules, React Compiler invariants, Tailwind CSS conventions, and Fowler smell baselines.
- [Architecture Guide](./ARCHITECTURE.md): Deep module interfaces, clean storage seams, and layer isolation rules.
- [Testing Guidelines](./TESTING.md): Seam-based testing and accessibility standards.
- [Domain Glossary](./GLOSSARY.md): Canonical terminology for all domain entities.

---

## 5. Pull Request Process

1. Create a feature branch off `main`: `git checkout -b feat/your-feature-name`.
2. Ensure all tests and verification commands pass cleanly (`pnpm run verify:fast`).
3. Open a Pull Request on GitHub.
4. The automated CI suite and `/code-review` checks will evaluate the diff along both the **Standards** and **Spec** axes.
