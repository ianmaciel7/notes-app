# 04: Offline-First Firestore Persistence with Multi-Tab Local Cache

**What to build:** A zero-latency, offline-capable database persistence layer using native Firestore with IndexedDB persistent local cache and multi-tab coordination. Learners can create and view study spaces with instantaneous optimistic UI updates. When working offline or in flaky network conditions, changes remain accessible locally and seamlessly synchronize with the cloud once connectivity is restored. In restricted environments (such as private browsing or server rendering), initialization falls back safely to in-memory persistence. All operations connect transparently to the local Firestore emulator during development.

**Blocked by:** 01: Upstream Reference Registry, Guard & Local Authentication Flow

**Status:** ready-for-agent

- [ ] All database access routes through a single centralized database entry point connecting to the local Firestore emulator in development.
- [ ] Browser environments initialize persistent local cache with multi-tab management backed by IndexedDB.
- [ ] Server-side rendering and storage-restricted environments fall back gracefully to memory caching without throwing exceptions.
- [ ] Creating and listing study spaces updates the UI immediately with optimistic writes and real-time snapshot listeners.
- [ ] Mutations performed in one open browser tab reflect immediately in other concurrent tabs without page reload.
- [ ] Users can browse and create spaces while disconnected from the network, with pending mutations synchronizing automatically upon reconnection.
- [ ] Automated tests verify offline read/write persistence, multi-tab synchronization, and emulator connectivity.
