# shadcn GritQL Guards

This directory contains application-consumption rules for the project's shadcn
Base Nova / Base UI system.

The guards intentionally exclude `src/components/ui/**`, which is the
project-owned implementation/registry layer.

## Active guard areas

The current pack covers:

- Base UI API compatibility;
- required accessible compound parts;
- group/field/input/card/tabs/sidebar composition;
- overlay ownership;
- button and icon semantics;
- controlled/uncontrolled state;
- field validation state;
- semantic color tokens;
- dark-mode ownership;
- Tailwind composition;
- logical properties;
- conditional `cn()` composition;
- preference for owned shadcn interactive primitives;
- overlay stacking ownership;
- canonical import aliases (`@/components/ui`, `@/lib/utils`, `@/hooks`).

The exact active files are registered in `biome.json`.

## Ownership rule

Use GritQL only for mechanically reliable consumption rules.

Leave these to their stronger owners:

- portal/focus/dismissal behavior -> Base UI runtime;
- TypeScript correctness -> TypeScript;
- generic accessibility -> Biome/browser tests;
- registry/project style configuration -> `components.json`;
- naming/abstraction quality -> architecture review.

See [../../docs/SHADCN-GUARD-COVERAGE.md](../../docs/SHADCN-GUARD-COVERAGE.md).
