export const WORKSPACE_SECTION_VALUES = [
  "calendar",
  "search",
  "explore",
  "trash",
] as const;

export type WorkspaceSection = (typeof WORKSPACE_SECTION_VALUES)[number];

export type WorkspaceRouteState = {
  spaceId: string;
  targetId: string | null;
  section: WorkspaceSection | null;
};

export type ContextualPanelRouteEntry =
  | "explore"
  | "graphView"
  | "localSpaceQuery";

export type ContextualPanelRouteState = {
  entry: ContextualPanelRouteEntry;
  visible: boolean;
};

function hashRouteValue(value: string) {
  let hash = 2166136261;
  for (const character of value) {
    hash ^= character.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

/** Stable opaque route id; internal labels never leak into the URL. */
export function workspaceRouteId(value: string) {
  const first = hashRouteValue(`a:${value}`).toString(16).padStart(8, "0");
  const second = hashRouteValue(`b:${value}`).toString(16).padStart(8, "0");
  const third = hashRouteValue(`c:${value}`).toString(16).padStart(8, "0");
  const fourth = hashRouteValue(`d:${value}`).toString(16).padStart(8, "0");
  const hex = `${first}${second}${third}${fourth}`;
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-4${hex.slice(13, 16)}-8${hex.slice(17, 20)}-${hex.slice(20, 32)}`;
}

function decodeSegment(segment: string) {
  try {
    return decodeURIComponent(segment);
  } catch {
    return segment;
  }
}

export function workspaceRoutePath({
  locale,
  spaceId,
  targetId,
  section,
}: {
  locale: string;
  spaceId: string;
  targetId?: string | null;
  section?: WorkspaceSection | null;
}) {
  const path = [locale, spaceId, targetId]
    .filter((value): value is string => Boolean(value?.trim()))
    .map((value) => encodeURIComponent(value))
    .join("/");
  const search = section ? `?section=${encodeURIComponent(section)}` : "";
  return `/${path}${search}`;
}

export function parseWorkspaceRoute(
  pathname: string,
  search: string,
  locale: string,
  fallbackSpaceId: string,
): WorkspaceRouteState {
  const segments = pathname
    .split("/")
    .filter(Boolean)
    .map(decodeSegment);
  const localeIndex = segments[0] === locale ? 1 : 0;
  const spaceId = segments[localeIndex] || fallbackSpaceId;
  const targetId = segments[localeIndex + 1] || null;
  const sectionValue = new URLSearchParams(search).get("section");
  const section = WORKSPACE_SECTION_VALUES.includes(
    sectionValue as WorkspaceSection,
  )
    ? (sectionValue as WorkspaceSection)
    : null;

  return { spaceId, targetId, section };
}

/**
 * Maps the serializable workspace route to the contextual panel's default
 * presentation. More granular panel tabs remain transient workspace state.
 */
export function contextualPanelRouteState({
  section,
  targetId,
}: WorkspaceRouteState): ContextualPanelRouteState {
  if (targetId) return { entry: "graphView", visible: true };
  if (section === "search") return { entry: "localSpaceQuery", visible: true };
  if (section === "explore") return { entry: "explore", visible: true };
  return { entry: "explore", visible: false };
}
