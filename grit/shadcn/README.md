# shadcn GritQL guards

These Biome GritQL plugins enforce deterministic consumption rules for the
project's shadcn Base Nova / Base UI component system.

They intentionally target application code and exclude `src/components/ui/**`,
which is registry-managed implementation code.

The guards cover only low-ambiguity structural invariants:

- Base UI APIs instead of Radix-only APIs such as `asChild`.
- Required accessible subparts for dialogs, sheets, drawers, and avatars.
- Required Group composition for grouped menu/select/command items.
- InputGroup-specific controls.
- Button loading-state composition.
- TabsTrigger placement inside TabsList.

Do not use these plugins to encode subjective UI choices. Prefer built-in Biome
rules first, then GritQL only for repository-specific invariants that are
mechanically verifiable.
