const WORKSPACE_MOBILE_BREAKPOINT = 768;
const WORKSPACE_CONTEXT_OVERLAY_BREAKPOINT = 1024;

type WorkspacePanelPresentation = "mobile" | "overlay" | "inline";

function getWorkspacePanelPresentation(
  viewportWidth: number,
): WorkspacePanelPresentation {
  if (viewportWidth < WORKSPACE_MOBILE_BREAKPOINT) return "mobile";
  if (viewportWidth < WORKSPACE_CONTEXT_OVERLAY_BREAKPOINT) return "overlay";
  return "inline";
}

export {
  getWorkspacePanelPresentation,
  WORKSPACE_CONTEXT_OVERLAY_BREAKPOINT,
  WORKSPACE_MOBILE_BREAKPOINT,
  type WorkspacePanelPresentation,
};
