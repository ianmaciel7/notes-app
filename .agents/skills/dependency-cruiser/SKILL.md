---
name: dependency-cruiser
description: Validate, visualize, and diagnose module boundaries and circular dependency violations in src/ using dependency-cruiser.
metadata:
  short-description: Module boundary and dependency cycle enforcement
---

# Dependency Cruiser Architecture Checks

This repository strictly enforces clean architectural boundaries and forbids circular dependencies via `dependency-cruiser`.

## Rules & Configuration

The configuration file is `.dependency-cruiser.cjs` at repository root:
- **`no-circular` (error)**: Forbids circular dependency chains anywhere in `src/`. Circular imports make module boundaries fragile and break bundle splitting.
- **Scope**: Scans all source files under `src/` respecting `tsconfig.json`.

## Verification Commands

- Run check:
  ```bash
  pnpm run deps:check
  ```
- Part of fast quality check:
  `pnpm run check:fast` automatically includes `deps:check`.

## Resolving Circular Dependencies

When `deps:check` reports a cycle `A -> B -> C -> A`:
1. **Extract Shared Types**: Move common types or schemas into a dedicated domain/types module (e.g. `src/types/` or `src/domain/`).
2. **Invert Dependencies**: Have lower-level modules expose interfaces, and let higher-level modules inject implementations.
3. **Split Monolithic Files**: Separate helper functions or factory utilities from component definitions.
