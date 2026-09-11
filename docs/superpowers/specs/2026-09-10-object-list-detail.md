# Object lists and details by type

## Approved contract

Each fixed object type owns a named List and Detail component. Lists compose ObjectList;
details compose ObjectDetail. ObjectListScreen is not the public name. Structural bases
must not import concrete types, the workspace controller, persistence, or navigation.

## Scope

Split workspace-object-renderer.tsx into structural bases, list state/selection, list
controls, shared content presenters, concrete type components, and a small resolver.
Retain the existing public renderer exports so main-panel consumers keep working.
Include all 14 built-in types, the 13 shipped presets, and a schema-driven custom pair.
Do not implement fictional PDF/audio/task editors: preserve each current capability.
Do not migrate Dexie, authorization, navigation, global theme, or generated UI files.

## Contracts and failure handling

- List selection respects both objectTypeId and a resolved spaceId.
- Missing/invalid preferences use defaults; denied/quota-limited storage does not crash UI.
- Never persist the previous view's preferences under a newly selected view's key.
- Weblinks only create navigable HTTP(S) URLs; invalid URLs keep the existing empty state.
- Controls reuse local shadcn/Base UI components and preserve labels and focus behavior.
- No runtime component generation and no forced global provider.
- Keep existing saved blocks, metadata, callbacks and labels during this extraction.

## Quality policy

biome.json remains the authority: 600 nonblank lines/file, 80 nonblank lines/function,
cognitive complexity 15, four parameters, formatting lineWidth 100. No threshold changes,
suppressions or additional exclusions. Readable decomposition takes priority over packing
statements or adding abstractions solely to reduce counts.

## Verification

Exercise filtering, ordering, namespace isolation, corrupted preferences and unsafe URLs.
Check all new TypeScript sources for syntax and structural boundaries. Run the project's
Biome, typecheck, Vitest, Ladle and browser checks when its dependencies are available.
Report unavailable checks explicitly; structural checks are not substitutes for those gates.
