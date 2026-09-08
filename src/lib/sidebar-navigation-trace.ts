type SidebarNavigationTraceDetails = Record<string, unknown>;

type SidebarNavigationTraceEntry = {
  readonly at: string;
  readonly details: SidebarNavigationTraceDetails;
  readonly label: string;
  readonly scope: string;
};

const SIDEBAR_NAVIGATION_TRACE_DATASET_KEY = "sidebarNavigationTrace";
const SIDEBAR_NAVIGATION_TRACE_EVENT = "sidebar-navigation:trace";
const SIDEBAR_NAVIGATION_TRACE_LIMIT = 200;

function localStorageDebugEnabled() {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage?.getItem("debug:sidebar-navigation") === "true";
  } catch {
    return false;
  }
}

function sidebarNavigationTraceEnabled() {
  return process.env.NODE_ENV !== "production" || localStorageDebugEnabled();
}

function readSidebarNavigationTrace(): SidebarNavigationTraceEntry[] {
  if (typeof document === "undefined") return [];
  const raw = document.documentElement.dataset[SIDEBAR_NAVIGATION_TRACE_DATASET_KEY];
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function recordSidebarNavigationTrace(
  scope: string,
  label: string,
  details: SidebarNavigationTraceDetails,
) {
  if (!sidebarNavigationTraceEnabled() || typeof document === "undefined") return;

  const entry: SidebarNavigationTraceEntry = {
    at: new Date().toISOString(),
    details,
    label,
    scope,
  };
  const nextTrace = [...readSidebarNavigationTrace(), entry].slice(
    -SIDEBAR_NAVIGATION_TRACE_LIMIT,
  );
  document.documentElement.dataset[SIDEBAR_NAVIGATION_TRACE_DATASET_KEY] =
    JSON.stringify(nextTrace);

  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(SIDEBAR_NAVIGATION_TRACE_EVENT, { detail: entry }));
  }
}

export {
  SIDEBAR_NAVIGATION_TRACE_DATASET_KEY,
  SIDEBAR_NAVIGATION_TRACE_EVENT,
  type SidebarNavigationTraceEntry,
  readSidebarNavigationTrace,
  recordSidebarNavigationTrace,
  sidebarNavigationTraceEnabled,
};
