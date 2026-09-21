// spec.md §5.4: "Desktop open state is stored in a `sidebar_state` cookie for
// seven days; mobile drawer state is temporary." This is the shared constant
// between the server-side read (src/lib/space.ts#requireSnapshot) and the
// client-side write (src/components/space-frame.tsx), so first paint already
// reflects the persisted state instead of flashing open-then-collapsed.
export const sidebarCookie = "sidebar_state";
export const sidebarCookieMaxAgeSeconds = 60 * 60 * 24 * 7;
