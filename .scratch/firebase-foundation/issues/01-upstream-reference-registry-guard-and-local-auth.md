# 01: Upstream Reference Registry, Guard & Local Authentication Flow

**What to build:** A complete local authentication experience where users can sign up, sign in with email and pre-seeded test credentials, and log out with immediate reactive session updates. The project integrates the official `@firebase` component registry as an immutable reference baseline protected by an automated guard against accidental edits, while hosting all application-owned authentication forms and screens in the application component layer styled with the project's design system. All authentication interactions run hermetically against the local Firebase Auth emulator.

**Blocked by:** None (can start immediately)

**Status:** ready-for-agent

- [x] The custom `@firebase` registry is configured in the component configuration and upstream reference components are installed into a dedicated reference directory.
- [x] An automated SHA-256 manifest guard detects any modification, deletion, or addition in the immutable upstream reference directory.
- [ ] Application-owned authentication screens and forms compose project design system primitives with full accessibility support.
- [ ] Users can register a new account and sign in using email/password against the local Firebase Auth emulator.
- [ ] Deterministic login works seamlessly using pre-seeded local emulator test accounts.
- [ ] Active authentication state is accessible reactively across the component hierarchy and persists across page refreshes.
- [ ] Users can sign out and immediately see the interface transition to unauthenticated state.
- [ ] Automated browser tests verify the complete registration, sign-in, and sign-out journey against the emulator.
