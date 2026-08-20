## 1. Primary sidebar actions

- [x] 1.1 Add a focused `app-sidebar-primary-actions` client component using existing Button, HoverCard, and Kbd primitives.
- [x] 1.2 Render enabled `New`, `Search`, `Explore`, and `Calendar` actions from a shared typed definition and expose an action callback.
- [x] 1.3 Add hover-only hints for all four actions with approximately 200ms open delay, immediate close on leave/press, and source-inspired shortcut content.
- [x] 1.4 Support controlled active styling for Search, Explore, and Calendar while keeping New as a non-route action.

## 2. Integration

- [x] 2.1 Add an enhanced app-sidebar demo that composes the existing workspace selector with the new primary actions without changing AppShell.
- [x] 2.2 Update the locale starter page to render the enhanced sidebar demo on desktop and mobile.

## 3. Verification

- [x] 3.1 Verify OpenSpec artifacts are complete and consistent with the implementation.
- [ ] 3.2 Run `pnpm verify` in a development checkout and resolve reported errors.