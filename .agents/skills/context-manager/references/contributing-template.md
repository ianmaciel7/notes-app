# CONTRIBUTING.md Template

## Document Purpose
`CONTRIBUTING.md` guides internal and open-source contributors on onboarding, branching strategies, commit messages, testing requirements, pull request processes, and code review standards.

---

## Canonical Structure

```markdown
# Contributing Guidelines

Thank you for contributing to this project! Please follow these guidelines to ensure a smooth collaboration.

## 1. Prerequisites & Environment Setup
- Required runtime versions (e.g., Node.js >= 20, pnpm >= 9).
- Step-by-step setup commands:
  ```bash
  git clone <repository-url>
  pnpm install
  pnpm dev
  ```

## 2. Branching Strategy
- Main branch: `main` (production-ready).
- Branch naming pattern:
  - `feat/<short-description>`
  - `fix/<short-description>`
  - `docs/<short-description>`
  - `refactor/<short-description>`

## 3. Commit Message Standards
- Follow Conventional Commits format: `<type>(<optional scope>): <description>`
  - `feat`: A new feature
  - `fix`: A bug fix
  - `docs`: Documentation only changes
  - `style`: Changes that do not affect the meaning of the code
  - `refactor`: A code change that neither fixes a bug nor adds a feature
  - `perf`: A code change that improves performance
  - `test`: Adding missing tests or correcting existing tests
  - `chore`: Changes to build process or tooling

## 4. Pre-Flight Checklist Before Submitting PR
Before pushing or opening a PR, ensure all local checks pass:
- [ ] `pnpm lint` (or formatter check)
- [ ] `pnpm build` (TypeScript compilation & build succeeds)
- [ ] `pnpm test` (Unit and integration tests pass)
- [ ] Relevant documentation updated (if architecture, conventions, or design tokens changed)

## 5. Pull Request Submission & Review
- Provide a clear PR description detailing *what* changed and *why*.
- Include before/after screenshots or recordings for UI updates.
- Keep PRs focused and reasonably sized to facilitate prompt code review.
```
