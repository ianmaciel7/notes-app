## Why

Spaces are distinct knowledge environments. The current specs mention `space id`, but implementation needs explicit requirements for data segregation, type scope, navigation scope, search scope, sharing, sync, export, and AI retrieval per space.

## What Changes

- Define spaces as isolated knowledge environments.
- Define space-scoped object types, objects, properties, relationships, collections, search, graph, AI retrieval, and exports.
- Define behavior for switching spaces and copying/moving objects between spaces.
- Define explicit handling for global defaults versus space-specific schemas.

## Impact

- Planning only; no runtime code changes in this change.
- Depends conceptually on object model, navigation, search, graph, AI, portability, and offline sync.
