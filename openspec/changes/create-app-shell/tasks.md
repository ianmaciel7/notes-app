## 1. Reusable app-shell primitive

- [ ] 1.1 Add `src/components/ui/app-shell.tsx` using named shadcn-style exports and `data-slot` attributes.
- [ ] 1.2 Compose the shell from native shadcn `ResizablePanelGroup`, `ResizablePanel`, and `ResizableHandle` primitives with the selected desktop geometry and constraints.
- [ ] 1.3 Add stable left/right collapse triggers using shadcn `Button`, keeping each trigger mounted through collapse/expand.
- [ ] 1.4 Track the rendered left-panel width with `elementRef` + `ResizeObserver` so its persistent trigger follows resize and transitions without flicker.

## 2. Composition and responsive behavior

- [ ] 2.1 Expose sidebar, workspace, main, side-panel, header, content, surface, and trigger primitives that accept children/native props rather than hardcoding feature controls.
- [ ] 2.2 Use existing Nova theme tokens only (`bg-sidebar`, `bg-background`, border tokens) without changing `globals.css`.
- [ ] 2.3 Add a mobile composition using existing shadcn `Sheet` primitives below the desktop breakpoint.

## 3. Integration and verification

- [ ] 3.1 Replace the starter page with a minimal app-shell composition that demonstrates empty sidebar/main/side-panel regions and public triggers.
- [ ] 3.2 Verify formatting, linting, typecheck, tests, and build through the existing project verification workflow.
