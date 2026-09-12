## Domain & Object Types Location Rule

- All object type definitions, space types, icon names, and tones (`ObjectIconName`, `ObjectIconTone`, `StructureLifecycleKind`, `StructureOwnership`, etc.) **MUST ALWAYS** be located in `src/lib/` (specifically `src/lib/space-object-types.ts`), **NEVER** isolated exclusively inside UI component folders (like `src/components/objects/icons/types.ts`).
- UI components under `src/components/` must import these domain types from `@/lib/space-object-types` (or have local re-exports pointing to `@/lib/space-object-types`).
- Non-UI layers (database models, space schemas, command registries, sync engines, API routes) must be able to use these types without importing from UI components.
