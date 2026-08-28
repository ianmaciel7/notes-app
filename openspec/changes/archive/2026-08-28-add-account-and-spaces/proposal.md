## Why

The current prototype is one anonymous local workspace. Explicit Account/Session and Space identity is required to isolate data, future synchronization, API authorization, and integrations correctly.

## What Changes

- Add stable Space records and hard repository partitioning by SpaceId.
- Add account/session adapter boundaries, active-space bootstrap, switching, creation, rename, guarded deletion, sign-out, and local-offline session policy.
- Preserve a personal/single-user product scope; do not imply collaborative editing or enterprise ACLs.

## Capabilities

### New Capabilities

- `domain/account-and-spaces`: Account/session boundary, Space lifecycle, repository isolation, and active-space UI contracts.

### Modified Capabilities

- None.

## Impact

- Priority: **P9**.
- Depends on `add-workspace-database`.
- Prepares sync/API/integrations but does not choose a production identity vendor or add collaboration.
