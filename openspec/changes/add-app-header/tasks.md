## 1. OpenSpec alignment

- [x] 1.1 Expand the active `add-app-header` proposal to include the Capacities-style main tab strip, side-panel tab header, pinning, overflow, drag reorder, and focus mode.
- [x] 1.2 Update the design with captured-source geometry, state ownership, shadcn-first constraints, and integration decisions.
- [x] 1.3 Expand the `ui/app-header` delta spec with visual, responsive, pin, close, overflow, drag, side-panel, preview, and focus-mode scenarios.

## 2. Reusable header tabs

- [ ] 2.1 Add a shared application tab primitive matching the captured 32px/13px/0.5px geometry and active/inactive/neutral states.
- [ ] 2.2 Add main-tab pin and close action overlays, including pinned `alwaysVisible` behavior and caller-owned pinned-close rejection.
- [ ] 2.3 Add delayed inactive-tab previews using the existing `HoverCard` primitive.
- [ ] 2.4 Add controlled drag reorder with before/after insertion feedback.
- [ ] 2.5 Add the main `AppSpaceHeader` responsive 200/60/5 sizing and active-centered overflow/tab-list behavior.
- [ ] 2.6 Add the side-panel header responsive 160/44/4 sizing, non-draggable `explore`, tab-list/create controls, and no pin action.

## 3. App header and focus mode

- [ ] 3.1 Move create-new-tab behavior out of the history group and into `AppSpaceHeader`.
- [ ] 3.2 Keep back/forward on the left and focus action on the right with existing shadcn button semantics.
- [ ] 3.3 Add floating focus-mode controls with a primary exit action and hover-expanding history actions.

## 4. Integration demo

- [ ] 4.1 Add a client demo provider/state owner with all representative main tabs: Cloud Monitoring, Azure, Cursos, Ideias, and Ideias.
- [ ] 4.2 Demonstrate the pinned state and reject attempts to close a pinned main tab with user feedback.
- [ ] 4.3 Demonstrate side-panel tabs: Visualização em grafo and Explorar, with Explorar non-draggable.
- [ ] 4.4 Integrate the demo main and side-panel headers into the current desktop app shell while leaving mobile composition unchanged.

## 5. Verification

- [ ] 5.1 Review component APIs and `data-slot` hooks against the repository shadcn-first rule.
- [ ] 5.2 Compare header geometry and interaction states against the captured Capacities HTML/JS/CSS reference.
- [ ] 5.3 Run the full repository verification workflow in CI or an executable development checkout.
- [ ] 5.4 Sync/validate OpenSpec artifacts when the OpenSpec CLI workflow is available, then archive the change after implementation verification.
