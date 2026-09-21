// spec.md §5.4: "Desktop open state is stored in a `sidebar_state` cookie for
// seven days; mobile drawer state is temporary." This is the shared constant
// between the server-side read (src/lib/space.ts#requireSnapshot) and the
// client-side write (src/components/space-frame.tsx), so first paint already
// reflects the persisted state instead of flashing open-then-collapsed.
export const sidebarCookie = "sidebar_state";
export const sidebarCookieMaxAgeSeconds = 60 * 60 * 24 * 7;

// spec.md §5.4 "Resize limits": "The documented rail resize range is
// 160-360px; dragging past the minimum collapses." Peek (a transient,
// non-persistent hover/click overlay) deliberately has no width state of its
// own here — it reuses the last persisted/dragged width and never writes a
// cookie, per the "Collapse and peek" row of the same table.
export const sidebarMinWidth = 160;
export const sidebarMaxWidth = 360;
export const sidebarDefaultWidth = 240;
export const sidebarWidthStep = 16;

export function clampSidebarWidth(width: number): number {
  return Math.min(sidebarMaxWidth, Math.max(sidebarMinWidth, width));
}
