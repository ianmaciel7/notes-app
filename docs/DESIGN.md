# Design

## Current UI

The current branch displays the default-style Next.js starter page in `src/app/page.tsx`.

Current visible behavior:

- centered starter layout;
- Next.js logo;
- "To get started, edit the page.tsx file" headline;
- links to Vercel templates and Next.js documentation;
- light/dark styling through Tailwind classes.

There is no implemented object-centric workspace shell, sidebar, editor, graph/context panel, shadcn UI layer, or Capacities parity surface in this branch yet.

## Product Direction

The intended product direction remains a Portuguese, object-centric knowledge workspace inspired by Capacities-like workflows. That direction should be expressed through OpenSpec changes before implementation.

Do not document a workspace UI as current until the corresponding files exist and have been verified in the browser.

## Current Styling Surface

- Global styles live in `src/app/globals.css`.
- The app uses Tailwind CSS v4.
- Fonts are configured in `src/app/layout.tsx` with Geist and Geist Mono.
- Static assets live under `public/`.

## Future Design Rules

When the workspace UI is implemented:

- Prefer quiet, utilitarian, object-centric interfaces over marketing layouts.
- Always prefer existing project components and shadcn/ui components over raw HTML controls or custom component markup.
- Use real components and accessible controls rather than screenshot-only markup.
- Use icons, labels, and color together for object type or state.
- Keep motion short and functional, respecting `prefers-reduced-motion`.
- Verify desktop and mobile layouts in a browser before claiming parity.

Custom UI is allowed only when existing project/shadcn components cannot satisfy the requirement through reasonable composition or customization. Record that reason in OpenSpec or the completion summary.

## Accessibility

Current starter UI should remain keyboard reachable and readable. Future UI work should follow WCAG 2.2 AA, provide accessible names for icon-only controls, preserve visible focus, and avoid encoding state by color alone.
