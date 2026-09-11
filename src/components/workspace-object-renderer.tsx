"use client";

// Compatibility exports for the workspace; concrete types own their list and detail.
export {
  getWeblinkUrl as getWorkspaceWeblinkUrl,
} from "@/components/objects/detail/object-detail-model";
export {
  EmbeddedObjectList as WorkspaceListRenderer,
} from "@/components/objects/embedded-object-list";
export {
  ObjectDetailResolver as WorkspaceObjectRenderer,
} from "@/components/objects/object-detail-resolver";
export {
  ObjectListResolver as WorkspaceObjectListRenderer,
  ObjectListResolver as WorkspaceObjectTypeListView,
} from "@/components/objects/object-list-resolver";
