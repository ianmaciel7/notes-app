# shadcn GritQL Guards

This directory contains application-consumption rules for the project's shadcn
Base Nova / Base UI system.

The guards intentionally exclude two reserved component layers:

- `src/components/ui/**`: project-owned shadcn implementation/registry layer;
- `src/components/firebase/**`: immutable upstream Firebase UI reference
  layer protected separately by its SHA-256 manifest test.

Application-owned consumers outside those layers are the GritQL
guard-consumption surface.

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
- canonical import aliases (`@/components/ui`, `@/lib/utils`, `@/hooks`);
- prohibition of inline styles (`style={{ ... }}`);
- Base UI ecosystem protection (blocking direct `@radix-ui/*` imports).
- hook placement: exported hooks outside `src/hooks/` must be context accessors (`exported-hook-location.grit`).

The exact active files are registered in `biome.json`.

## Ownership rule

Use GritQL only for mechanically reliable consumption rules.

Leave these to their stronger owners:

- portal/focus/dismissal behavior -> Base UI runtime;
- TypeScript correctness -> TypeScript;
- generic accessibility -> Biome/browser tests;
- registry/project style configuration -> `components.json`;
- naming/abstraction quality -> architecture review.

See [../../docs/guards/SHADCN-GUARD-COVERAGE.md](../../docs/guards/SHADCN-GUARD-COVERAGE.md).
